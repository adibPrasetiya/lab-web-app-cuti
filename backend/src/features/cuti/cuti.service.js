import { AppError } from '../../utils/AppError.js';
import * as repository from './cuti.repository.js';

const toDateOnly = (value) => new Date(value).toISOString().slice(0, 10);

export async function createRequest(user, body, file) {
  if (!file) throw AppError.badRequest('Surat cuti wajib diunggah', [{ field: 'surat', message: 'Surat cuti wajib diunggah' }]);
  return repository.create({
    userId: user.id,
    jenis: body.jenis,
    startDate: toDateOnly(body.startDate),
    endDate: toDateOnly(body.endDate),
    alasan: body.alasan,
    attachmentFilename: file.filename,
    attachmentOriginalName: file.originalname,
    attachmentMime: file.mimetype,
    status: 'menunggu_atasan',
  });
}

export function listMine(userId) {
  return repository.listByUser(userId);
}

export function calendar(user, month) {
  // month: "YYYY-MM". Hitung tanggal awal & akhir bulan (string YYYY-MM-DD).
  const [year, mon] = month.split('-').map(Number);
  const startOfMonth = `${month}-01`;
  const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const endOfMonth = `${month}-${String(lastDay).padStart(2, '0')}`;
  // Pegawai hanya cuti miliknya; atasan & admin melihat seluruh pegawai.
  const userId = user.role === 'pegawai' ? user.id : undefined;
  return repository.listOverlappingMonth(startOfMonth, endOfMonth, userId);
}

export async function getDetail(id, user) {
  const cuti = await repository.findById(id);
  if (!cuti) throw AppError.notFound('Pengajuan cuti tidak ditemukan');
  // Pemohon sendiri, atau approver (atasan/admin), yang boleh melihat detail.
  if (cuti.userId !== user.id && user.role === 'pegawai') throw AppError.forbidden();
  return cuti;
}

export function queue(user) {
  if (user.role === 'atasan') return repository.listByStatus('menunggu_atasan');
  if (user.role === 'admin') return repository.listByStatus('menunggu_admin');
  throw AppError.forbidden('Hanya atasan atau admin yang memiliki antrian approval');
}

// Seluruh pengajuan (semua status) untuk approver — dipakai tabel riwayat approval.
export function allForApprover(user) {
  if (user.role === 'atasan' || user.role === 'admin') return repository.listAll();
  throw AppError.forbidden('Hanya atasan atau admin yang dapat melihat daftar approval');
}

// Peta role approver → status yang boleh ia proses + status berikutnya bila disetujui.
const STAGE = {
  atasan: { from: 'menunggu_atasan', next: 'menunggu_admin' },
  admin: { from: 'menunggu_admin', next: 'disetujui' },
};

async function loadForAction(id, user) {
  const stage = STAGE[user.role];
  if (!stage) throw AppError.forbidden('Hanya atasan atau admin yang dapat memproses pengajuan');
  const cuti = await repository.findById(id);
  if (!cuti) throw AppError.notFound('Pengajuan cuti tidak ditemukan');
  if (cuti.status !== stage.from) {
    throw AppError.conflict(`Pengajuan tidak dalam status "${stage.from}" (status saat ini: "${cuti.status}")`);
  }
  return { cuti, stage };
}

export async function approve(id, user) {
  const { stage } = await loadForAction(id, user);
  const now = new Date();
  const patch =
    user.role === 'atasan'
      ? { status: stage.next, atasanId: user.id, atasanActedAt: now }
      : { status: stage.next, adminId: user.id, adminActedAt: now };
  return repository.update(id, patch);
}

export async function reject(id, user, catatan) {
  const { stage } = await loadForAction(id, user);
  void stage;
  const now = new Date();
  const note = catatan || null;
  const patch =
    user.role === 'atasan'
      ? { status: 'ditolak', ditolakOleh: 'atasan', atasanId: user.id, atasanNote: note, atasanActedAt: now }
      : { status: 'ditolak', ditolakOleh: 'admin', adminId: user.id, adminNote: note, adminActedAt: now };
  return repository.update(id, patch);
}

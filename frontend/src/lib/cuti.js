// Label & gaya badge untuk jenis dan status pengajuan cuti.
export const JENIS_LABEL = {
  tahunan: 'Cuti Tahunan',
  sakit: 'Cuti Sakit',
  penting: 'Cuti Alasan Penting',
};

export const STATUS_META = {
  menunggu_atasan: { label: 'Menunggu Atasan', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500 text-white', dot: 'bg-amber-500' },
  menunggu_admin: { label: 'Menunggu Admin', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500 text-white', dot: 'bg-blue-500' },
  disetujui: { label: 'Disetujui', badge: 'bg-green-100 text-green-700', bar: 'bg-green-600 text-white', dot: 'bg-green-600' },
  ditolak: { label: 'Ditolak', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500 text-white', dot: 'bg-red-500' },
};

export function jenisLabel(jenis) {
  return JENIS_LABEL[jenis] ?? jenis;
}

export function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-500 text-white', dot: 'bg-gray-500' };
}

/** Lama cuti (inklusif) dari dua tanggal ISO (YYYY-MM-DD). */
export function durasiHari(startDate, endDate) {
  const ms = new Date(endDate) - new Date(startDate);
  return Math.round(ms / 86400000) + 1;
}

/** Tanggal ISO → format lokal Indonesia. */
export function formatTanggal(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

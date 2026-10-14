import { success } from '../../utils/response.js';
import * as service from './cuti.service.js';

export async function create(req, res) {
  const cuti = await service.createRequest(req.user, req.body, req.file);
  return success(res, { statusCode: 201, message: 'Pengajuan cuti terkirim', data: cuti });
}

export async function listMine(req, res) {
  return success(res, { data: await service.listMine(req.user.id) });
}

export async function queue(req, res) {
  return success(res, { data: await service.queue(req.user) });
}

export async function calendar(req, res) {
  return success(res, { data: await service.calendar(req.user, req.query.month) });
}

export async function allApprovals(req, res) {
  return success(res, { data: await service.allForApprover(req.user) });
}

export async function detail(req, res) {
  return success(res, { data: await service.getDetail(req.params.id, req.user) });
}

export async function approve(req, res) {
  const cuti = await service.approve(req.params.id, req.user);
  return success(res, { message: 'Pengajuan disetujui', data: cuti });
}

export async function reject(req, res) {
  const cuti = await service.reject(req.params.id, req.user, req.body.catatan);
  return success(res, { message: 'Pengajuan ditolak', data: cuti });
}

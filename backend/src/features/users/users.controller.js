import { success } from '../../utils/response.js';
import * as service from './users.service.js';

export async function list(req, res) {
  return success(res, { data: await service.list() });
}

export async function detail(req, res) {
  return success(res, { data: await service.getDetail(req.params.id) });
}

export async function create(req, res) {
  const user = await service.create(req.body);
  return success(res, { statusCode: 201, message: 'Pengguna dibuat', data: user });
}

export async function update(req, res) {
  const user = await service.update(req.params.id, req.body);
  return success(res, { message: 'Pengguna diperbarui', data: user });
}

export async function resetPassword(req, res) {
  await service.resetPassword(req.params.id, req.body.password);
  return success(res, { message: 'Password pengguna direset' });
}

export async function remove(req, res) {
  await service.remove(req.params.id, req.user);
  return success(res, { message: 'Pengguna dihapus' });
}

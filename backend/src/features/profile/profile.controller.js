import { success } from '../../utils/response.js';
import * as service from './profile.service.js';

export async function getProfile(req, res) {
  const user = await service.getProfile(req.params.id);
  return success(res, { data: user });
}

export async function updateProfile(req, res) {
  const user = await service.updateProfile(req.params.id, req.body);
  return success(res, { message: 'Profil berhasil diperbarui', data: user });
}

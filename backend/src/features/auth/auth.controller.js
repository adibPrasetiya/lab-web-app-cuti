import { success } from '../../utils/response.js';
import * as service from './auth.service.js';

export async function register(req, res) {
  const user = await service.register(req.body);
  return success(res, { statusCode: 201, message: 'Registrasi berhasil', data: user });
}

export async function login(req, res) {
  const data = await service.login(req.body);
  return success(res, { message: 'Login berhasil', data });
}

export async function me(req, res) {
  return success(res, { data: req.user });
}

export async function logout(req, res) {
  await service.logout(req.sessionId);
  return success(res, { message: 'Logout berhasil' });
}

export async function changePassword(req, res) {
  await service.changePassword(req.user.id, req.body.password);
  return success(res, { message: 'Password berhasil diperbarui' });
}

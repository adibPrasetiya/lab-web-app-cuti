import { randomUUID } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

// Sama dengan UPLOAD_ROOT di app/app.js; dihitung di sini untuk menghindari import melingkar.
const UPLOAD_ROOT = path.resolve(process.cwd(), env.upload.dir);

const ALLOWED_EXT = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ROOT),
  // Nama acak + ekstensi ASLI dari unggahan (ekstensi dikendalikan klien).
  filename: (req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
});

// VULN A10 (sengaja): validasi lampiran HANYA dari ekstensi nama file + mime type,
// keduanya dikirim oleh klien pada request multipart dan tidak dicek terhadap isi
// file (magic bytes). File berbahaya cukup di-rename / dipalsukan mime-nya untuk lolos.
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXT.includes(ext) && ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
  cb(AppError.badRequest('Surat cuti harus berupa file PDF, JPG, atau PNG', [{ field: 'surat', message: 'Format file tidak didukung' }]));
}

export const uploadSurat = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxBytes, files: 1 },
}).single('surat');

// Aturan kekuatan password registrasi. Hanya dicek di frontend; backend menerima password apa pun.
export const PASSWORD_RULES = [
  { label: 'Minimal 8 karakter', test: (value) => value.length >= 8 },
  { label: 'Huruf besar (A-Z)', test: (value) => /[A-Z]/.test(value) },
  { label: 'Huruf kecil (a-z)', test: (value) => /[a-z]/.test(value) },
  { label: 'Angka (0-9)', test: (value) => /\d/.test(value) },
  { label: 'Simbol (mis. !@#$)', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export function isStrongPassword(value) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

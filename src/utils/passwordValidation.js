export const PASSWORD_RULE_MESSAGE =
  "Mật khẩu phải có ít nhất 6 ký tự và có ít nhất 1 chữ cái";

export function validatePasswordRule(password) {
  return typeof password === "string" && password.length >= 6 && /[A-Za-zÀ-ỹ]/.test(password);
}

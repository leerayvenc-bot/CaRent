//this is for validating the form inputs for the register and login forms

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export function validateName(name) {
  if (!name.trim()) return "Full name is required.";
  return "";
}

export function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

// Keeps only the fields that have an error message
function collectErrors(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, msg]) => msg));
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  return collectErrors({
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}

export function validateLoginForm({ email, password }) {
  return collectErrors({
    email: validateEmail(email),
    // Login only checks that a password was typed. It doesn't enforce length.
    password: password ? "" : "Password is required.",
  });
}
export const MAX_MESSAGE_LENGTH = 500;

export function validateMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return "Message can't be empty.";
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`;
  }
  return "";
}
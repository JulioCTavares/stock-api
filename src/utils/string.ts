/**
 * String helpers - Utilitários para manipulação de strings
 */

/**
 * Remove espaços em branco e converte para lowercase
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palavra de uma string
 */
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Remove caracteres especiais, mantendo apenas letras, números e espaços
 */
export function sanitizeString(str: string): string {
  return str.replace(/[^a-zA-Z0-9\s]/g, "");
}

/**
 * Gera um slug a partir de uma string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Trunca uma string com ellipsis
 */
export function truncate(str: string, maxLength: number, suffix = "..."): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Mascara um email (ex: user@example.com -> u***@example.com)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length > 1 ? `${local[0]}***` : "***";
  return `${maskedLocal}@${domain}`;
}

/**
 * Mascara uma string sensível (mantém apenas os primeiros e últimos caracteres)
 */
export function maskSensitive(str: string, visibleChars = 4): string {
  if (str.length <= visibleChars * 2) return "***";
  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  return `${start}***${end}`;
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


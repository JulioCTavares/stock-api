/**
 * Constantes reutilizáveis da aplicação
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
} as const;

export const CACHE_KEYS = {
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  USER_BY_ID: (id: string) => `user:id:${id}`,
  USERS_ALL: "users:all"
} as const;

export const CACHE_TTL = {
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7
} as const;

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator"
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 255,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 255
} as const;


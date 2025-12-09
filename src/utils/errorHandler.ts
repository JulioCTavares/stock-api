/**
 * Error Handler - Centraliza tratamento de erros
 */

import { logger } from "./logger";
import { ResponseHelper } from "./response";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

/**
 * Converte qualquer erro em uma resposta HTTP padronizada
 */
export function handleError(error: unknown): Response {
  // Erros customizados da aplicação
  if (error instanceof AppError) {
    logger.warn(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      },
      "Erro da aplicação"
    );

    return ResponseHelper.error(error.message, error.statusCode, error.details);
  }

  // Erros do Zod (validação)
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
    const errors = zodError.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");

    logger.warn({ errors }, "Erro de validação Zod");

    return ResponseHelper.error(`Dados inválidos: ${errors}`, 400);
  }

  // Erros genéricos do JavaScript
  if (error instanceof Error) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        name: error.name
      },
      "Erro não tratado"
    );

    // Em produção, não expor detalhes do erro
    const isDev = process.env.NODE_ENV === "development";
    const message = isDev ? error.message : "Erro interno do servidor";

    return ResponseHelper.error(message, 500);
  }

  // Erro desconhecido
  logger.error({ error }, "Erro desconhecido");
  return ResponseHelper.error("Erro interno do servidor", 500);
}

/**
 * Wrapper para funções assíncronas que captura erros automaticamente
 */
export function asyncErrorHandler<T extends (...args: unknown[]) => Promise<Response>>(
  fn: T
): (...args: Parameters<T>) => Promise<Response> {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}


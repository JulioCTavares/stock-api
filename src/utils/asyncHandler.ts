/**
 * Async Handler - Wrapper para evitar try/catch repetitivo em controllers
 */

import { logger } from "./logger";
import { ResponseHelper } from "./response";

type AsyncHandler = (req: Request) => Promise<Response>;

/**
 * Wrapper que captura erros automaticamente em handlers assíncronos
 * @param handler Função assíncrona do controller
 * @returns Handler com tratamento de erro automático
 */
export function asyncHandler(handler: AsyncHandler): AsyncHandler {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      logger.error({ error, url: req.url, method: req.method }, "Erro no handler");

      if (error instanceof Error) {
        // Erros conhecidos
        if (error.message.includes("já está em uso") || error.message.includes("já existe")) {
          return ResponseHelper.error(error.message, 409);
        }

        if (error.message.includes("não encontrado") || error.message.includes("not found")) {
          return ResponseHelper.notFound(error.message);
        }

        if (error.message.includes("Dados inválidos") || error.message.includes("Invalid")) {
          return ResponseHelper.error(error.message, 400);
        }

        if (error.message.includes("não autorizado") || error.message.includes("unauthorized")) {
          return ResponseHelper.unauthorized(error.message);
        }

        // Erro genérico
        return ResponseHelper.error(error.message, 500);
      }

      // Erro desconhecido
      return ResponseHelper.error("Erro interno do servidor", 500);
    }
  };
}


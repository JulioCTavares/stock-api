import type { FastifyReply } from "fastify";
import { HTTP_STATUS } from "./constants";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class FastifyResponseHelper {
  static success<T>(reply: FastifyReply, data: T, message?: string, status: number = HTTP_STATUS.OK): FastifyReply {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message })
    };

    return reply.status(status).send(response);
  }

  static created<T>(reply: FastifyReply, data: T, message = "Criado com sucesso"): FastifyReply {
    return this.success(reply, data, message, HTTP_STATUS.CREATED);
  }

  static error(reply: FastifyReply, message: string, status: number = HTTP_STATUS.BAD_REQUEST, error?: unknown): FastifyReply {
    const response: ApiResponse = {
      success: false,
      error: message,
      ...(error && typeof error === "object" && "details" in error ? { details: (error as { details: unknown }).details } : {})
    };

    return reply.status(status).send(response);
  }

  static notFound(reply: FastifyReply, message = "Recurso não encontrado"): FastifyReply {
    return this.error(reply, message, HTTP_STATUS.NOT_FOUND);
  }

  static unauthorized(reply: FastifyReply, message = "Não autorizado"): FastifyReply {
    return this.error(reply, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(reply: FastifyReply, message = "Acesso negado"): FastifyReply {
    return this.error(reply, message, HTTP_STATUS.FORBIDDEN);
  }

  static paginated<T>(
    reply: FastifyReply,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): FastifyReply {
    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<T[]> = {
      success: true,
      data,
      ...(message && { message }),
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    };

    return reply.status(HTTP_STATUS.OK).send(response);
  }
}


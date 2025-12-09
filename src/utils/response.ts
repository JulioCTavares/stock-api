/**
 * Response helpers para padronizar respostas HTTP
 */

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

export class ResponseHelper {
  static success<T>(data: T, message?: string, status = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message })
    };

    return Response.json(response, { status });
  }

  static created<T>(data: T, message = "Criado com sucesso"): Response {
    return this.success(data, message, 201);
  }

  static error(message: string, status = 400, error?: unknown): Response {
    const response: ApiResponse = {
      success: false,
      error: message,
      ...(error && typeof error === "object" && "details" in error && { details: error.details })
    };

    return Response.json(response, { status });
  }

  static notFound(message = "Recurso não encontrado"): Response {
    return this.error(message, 404);
  }

  static unauthorized(message = "Não autorizado"): Response {
    return this.error(message, 401);
  }

  static forbidden(message = "Acesso negado"): Response {
    return this.error(message, 403);
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
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

    return Response.json(response, { status: 200 });
  }
}


/**
 * Błąd z API (zgodny z formatem z ADR-006).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiErrorPayload {
  error?: string
  fields?: Record<string, string>
}

function isApiErrorPayload(data: unknown): data is ApiErrorPayload {
  return typeof data === 'object' && data !== null
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

/**
 * Wywołuje endpoint API z obsługą ciasteczek (credentials: 'include') i nagłówków JSON.
 * Przy błędzie rzuca ApiError ze statusem i polami z serwera (ADR-006, ADR-013).
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...restOptions } = options

  const isJsonBody = body !== undefined && !(body instanceof FormData)

  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit | null | undefined),
    ...restOptions,
  })

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType ? contentType.includes('application/json') : false
  const data: unknown = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    let message = 'Wystąpił błąd podczas komunikacji z serwerem'
    let fields: Record<string, string> | undefined

    if (isApiErrorPayload(data)) {
      if (typeof data.error === 'string') {
        message = data.error
      }
      if (typeof data.fields === 'object' && data.fields !== null) {
        fields = data.fields as Record<string, string>
      }
    } else if (typeof data === 'string' && data.trim()) {
      message = data
    }

    throw new ApiError(response.status, message, fields)
  }

  return data as T
}

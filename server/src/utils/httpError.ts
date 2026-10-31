/**
 * Błąd z kodem HTTP. Rzucony w kontrolerze lub serwisie trafia do errorHandler,
 * który zwraca go w formacie z ADR-006: { error, fields? }.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

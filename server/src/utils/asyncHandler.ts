import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Express 4 nie łapie błędów z funkcji async. Ten wrapper przekazuje je do errorHandler,
 * więc kontroler nie potrzebuje własnego try/catch.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}

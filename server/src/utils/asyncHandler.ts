import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap an async controller so Express sees a void-returning handler,
 * and forwards any rejected promise to next(err).
 */
export const asyncHandler = <
  H extends (req: Request, res: Response, next: NextFunction) => Promise<any>
>(
  fn: H
): RequestHandler => {
  return (req, res, next) => {
    // Ensure we don't return a Promise to the caller (satisfies void expectations)
    void fn(req, res, next).catch(next);
  };
};

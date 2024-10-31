import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Request: ${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

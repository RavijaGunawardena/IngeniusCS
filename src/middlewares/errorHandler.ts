import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	logger.error(`${req.method} ${req.url} - ${err.message}`);

	res.status(500).json({
		error: {
			message: "Internal Server Error",
			details: err.message,
		},
	});
};

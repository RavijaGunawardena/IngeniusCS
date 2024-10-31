import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const { error } = schema.validate(
			{ ...req.body, ...req.query, ...req.params },
			{ abortEarly: false }
		);

		if (error) {
			const errors = error.details.map((detail) => detail.message);
			res.status(400).json({
				status: "error",
				message: "Validation failed",
				errors,
			});
			return;
		}

		next();
	};
};

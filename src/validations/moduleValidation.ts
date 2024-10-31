import Joi from "joi";

// Schema for creating a module
export const createModuleSchema = Joi.object({
	courseId: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
	title: Joi.string().min(1).required().messages({
		"string.base": "Title must be a string.",
		"string.empty": "Title cannot be empty.",
		"any.required": "Title is required.",
	}),
});

// Schema for getting modules (includes pagination and courseId query param)
export const getModulesSchema = Joi.object({
	courseId: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
	page: Joi.number().integer().min(1).optional().messages({
		"number.base": "Page must be a number.",
		"number.integer": "Page must be an integer.",
		"number.min": "Page must be at least 1.",
	}),
	limit: Joi.number().integer().min(1).optional().messages({
		"number.base": "Limit must be a number.",
		"number.integer": "Limit must be an integer.",
		"number.min": "Limit must be at least 1.",
	}),
});

// Schema for updating a module
export const updateModuleSchema = Joi.object({
	courseId: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
	id: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
	}),
	title: Joi.string().min(1).required().messages({
		"string.base": "Title must be a string.",
		"string.empty": "Title cannot be empty.",
		"any.required": "Title is required.",
	}),
});

// Schema for deleting a module
export const deleteModuleSchema = Joi.object({
	courseId: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
	id: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
	}),
});

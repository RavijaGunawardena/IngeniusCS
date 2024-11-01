import Joi from "joi";

// Schema for creating a lesson
export const createLessonSchema = Joi.object({
	title: Joi.string().min(1).required().messages({
		"string.base": "Title must be a string.",
		"string.empty": "Title cannot be empty.",
		"any.required": "Title is required.",
	}),
	description: Joi.string().min(1).required().messages({
		"string.base": "Description must be a string.",
		"string.empty": "Description cannot be empty.",
		"any.required": "Description is required.",
	}),
	topics: Joi.array().items(Joi.string()).required().messages({
		"array.base": "Topics must be an array of strings.",
		"any.required": "Topics are required.",
	}),
	content: Joi.array()
		.items(
			Joi.object({
				type: Joi.string().valid("text", "video", "audio").required().messages({
					"string.base": "Content type must be a string.",
					"any.only":
						"Content type must be one of 'text', 'video', or 'audio'.",
					"any.required": "Content type is required.",
				}),
				data: Joi.string().min(1).required().messages({
					"string.base": "Content data must be a string.",
					"string.empty": "Content data cannot be empty.",
					"any.required": "Content data is required.",
				}),
			})
		)
		.required()
		.messages({
			"array.base": "Content must be an array of LessonContent.",
			"any.required": "Content is required.",
		}),
	moduleId: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
	}),
});

// Schema for getting lessons
export const getLessonsSchema = Joi.object({
	moduleId: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
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

// Schema for updating a lesson
export const updateLessonSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.base": "Lesson ID must be a string.",
		"string.uuid": "Lesson ID must be a valid UUID.",
		"any.required": "Lesson ID is required.",
	}),
    moduleId: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
	}),
	title: Joi.string().min(1).optional().messages({
		"string.base": "Title must be a string.",
		"string.empty": "Title cannot be empty.",
	}),
	description: Joi.string().min(1).optional().messages({
		"string.base": "Description must be a string.",
		"string.empty": "Description cannot be empty.",
	}),
	topics: Joi.array().items(Joi.string()).optional().messages({
		"array.base": "Topics must be an array of strings.",
	}),
	content: Joi.array()
		.items(
			Joi.object({
				type: Joi.string().valid("text", "video", "audio").optional().messages({
					"string.base": "Content type must be a string.",
					"any.only":
						"Content type must be one of 'text', 'video', or 'audio'.",
				}),
				data: Joi.string().min(1).optional().messages({
					"string.base": "Content data must be a string.",
					"string.empty": "Content data cannot be empty.",
				}),
			})
		)
		.optional()
		.messages({
			"array.base": "Content must be an array of LessonContent.",
		}),
});

// Schema for deleting a lesson
export const deleteLessonSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.base": "Lesson ID must be a string.",
		"string.uuid": "Lesson ID must be a valid UUID.",
		"any.required": "Lesson ID is required.",
	}),
	moduleId: Joi.string().uuid().required().messages({
		"string.base": "Module ID must be a string.",
		"string.uuid": "Module ID must be a valid UUID.",
		"any.required": "Module ID is required.",
	}),
});

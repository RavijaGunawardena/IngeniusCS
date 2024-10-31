import Joi from "joi";

// Schema for creating a course
export const createCourseSchema = Joi.object({
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
});

// Schema for getting courses (includes pagination and courseId query param)
export const getCoursesSchema = Joi.object({
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

// Schema for getting a course by it's id
export const getCourseByIdSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
});

// Schema for updating a course
export const updateCourseSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
	title: Joi.string().min(1).required().messages({
		"string.base": "Title must be a string.",
		"string.empty": "Title cannot be empty.",
		"any.required": "Title is required.",
	}),
	description: Joi.string().min(1).required().messages({
		"string.base": "Description must be a string.",
		"string.empty": "Description cannot be empty.",
		"any.required": "Description is required.",
	})
});

// Schema for deleting a course
export const deleteCourseSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.base": "Course ID must be a string.",
		"string.uuid": "Course ID must be a valid UUID.",
		"any.required": "Course ID is required.",
	}),
});

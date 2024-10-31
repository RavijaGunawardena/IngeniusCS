import { Request, Response } from "express";
import logger from "../config/logger";
import * as courseService from "../services/courseService";
import { setCache, getCache } from "../utils/cache";
import { response } from "../utils/utils";

// CREATE Course
export const createCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { title, description } = req.body;
		const newCourse = await courseService.createCourse(title, description);

		res
			.status(201)
			.json(response("success", "Course created successfully", newCourse));
	} catch (error) {
		logger.error(`Error creating course: ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET All Courses with Caching and Pagination
export const getCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const cacheKey = `courses_page_${req.query.page}_limit_${req.query.limit}`;
		const cachedCourses = getCache(cacheKey);

		if (cachedCourses) {
			res
				.status(200)
				.json(
					response("success", "Courses retrieved from cache", cachedCourses)
				);
			return;
		}

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { courses, totalCourses, totalPages } =
			await courseService.getCourses(page, limit);

		const responseData = {
			page,
			limit,
			totalCourses,
			totalPages,
			data: courses,
		};
		setCache(cacheKey, responseData, 60000);
		res
			.status(200)
			.json(
				response("success", "Courses retrieved successfully", responseData)
			);
	} catch (error) {
		logger.error(`Error retrieving courses: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

export const getCoursesWithMoreDetails = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const cacheKey = `courses_details_page_${req.query.page}_limit_${req.query.limit}`;
		const cachedCourses = getCache(cacheKey);

		if (cachedCourses) {
			res
				.status(200)
				.json(
					response(
						"success",
						"Courses with more details retrieved from cache",
						cachedCourses
					)
				);
			return;
		}

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { paginatedCourses, totalCourses, totalPages } =
			await courseService.getCoursesWithDetails(page, limit);

		const responseData = {
			page,
			limit,
			totalCourses,
			totalPages,
			data: paginatedCourses,
		};
		setCache(cacheKey, responseData, 60000);
		res
			.status(200)
			.json(
				response(
					"success",
					"Courses with more details retrieved successfully",
					responseData
				)
			);
	} catch (error) {
		logger.error(`Error retrieving courses with more details: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// GET Course by ID
export const getCourseById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const courseId = req.params.id;
		const course = await courseService.getCourseById(courseId);
		if (!course) {
			res.status(404).json({ error: "Course not found" });
			return;
		}
		res.status(200).json(course);
	} catch (error) {
		logger.error(`Error retrieving course by ID: ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

// UPDATE Course
export const updateCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const courseId = req.params.id;
		const { title, description } = req.body;
		const updatedCourse = await courseService.updateCourse(
			courseId,
			title,
			description
		);
		if (!updatedCourse) {
			res.status(404).json(response("error", "Course not found", null));
			return;
		}
		res
			.status(200)
			.json(response("success", "Course updated successfully", updatedCourse));
	} catch (error) {
		logger.error(`Error updating course: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// DELETE Course
export const deleteCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const courseId = req.params.id;
		const deleted = await courseService.deleteCourse(courseId);
		if (!deleted) {
			res.status(404).json(response("error", "Course not found", null));
			return;
		}
		res
			.status(204)
			.json(response("success", "Course deleted successfully", null));
	} catch (error) {
		logger.error(`Error deleting course: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

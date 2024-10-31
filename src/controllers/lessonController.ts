import { Request, Response } from "express";
import logger from "../config/logger";
import * as lessonService from "../services/lessonService";
import { setCache, getCache } from "../utils/cache";
import { response } from "../utils/utils";

// CREATE Lesson
export const createLesson = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { moduleId, title, description, topics, content } = req.body;
		const newLesson = await lessonService.createLesson(
			moduleId,
			title,
			description,
			topics,
			content
		);
		if (!newLesson) {
			res.status(404).json(response("error", "Module not found", null));
			return;
		}

		res
			.status(201)
			.json(response("success", "Lesson created successfully", newLesson));
	} catch (error) {
		logger.error(`Error creating lesson: ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET All Lessons with Caching and Pagination
export const getLessons = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { moduleId } = req.query;
		const cacheKey = `lessons_${moduleId}_page_${req.query.page}_limit_${req.query.limit}`;
		const cachedLessons = getCache(cacheKey);

		if (cachedLessons) {
			res
				.status(200)
				.json(
					response("success", "Lessons retrieved from cache", cachedLessons)
				);
			return;
		}

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { lessons, totalLessons, totalPages } =
			await lessonService.getLessons(moduleId as string, page, limit);

		const responseData = {
			page,
			limit,
			totalLessons,
			totalPages,
			data: lessons,
		};
		setCache(cacheKey, responseData, 60000); // Cache for 1 minute
		res
			.status(200)
			.json(
				response("success", "Lessons retrieved successfully", responseData)
			);
	} catch (error) {
		logger.error(`Error retrieving lessons: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// GET Lesson by ID
export const getLessonById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { moduleId, id } = req.params;
		const lesson = await lessonService.getLessonById(moduleId, id);
		if (!lesson) {
			res.status(404).json({ error: "Lesson not found" });
			return;
		}
		res.status(200).json(lesson);
	} catch (error) {
		logger.error(`Error retrieving lesson by ID: ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

// UPDATE Lesson
export const updateLesson = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { moduleId } = req.query;
		const { id } = req.params;
		const { title, description, topics, content } = req.body;
		const updatedLesson = await lessonService.updateLesson(
			moduleId as string,
			id,
			title,
			description,
			topics,
			content
		);
		if (!updatedLesson) {
			res.status(404).json(response("error", "Lesson not found", null));
			return;
		}
		res
			.status(200)
			.json(response("success", "Lesson updated successfully", updatedLesson));
	} catch (error) {
		logger.error(`Error updating lesson: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// DELETE Lesson
export const deleteLesson = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { moduleId } = req.query;
		const deleted = await lessonService.deleteLesson(moduleId as string, id);
		if (!deleted) {
			res.status(404).json(response("error", "Lesson not found", null));
			return;
		}
		res
			.status(204)
			.json(response("success", "Lesson deleted successfully", null));
	} catch (error) {
		logger.error(`Error deleting lesson: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

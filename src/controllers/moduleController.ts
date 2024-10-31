import { Request, Response } from "express";
import logger from "../config/logger";
import * as moduleService from "../services/moduleService";
import { setCache, getCache } from "../utils/cache";
import { response } from "../utils/utils";

// CREATE Module
export const createModule = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId, title } = req.body;
		const newModule = await moduleService.createModule(courseId, title);

		if (!newModule) {
			res.status(404).json(response("error", "Course not found", null));
			return;
		}
		
		res
			.status(201)
			.json(response("success", "Module created successfully", newModule));
	} catch (error) {
		logger.error(`Error creating module: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// GET Modules with Caching and Pagination for a specific course
export const getModules = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.query;
		const cacheKey = `modules_${courseId}_page_${req.query.page}_limit_${req.query.limit}`;
		const cachedModules = getCache(cacheKey);

		if (cachedModules) {
			res
				.status(200)
				.json(
					response("success", "Modules retrieved from cache", cachedModules)
				);
			return;
		}

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { modules, totalModules, totalPages } =
			await moduleService.getModules(courseId as string, page, limit);

		const result = { page, limit, totalModules, totalPages, data: modules };
		setCache(cacheKey, result, 60000); // Cache for 1 minute
		res
			.status(200)
			.json(response("success", "Modules retrieved successfully", result));
	} catch (error) {
		logger.error(`Error retrieving modules: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// UPDATE Module
export const updateModule = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.query;
		const { title } = req.body;
		const { id: moduleId } = req.params;

		const updatedModule = await moduleService.updateModule(
			courseId as string,
			moduleId,
			title
		);

		if (!updatedModule) {
			res.status(404).json(response("error", "Module not found", null));
			return;
		}

		res
			.status(200)
			.json(response("success", "Module updated successfully", updatedModule));
	} catch (error) {
		logger.error(`Error updating module: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

// DELETE Module
export const deleteModule = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.query;
		const { id: moduleId } = req.params;

		const deleted = await moduleService.deleteModule(
			courseId as string,
			moduleId
		);
		if (!deleted) {
			res.status(404).json(response("error", "Module not found", null));
			return;
		}

		res
			.status(204)
			.json(response("success", "Module deleted successfully", null));
	} catch (error) {
		logger.error(`Error deleting module: ${error}`);
		res.status(500).json(response("error", "Internal server error", null));
	}
};

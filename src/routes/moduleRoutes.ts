import express from "express";
import {
	createModule,
	deleteModule,
	getModules,
	updateModule,
} from "../controllers/moduleController";
import { validateRequest } from "../middlewares/validateRequest";
import {
	createModuleSchema,
	deleteModuleSchema,
	getModulesSchema,
	updateModuleSchema,
} from "../validations/moduleValidation";

const router = express.Router();

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Module created successfully
 */
router.post("/", validateRequest(createModuleSchema), createModule);

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get modules for a specific course
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 */
router.get("/", validateRequest(getModulesSchema), getModules);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Module updated successfully
 */
router.put("/:id", validateRequest(updateModuleSchema), updateModule);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the module
 *     responses:
 *       204:
 *         description: Module deleted successfully
 */
router.delete("/:id", validateRequest(deleteModuleSchema), deleteModule);

export default router;

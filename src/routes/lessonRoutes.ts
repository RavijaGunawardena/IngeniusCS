import express from "express";
import {
	createLesson,
	deleteLesson,
	getLessons,
	updateLesson,
} from "../controllers/lessonController";
import { validateRequest } from "../middlewares/validateRequest";
import {
	createLessonSchema,
	deleteLessonSchema,
	getLessonsSchema,
	updateLessonSchema,
} from "../validations/lessonValidation";
import { updateModuleSchema } from "../validations/moduleValidation";
import { updateModule } from "../controllers/moduleController";

const router = express.Router();

/**
 * @swagger
 * /lessons:
 *     post:
 *       summary: Create a new lesson
 *       tags: [Lessons]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Introduction to Programming"
 *                 description:
 *                   type: string
 *                   example: "This lesson covers the basics of programming."
 *                 topics:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "variables"
 *                 content:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [text, video, audio]
 *                         example: "text"
 *                       data:
 *                         type: string
 *                         example: "This is the lesson content."
 *                 moduleId:
 *                   type: string
 *                   format: uuid
 *                   example: "1f3fa915-86aa-46fd-8e2b-daec1b045b5f"
 *       responses:
 *         201:
 *           description: Lesson created successfully
 *         400:
 *           description: Invalid request body
 *         500:
 *           description: Server error
 */

router.post("/", validateRequest(createLessonSchema), createLesson);

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Get all lessons with pagination
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: moduleId
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
 *         description: A paginated list of lessons
 *       500:
 *         description: Internal server error
 */
router.get("/", validateRequest(getLessonsSchema), getLessons);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 title:
 *                   type: string
 *                   example: "Introduction to Programming"
 *                 description:
 *                   type: string
 *                   example: "This lesson covers the basics of programming."
 *                 topics:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "variables"
 *                 content:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [text, video, audio]
 *                         example: "text"
 *                       data:
 *                         type: string
 *                         example: "This is the lesson content."
 *     responses:
 *       200:
 *         description: Module updated successfully
 */
router.put("/:id", validateRequest(updateLessonSchema), updateLesson);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 */
router.delete("/:id", validateRequest(deleteLessonSchema), deleteLesson);

export default router;

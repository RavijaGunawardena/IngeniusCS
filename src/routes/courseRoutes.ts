import express from "express";
import {
	createCourse,
	getCourses,
	getCourseById,
	updateCourse,
	deleteCourse,
	getCoursesWithMoreDetails,
} from "../controllers/courseController";
import { validateRequest } from "../middlewares/validateRequest";
import {
	createCourseSchema,
	deleteCourseSchema,
	getCourseByIdSchema,
	getCoursesSchema,
	updateCourseSchema,
} from "../validations/courseValidation";

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course
 *               description:
 *                 type: string
 *                 description: The description of the course
 *     responses:
 *       201:
 *         description: The course was successfully created
 *       500:
 *         description: Internal server error
 */
router.post("/", validateRequest(createCourseSchema), createCourse);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses with pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of courses per page
 *     responses:
 *       200:
 *         description: A paginated list of courses
 *       500:
 *         description: Internal server error
 */
router.get("/", validateRequest(getCoursesSchema), getCourses);

/**
 * @swagger
 * /courses/details:
 *   get:
 *     summary: Get all courses with more details
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of courses per page
 *     responses:
 *       200:
 *         description: A paginated list of courses with more details
 *       500:
 *         description: Internal server error
 */
router.get("/details", getCoursesWithMoreDetails);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: A course object
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", validateRequest(getCourseByIdSchema), getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course
 *               description:
 *                 type: string
 *                 description: The description of the course
 *     responses:
 *       200:
 *         description: The updated course object
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", validateRequest(updateCourseSchema), updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", validateRequest(deleteCourseSchema), deleteCourse);

export default router;

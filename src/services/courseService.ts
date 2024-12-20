import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Course } from "../models/Course";

import { readModulesFromFile, writeModulesToFile } from "./moduleService";
import { readLessonsFromFile, writeLessonsToFile } from "./lessonService";

const courseDataFilePath = path.join(__dirname, "../data/courses.json");

// Helper to read courses from JSON file
export const readCoursesFromFile = async (): Promise<Course[]> => {
	const fileData = await fs.readFile(courseDataFilePath, "utf-8");
	return JSON.parse(fileData);
};

// Helper to write courses to JSON file
export const writeCoursesToFile = async (courses: Course[]): Promise<void> => {
	await fs.writeFile(courseDataFilePath, JSON.stringify(courses, null, 2));
};

// CREATE Course
export const createCourse = async (
	title: string,
	description: string
): Promise<Course> => {
	const courses = await readCoursesFromFile();
	const newCourse = { id: uuidv4(), title, description, moduleIds: [] };
	courses.push(newCourse);
	await writeCoursesToFile(courses);
	return newCourse;
};

// GET All Courses with Pagination
export const getCourses = async (page: number, limit: number) => {
	const courses = await readCoursesFromFile();
	const totalCourses = courses.length;
	const totalPages = Math.ceil(totalCourses / limit);
	const paginatedCourses = courses.slice((page - 1) * limit, page * limit);
	return { courses: paginatedCourses, totalCourses, totalPages };
};

export const getCoursesWithDetails = async (page: number, limit: number) => {
	const courses = await readCoursesFromFile();
	const modules = await readModulesFromFile();
	const lessons = await readLessonsFromFile();

	const totalCourses = courses.length;
	const totalPages = Math.ceil(totalCourses / limit);

	const detailedCourses = courses.map((course) => {
		const courseModules = modules.filter((module) =>
			course.moduleIds.includes(module.id)
		);

		const modulesWithLessons = courseModules.map((module) => {
			const moduleLessons = lessons.filter((lesson) =>
				module.lessonIds.includes(lesson.id)
			);

			return {
				moduleId: module.id,
				title: module.title,
				lessons: moduleLessons.map((lesson) => ({
					lessonId: lesson.id,
					title: lesson.title,
					description: lesson.description,
					topics: lesson.topics,
					content: lesson.content,
				})),
			};
		});

		return {
			id: course.id,
			title: course.title,
			description: course.description,
			modules: modulesWithLessons,
		};
	});

	const paginatedCourses = detailedCourses.slice(
		(page - 1) * limit,
		page * limit
	);
	return { paginatedCourses, totalCourses, totalPages };
};

// GET Course by ID
export const getCourseById = async (
	courseId: string
): Promise<Course | undefined> => {
	const courses = await readCoursesFromFile();
	return courses.find((course) => course.id === courseId);
};

// UPDATE Course
export const updateCourse = async (
	courseId: string,
	title: string,
	description: string
): Promise<Course | undefined> => {
	const courses = await readCoursesFromFile();
	const courseIndex = courses.findIndex((course) => course.id === courseId);

	if (courseIndex === -1) {
		return undefined;
	}

	courses[courseIndex] = { ...courses[courseIndex], title, description };
	await writeCoursesToFile(courses);
	return courses[courseIndex];
};

// DELETE Course
export const deleteCourse = async (courseId: string): Promise<boolean> => {
	const courses = await readCoursesFromFile();
	const updatedCourses = courses.filter((course) => course.id !== courseId);

	if (updatedCourses.length === courses.length) {
		return false;
	}

	const modules = await readModulesFromFile();
	const lessons = await readLessonsFromFile();

	const courseToDelete = courses.find((course) => course.id === courseId);
	if (courseToDelete) {
		const updatedModules = modules.filter(
			(module) => !courseToDelete.moduleIds.includes(module.id)
		);
		await writeModulesToFile(updatedModules);

		const updatedLessons = lessons.filter(
			(lesson) =>
				!courseToDelete.moduleIds.some((moduleId) =>
					modules
						.find((module) => module.id === moduleId)
						?.lessonIds.includes(lesson.id)
				)
		);
		await writeLessonsToFile(updatedLessons);
	}

	await writeCoursesToFile(updatedCourses);
	return true;
};

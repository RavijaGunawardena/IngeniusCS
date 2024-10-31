import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { readCoursesFromFile, writeCoursesToFile } from "./courseService";
import { Module } from "../models/Module";

const moduleDataFilePath = path.join(__dirname, "../data/modules.json");

// Helper to read modules from JSON file
export const readModulesFromFile = async (): Promise<Module[]> => {
	const fileData = await fs.readFile(moduleDataFilePath, "utf-8");
	return JSON.parse(fileData);
};

// Helper to write modules to JSON file
export const writeModulesToFile = async (modules: Module[]): Promise<void> => {
	await fs.writeFile(moduleDataFilePath, JSON.stringify(modules, null, 2));
};

// CREATE Module
export const createModule = async (
	courseId: string,
	title: string
): Promise<Module | null> => {
	const modules = await readModulesFromFile();
	const newModule = { id: uuidv4(), title, courseId, lessonIds: [] };

	const courses = await readCoursesFromFile();
	const course = courses.find((c) => c.id === courseId);
	if (!course) return null;

	modules.push(newModule);
	course.moduleIds.push(newModule.id);

	await writeModulesToFile(modules);
	await writeCoursesToFile(courses);

	return newModule;
};

// GET Modules with Pagination for a specific course
export const getModules = async (
	courseId: string,
	page: number,
	limit: number
) => {
	const modules = await readModulesFromFile();
	const courseModules = modules.filter((m) => m.courseId === courseId);
	const totalModules = courseModules.length;
	const totalPages = Math.ceil(totalModules / limit);
	const paginatedModules = courseModules.slice(
		(page - 1) * limit,
		page * limit
	);

	return { modules: paginatedModules, totalModules, totalPages };
};
// // GET Module by ID
// export const getModuleById = async (
// 	courseId: string,
// 	moduleId: string
// ): Promise<Module | undefined> => {
// 	const modules = await readModulesFromFile();
// 	return modules.find((m) => m.courseId === courseId && m.id === moduleId);
// };

// UPDATE Module
export const updateModule = async (
	courseId: string,
	moduleId: string,
	title: string
): Promise<Module | undefined> => {
	const modules = await readModulesFromFile();
	const moduleIndex = modules.findIndex(
		(m) => m.courseId === courseId && m.id === moduleId
	);

	if (moduleIndex === -1) return undefined;

	modules[moduleIndex].title = title;
	await writeModulesToFile(modules);
	return modules[moduleIndex];
};

// DELETE Module and Update Course
export const deleteModule = async (
	courseId: string,
	moduleId: string
): Promise<boolean> => {
	const modules = await readModulesFromFile();
	const updatedModules = modules.filter(
		(m) => m.courseId !== courseId || m.id !== moduleId
	);

	if (updatedModules.length === modules.length) return false;

	const courses = await readCoursesFromFile();
	const course = courses.find((c) => c.id === courseId);
	if (course) {
		course.moduleIds = course.moduleIds.filter((id) => id !== moduleId);
		await writeCoursesToFile(courses);
	}

	await writeModulesToFile(updatedModules);
	return true;
};

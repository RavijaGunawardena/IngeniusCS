import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { readModulesFromFile, writeModulesToFile } from "./moduleService";
import { Lesson } from "../models/Lesson";

const lessonDataFilePath = path.join(__dirname, "../data/lessons.json");

// Helper to read lessons from JSON file
export const readLessonsFromFile = async (): Promise<Lesson[]> => {
	const fileData = await fs.readFile(lessonDataFilePath, "utf-8");
	return JSON.parse(fileData);
};

// Helper to write lessons to JSON file
const writeLessonsToFile = async (lessons: Lesson[]): Promise<void> => {
	await fs.writeFile(lessonDataFilePath, JSON.stringify(lessons, null, 2));
};

// CREATE Lesson
export const createLesson = async (
	moduleId: string,
	title: string,
	description: string,
	topics: string[],
	content: any[]
): Promise<Lesson | null> => {
	const lessons = await readLessonsFromFile();
	const newLesson = {
		id: uuidv4(),
		title,
		description,
		topics,
		content,
		moduleId,
	};

	const modules = await readModulesFromFile();
	const module = modules.find((m) => m.id === moduleId);
	if (!module) return null;

	lessons.push(newLesson);
	module.lessonIds.push(newLesson.id);

	await writeLessonsToFile(lessons);
	await writeModulesToFile(modules);

	return newLesson;
};

// GET All Lessons for a Module with Pagination
export const getLessons = async (
	moduleId: string,
	page: number,
	limit: number
) => {
	const lessons = await readLessonsFromFile();
	const moduleLessons = lessons.filter((l) => l.moduleId === moduleId);
	const totalLessons = moduleLessons.length;
	const totalPages = Math.ceil(totalLessons / limit);
	const paginatedLessons = moduleLessons.slice(
		(page - 1) * limit,
		page * limit
	);

	return { lessons: paginatedLessons, totalLessons, totalPages };
};

// GET Lesson by ID
export const getLessonById = async (
	moduleId: string,
	lessonId: string
): Promise<Lesson | undefined> => {
	const lessons = await readLessonsFromFile();
	return lessons.find((l) => l.moduleId === moduleId && l.id === lessonId);
};

// UPDATE Lesson
export const updateLesson = async (
	moduleId: string,
	lessonId: string,
	title: string,
	description: string,
	topics: string[],
	content: any[]
): Promise<Lesson | undefined> => {
	const lessons = await readLessonsFromFile();
	const lessonIndex = lessons.findIndex(
		(l) => l.moduleId === moduleId && l.id === lessonId
	);

	if (lessonIndex === -1) {
		return undefined;
	}

	lessons[lessonIndex] = {
		...lessons[lessonIndex],
		title,
		description,
		topics,
		content,
	};
	await writeLessonsToFile(lessons);
	return lessons[lessonIndex];
};

// DELETE Lesson
export const deleteLesson = async (
	moduleId: string,
	lessonId: string
): Promise<boolean> => {
	const lessons = await readLessonsFromFile();
	const updatedLessons = lessons.filter(
		(l) => l.moduleId !== moduleId || l.id !== lessonId
	);

	if (updatedLessons.length === lessons.length) {
		return false;
	}

	const modules = await readModulesFromFile();
	const module = modules.find((m) => m.id === moduleId);
	if (module) {
		module.lessonIds = module.lessonIds.filter((id) => id !== lessonId);
		await writeModulesToFile(modules);
	}

	await writeLessonsToFile(updatedLessons);
	return true;
};

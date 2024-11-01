import * as fs from "fs/promises";
import { Module } from "../models/Module";
import { v4 as uuidv4 } from "uuid";
import {
	createModule,
	deleteModule,
	getModules,
	updateModule,
} from "../services/moduleService";
import { Course } from "../models/Course";

jest.mock("fs/promises");

const mockCourses: Course[] = [
	{
		id: "1",
		title: "Web Development Basics",
		description: "",
		moduleIds: [],
	},
	{
		id: "2",
		title: "Web Development Basics",
		description: "",
		moduleIds: [],
	},
];

const mockModules: Module[] = [
	{
		id: "1",
		title: "Web Development Basics",
		courseId: "1",
		lessonIds: [],
	},
	{
		id: "2",
		title: "Web Development Basics",
		courseId: "2",
		lessonIds: [],
	},
];

describe("Module Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should create a new module", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const newModule = await createModule(
			mockCourses[0].id,
			"React Fundamentals"
		);

		expect(newModule).toEqual({
			id: expect.any(String),
			title: "React Fundamentals",
			courseId: mockCourses[0].id,
			lessonIds: [],
		});
		expect(fs.writeFile).toHaveBeenCalled();
	});

	test("should get all modules for a specific course with pagination", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);

		const { modules, totalModules, totalPages } = await getModules(
			mockCourses[0].id,
			1,
			10
		);

		expect(modules).toEqual([mockModules[0]]);
		expect(totalModules).toBe(1);
		expect(totalPages).toBe(1);
	});

	test("should not creaet a module for a non-existing course", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const newModule = await createModule(uuidv4(), "React Fundamentals");

		expect(newModule).toBeNull();
	});

	test("should update an existing module", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const updatedModule = await updateModule(
			mockCourses[0].id,
			mockModules[0].id,
			"Updated Web Development Basics"
		);

		expect(updatedModule).toEqual({
			id: mockModules[0].id,
			title: "Updated Web Development Basics",
			courseId: mockCourses[0].id,
			lessonIds: [],
		});
	});

	test("should delete a module", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const result = await deleteModule(mockCourses[0].id, mockModules[0].id);

		expect(result).toBe(true);
	});

	test("should return false when trying to delete a non-existent module", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);

		const result = await deleteModule(mockCourses[0].id, uuidv4()); // Random UUID

		expect(result).toBe(false);
	});
});

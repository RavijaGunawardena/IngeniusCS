import * as fs from "fs/promises";
import { Lesson } from "../src/models/Lesson";
import { v4 as uuidv4 } from "uuid";
import {
	createLesson,
	deleteLesson,
	getLessonById,
	getLessons,
	updateLesson,
} from "../src/services/lessonService";
import { Module } from "../src/models/Module";

jest.mock("fs/promises");

const mockLessons: Lesson[] = [
	{
		id: uuidv4(),
		title: "Introduction to HTML",
		description: "Learn the basics of HTML, the structure of web pages.",
		topics: ["HTML Structure", "Tags", "Attributes"],
		content: [
			{
				type: "text",
				data: "HTML is the standard markup language for web pages.",
			},
		],
		moduleId: "c386fd6f-003c-44ef-a99b-61072ac18121",
	},
	{
		id: uuidv4(),
		title: "CSS Fundamentals",
		description: "Understand how to style your web pages using CSS.",
		topics: ["Selectors", "Box Model", "Flexbox"],
		content: [{ type: "video", data: "https://example.com/css-fundamentals" }],
		moduleId: "c386fd6f-003c-44ef-a99b-61072ac18121",
	},
];

const mockModules: Module[] = [
	{
		id: "c386fd6f-003c-44ef-a99b-61072ac18121",
		title: "Web Development Basics",
		courseId: "1",
		lessonIds: [],
	},
	{
		id: "c386fd6f-003c-44ef-a99b-61072ac18121",
		title: "Web Development Basics 2",
		courseId: "2",
		lessonIds: [],
	},
];

describe("Lesson Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should create a new lesson", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);

		const newLesson = await createLesson(
			mockLessons[0].moduleId,
			"JavaScript Basics",
			"Learn the fundamentals of JavaScript.",
			["Variables", "Data Types", "Functions"],
			[
				{
					type: "text",
					data: "JavaScript is a versatile programming language.",
				},
				{ type: "video", data: "https://example.com/js-basics" },
			]
		);

		expect(newLesson).toEqual({
			id: expect.any(String),
			title: "JavaScript Basics",
			description: "Learn the fundamentals of JavaScript.",
			topics: ["Variables", "Data Types", "Functions"],
			content: expect.any(Array),
			moduleId: mockLessons[0].moduleId,
		});
		expect(fs.writeFile).toHaveBeenCalled();
	});

	test("should get all lessons for a specific module with pagination", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);

		const { lessons, totalLessons, totalPages } = await getLessons(
			mockLessons[0].moduleId,
			1,
			10
		);

		expect(lessons).toEqual(mockLessons);
		expect(totalLessons).toBe(2);
		expect(totalPages).toBe(1);
	});

	test("should get lesson by ID", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);

		const lesson = await getLessonById(
			mockLessons[0].moduleId,
			mockLessons[0].id
		);

		expect(lesson).toEqual(mockLessons[0]);
	});

	test("should update an existing lesson", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const updatedLesson = await updateLesson(
			mockLessons[0].moduleId,
			mockLessons[0].id,
			"Updated JavaScript Basics",
			"Learn the updated fundamentals of JavaScript.",
			["Variables", "Data Types", "Functions", "ES6 Features"],
			[{ type: "text", data: "JavaScript now includes many modern features." }]
		);

		expect(updatedLesson).toEqual({
			id: mockLessons[0].id,
			title: "Updated JavaScript Basics",
			description: "Learn the updated fundamentals of JavaScript.",
			topics: ["Variables", "Data Types", "Functions", "ES6 Features"],
			content: expect.any(Array),
			moduleId: mockLessons[0].moduleId,
		});
	});

	test("should delete a lesson", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);

		const result = await deleteLesson(
			mockLessons[0].moduleId,
			mockLessons[0].id
		);

		expect(result).toBe(true);
	});

	test("should return undefined for non-existent lesson ID", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);

		const lesson = await getLessonById(mockLessons[0].moduleId, uuidv4()); // Random UUID

		expect(lesson).toBeUndefined();
	});

	// test("should not create a lesson with empty title", async () => {
	// 	(fs.readFile as jest.Mock).mockResolvedValueOnce(
	// 		JSON.stringify(mockLessons)
	// 	);
	// 	(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
	// 	(fs.readFile as jest.Mock).mockResolvedValueOnce(
	// 		JSON.stringify(mockModules)
	// 	);

	// 	await expect(
	// 		createLesson(
	// 			mockLessons[0].moduleId,
	// 			"",
	// 			"Description",
	// 			["Sample topic"],
	// 			[{ type: "text", data: "Sample content" }]
	// 		)
	// 	).rejects.toThrow("Title cannot be empty.");
	// });
});

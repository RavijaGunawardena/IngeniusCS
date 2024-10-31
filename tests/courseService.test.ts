import {
	createCourse,
	deleteCourse,
	getCourseById,
	getCourses,
	updateCourse,
} from "../src/services/courseService";
import * as fs from "fs/promises";
import { Course } from "../src/models/Course";
import { v4 as uuidv4 } from "uuid"; // Import UUID generation

jest.mock("fs/promises");

const mockCourses: Course[] = [
	{
		id: uuidv4(),
		title: "Introduction to JavaScript",
		description:
			"Learn the fundamentals of JavaScript, the programming language of the web.",
		moduleIds: [],
	},
	{
		id: uuidv4(),
		title: "Advanced CSS Techniques",
		description:
			"Explore advanced CSS techniques for building responsive layouts.",
		moduleIds: [],
	},
];

describe("Course Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should create a new course", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const newCourse = await createCourse(
			"Web Development Basics",
			"A comprehensive introduction to web development."
		);

		expect(newCourse).toEqual({
			id: expect.any(String),
			title: "Web Development Basics",
			description: "A comprehensive introduction to web development.",
			moduleIds: [],
		});
		expect(fs.writeFile).toHaveBeenCalled();
	});

	test("should get all courses with pagination", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const { courses, totalCourses, totalPages } = await getCourses(1, 2);

		expect(courses).toEqual(mockCourses);
		expect(totalCourses).toBe(2);
		expect(totalPages).toBe(1);
	});

	test("should get course by ID", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const course = await getCourseById(mockCourses[0].id);

		expect(course).toEqual(mockCourses[0]);
	});

	test("should update an existing course", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const updatedCourse = await updateCourse(
			mockCourses[0].id,
			"Introduction to JavaScript (Updated)",
			"Learn the fundamentals of JavaScript, now updated with ES6 features."
		);

		expect(updatedCourse).toEqual({
			id: mockCourses[0].id,
			title: "Introduction to JavaScript (Updated)",
			description:
				"Learn the fundamentals of JavaScript, now updated with ES6 features.",
			moduleIds: [],
		});
	});

	test("should delete a course", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const result = await deleteCourse(mockCourses[0].id);

		expect(result).toBe(true);
	});

	test("should return undefined for non-existent course ID", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const course = await getCourseById(uuidv4());

		expect(course).toBeUndefined();
	});

	// test("should not create a course with empty title", async () => {
	// 	(fs.readFile as jest.Mock).mockResolvedValueOnce(
	// 		JSON.stringify(mockCourses)
	// 	);

	// 	await expect(createCourse("", "Description")).rejects.toThrow(
	// 		"Title cannot be empty."
	// 	);
	// });
});

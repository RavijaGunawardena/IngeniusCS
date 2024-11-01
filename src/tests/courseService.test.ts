import {
	createCourse,
	deleteCourse,
	getCourseById,
	getCourses,
	getCoursesWithDetails,
	updateCourse,
} from "../services/courseService";
import * as fs from "fs/promises";
import { Course } from "../models/Course";
import { v4 as uuidv4 } from "uuid";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";


jest.mock("fs/promises");

const mockCourses: Course[] = [
	{
		id: "1",
		title: "Introduction to JavaScript",
		description:
			"Learn the fundamentals of JavaScript, the programming language of the web.",
		moduleIds: ["m1"],
	},
	{
		id: "2",
		title: "Advanced CSS Techniques",
		description:
			"Explore advanced CSS techniques for building responsive layouts.",
		moduleIds: [],
	},
];

const mockModules: Module[] = [
	{
		id: "m1",
		title: "Web Development Basics",
		courseId: "1",
		lessonIds: ["l1"],
	},
];

const mockLessons: Lesson[] = [
	{
		id: "l1",
		title: "Introduction to HTML",
		description: "Learn the basics of HTML, the structure of web pages.",
		topics: ["HTML Structure", "Tags", "Attributes"],
		content: [
			{
				type: "text",
				data: "HTML is the standard markup language for web pages.",
			},
		],
		moduleId: "m1",
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

	test("should get more details of all courses with pagination", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);

		const { totalCourses, totalPages } = await getCoursesWithDetails(1, 2);

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
			moduleIds: ["m1"],
		});
	});

	test("should return undefined for non-existent course ID", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);

		const course = await getCourseById(uuidv4());

		expect(course).toBeUndefined();
	});

	test("should delete a course and associated modules and lessons", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockCourses)
		);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockModules)
		);
		(fs.readFile as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockLessons)
		);
		(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

		const result = await deleteCourse("1");

		expect(result).toBe(true);
	});
});

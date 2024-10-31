"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getCourses = exports.createCourse = void 0;
const uuid_1 = require("../utils/uuid");
const validationSchemas_1 = require("../models/validationSchemas");
const logger_1 = __importDefault(require("../config/logger"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const cache_1 = require("../utils/cache");
const dataFilePath = path_1.default.join(__dirname, "../data/courses.json");
// Helper to read courses from the file
const readCoursesFromFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const fileData = yield promises_1.default.readFile(dataFilePath, "utf-8");
    return JSON.parse(fileData);
});
// Helper to write courses to the file
const writeCoursesToFile = (courses) => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile(dataFilePath, JSON.stringify(courses, null, 2));
});
// CREATE Course
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        const { error } = validationSchemas_1.createCourseSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const courseData = req.body;
        // Generate UUID for the new course
        const newCourse = Object.assign({ id: (0, uuid_1.generateUUID)() }, courseData);
        // Save to JSON file (data persistence simulation)
        const fileData = yield promises_1.default.readFile(dataFilePath, "utf-8");
        const courses = JSON.parse(fileData);
        courses.push(newCourse);
        yield promises_1.default.writeFile(dataFilePath, JSON.stringify(courses, null, 2));
        res.status(201).json(newCourse);
    }
    catch (error) {
        logger_1.default.error(`Error creating course: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCourse = createCourse;
// READ All Courses with Pagination and Caching
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `courses_page_${req.query.page}_limit_${req.query.limit}`;
        const cachedCourses = (0, cache_1.getCache)(cacheKey);
        if (cachedCourses) {
            res.status(200).json(cachedCourses);
            return;
        }
        const courses = yield readCoursesFromFile();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedCourses = courses.slice(startIndex, endIndex);
        const responseData = {
            page,
            limit,
            totalCourses: courses.length,
            totalPages: Math.ceil(courses.length / limit),
            data: paginatedCourses,
        };
        // Set cache for the paginated response
        (0, cache_1.setCache)(cacheKey, responseData, 60000); // Cache for 1 minute
        res.status(200).json(responseData);
    }
    catch (error) {
        logger_1.default.error(`Error retrieving courses: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCourses = getCourses;
// READ Course by ID
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield readCoursesFromFile();
        const course = courses.find((c) => c.id === req.params.id);
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        res.status(200).json(course);
    }
    catch (error) {
        logger_1.default.error(`Error retrieving course by ID: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCourseById = getCourseById;
// UPDATE Course
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validationSchemas_1.createCourseSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const courses = yield readCoursesFromFile();
        const index = courses.findIndex((c) => c.id === req.params.id);
        if (index === -1) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        const updatedCourse = Object.assign(Object.assign({}, courses[index]), req.body);
        courses[index] = updatedCourse;
        yield writeCoursesToFile(courses);
        res.status(200).json(updatedCourse);
    }
    catch (error) {
        logger_1.default.error(`Error updating course: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateCourse = updateCourse;
// DELETE Course
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield readCoursesFromFile();
        const updatedCourses = courses.filter((c) => c.id !== req.params.id);
        if (courses.length === updatedCourses.length) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        yield writeCoursesToFile(updatedCourses);
        res.status(204).send(); // No content for successful deletion
    }
    catch (error) {
        logger_1.default.error(`Error deleting course: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCourse = deleteCourse;

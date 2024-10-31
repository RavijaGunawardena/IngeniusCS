"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCourses = exports.readCourses = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '../data/courses.json');
const readCourses = () => {
    const data = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};
exports.readCourses = readCourses;
const writeCourses = (courses) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(courses, null, 2));
};
exports.writeCourses = writeCourses;

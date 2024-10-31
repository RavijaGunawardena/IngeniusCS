"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = exports.createModuleSchema = exports.createLessonSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createLessonSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    topics: joi_1.default.array().items(joi_1.default.string()).required(),
    content: joi_1.default.array()
        .items(joi_1.default.object({
        type: joi_1.default.string().valid("text", "video", "audio").required(),
        data: joi_1.default.string().required(),
    }))
        .required(),
});
exports.createModuleSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    lessons: joi_1.default.array().items(exports.createLessonSchema).required(),
});
exports.createCourseSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    modules: joi_1.default.array().items(exports.createModuleSchema).required(),
});

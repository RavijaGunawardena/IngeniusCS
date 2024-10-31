"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const requestLogger_1 = require("./middlewares/requestLogger");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Course Management System API",
            version: "1.0.0",
            description: "API documentation for Course Management System",
        },
        components: {
            schemas: {
                Course: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Unique course ID" },
                        title: { type: "string", description: "Title of the course" },
                        description: {
                            type: "string",
                            description: "Description of the course",
                        },
                        modules: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Module" },
                        },
                    },
                },
                CreateCourseRequest: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Title of the course" },
                        description: {
                            type: "string",
                            description: "Description of the course",
                        },
                        modules: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Module" },
                        },
                    },
                },
                Module: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Title of the module" },
                        lessons: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Lesson" },
                        },
                    },
                },
                Lesson: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Title of the lesson" },
                        description: {
                            type: "string",
                            description: "Description of the lesson",
                        },
                        topics: {
                            type: "array",
                            items: { type: "string" },
                        },
                        content: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string", enum: ["text", "video", "audio"] },
                                    data: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"], // Location of API routes
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(requestLogger_1.requestLogger);
app.use("/api", courseRoutes_1.default);
// app.use("/api", moduleRoutes);
// app.use("/api", lessonRoutes);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(rateLimiter_1.rateLimiter);
app.use(errorHandler_1.errorHandler);
exports.default = app;

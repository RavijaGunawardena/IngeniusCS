import express from "express";
import { json } from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import courseRoutes from "./routes/courseRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { rateLimiter } from "./middlewares/rateLimiter";

// Initialize the app
const app = express();

// Middleware
app.use(json());
app.use(requestLogger);
app.use(rateLimiter);

// Swagger configuration
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Course Management System API",
			version: "1.0.0",
			description: "API for managing courses, modules, and lessons",
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
						moduleIds: {
							type: "array",
							items: { type: "string" },
							description: "List of module IDs associated with the course",
						},
					},
				},
				Module: {
					type: "object",
					properties: {
						id: { type: "string", description: "Unique module ID" },
						title: { type: "string", description: "Title of the module" },
						courseId: {
							type: "string",
							description: "ID of the parent course",
						},
						lessonIds: {
							type: "array",
							items: { type: "string" },
							description: "List of lesson IDs associated with the module",
						},
					},
				},
				Lesson: {
					type: "object",
					properties: {
						id: { type: "string", description: "Unique lesson ID" },
						title: { type: "string", description: "Title of the lesson" },
						description: {
							type: "string",
							description: "Description of the lesson",
						},
						topics: {
							type: "array",
							items: { type: "string" },
							description: "Topics covered in the lesson",
						},
						content: {
							type: "array",
							items: {
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["text", "video", "audio"],
										description: "Type of content",
									},
									data: {
										type: "string",
										description:
											"Content data, e.g., text, video URL, or audio URL",
									},
								},
							},
							description: "Content of the lesson, e.g., text, video, audio",
						},
						moduleId: {
							type: "string",
							description: "ID of the parent module",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/lessons", lessonRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;

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
		}
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

export default app;

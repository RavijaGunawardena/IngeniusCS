import request from "supertest";
import express from "express";
import { json } from "body-parser";
import courseRoutes from "../routes/courseRoutes";

const app = express();
app.use(json());
app.use("/courses", courseRoutes);

describe("Course Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("POST /courses - should create a new course", async () => {
		const response = await request(app).post("/courses").send({
			title: "React Basics",
			description: "Learn the basics of React.",
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			status: "success",
			message: "Course created successfully",
			payload: expect.objectContaining({
				title: "React Basics",
				description: "Learn the basics of React.",
				moduleIds: expect.any(Array),
			}),
		});
	});

	test("GET /courses - should retrieve all courses", async () => {
		const response = await request(app).get("/courses?page=1&limit=10");

		expect(response.status).toBe(200);
		expect(response.body.payload).toHaveProperty("data");
	});

	test("GET /courses/:id - should retrieve course by ID", async () => {
		const courseId = "81b64bbf-cdf4-43ee-af58-870e5b666929";

		const response = await request(app).get(`/courses/${courseId}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("title");
	});

	test("PUT /courses/:id - should update a course", async () => {
		const courseId = "81b64bbf-cdf4-43ee-af58-870e5b666929";

		const response = await request(app).put(`/courses/${courseId}`).send({
			title: "Updated React Course",
			description: "Updated description for React course.",
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Course updated successfully"
		);
	});

	test("POST /courses - should return error for empty title", async () => {
		const response = await request(app)
			.post("/courses")
			.send({ title: "", description: "No title" });

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Validation failed");
		expect(response.body.errors).toContain("Title cannot be empty.");
	});

	test("DELETE /courses/:id - should delete a course and associated modules and lessons", async () => {
		const courseResponse = await request(app).post("/courses").send({
			title: "Full Stack Development",
			description: "Comprehensive course on full stack development.",
		});

		const courseId = courseResponse.body.payload.id;

		const response = await request(app).delete(`/courses/${courseId}`);

		expect(response.status).toBe(204);
	});
});

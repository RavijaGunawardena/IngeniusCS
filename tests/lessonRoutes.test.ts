// import request from "supertest";
// import express from "express";
// import { json } from "body-parser";
// import lessonRoutes from "../src/routes/lessonRoutes";

// const app = express();
// app.use(json());
// app.use("/lessons", lessonRoutes);

// // jest.mock("../src/services/lessonService");

// describe("Lesson Routes", () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	test("POST /lessons - should create a new lesson", async () => {
// 		// (writeLessonsToFile as jest.Mock).mockResolvedValueOnce(undefined);

// 		const response = await request(app)
// 			.post("/lessons")
// 			.send({
// 				title: "New Lesson",
// 				description: "New Lesson Description",
// 				topics: ["Sample topic"],
// 				content: [{ type: "text", data: "Sample content" }],
//                 moduleId: '{id}'
// 			});

// 		expect(response.status).toBe(201);
// 	});

// 	test("GET /lessons - should retrieve all lessons for a given module", async () => {
// 		// (writeLessonsToFile as jest.Mock).mockResolvedValueOnce(undefined);

// 		const response = await request(app).get("/lessons/{}");

// 		expect(response.status).toBe(200);
// 		// expect(response.body).toHaveProperty('data');
// 	});

// 	test("PUT /lessons/:id - should update a lesson", async () => {
// 		const response = await request(app)
// 			.put("/lessons/{id}?moduleId={id}")
// 			.send({
// 				title: "Updated Lesson",
// 				description: "Updated Description",
// 				topics: ["Updated topic"],
// 				content: [{ type: "text", data: "Updated Sample content" }],
// 			});

// 		expect(response.status).toBe(200);
// 	});

// 	test("DELETE /lessons/:id - should delete a lesson", async () => {
// 		const response = await request(app).delete("/lessons/{id}?moduleId={id}");

// 		expect(response.status).toBe(204);
// 	});
// });

import request from "supertest";
import express from "express";
import { json } from "body-parser";
import lessonRoutes from "../src/routes/lessonRoutes";

const app = express();
app.use(json());
app.use("/lessons", lessonRoutes);

describe("Lesson Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("POST /lessons - should create a new lesson", async () => {
		const response = await request(app)
			.post("/lessons")
			.send({
				title: "Advanced JavaScript Concepts",
				description: "Deep dive into JavaScript.",
				topics: ["Closures", "Promises", "Async/Await"],
				content: [
					{ type: "text", data: "JavaScript closures are powerful." },
					{ type: "video", data: "https://example.com/advanced-js" },
				],
				moduleId: "c386fd6f-003c-44ef-a99b-61072ac18121",
			});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			status: "success",
			message: "Lesson created successfully",
			payload: expect.objectContaining({
				title: "Advanced JavaScript Concepts",
				description: "Deep dive into JavaScript.",
				topics: expect.any(Array),
				moduleId: "c386fd6f-003c-44ef-a99b-61072ac18121",
			}),
		});
	});

	test("GET /lessons - should retrieve all lessons for a given module", async () => {
		const response = await request(app).get(
			"/lessons?moduleId=c386fd6f-003c-44ef-a99b-61072ac18121&page=1&limit=10"
		);

		expect(response.status).toBe(200);
		expect(response.body.payload).toHaveProperty("data");
	});

	test("PUT /lessons/:id - should update a lesson", async () => {
		const lessonId = "a69c702b-2e19-408a-be0b-d66e2e41bf4c";
		const response = await request(app)
			.put(`/lessons/${lessonId}?moduleId=c386fd6f-003c-44ef-a99b-61072ac18121`)
			.send({
				title: "Updated Advanced JavaScript Concepts",
				description: "Updated lesson on JavaScript.",
				topics: ["Closures", "Promises", "Async/Await", "Error Handling"],
				content: [
					{ type: "text", data: "JavaScript error handling is crucial." },
				],
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Lesson updated successfully"
		);
	});

	test("DELETE /lessons/:id - should delete a lesson", async () => {
		const lessonId = "b251e586-e2da-4e11-ad79-134e198c56ca";
		const response = await request(app).delete(
			`/lessons/${lessonId}?moduleId=c386fd6f-003c-44ef-a99b-61072ac18121`
		); 

		expect(response.status).toBe(204);
	});

	test("POST /lessons - should return error for empty title", async () => {
		const response = await request(app)
			.post("/lessons")
			.send({
				title: "",
				description: "No title lesson.",
				topics: ["Sample topic"],
				content: [{ type: "text", data: "Sample content" }],
				moduleId: "c386fd6f-003c-44ef-a99b-61072ac18121",
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Validation failed");
		expect(response.body.errors).toContain("Title cannot be empty.");
	});
});

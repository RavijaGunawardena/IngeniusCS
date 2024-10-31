// // moduleRoutes.test.ts

// import request from "supertest";
// import express from "express";
// import { json } from "body-parser";
// import moduleRoutes from "../src/routes/moduleRoutes";

// const app = express();
// app.use(json());
// app.use("/modules", moduleRoutes);

// // jest.mock("../src/services/moduleService"); // Uncomment to mock service methods

// describe("Module Routes", () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	test("POST /modules - should create a new module", async () => {
// 		// (writeModulesToFile as jest.Mock).mockResolvedValueOnce(undefined);

// 		const response = await request(app).post("/modules").send({
// 			courseId: "courseId1",
// 			title: "New Module",
// 		});

// 		expect(response.status).toBe(201);
// 		// expect(response.body).toEqual({
// 		// 	status: "success",
// 		// 	message: "Module created successfully",
// 		// });
// 	});

// 	test("GET /modules - should retrieve all modules for a specific course", async () => {
// 		// (writeModulesToFile as jest.Mock).mockResolvedValueOnce(undefined);

// 		const response = await request(app).get(
// 			"/modules?courseId=courseId1&page=1&limit=10"
// 		);

// 		expect(response.status).toBe(200);
// 		// expect(response.body).toHaveProperty('data'); // Uncomment for additional checks
// 	});

// 	test("PUT /modules/:id - should update a module", async () => {
// 		const response = await request(app)
// 			.put("/modules/1?courseId=courseId1")
// 			.send({
// 				title: "Updated Module",
// 			});

// 		expect(response.status).toBe(200);
// 		expect(response.body).toHaveProperty(
// 			"message",
// 			"Module updated successfully"
// 		);
// 	});

// 	test("DELETE /modules/:id - should delete a module", async () => {
// 		const response = await request(app).delete("/modules/1?courseId=courseId1");

// 		expect(response.status).toBe(204);
// 	});
// });

import request from "supertest";
import express from "express";
import { json } from "body-parser";
import moduleRoutes from "../src/routes/moduleRoutes";

import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(json());
app.use("/modules", moduleRoutes);

// const randomCourseId = uuidv4();

describe("Module Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("POST /modules - should create a new module", async () => {
		const response = await request(app).post("/modules").send({
			courseId: "80c8bb88-ca57-4f2a-a7a4-bd28774c22ec",
			title: "Node.js Basics",
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			status: "success",
			message: "Module created successfully",
			payload: expect.objectContaining({
				title: "Node.js Basics",
				courseId: "80c8bb88-ca57-4f2a-a7a4-bd28774c22ec",
				lessonIds: [],
			}),
		});
	});

	test("GET /modules - should retrieve all modules for a specific course", async () => {
		const response = await request(app).get(
			"/modules?courseId=80c8bb88-ca57-4f2a-a7a4-bd28774c22ec&page=1&limit=10"
		); 

		expect(response.status).toBe(200);
		expect(response.body.payload).toHaveProperty("data");
	});

	test("PUT /modules/:id - should update a module", async () => {
		const moduleId = "1907b7e0-57d4-432f-8500-2201f4b23e15";
		const response = await request(app)
			.put(`/modules/${moduleId}?courseId=80c8bb88-ca57-4f2a-a7a4-bd28774c22ec`)
			.send({
				title: "Updated Node.js Basics",
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			"message",
			"Module updated successfully"
		);
	});

	test("DELETE /modules/:id - should delete a module", async () => {
		const moduleId = "1907b7e0-57d4-432f-8500-2201f4b23e15";
		const response = await request(app).delete(
			`/modules/${moduleId}?courseId=80c8bb88-ca57-4f2a-a7a4-bd28774c22ec`
		);

		expect(response.status).toBe(204);
	});

	test("POST /modules - should return error for missing title", async () => {
		const response = await request(app).post("/modules").send({
			courseId: "80c8bb88-ca57-4f2a-a7a4-bd28774c22ec",
			title: "",
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Validation failed");
		expect(response.body.errors).toContain("Title cannot be empty.");
	});
});

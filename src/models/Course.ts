export interface Course {
	id: string; // UUID
	title: string;
	description: string;
	moduleIds: string[]; // Array of module IDs
}

export interface CreateCourseRequest {
	title: string;
	description: string;
	moduleIds?: string[]; // Optional on creation
}

export interface CourseResponse extends Course {}

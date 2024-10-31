export interface LessonContent {
	type: "text" | "video" | "audio";
	data: string; 
}

export interface Lesson {
	id: string; 
	title: string;
	description: string;
	topics: string[];
	content: LessonContent[];
	moduleId: string;
}

export interface CreateLessonRequest {
	title: string;
	description: string;
	topics: string[];
	content: LessonContent[];
	moduleId: string;
}

export interface LessonResponse extends Lesson {}

export interface Module {
    id: string;
    title: string;
    courseId: string;
    lessonIds: string[]; 
}

export interface CreateModuleRequest {
    title: string;
    courseId: string;
    lessonIds?: string[]; 
}

export interface ModuleResponse extends Module {}

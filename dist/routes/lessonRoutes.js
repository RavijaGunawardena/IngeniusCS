"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lessonController_1 = require("../controllers/lessonController");
const router = express_1.default.Router();
router.post('/courses/:courseId/modules/:moduleId/lessons', lessonController_1.createLesson);
router.get('/courses/:courseId/modules/:moduleId/lessons', lessonController_1.getLessons);
router.get('/courses/:courseId/modules/:moduleId/lessons/:id', lessonController_1.getLessonById);
router.put('/courses/:courseId/modules/:moduleId/lessons/:id', lessonController_1.updateLesson);
router.delete('/courses/:courseId/modules/:moduleId/lessons/:id', lessonController_1.deleteLesson);
exports.default = router;

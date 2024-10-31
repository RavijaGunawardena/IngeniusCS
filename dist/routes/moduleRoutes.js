"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleController_1 = require("../controllers/moduleController");
const router = express_1.default.Router();
router.post('/courses/:courseId/modules', moduleController_1.createModule);
router.get('/courses/:courseId/modules', moduleController_1.getModules);
router.get('/courses/:courseId/modules/:id', moduleController_1.getModuleById);
router.put('/courses/:courseId/modules/:id', moduleController_1.updateModule);
router.delete('/courses/:courseId/modules/:id', moduleController_1.deleteModule);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dataFilePath = path_1.default.join(__dirname, '../data/courses.json');
// Functionality similar to courseController, adapted for module CRUD operations
// Implement getModules, getModuleById, createModule, updateModule, deleteModule

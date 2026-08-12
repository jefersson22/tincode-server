const express = require("express");
const CourseController = require("../controllers/course");
const md_auth = require("../middlewares/authenticated");
const { ensureAdmin } = require("../middlewares/ensureAdmin");
const multerMiddleware = require("../middlewares/multer");

// Detecta 'uploadCourse', 'upload' o la exportación directa de Multer
const uploadCourse = multerMiddleware.uploadCourse || multerMiddleware.upload || multerMiddleware;

// Middleware de autenticación flexible
const ensureAuth = md_auth.ensureAuth || md_auth;

const api = express.Router();

// Rutas de Cursos
api.get("/course", CourseController.getCourses);
api.post("/course", [ensureAuth, ensureAdmin, uploadCourse.single("miniature")], CourseController.createCourse);
api.put("/course/:id", [ensureAuth, ensureAdmin, uploadCourse.single("miniature")], CourseController.updateCourse);
api.patch("/course/:id", [ensureAuth, ensureAdmin, uploadCourse.single("miniature")], CourseController.updateCourse);
api.delete("/course/:id", [ensureAuth, ensureAdmin], CourseController.deleteCourse);

module.exports = api;
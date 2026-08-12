const express = require("express");
const CourseController = require("../controllers/course");
const md_auth = require("../middlewares/authenticated");
const multerMiddleware = require("../middlewares/multer");

// Detecta 'uploadCourse', 'upload' o la exportación directa de Multer
const uploadCourse = multerMiddleware.uploadCourse || multerMiddleware.upload || multerMiddleware;

// Middleware de autenticación flexible
const ensureAuth = md_auth.ensureAuth || md_auth;

// Middleware para permitir acceso tanto a Admin como a Editor
const ensureAdminOrEditor = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "editor")) {
    return next();
  }
  return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
};

const api = express.Router();

// Rutas de Cursos
api.get("/course", CourseController.getCourses);
api.post("/course", [ensureAuth, ensureAdminOrEditor, uploadCourse.single("miniature")], CourseController.createCourse);
api.put("/course/:id", [ensureAuth, ensureAdminOrEditor, uploadCourse.single("miniature")], CourseController.updateCourse);
api.patch("/course/:id", [ensureAuth, ensureAdminOrEditor, uploadCourse.single("miniature")], CourseController.updateCourse);
api.delete("/course/:id", [ensureAuth, ensureAdminOrEditor], CourseController.deleteCourse);

module.exports = api;
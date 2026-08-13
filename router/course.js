const express = require("express");
const CourseController = require("../controllers/course");
const md_auth = require("../middlewares/authenticated");
const multerMiddleware = require("../middlewares/multer");

// Middleware de autenticación
const ensureAuth = md_auth.ensureAuth || md_auth;

// Middleware insensible a mayúsculas/minúsculas para Admin y Editor
const ensureAdminOrEditor = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).send({ msg: "Usuario no autenticado" });
  }

  const role = String(req.user.role).toLowerCase();
  if (role === "admin" || role === "editor") {
    return next();
  }

  return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
};

// Wrapper seguro para Multer que captura errores y siempre responde en formato JSON
const uploadSingle = (fieldName) => {
  const uploader = multerMiddleware.uploadCourse || multerMiddleware.upload || multerMiddleware;

  return (req, res, next) => {
    if (!uploader || typeof uploader.single !== "function") {
      return next();
    }

    const singleUpload = uploader.single(fieldName);
    singleUpload(req, res, (err) => {
      if (err) {
        console.error(`Error en Multer/Cloudinary al subir '${fieldName}':`, err);
        return res.status(400).send({
          msg: "Error al procesar la imagen subida",
          error: err.message || String(err),
        });
      }
      next();
    });
  };
};

const api = express.Router();

// Rutas de Cursos
api.get("/course", CourseController.getCourses);
api.post("/course", [ensureAuth, ensureAdminOrEditor, uploadSingle("miniature")], CourseController.createCourse);
api.put("/course/:id", [ensureAuth, ensureAdminOrEditor, uploadSingle("miniature")], CourseController.updateCourse);
api.patch("/course/:id", [ensureAuth, ensureAdminOrEditor, uploadSingle("miniature")], CourseController.updateCourse);
api.delete("/course/:id", [ensureAuth, ensureAdminOrEditor], CourseController.deleteCourse);

module.exports = api;
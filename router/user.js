const express = require("express");
const UserController = require("../controllers/user");
const { ensureAuth } = require("../middlewares/authenticated");
const { ensureAdmin } = require("../middlewares/ensureAdmin");
const { uploadAvatar } = require("../middlewares/multer");

const api = express.Router();

// Rutas propias del usuario logueado (cualquier rol)
api.get("/users/me", ensureAuth, UserController.getMe);

// Rutas de gestión (solo admin)
api.get("/users", ensureAuth, ensureAdmin, UserController.getUsers);
api.post("/users", ensureAuth, ensureAdmin, uploadAvatar.single("avatar"), UserController.createUser);
api.patch("/users/:id", ensureAuth, ensureAdmin, uploadAvatar.single("avatar"), UserController.updateUser);
api.delete("/users/:id", ensureAuth, ensureAdmin, UserController.deleteUser);

module.exports = api;
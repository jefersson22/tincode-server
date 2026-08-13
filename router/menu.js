const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const ensureAuth = md_auth.ensureAuth || md_auth;

// Middleware para permitir acceso tanto a Admin como a Editor
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

const api = express.Router();

api.get("/menu", MenuController.getMenus);
api.post("/menu", [ensureAuth, ensureAdminOrEditor], MenuController.createMenu);
api.put("/menu/:id", [ensureAuth, ensureAdminOrEditor], MenuController.updateMenu);
api.delete("/menu/:id", [ensureAuth, ensureAdminOrEditor], MenuController.deleteMenu);

module.exports = api;
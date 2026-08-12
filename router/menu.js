const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");
// Asegúrate de tener este middleware creado, si no, avísame para ajustarlo
const { ensureAdmin } = require("../middlewares/ensureAdmin"); 

const api = express.Router();

api.post("/menu", [md_auth.ensureAuth, ensureAdmin], MenuController.createMenu);
api.get("/menu", MenuController.getMenus);
api.put("/menu/:id", [md_auth.ensureAuth, ensureAdmin], MenuController.updateMenu);
api.delete("/menu/:id", [md_auth.ensureAuth, ensureAdmin], MenuController.deleteMenu);

module.exports = api;
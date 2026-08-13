const mongoose = require("mongoose");
const Menu = require("../models/menu");

async function createMenu(req, res) {
  try {
    if (req.user && req.user.role) {
      const role = String(req.user.role).toLowerCase();
      if (role !== "admin" && role !== "editor") {
        return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
      }
    }

    const menuData = { ...req.body };

    // Conversión de tipo de datos
    if (menuData.order !== undefined && menuData.order !== "") {
      menuData.order = Number(menuData.order);
    }

    if (menuData.active !== undefined) {
      menuData.active = menuData.active === "true" || menuData.active === true;
    }

    const menu = new Menu(menuData);
    const savedMenu = await menu.save();
    return res.status(200).send(savedMenu);
  } catch (error) {
    console.error("Error en createMenu:", error);
    return res.status(400).send({ msg: error.message || "Error al crear menú" });
  }
}

async function getMenus(req, res) {
  try {
    const { active } = req.query;
    let response = null;

    if (active === undefined) {
      response = await Menu.find().sort({ order: 1 });
    } else {
      response = await Menu.find({ active: active === "true" }).sort({ order: 1 });
    }

    return res.status(200).send(response || []);
  } catch (error) {
    console.error("Error en getMenus:", error);
    return res.status(400).send({ msg: "Error al obtener los menús" });
  }
}

async function updateMenu(req, res) {
  try {
    if (req.user && req.user.role) {
      const role = String(req.user.role).toLowerCase();
      if (role !== "admin" && role !== "editor") {
        return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
      }
    }

    const { id } = req.params;
    const menuData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "El ID proporcionado no es válido" });
    }

    if (menuData.order !== undefined && menuData.order !== "") {
      menuData.order = Number(menuData.order);
    }

    if (menuData.active !== undefined) {
      menuData.active = menuData.active === "true" || menuData.active === true;
    }

    const menuUpdated = await Menu.findByIdAndUpdate(id, menuData, { new: true });

    if (!menuUpdated) {
      return res.status(404).send({ msg: "No se encontró el menú a actualizar" });
    }

    return res.status(200).send(menuUpdated);
  } catch (error) {
    console.error("Error en updateMenu:", error);
    return res.status(400).send({ msg: error.message || "Error al actualizar el menú" });
  }
}

async function deleteMenu(req, res) {
  try {
    if (req.user && req.user.role) {
      const role = String(req.user.role).toLowerCase();
      if (role !== "admin" && role !== "editor") {
        return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
      }
    }

    const { id } = req.params;
    const menuDeleted = await Menu.findByIdAndDelete(id);

    if (!menuDeleted) {
      return res.status(404).send({ msg: "No se encontró el menú a eliminar" });
    }

    return res.status(200).send({ msg: "Menú eliminado correctamente", menu: menuDeleted });
  } catch (error) {
    console.error("Error en deleteMenu:", error);
    return res.status(400).send({ msg: "Error al eliminar el menú" });
  }
}

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};
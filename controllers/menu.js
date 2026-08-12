// controllers/menu.js
const mongoose = require("mongoose");
const Menu = require("../models/menu");

async function createMenu(req, res) {

  try {
    const menu = new Menu(req.body);
    const savedMenu = await menu.save();
    res.status(200).send({ savedMenu });
  } catch (error) {
      res.status(400).send({ msg: "Error al crear menú" });
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
    
    if (!response || response.length === 0) {
      return res.status(404).send({ msg: "No se ha encontrado ningún menú"

      });
    }
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ msg: "Error al obtener los menús" });
  }
}

async function updateMenu(req, res) {
  try {
    const { id } = req.params;
    const menuData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ msg: "El ID proporcionado no es válido" });
    }
    const menuUpdated = await Menu.findByIdAndUpdate(id, menuData, { new: true });

    if (!menuUpdated) {
      return res.status(404).send({ msg: "No se encontró el menú a actualizar" }); // 👈 Corregido el salto de línea
    }

    res.status(200).send(menuUpdated);
  } catch (error) {
    res.status(400).send({ msg: "Error al actualizar el menú" });
  }
}


async function deleteMenu(req, res) {
  try{
    const { id } = req.params;
    const menuDeleted = await Menu.findByIdAndDelete(id);
    if (!menuDeleted) {
      return res.status(404).send({ msg: "No se encontró el menú a eliminar" });
    }
    res.status(200).send({ msg: "Menu eliminado correctamente", menu: menuDeleted });
  }catch (error) {
res.status(400).send({ msg: "Error al eliminar el menú" });
  }
}

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};


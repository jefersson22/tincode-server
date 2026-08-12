const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function createUser(req, res) {
  try {
    console.log("--> DATOS RECIBIDOS EN CREAR USUARIO:", req.body);
    console.log("--> ARCHIVO RECIBIDO:", req.file);

    const firstname = req.body.firstname || req.body.firstName || "";
    const lastname = req.body.lastname || req.body.lastName || "";
    const email = req.body.email ? req.body.email.toLowerCase().trim() : "";
    const role = req.body.role || "user";
    const active = req.body.active === "true" || req.body.active === true;

    const user = new User({
      firstname,
      lastname,
      email,
      role,
      active,
    });

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(req.body.password, salt);
    }

    if (req.file) {
      // Guarda la URL completa de Cloudinary enviada por Multer
      user.avatar = req.file.path || req.file.secure_url || `avatar/${req.file.filename}`;
    }

    const userStored = await user.save();
    return res.status(201).send({ user: userStored });
  } catch (error) {
    console.error("Error en createUser:", error);
    return res.status(400).send({ msg: "Error al crear el usuario", error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const userData = { ...req.body };

    if (userData.firstname || userData.firstName) {
      userData.firstname = userData.firstname || userData.firstName;
    }
    if (userData.lastname || userData.lastName) {
      userData.lastname = userData.lastname || userData.lastName;
    }

    if (userData.password) {
      const salt = bcrypt.genSaltSync(10);
      userData.password = bcrypt.hashSync(userData.password, salt);
    } else {
      delete userData.password;
    }

    if (userData.active !== undefined) {
      userData.active = userData.active === "true" || userData.active === true;
    }

    if (req.file) {
      // Guarda la URL completa de Cloudinary enviada por Multer
      userData.avatar = req.file.path || req.file.secure_url || `avatar/${req.file.filename}`;
    }

    const userUpdated = await User.findByIdAndUpdate(id, userData, { new: true });
    return res.status(200).send({ user: userUpdated });
  } catch (error) {
    return res.status(400).send({ msg: "Error al actualizar el usuario", error: error.message });
  }
}

async function getMe(req, res) {
  try {
    const response = await User.findById(req.user_id);
    if (!response) return res.status(404).send({ msg: "Usuario no encontrado" });
    res.status(200).send({ response });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function getUsers(req, res) {
  try {
    const { active } = req.query;
    const query = active === undefined ? {} : { active: active === "true" };
    const response = await User.find(query);
    res.status(200).send({ response });
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener usuarios" });
  }
}

async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(400).send({ msg: "Error al eliminar el usuario" });
  }
}

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
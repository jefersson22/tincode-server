const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const jsonwebtoken = require("jsonwebtoken");

// 1. Registro público de usuario
async function register(req, res) {
  try {
    const { firstname, lastname, firstName, lastName, email, password } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    // Detecta los nombres tanto si vienen en minúsculas como en camelCase
    const finalFirstName = firstname || firstName || "";
    const finalLastName = lastname || lastName || "";

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      firstname: finalFirstName,
      lastname: finalLastName,
      email: email.toLowerCase().trim(),
      password: hashPassword,
      role: "user",
      active: false, // Inactivo por defecto hasta que un admin lo active
    });

    const userStorage = await user.save();
    return res.status(200).send({ user: userStorage });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(400).send({ msg: "Error al crear el usuario", error: error.message });
  }
}

// 2. Inicio de sesión
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    const emailLowerCase = email.toLowerCase().trim();

    // Búsqueda con Promises
    const userStorage = await User.findOne({ email: emailLowerCase });

    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Validación de contraseña
    const check = await bcrypt.compare(password, userStorage.password);

    if (!check) {
      return res.status(400).send({ msg: "Contraseña incorrecta" });
    }

    if (!userStorage.active) {
      return res.status(401).send({ msg: "Usuario no autorizado o no activo" });
    }

    return res.status(200).send({
      access: jwt.createAccessToken(userStorage),
      refresh: jwt.createRefreshToken(userStorage),
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({ msg: "Error del servidor", error: error.message });
  }
}

// 3. Refrescar Token de Acceso
async function refreshAccessToken(req, res) {
  const { token } = req.body;

  if (!token) return res.status(400).send({ msg: "El token es obligatorio" });

  try {
    const decoded = jsonwebtoken.decode(token);

    if (!decoded) {
      return res.status(400).send({ msg: "El formato del token no se puede leer" });
    }

    const user_id = decoded.user_id || decoded.id;
    const userStorage = await User.findOne({ _id: user_id });

    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    return res.status(200).send({
      accessToken: jwt.createAccessToken(userStorage),
    });
  } catch (error) {
    return res.status(401).send({ msg: "Token inválido o expirado", error: error.message });
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
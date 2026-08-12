const jwt = require("../utils/jwt");

function ensureAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ msg: "La petición no tiene la cabecera de autenticación" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verifyToken(token);
    const { user_id, role } = payload;

    // Se asignan ambas formas para compatibilidad con todo el proyecto
    req.user_id = user_id;
    req.user_role = role;
    req.user = {
      user_id,
      role,
      ...payload,
    };

    next();
  } catch (error) {
    console.log("Error en verifyToken:", error.message);
    return res.status(401).send({ msg: "Token inválido o expirado" });
  }
}

module.exports = {
  ensureAuth,
};
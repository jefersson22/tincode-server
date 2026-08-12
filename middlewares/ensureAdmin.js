function ensureAdmin(req, res, next) {
  const role = req.user?.role || req.user_role;

  if (role !== "admin" && role !== "editor") {
    return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
  }

  next();
}

module.exports = { ensureAdmin };
function ensureAdmin(req, res, next) {
  if (req.user_role !== "admin") {
    return res.status(403).send({ msg: "No tienes permisos para realizar esta acción" });
  }
  next();
}

module.exports = { ensureAdmin };
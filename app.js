const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); 
const { API_VERSION } = require("./constants");

const app = express();

// 1. Configuración de CORS (Debe ir al inicio para aplicar a imágenes estáticas y rutas)
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

// 2. Middlewares globales para analizar peticiones
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3. Servir recursos estáticos (Permite acceso a /uploads/avatar, /uploads/course, /uploads/post)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. Importación de todas las rutas
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");
const postRoutes = require("./router/post");
const newsletterRoutes = require("./router/newsletter");

// 5. Definición de la versión de la API
const version = API_VERSION || "v1";

// 6. Registro oficial de rutas en Express
app.use(`/api/${version}`, authRoutes);
app.use(`/api/${version}`, userRoutes);
app.use(`/api/${version}`, menuRoutes);
app.use(`/api/${version}`, courseRoutes);
app.use(`/api/${version}`, postRoutes);
app.use(`/api/${version}`, newsletterRoutes);

module.exports = app;
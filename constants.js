require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST; // Ahora solo recibirá el hostname
const API_VERSION = process.env.API_VERSION || "v1";
const IP_SERVER = process.env.IP_SERVER || "localhost";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Se arma la URI completa en un solo lugar
const DB_URI = `mongodb+srv://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/?retryWrites=true&w=majority`;

module.exports = {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_URI,
  API_VERSION,
  IP_SERVER,
  JWT_SECRET_KEY,
};
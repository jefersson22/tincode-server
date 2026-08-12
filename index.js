require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, DB_URI } = require("./constants");

const PORT = process.env.PORT || 3977;

mongoose.connect(DB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
  })
  .catch((error) => {
    console.error("Error de conexion:", error.message);
  });
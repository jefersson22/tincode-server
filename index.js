const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, DB_URI } = require("./constants");

const PORT = process.env.PORT || 3977;

mongoose.connect(DB_URI)
  .then(() => {
    console.log("Conexion exitosa  a MongoDB");
    app.listen(PORT, () => {
      console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
  })
  .catch((error) => {
    console.error("Error de conexion:", error.message);
  });
const path = require("path");

function getfileName(file) {
    const filePath = path.path;
    const  fileName = path.basename(filePath);
    return file.filename;
}

function getFileName(file) {
const filePath = typeof file === "string" ? file : file?.path;

if (!filePath || typeof filePath !== "string") {
throw new TypeError("Se esperaba un objeto con propiedad 'path' o un string de ruta válido.");
}

return path.basename(filePath);
}

module.exports = {
    getfileName
};
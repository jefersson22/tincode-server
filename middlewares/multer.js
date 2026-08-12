const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/avatar";

    if (req.originalUrl.includes("/post")) {
      folder = "uploads/post";
    } else if (req.originalUrl.includes("/course")) {
      folder = "uploads/course";
    }

    const destinationPath = path.join(__dirname, "..", folder);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const nombreLimpio = path.parse(file.originalname).name;
    const extensionOriginal = path.parse(file.originalname).ext;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    
    cb(null, `${nombreLimpio}-${uniqueSuffix}${extensionOriginal}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Límite de 15 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG o WEBP."));
    }
  }
});

// Asignamos las variantes como propiedades del objeto upload
upload.upload = upload;
upload.uploads = upload;
upload.uploadAvatar = upload;
upload.uploadCourse = upload;
upload.uploadPost = upload;

// Exportación principal directa para que funcione con require("../middlewares/multer")
module.exports = upload;
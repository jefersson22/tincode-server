const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Filtro flexible para permitir diversos tipos de imágenes y validar extensión
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
    "image/bmp",
  ];

  const isExtensionValid = /\.(jpg|jpeg|png|webp|gif|avif|svg|bmp)$/i.test(
    file.originalname
  );

  if (allowedMimeTypes.includes(file.mimetype) || isExtensionValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato no permitido. Utiliza una imagen válida (JPG, PNG, WEBP, GIF, AVIF, SVG)."
      ),
      false
    );
  }
};

// Fábrica: crea un middleware de Multer configurado para subir a Cloudinary
function createUploader(folder) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `tincode/${folder}`,
      public_id: (req, file) => {
        const cleanName = file.originalname
          .split(".")
          .slice(0, -1)
          .join(".")
          .replace(/[^a-zA-Z0-9]/g, "_");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${file.fieldname}-${cleanName}-${uniqueSuffix}`;
      },
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // Ampliado a 10 MB máximo
    },
  });
}

const uploadPost = createUploader("post");
const uploadCourse = createUploader("courses");
const uploadAvatar = createUploader("avatars");

// Mantiene compatibilidad con cualquier forma de importación en tus rutas
uploadCourse.uploadPost = uploadPost;
uploadCourse.uploadCourse = uploadCourse;
uploadCourse.uploadAvatar = uploadAvatar;
uploadCourse.upload = uploadCourse;
uploadCourse.uploads = uploadCourse;

module.exports = uploadCourse;
module.exports.uploadPost = uploadPost;
module.exports.uploadCourse = uploadCourse;
module.exports.uploadAvatar = uploadAvatar;
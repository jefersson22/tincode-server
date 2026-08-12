const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de archivo no permitido. Solo se aceptan imágenes (jpg, jpeg, png, webp)"
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
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${file.fieldname}-${uniqueSuffix}`;
      },
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB máximo
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
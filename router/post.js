const express = require("express");
const PostController = require("../controllers/post");
const { ensureAuth } = require("../middlewares/authenticated");
const { ensureAdmin } = require("../middlewares/ensureAdmin");
const uploads = require("../middlewares/multer");

const api = express.Router();

api.post("/post", [ensureAuth, ensureAdmin, uploads.single("miniature")], PostController.createPost);
api.get("/post", PostController.getPosts);
api.get("/post/path", PostController.getPostByPath);
api.get("/post/:path", PostController.getPostByPath); // 👈 Esta línea resuelve el 404
api.patch("/post/:id", [ensureAuth, ensureAdmin, uploads.single("miniature")], PostController.updatePost);
api.delete("/post/:id", [ensureAuth, ensureAdmin], PostController.deletePost);

module.exports = api;
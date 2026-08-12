const Post = require("../models/post");

// 1. Crear un post
async function createPost(req, res) {
  try {
    const postData = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No se envió ninguna imagen" });
    }

    postData.miniature = req.file.filename;
    postData.created_at = new Date();

    const post = new Post(postData);
    const postStored = await post.save();

    return res.status(201).json(postStored);
  } catch (error) {
    console.error("Error al crear el post:", error);
    return res.status(400).json({ msg: "Error al crear el post", error: error.message });
  }
}

// 2. Obtener y paginar posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
      sort: { created_at: -1 },
    };

    const posts = await Post.paginate({}, options);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los posts",
      error: error.message,
    });
  }
};

// 3. Actualizar un post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postData = req.body;

    // Si se subió un archivo nuevo, actualizamos la miniatura
    if (req.file) {
      postData.miniature = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      postData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json({
      message: "Post actualizado correctamente",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el post",
      error: error.message,
    });
  }
};

// 4. Eliminar un post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json({
      message: "Post eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el post",
      error: error.message,
    });
  }
};

// 5. Obtener un post por su Path único o por ID (Query params)
const getPostByPath = async (req, res) => {
  try {
    const { path: postPath } = req.query;

    if (!postPath) {
      return res.status(400).json({ message: "Debes enviar el parámetro 'path' en la query" });
    }

    // 1º Intentar buscar por el campo personalizable 'path'
    let post = await Post.findOne({ path: postPath });

    // 2º Si no se encuentra por 'path' y la cadena coincide con la estructura de un ObjectId de MongoDB, buscar por ID
    if (!post && postPath.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(postPath);
    }

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el post",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostByPath,
};
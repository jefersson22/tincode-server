const Course = require("../models/course");

async function createCourse(req, res) {
  try {
    const courseData = { ...req.body };

    if (req.file) {
      courseData.miniature = req.file.filename;
    }

    // Conversiones explícitas desde FormData (cadenas a tipos numéricos y booleanos)
    if (courseData.price !== undefined && courseData.price !== "") {
      courseData.price = Number(courseData.price);
    }

    if (courseData.score !== undefined && courseData.score !== "") {
      courseData.score = Number(courseData.score);
    } else {
      delete courseData.score;
    }

    if (courseData.active !== undefined) {
      courseData.active = courseData.active === "true" || courseData.active === true;
    }

    const course = new Course(courseData);
    const courseSaved = await course.save();
    return res.status(200).send(courseSaved);
  } catch (error) {
    console.error("Error en createCourse:", error);
    return res.status(500).send({ msg: error.message || "Error al crear el curso" });
  }
}

async function getCourses(req, res) {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === "true";
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: "desc" },
    };

    const courses = await Course.paginate(filter, options);
    return res.status(200).send(courses);
  } catch (error) {
    console.error("Error en getCourses:", error);
    return res.status(500).send({ msg: "Error al obtener los cursos" });
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const courseData = { ...req.body };

    if (req.file) {
      courseData.miniature = req.file.filename;
    }

    // Conversión e inserción limpia de precio
    if (courseData.price !== undefined && courseData.price !== "") {
      courseData.price = Number(courseData.price);
    }

    // Conversión de calificación (o eliminación si viene vacía)
    if (courseData.score !== undefined && courseData.score !== "") {
      courseData.score = Number(courseData.score);
    } else if (courseData.score === "") {
      delete courseData.score;
    }

    // Conversión de estado activo
    if (courseData.active !== undefined) {
      courseData.active = courseData.active === "true" || courseData.active === true;
    }

    const courseUpdated = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    });

    if (!courseUpdated) {
      return res.status(404).send({ msg: "No se encontró el curso a actualizar" });
    }
    return res.status(200).send(courseUpdated);
  } catch (error) {
    console.error("Error en updateCourse:", error);
    return res.status(500).send({ msg: error.message || "Error al actualizar el curso" });
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const courseDeleted = await Course.findByIdAndDelete(id);

    if (!courseDeleted) {
      return res.status(404).send({ msg: "No se encontró el curso a eliminar" });
    }
    return res.status(200).send({
      msg: "Curso eliminado correctamente",
      course: courseDeleted,
    });
  } catch (error) {
    console.error("Error en deleteCourse:", error);
    return res.status(500).send({ msg: "Error al eliminar el curso" });
  }
}

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
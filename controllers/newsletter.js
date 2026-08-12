const Newsletter = require("../models/newsletter");

// Formato básico de validación de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Suscribir un nuevo correo al newsletter (Público)
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).send({ message: "El correo electrónico es obligatorio" });
    }
    
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).send({ message: "El formato del correo electrónico no es válido" });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    
    if (existing) {
      if (existing.active) {
        return res.status(409).send({ message: "Este correo ya está suscrito" });
      }
      // Si existía pero estaba inactivo (se había dado de baja), lo reactivamos
      existing.active = true;
      existing.subscribed_at = new Date();
      await existing.save();
      
      return res.status(200).send({
        message: "Suscripción reactivada correctamente",
        subscriber: existing,
      });
    }
    
    const newSubscriber = new Newsletter({ email: normalizedEmail });
    const savedSubscriber = await newSubscriber.save();
    
    return res.status(201).send({
      message: "Suscripción realizada correctamente",
      subscriber: savedSubscriber,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al procesar la suscripción",
      error: error.message,
    });
  }
};

// Listar suscriptores con filtros, búsqueda y paginación (Admin)
const getSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const { active, search } = req.query;
    const query = {};
    
    if (active === "true") query.active = true;
    if (active === "false") query.active = false;
    
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }
    
    const total = await Newsletter.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    
    const subscribers = await Newsletter.find(query)
      .sort({ subscribed_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    return res.status(200).send({
      total,
      totalPages,
      page,
      subscribers,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al obtener los suscriptores",
      error: error.message,
    });
  }
};

// Dar de baja un correo (Público)
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "El correo electrónico es obligatorio" });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const subscriber = await Newsletter.findOne({ email: normalizedEmail });
    
    if (!subscriber) {
      return res.status(404).send({ message: "Correo no encontrado en la lista de suscriptores" });
    }
    
    subscriber.active = false;
    await subscriber.save();
    
    return res.status(200).send({ message: "Te has dado de baja correctamente" });
  } catch (error) {
    return res.status(500).send({
      message: "Error al procesar la baja",
      error: error.message,
    });
  }
};

// Actualizar el estado (activo/inactivo) de un suscriptor (Admin)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    if (active === undefined) {
      return res.status(400).send({ message: "El campo 'active' es obligatorio" });
    }
    
    const activeBool = active === true || active === "true";
    const updated = await Newsletter.findByIdAndUpdate(
      id,
      { active: activeBool },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).send({ message: "Suscriptor no encontrado" });
    }
    
    return res.status(200).send({
      message: "Estado actualizado correctamente",
      subscriber: updated,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al actualizar el estado",
      error: error.message,
    });
  }
};

// Eliminar un suscriptor de forma permanente (Admin)
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Newsletter.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).send({ message: "Suscriptor no encontrado" });
    }
    
    return res.status(200).send({ message: "Suscriptor eliminado correctamente" });
  } catch (error) {
    return res.status(500).send({
      message: "Error al eliminar el suscriptor",
      error: error.message,
    });
  }
};

module.exports = {
  subscribe,
  getSubscribers,
  unsubscribe,
  updateStatus,
  deleteSubscriber,
};
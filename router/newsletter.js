const express = require("express");
const NewsletterController = require("../controllers/newsletter");
const md_auth = require("../middlewares/authenticated");

const ensureAuth = md_auth.ensureAuth || md_auth;
const api = express.Router();

api.post("/newsletter", NewsletterController.subscribe); // público
api.post("/newsletter/unsubscribe", NewsletterController.unsubscribe); // público

api.get("/newsletter", ensureAuth, NewsletterController.getSubscribers); // admin
api.put("/newsletter/:id", ensureAuth, NewsletterController.updateStatus); // admin
api.delete("/newsletter/:id", ensureAuth, NewsletterController.deleteSubscriber); // admin

module.exports = api;
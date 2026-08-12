// models/menu.js
const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
    title: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    roles: { type: [String], default: ["user"] }
}, {    
    timestamps: true
});

module.exports = mongoose.model("Menu", MenuSchema);
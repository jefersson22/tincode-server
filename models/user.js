const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user",
  },
  active: Boolean,
  avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
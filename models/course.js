const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    miniature: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    score: { type: Number, min: 0, max: 5 },
    active: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

CourseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Course", CourseSchema);
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = mongoose.Schema({
    title: String, 
    miniature: String,
    content: String,
    path: {
        type: String,
        unique: true
    },
    created_at: Date,
});

postSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model("Post", postSchema);
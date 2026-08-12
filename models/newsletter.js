const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const NewsletterSchema = mongoose.Schema({
email: {
type: String,
required: true,
unique: true,
trim: true,
lowercase: true,
},
subscribed_at: {
type: Date,
default: Date.now,
},
active: {
type: Boolean,
default: true,
},
});

NewsletterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Newsletter", NewsletterSchema);
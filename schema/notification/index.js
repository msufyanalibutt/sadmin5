const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - notifications
const notificationSchema = new Schema({
    type: String,
    userFrom: Number,
    userTo: Number,
    productId: Number,
    new: Boolean,
    updatedAt: {
        type: Date,
        default: Date.now
    },
});
notificationSchema.plugin(autoIncrement.plugin, {model: "notification", startAt: 10000});

module.exports = mongoose.model("notification", notificationSchema);


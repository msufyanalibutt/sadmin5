const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - forceUpdate list
const forceUpdateSchema = new Schema({
    version: {
        type: String
    },   
    deviceType: {
        type: String
    },    
    forceUpdate: {
        type: String
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

forceUpdateSchema.plugin(autoIncrement.plugin, {model: "forceUpdate", startAt: 1});

module.exports = mongoose.model("forceUpdate", forceUpdateSchema);
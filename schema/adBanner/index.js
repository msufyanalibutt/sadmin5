const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - ad banner
const adBannerSchema = new Schema({    
    name: String,
    webBannerImage: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },    
    mobileBannerImage: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    bannerUrl: String, 
    status: {
        type: String,
        default: "Active"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },   
    createdAt: {
        type: Date,
        default: Date.now
    }             
});

adBannerSchema.plugin(autoIncrement.plugin, {model: "adBanner", startAt: 1});

module.exports = mongoose.model("adBanner", adBannerSchema);



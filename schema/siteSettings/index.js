const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - site settings 
// const siteSchema = new Schema({
//     name: String,
//     contactNo: String,
//     version: String,
//     defaultCurrency: {
//         type: String,
//         default: "USD"
//     },
//     defaultUnit: {
//         type: String,
//         default: "KM"
//     },
//     favicon: String,
//     image: String,
//     footerLogo: String,
//     footerBatch: String,
//     footerBackground: String,
//     loginImage: String,
//     adminloginImage: String,
//     fbLink: String,
//     twLink: String,
//     utubeLink: String,
//     androidLink: String,
//     iosLink: String,
//     instagramLink: String,
//     googleAnalyticKey:String,
//     productPageSlotId: String,
//     productDetailPageSlotId: String,
//     sellerDetailsPageSlotId: String,
//     editProfilePageSlotId: String,
//     chatPageSlotId: String,
//     fromAddress: String,
//     fromName: String,
//     uName: String,
//     password: String,
//     paymentApi: String,
//     googleApi: String,
//     facebookAppId: String,
//     googleAppId: String,
//     admob: String,
//     admobBanner: String,
//     Environment: String,
//     MerchantId: String,
//     PublicKey: String,
//     PrivateKey: String,
//     firebaseJson: String,
//     stripeSecretKey: String,
//     stripePublishKey: String,
//     paypalEnvironment: String,
//     paypalAppId: String,
//     appleClientId: String,
//     appleTeamId: String,
//     appleKeyIdentifier: String,
//     appleP8File: String,
//     colorCode: {
//         type: String,
//         default: "#e71de1"
//     },
//     serviceFeeBuyer: Number,
//     serviceFeeSeller: Number,
//     adminSupportMail: String,
//     braintree: {
//         type: Boolean,
//         default: false
//     },
//     stripe: {
//         type: Boolean,
//         default: false
//     },
//     paypal: {
//         type: Boolean,
//         default: false
//     },
//     hideOrderCancelStatus: {
//         type: String,    // PROCESSING, SHIPPED
//         default: "PROCESSING"
//     },
//     googleLogin: {
//         type: Boolean,
//         default: false
//     },
//     facebookLogin: {
//         type: Boolean,
//         default: false
//     },
//     appleLogin: {
//         type: Boolean,
//         default: false
//     },
//     googleAdsence:{
//         type: Boolean,
//         default: false  
//     },
//     serviceFeeBuyer: Number,
//     serviceFeeSeller: Number,
//     paypalClientId: String,
//     paypalSecretKey: String,
//     adminSupportMail: String
// });
const siteSchema = new Schema({
    name: String,
    contactNo: String,
    version: String,
    defaultCurrency: {
        type: String,
        default: "USD"
    },
    defaultUnit: {
        type: String,
        default: "KM"
    },
    favicon: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    logo: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    footerLogo: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    footerBatch: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    footerBackground: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    loginImage: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    adminloginImage: {
        image: String,
        imageSource: {
            type: String,
            default: "local"
        }
    },
    imageHost: {
        type: String,
        default: "local"
    },
 	paymentSDKMode:{
        type: Boolean,
        default: true
    },
    fbLink: String,
    twLink: String,
    utubeLink: String,
    androidLink: String,
    iosLink: String,
    instagramLink: String,
    googleAnalyticKey:String,
    googleAdSenseId:String,
    productPageSlotId: String,
    productDetailPageSlotId: String,
    sellerDetailsPageSlotId: String,
    editProfilePageSlotId: String,
    chatPageSlotId: String,
    fromAddress: String,
    fromName: String,
    uName: String,
    password: String,
    paymentApi: String,
    googleApi: String,
    facebookAppId: String,
    googleAppId: String,
    admob: String,
    admobBanner: String,
    Environment: String,
    MerchantId: String,
    PublicKey: String,
    PrivateKey: String,
    firebaseJson: String,
    stripeSecretKey: String,
    stripePublishKey: String,
    paypalEnvironment: String,
    paypalAppId: String,
    appleClientId: String,
    appleTeamId: String,
    appleKeyIdentifier: String,
    appleP8File: String,
    colorCode: {
        type: String,
        default: "#e71de1"
        // default:"#579FAB"
    },
    subcolorCode: {
        type: String,
        default: "#fffff"
    },
    serviceFeeBuyer: Number,
    serviceFeeSeller: Number,
    adminSupportMail: String,
    braintree: {
        type: Boolean,
        default: false
    },
    stripe: {
        type: Boolean,
        default: false
    },
    paypal: {
        type: Boolean,
        default: false
    },
    hideOrderCancelStatus: {
        type: String,    // PROCESSING, SHIPPED
        default: "PROCESSING"
    },
    googleLogin: {
        type: Boolean,
        default: false
    },
    facebookLogin: {
        type: Boolean,
        default: false
    },
    appleLogin: {
        type: Boolean,
        default: false
    },
    googleAdsence:{
        type: Boolean,
        default: false  
    },    
    paypalClientId: String,
    paypalSecretKey: String,
    adminSupportMail: String,
    cloudName : String,
    cloudApiKey : String,
    cloudApiSecret : String,
    copyrightsText: String,    
    contactUs: String
});

siteSchema.plugin(autoIncrement.plugin, {model: "site", startAt: 10000});

module.exports = mongoose.model("site", siteSchema);


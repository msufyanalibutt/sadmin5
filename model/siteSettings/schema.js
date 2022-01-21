const { gql } = require("apollo-server-express");

//graphql schema for site setting

module.exports = gql`
type siteInfo {
    _id: ID!
    name: String
    contactNo: String
    version: String
    defaultCurrency: String
    favicon: String
    image: String
    footerLogo: String,
    footerBatch: String,
    footerBackground: String,
    loginImage:String,
    adminloginImage:String,
    fbLink: String
    twLink: String
    instagramLink:String
    googleAnalyticKey:String
    productPageSlotId: String,
    productDetailPageSlotId: String,
    sellerDetailsPageSlotId: String,
    editProfilePageSlotId: String,
    chatPageSlotId: String,
    utubeLink: String
    androidLink: String
    iosLink: String
    fromAddress: String
    fromName: String
    uName: String
    password: String,
    paymentApi: String,
    googleApi: String,
    facebookAppId: String,
    googleAppId:String,
    defaultUnit: String,
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
    braintree: Boolean,
    stripe: Boolean,
    paypal: Boolean,
    appleClientId: String,
    appleTeamId: String,
    appleKeyIdentifier: String,
    appleP8File: String
    hideOrderCancelStatus: String
    googleLogin: Boolean,
    facebookLogin: Boolean,
    appleLogin: Boolean,
    googleAdsence: Boolean,
    colorCode: String,
    serviceFeeBuyer: Float,
    serviceFeeSeller: Float,
    paypalClientId: String,
    paypalSecretKey: String,
    adminSupportMail: String,
    imageHost: String
    googleAdSenseId: String,
    paymentSDKMode: Boolean,
    cloudName : String,
    cloudApiKey : String,
    cloudApiSecret : String
    subcolorCode: String
    copyrightsText: String
    contactUs: String
}

extend type Query {
    getSiteInfo: siteInfo
}

input SiteInput {
    id: Int
    name: String
    contactNo: String
    defaultCurrency: String
    version: String,
    favicon: Upload
    image: Upload,
    footerLogo: Upload, 
    footerBatch: Upload,
    footerBackground: Upload,
    loginImage: Upload,
    adminloginImage: Upload,  
    fbLink: String,
    twLink: String,
    instagramLink:String,
    googleAnalyticKey:String,
    productPageSlotId: String,
    productDetailPageSlotId: String,
    sellerDetailsPageSlotId: String,
    editProfilePageSlotId: String,
    chatPageSlotId: String,
    utubeLink: String,
    androidLink: String,
    iosLink: String,
    fromAddress: String,
    fromName: String,
    uName: String,
    password: String,
    paymentApi: String,
    googleApi: String,
    facebookAppId: String,
    googleAppId:String,
    defaultUnit: String,
    admob: String,
    admobBanner: String,
    Environment: String,
    MerchantId: String,
    PublicKey: String,
    PrivateKey: String,
    firebaseJson: Upload,
    stripeSecretKey: String,
    stripePublishKey: String,
    paypalAppId: String,
    paypalEnvironment: String,
    braintree: Boolean,
    stripe: Boolean,
    paypal: Boolean,
    appleClientId: String,
    appleTeamId: String,
    appleKeyIdentifier: String,
    appleP8File: Upload
    hideOrderCancelStatus: String
    googleLogin: Boolean,
    facebookLogin: Boolean,
    appleLogin: Boolean,
    googleAdsence: Boolean,
    colorCode: String,
    serviceFeeBuyer: Float,
    serviceFeeSeller: Float,
    paypalClientId: String,
    paypalSecretKey: String,
    adminSupportMail: String,
    imageHost: String,
    googleAdSenseId: String,
    paymentSDKMode: Boolean,
    cloudName : String,
    cloudApiKey : String,
    cloudApiSecret : String,
    subcolorCode: String,
    copyrightsText: String
    contactUs: String
}

extend type Mutation {
    updateSiteInfo(data: SiteInput): Boolean
}`;
const {errors} = require("../../error");
const fs = require("fs-extra");
var path = require("path");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {storeUpload, deleteImage, cloudinaryUpload, cloudinaryImageDelete} = require("../../handler");
const URL = process.env.URL;
var admin = require("firebase-admin");


const resolvers = {
    Query: {
        // get informations of the site
        getSiteInfo: async (root, args, {currentUser, site, req}) => {
            var foundSetting;
            if(currentUser) {
                foundSetting = await site.findOne();
                var result = await JSON.parse(JSON.stringify(foundSetting));                
            }
            else {
                foundSetting = await site.findOne({}, "image favicon footerLogo footerBatch loginImage adminloginImage footerBackground name contactNo defaultCurrency iosLink androidLink logo");
            }
            if(foundSetting.logo) {
                result.image = (foundSetting.logo.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/images/${foundSetting.logo.image}`: (foundSetting.logo.imageSource === "cloud") ? foundSetting.logo.image : "";
                delete result.logo
            }
            if (foundSetting.favicon) {
                result.favicon = (foundSetting.favicon.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/favicons/${foundSetting.favicon.image}` : (foundSetting.favicon.imageSource === "cloud") ? foundSetting.favicon.image : "";
            }
            if (foundSetting.footerLogo) {
                result.footerLogo = (foundSetting.footerLogo.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/footers/${foundSetting.footerLogo.image}` : (foundSetting.footerLogo.imageSource === "cloud") ? foundSetting.footerLogo.image : "";
            }
            if (foundSetting.footerBatch) {
                result.footerBatch = (foundSetting.footerBatch.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/footerBatch/${foundSetting.footerBatch.image}` : (foundSetting.footerBatch.imageSource === "cloud") ? foundSetting.footerBatch.image : "";
            }
            if (foundSetting.footerBackground) {
                result.footerBackground = (foundSetting.footerBackground.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/footerBackground/${foundSetting.footerBackground.image}` : (foundSetting.footerBackground.imageSource === "cloud") ? foundSetting.footerBackground.image : "";
            }
            if (foundSetting.firebaseJson) {
                result.firebaseJson = foundSetting.firebaseJson;
            }
            if(foundSetting.appleP8File){
                result.appleP8File = foundSetting.appleP8File;
            }
            if (foundSetting.loginImage) {
                result.loginImage = (foundSetting.loginImage.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/loginImage/${foundSetting.loginImage.image}` : (foundSetting.loginImage.imageSource === "cloud") ? foundSetting.loginImage.image : "";
            }
            if (foundSetting.adminloginImage) {
                result.adminloginImage = (foundSetting.adminloginImage.imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/site/adminloginImage/${foundSetting.adminloginImage.image}` : (foundSetting.adminloginImage.imageSource === "cloud") ? foundSetting.adminloginImage.image : "";
            }
            return await result;
        }
    },
    Mutation: {
        // update the site informations 
        updateSiteInfo: async (root, {data}, {currentUser, site, currency}) => {
            if (currentUser.adminUserId) {
            var data1 = await JSON.parse(JSON.stringify(data));
                var fileName;
                var siteData = await site.findOne();
                if (data.defaultCurrency) {
                    await currency.findOneAndUpdate({default: "1"}, {default: "0"});
                    await currency.findOneAndUpdate({code: data.defaultCurrency}, {default: "1"});
                }
                if (data.image) {
                    const { stream, filename } = await data.image;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `siteImage_${new Date().getTime()}.${ext}`;
                        var iii = await storeUpload({ stream }, fileName, "images", "site");
                        // console.log("iiii", iii)
                        data1.logo = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "images", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/images/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.logo = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/images/${siteData.logo.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/images/${siteData.logo.image}`);
                    }
                    else if(siteData.logo.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.logo.image)
                    }
                }
                if (data.favicon) {
                    const { stream, filename } = await data.favicon;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `favicon_${new Date().getTime()}.${ext}`;
                        var favi = await storeUpload({ stream }, fileName, "favicons", "site");
                        // console.log("favicon", favi)
                        data1.favicon = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "favicons", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/favicons/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.favicon = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/favicons/${siteData.favicon.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/favicons/${siteData.favicon.image}`);
                    }
                    else if(siteData.favicon.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.favicon.image)
                    }
                }
                if (data.footerLogo) {
                    const { stream, filename } = await data.footerLogo;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `footer_${new Date().getTime()}.${ext}`;
                        var fl = await storeUpload({ stream }, fileName, "footers", "site");
                        // console.log("footerLogo", fl)

                        data1.footerLogo = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "footers", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/footers/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.footerLogo = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/footers/${siteData.footerLogo.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/footers/${siteData.footerLogo.image}`);
                    }
                    else if(siteData.footerLogo.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.footerLogo.image)
                    }
                }
                if (data.footerBatch) {
                    const { stream, filename } = await data.footerBatch;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `footerBatch_${new Date().getTime()}.${ext}`;
                        var fb = await storeUpload({ stream }, fileName, "footerBatch", "site");
                        // console.log("footerBatch", fb)
                        data1.footerBatch = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "footerBatch", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/footerBatch/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.footerBatch = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/footerBatch/${siteData.footerBatch.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/footerBatch/${siteData.footerBatch.image}`);
                    }
                    else if(siteData.footerBatch.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.footerBatch.image)
                    }
                }
                if (data.footerBackground) {
                    const { stream, filename } = await data.footerBackground;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `footerBackground_${new Date().getTime()}.${ext}`;
                        var fback = await storeUpload({ stream }, fileName, "footerBackground", "site");
                        // console.log("footerBackground", fback)

                        data1.footerBackground = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "footerBackground", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/footerBackground/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.footerBackground = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/footerBackground/${siteData.footerBackground.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/footerBackground/${siteData.footerBackground.image}`);
                    }
                    else if(siteData.footerBackground.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.footerBackground.image)
                    }
                }
                if (data.loginImage) {
                    const { stream, filename } = await data.loginImage;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `loginImage_${new Date().getTime()}.${ext}`;
                        var lI = await storeUpload({ stream }, fileName, "loginImage", "site");
                        // console.log("loginImage", lI)

                        data1.loginImage = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "loginImage", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/loginImage/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.loginImage = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/loginImage/${siteData.loginImage.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/loginImage/${siteData.loginImage.image}`);
                    }
                    else if(siteData.loginImage.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.loginImage.image)
                    }
                }
                if (data.adminloginImage) {
                    const { stream, filename } = await data.adminloginImage;
                    let ext = filename.split(".")[1];
                    if(siteData.imageHost == "local") {
                        fileName = `adminloginImage${new Date().getTime()}.${ext}`;
                        var aLI = await storeUpload({ stream }, fileName, "adminloginImage", "site");
                        // console.log("adminloginImage", aLI)

                        data1.adminloginImage = {                            
                            image: fileName,
                            imageSource: "local"                                
                        }
                    }
                    else if(siteData.imageHost == "cloud") {
                        var response = await cloudinaryUpload({ stream }, "fileName", "adminloginImage", "site");
                        // fileData = await response && response.public_id.replace(`fileStorage/uploads/site/adminloginImage/`, "")+"."+response.format
                        fileData = await response && response.secure_url
                        data1.adminloginImage = {
                            image: fileData,
                            imageSource: "cloud"                                
                        }
                    }
                    if (fs.existsSync(`fileStorage/uploads/site/adminloginImage/${siteData.adminloginImage.image}`)) {
                        fs.removeSync(`fileStorage/uploads/site/adminloginImage/${siteData.adminloginImage.image}`);
                    }
                    else if(siteData.adminloginImage.imageSource == "cloud") {
                        await cloudinaryImageDelete(siteData.adminloginImage.image)
                    }
                }

                if (data.appleP8File) {
                    const { stream, filename } = await data.appleP8File;
                    await storeUpload({ stream }, filename, "authp8File", "appleAuth");
                    data1.appleP8File = filename;
                }
                if(data.braintree === true) {
                    if(data.Environment === null || typeof(data.Environment) === "undefined") {
                        throw new Error("Braintree Environment field is required");
                    }
                    if(data.MerchantId === null || typeof(data.MerchantId) === "undefined") {
                        throw new Error("Braintree MerchantId field is required");
                    }
                    if(data.PublicKey === null || typeof(data.PublicKey) === "undefined") {
                        throw new Error("Braintree PublicKey field is required");
                    }
                    if(data.PrivateKey === null || typeof(data.PrivateKey) === "undefined") {
                        throw new Error("Braintree PrivateKey field is required");
                    }
                }

                if(data.stripe === true) {
                    if(data.stripeSecretKey === null || typeof(data.stripeSecretKey) === "undefined") {
                        throw new Error("Stripe stripeSecretKey field is required");
                    }
                    if(data.stripePublishKey === null || typeof(data.stripePublishKey) === "undefined") {
                        throw new Error("Stripe stripePublishKey field is required");
                    }                  
                }

                if(data.paypal === true) {
                    if(data.paypalAppId === null || typeof(data.paypalAppId) === "undefined") {
                        throw new Error("Paypal Access Token field is required");
                    }
                    if(data.paypalEnvironment === null || typeof(data.paypalEnvironment) === "undefined") {
                        throw new Error("Paypal Environment field is required");
                    }                                         
                }

                if(data.facebookLogin === true){
                    if(data.facebookAppId === "" || data.facebookAppId === undefined || data.facebookAppId === null) {
                        throw new Error("Facebook App Id field is required ");
                    }   
                }

                if(data.googleLogin === true){
                    if(data.googleAppId === "" || data.googleAppId === undefined || data.googleAppId === null) {
                        throw new Error("Google App Id field is required ");
                    }  
                }

                if(data.appleLogin === true){
                    if(data.appleClientId === "" || data.appleTeamId === "" || data.appleKeyIdentifier === ""){
                        throw new Error("Apple login credentials are required");
                    }
                }

                if (data.firebaseJson) {
                    const { stream, filename } = await data.firebaseJson;
                    let ext = filename.split(".")[1];
                    fileName = `firebaseJson_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "firebaseJson", "firebase");
                    // data.firebaseJson = fileName;
                    // console.log("datdadasd", data)

                    if (admin.apps.length !== 0){
                            await admin.app().delete().then(async function() {
                                try {
                                    var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${fileName}`);
                                    admin.initializeApp({
                                        credential: admin.credential.cert(serviceAccount),    
                                    });
                                    data1.firebaseJson = fileName;
                                }
                                catch(err) {      
                                    var siteDetails =  await site.findOne({});
                                    var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${siteDetails.firebaseJson}`);
                                    admin.initializeApp({
                                        credential: admin.credential.cert(serviceAccount),    
                                    });                              
                                    if (err.errorInfo) {
                                        throw new Error("Your firebase credentials are not valid, Upload a valid firebase JSON file");
                                    }                                    
                                }
                            });
                    } else {
                        var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${fileName}`);
                        try {
                            admin.initializeApp({
                                credential: admin.credential.cert(serviceAccount),    
                            });
                            data1.firebaseJson = fileName;
                        }
                        catch(err) {
                            var siteDetails =  await site.findOne({});
                            var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${siteDetails.firebaseJson}`);
                            admin.initializeApp({
                                credential: admin.credential.cert(serviceAccount),    
                            });
                            if (err.errorInfo) {
                                throw new Error("Your firebase credentials are not valid, Upload a valid firebase JSON file");
                            }
                        }                            
                    }
                    // var found = await site.findOne()
                    // if(found.firebaseJson) {
                    // deleteImage(found.firebaseJson, "firebaseJson", "firebase");
                    // }
                }
                          
                const updated = await site.findOneAndUpdate({}, {$set: data1}, {new: true}).then(function(data1){
                    if (data1) {
                        return true;
                    }
                });
                return updated;
            }
        }
    }
};

module.exports = resolvers;
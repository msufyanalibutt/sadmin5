
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {date, storeUpload, mapConfig, cloudinaryUpload, cloudinaryImageDelete} = require("../../handler");
const fs = require("fs-extra");

// const arrayData= [{index: 0,is_required: true,name: "vmvdnksl",type: "LONG_TEXT"},{index: 1,is_required: true,name: "dsvnlk",type: "MULTIPLE_SELECTORS"}];
// const result = arrayData.map(({type,index,...rest}) => ({...rest}));
// console.log(result);

const resolvers = {
    Query: {

        // get all ad Banner informations
        getAdBannerInfo: async (root, args, {req, adBanner}) => {
            var adBannerDetails = await adBanner.find({});
            
            // var adBannerData = adBannerDetails.re; 
            const result = adBannerDetails.map(function(res) {
                var response = {
                    id: res.id,
                    name: res.name,
                    webBannerImage: (res.webBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage.image}` : (res.webBannerImage.imageSource === "cloud") ? res.webBannerImage.image : "",
                    mobileBannerImage: (res.mobileBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage.image}` : (res.mobileBannerImage.imageSource === "cloud") ? res.mobileBannerImage.image : "",
                    bannerUrl: res.bannerUrl,
                    status: res.status,
                    updatedAt: res.updatedAt ,
                    createdAt: res.createdAt,
                }
                return response;                     
                // adBannerDetails.map(function(res) {
                //     webBanner = `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage.image}`;
                //     delete res.webBannerImage;
                //     console.log("wwww", webBanner)
                //     // res.webBannerImage = webBanner
                //     console.log("ff", res.webBannerImage)
                //     res.mobileBannerImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage.image}`;
                // });
            });
            return result;        
        },
        
    },
    Mutation: {        
        // update ad Banner list
        updateAdBanner: async (root, {id, data}, {currentUser, adBanner, req, site}) => {
            var data1 = await JSON.parse(JSON.stringify(data));
            if (currentUser.adminUserId) {
                var adBannerInfo;
                var siteData = await site.findOne();
                if (id) {
                    var adDetails = await adBanner.findOne({_id: id});
                    var fileName;
                    if (data.webBannerImage) {
                        const { stream, filename } = await data.webBannerImage;
                        let ext = filename.split(".")[1];
                        if(siteData.imageHost == "local") {
                            fileName = `webBanner_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(id), "webBanner");
                            // data.webBannerImage = fileName;
                            data1.webBannerImage = {
                                image: fileName,
                                imageSource: "local"
                            }
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(id), "webBanner");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/webBanner/${String(id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            // data.webBannerImage = fileName;
                            data1.webBannerImage = {
                                image: fileData,
                                imageSource: "cloud"
                            }
                        }
                        if (fs.existsSync(`fileStorage/uploads/webBanner/${id}/${adDetails.webBannerImage.image}`)) {
                            fs.removeSync(`fileStorage/uploads/webBanner/${id}/${adDetails.webBannerImage.image}`);
                        }
                        else if(adDetails.webBannerImage.imageSource == "cloud") {
                            await cloudinaryImageDelete(adDetails.webBannerImage.image)
                        }
                    }
                    if (data.mobileBannerImage) {                        
                        const { stream, filename } = await data.mobileBannerImage;
                        let ext = filename.split(".")[1];
                        if(siteData.imageHost == "local") {
                            fileName = `mobileBanner_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(id), "mobileBanner");
                            data1.mobileBannerImage = {
                                image: fileName,
                                imageSource: "local"
                            }
                        }
                        
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(id), "mobileBanner");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/mobileBanner/${String(id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data1.mobileBannerImage = {
                                image: fileData,
                                imageSource: "cloud"
                            }
                        }
                        if (fs.existsSync(`fileStorage/uploads/mobileBanner/${id}/${adDetails.mobileBannerImage.image}`)) {
                            fs.removeSync(`fileStorage/uploads/mobileBanner/${id}/${adDetails.mobileBannerImage.image}`);
                        }
                        else if(adDetails.mobileBannerImage.imageSource == "cloud") {
                            await cloudinaryImageDelete(adDetails.mobileBannerImage.image)
                        }
                    }
                    adBannerInfo = await adBanner.findOneAndUpdate({_id: id}, {$set: data1});
                } else {
                    var webBannerImage = data.webBannerImage;
                    delete data.webBannerImage;
                    var mobileBannerImage = data.mobileBannerImage;
                    delete data.mobileBannerImage;
                    var adBannerData = await  new adBanner(data).save();
                    if (webBannerImage) {
                        const { stream, filename } = await webBannerImage;
                        let ext = filename.split(".")[1];
                        if(siteData.imageHost == "local") {
                            fileName = `webBanner_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(adBannerData._id), "webBanner");
                            data1.webBannerImage = {
                                image: fileName,
                                imageSource: "local"
                            }
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(adBannerData._id), "webBanner");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/webBanner/${String(adBannerData._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            // data.webBannerImage = fileName;
                            data1.webBannerImage = {
                                image: fileData,
                                imageSource: "cloud"
                            }
                        }
                    }
                    if (mobileBannerImage) {
                        const { stream, filename } = await mobileBannerImage;
                        let ext = filename.split(".")[1];
                        if(siteData.imageHost == "local") {
                            fileName = `mobileBanner_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(adBannerData._id), "mobileBanner");
                            data1.mobileBannerImage = {
                                image: fileName,
                                imageSource: "local"
                            }
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(adBannerData._id), "mobileBanner");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/mobileBanner/${String(adBannerData._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data1.mobileBannerImage = {
                                image: fileData,
                                imageSource: "cloud"
                            }
                        }
                    }
                    adBannerInfo = await adBanner.findOneAndUpdate({_id: adBannerData._id}, {$set: {webBannerImage: data1.webBannerImage, mobileBannerImage: data1.mobileBannerImage } } );
                }
                var response = {
                    id: adBannerInfo.id,
                    name: adBannerInfo.name,
                    webBannerImage: (adBannerInfo.webBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${adBannerInfo.id}/${adBannerInfo.webBannerImage.image}` : (adBannerInfo.webBannerImage.imageSource === "cloud") ? adBannerInfo.webBannerImage.image : "",
                    mobileBannerImage: (adBannerInfo.mobileBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${adBannerInfo.id}/${adBannerInfo.mobileBannerImage.image}` : (adBannerInfo.mobileBannerImage.imageSource === "cloud") ? adBannerInfo.mobileBannerImage.image : "",
                    bannerUrl: adBannerInfo.bannerUrl,
                    status: adBannerInfo.status,
                    updatedAt: adBannerInfo.updatedAt ,
                    createdAt: adBannerInfo.createdAt,
                }
                return response;
            } throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        }       
    }
};

module.exports = resolvers;
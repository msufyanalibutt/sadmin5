
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {ForbiddenError, AuthenticationError, UserInputError} = require("apollo-server");
const {storeUpload, cloudinaryUpload, cloudinaryImageDelete} = require("../../handler");
const URL = process.env.URL;
const fs = require("fs-extra");


const resolvers = {
    Query: {
        // get all reporting reasons that can be used while reporting a user..
        getReasons: async (root, args, {reason, currentUser, req}) => {
            //if (currentUser.userId) {
                const reasonsList = await reason.find({status: "Active"});
                // reasonsList.forEach(r => {
                //     if (r.image) r.image = `${URL + req.headers.host}/fileStorage/uploads/reason/${r.id}/${r.image}`;
                // });
                // return reasonsList;
                             
                let filteredReasons = reasonsList && reasonsList.map( (item) => {
                    var reasonsInfo = {};
                    reasonsInfo.id = item._id,                   
                    reasonsInfo.image = (item.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/reason/${item.id}/${item.image}` : (item.imageSource === "cloud") ? item.image : "",
                    reasonsInfo.status = item.status,
                    reasonsInfo.createdAt = item.createdAt,
                    reasonsInfo.updatedAt = item.updatedAt;
                    var fName;
                    fName = item && item.language && item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item && item.language && item.language.filter((f) => f.langCode === "en");
                    }
                    fName && fName.map((i) => {                        
                        reasonsInfo.name = i.name,
                        reasonsInfo.description = i.description;                       
                    });                              
                    return reasonsInfo;
                });
                return filteredReasons;
           // }
           // throw new AuthenticationError(language[req.headers.lang] != undefined ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        },

        getAdminReasons: async (root, args, {reason, currentUser, req}) => {
            if (currentUser.adminUserId) {
                const reasonsList = await reason.find({});                
                reasonsList && reasonsList.forEach((r) => {
                    if (r.image) {
                        r.image = (r.imageSource === "local") ? `${URL + req.headers.host}/fileStorage/uploads/reason/${r.id}/${r.image}` : (r.imageSource === "cloud") ? r.image : "";
                    }
                });
                return reasonsList;
            }
            throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        },
        // get specific reporting reason based on reason id..
        getReason: async (root, {reasonId}, {reason, currentUser, req}) => {
            if(currentUser.adminUserId) {
                const reasonData = await reason.findOne({_id: reasonId});
                if (reasonData && reasonData.image) {
                    reasonData.image = (reasonData.imageSource === "local") ? `${URL + req.headers.host}/fileStorage/uploads/reason/${reasonId}/${reasonData.image}` : (reasonData.imageSource === "cloud") ? reasonData.image : "";
                    return reasonData;
                } else {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reasonnotFound : language.en._reasonnotFound);
                }
            }
            throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        }
    },
    Mutation: {
        //api to update a reporting reason
        updateReason: async (root, {id, data}, {currentUser, reason, uReport, site}) => {
            if (currentUser.adminUserId) {
                var fileName;
                var siteData = await site.findOne()
                if (id) {
                    var reasonDetails = await reason.findOne({_id: id})
                    if (data.status === "Inactive") {                                          
                        var foundReports = await uReport.find({reportId: id});
                        if(foundReports.length !== 0) {                                     
                            throw new UserInputError(`Report reason ${errors.cannotInactiveReason} report reason`);                             
                        }
                    }
                    if (data.image) {                        
                        const { stream, filename } = await data.image;
                        let ext = filename.split(".")[1];
                        // fileName = `reason_${new Date().getTime()}.${ext}`;
                        // await storeUpload({ stream }, fileName, String(id), "reason");
                        // data.image = fileName;

                        if(siteData.imageHost == "local") {
                            fileName = `reason_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(id), "reason");
                            data.image = fileName;
                            data.imageSource = "local"                                
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(id), "reason");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/reason/${String(id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data.image = fileData;
                            data.imageSource = "cloud"                                
                        }
                        if (fs.existsSync(`fileStorage/uploads/reason/${id}/${reasonDetails.image}`)) {
                            fs.removeSync(`fileStorage/uploads/reason/${id}/${reasonDetails.image}`);
                        }
                        else if(reasonDetails.imageSource == "cloud") {
                            await cloudinaryImageDelete(reasonDetails.image)
                        }
                    }
                    data.updatedAt = Date.now();
                    var updatedReason = await reason.findOneAndUpdate({_id: id}, {$set: data}, {new: true});
                    if (updatedReason) {
                        return true;
                    }
                    else {
                        throw new Error("Reason Not Found");
                    }
                } else {
                    var image = data.image;
                    delete data.image;
                    var resultInfo = await new reason(data).save();
                    if (image) {
                        const { stream, filename } = await image;
                        let ext = filename.split(".")[1];
                        // fileName = `reason_${new Date().getTime()}.${ext}`;
                        // await storeUpload({ stream }, fileName, String(resultInfo._id), "reason");
                        // image = fileName;

                        if(siteData.imageHost == "local") {
                            fileName = `reason_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(resultInfo._id), "reason");
                            image = fileName;
                            imageSource = "local"                                
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(resultInfo._id), "reason");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/reason/${String(resultInfo._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url        
                            image = fileData;
                            imageSource = "cloud"                                
                        }
                    }
                    const updated = await reason.findOneAndUpdate({_id: resultInfo._id}, {$set: {image, imageSource}}, {new: true}).then(function(data){
                        if (data) {
                            return true;
                        }
                        return false;
                    });
                    return updated;
                }
            }
            throw new AuthenticationError(errors.unauthorized);
        }
    }
};

module.exports = resolvers;
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {date, storeUpload, mapConfig} = require("../../handler");
const URL = process.env.URL;

const resolvers = {
    Query: {

        getAdminMetatags: async (root, args, params) => {
            let {req, currentUser, metatags} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching admin meta tags details               
                var adminMetatags = await metatags.find();                                
                return adminMetatags;             
            }
        },

        getMetatags: async (root, args, params) => {
            let {req, currentUser, metatags,site} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching meta tags details               
                var metatagsDetails = await metatags.find();
                var siteData = await site.findOne({});
                let result = metatagsDetails && metatagsDetails.map( (item) => {
                    var metatagsInfo = {};
                    metatagsInfo.id = item && item._id,
                    metatagsInfo.pageUrl = item && `${item.pageUrl}`,
                    metatagsInfo.favicon = `${URL+req.headers.host}/fileStorage/uploads/site/favicons/${siteData.favicon}`;
                    metatagsInfo.createdAt = item && item.createdAt,
                    metatagsInfo.updatedAt = item && item.updatedAt;
                    
                    var fName = item && item.language && item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item && item.language && item.language.filter((f) => f.langCode === "en");
                    }     

                    fName && fName.map((i) => {                        
                      metatagsInfo.pageTitle = i && i.pageTitle,
                      metatagsInfo.metaDescription = i && i.metaDescription;
                      metatagsInfo.keywords = i && i.keywords;         
                    });                                     
                    return metatagsInfo;
                });                                       
                return result;             
            }
        }
    },

    Mutation: {        
        updateMetatags: async (root, {id, data}, {currentUser, metatags}) => {
            if (currentUser.adminUserId) {  
                var metatagsInfo;              
                if (id) {                                     
                    metatagsInfo = await metatags.findOneAndUpdate({_id: id}, {$set: data});
                }
                else{                    
                    metatagsInfo = await  new metatags(data).save();
                }
                return metatagsInfo;
            } 
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
    }
};

module.exports = resolvers;
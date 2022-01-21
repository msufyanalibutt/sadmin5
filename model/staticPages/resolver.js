const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError, UserInputError} = require("apollo-server");

const resolvers = {
    Query: {
        
        getstaticPageDetails: async (root, args, params) => {
            let {req, currentUser, staticPages} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching Static Pages details               
                var staticPagesDetails = await staticPages.find();
                var fName;
                let result = staticPagesDetails && staticPagesDetails.map( (item) => {
                    var staticPagesInfo = {};
                    staticPagesInfo.id = item._id,
                    staticPagesInfo.url = `/pages/${item.url}`,
                    staticPagesInfo.status = item.status,
                    staticPagesInfo.createdAt = item.createdAt,
                    staticPagesInfo.updatedAt = item.updatedAt;
                    
                    fName = item && item.language && item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0) {                        
                        fName = item && item.language && item.language.filter((f) => f.langCode === "en");
                    }
                    else {
                        fName = item && item.language && item.language.filter((f) => f.langCode === req.headers.lang);
                    }
                    fName && fName.map((i) => { 
                        staticPagesInfo.title = i.title,
                        staticPagesInfo.content = i.content;                      
                    });                                             
                    return staticPagesInfo;
                });                                      
                return result;
            }
        },

        getAdminStaticPageDetails: async (root, args, params) => {
            let {req, currentUser, staticPages} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching admin Static Pages details               
                var adminStaticPagesDetails = await staticPages.find();                
                return adminStaticPagesDetails;               
            }
        }
    },

    Mutation: {        
        updateStaticPages: async (root, {id, data}, {currentUser, staticPages}) => {
            if (currentUser.adminUserId) {  
                var changedUrl; 
                var staticPagesInfo;      
                if (id) {                          
                    if(id == 1 || id == 2) {
                        var staticPagesData = await staticPages.findOne({_id: id});
                        if(staticPagesData) {
                            var EnglishstaticPagesData = staticPagesData && staticPagesData.language && staticPagesData.language.find((f) => f.langCode === "en");
                            var InputstaticPagesData = data && data.language && data.language.find((f) => f.langCode === "en");
                            if(EnglishstaticPagesData && InputstaticPagesData && EnglishstaticPagesData.title != InputstaticPagesData.title) {
                                throw new UserInputError("It is a default static page, So you cannot edit English language Title.");
                            }
                        }
                    }
                    changedUrl = data && data.language && data.language.filter((f) => f.langCode === "en");                    
                    changedUrl && changedUrl.map((i) => {                        
                        data.url = i.title.toLowerCase().replace(/ /g, "_");            
                        });
                    staticPagesInfo = await staticPages.findOneAndUpdate({_id: id}, {$set: data});
                }
                else {                    
                    changedUrl = data && data.language && data.language.filter((f) => f.langCode === "en");                
                    changedUrl && changedUrl.map((i) => {                        
                        data.url = i.title.toLowerCase().replace(/ /g, "_");                     
                    }); 
                    staticPagesInfo = await new staticPages(data).save();
                }
                return staticPagesInfo;
            } 
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
    }
};

module.exports = resolvers;
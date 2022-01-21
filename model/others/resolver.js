
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {date, storeUpload, mapConfig, payoutCountry, cloudinaryUpload, cloudinaryImageDelete} = require("../../handler");
var { UserInputError } = require("apollo-server");
var braintree = require("braintree");
const fs = require("fs-extra");
const resolvers = {
    Query: {

       
        getAdminCategoryDetails: async (root, {fetch}, {req, category,filterCategory, currentUser, product}) => {
            // if (!!req.headers.authorization && !currentUser.userId) {
            //     throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            // }
            // else {
                categoryInfo = await category.find();
                filterInfo = await filterCategory.find();
                productInfo = await product.find();

                categoryDetails = categoryInfo && categoryInfo.map((item) => {  
                    IsMandatory = [];
                    filterIdData = [];
                    fieldData = item && item.fields && item.fields.map((i) => {
                        var specFilter = filterInfo && filterInfo.find((fI) => fI.id == i.filterId); 
                                fName = specFilter && specFilter.language && specFilter.language.filter((f) => f.langCode === req.headers.lang);
                                if (fName && fName.length === 0){                        
                                    fName = specFilter && specFilter.language && specFilter.language.filter((f) => f.langCode === "en");
                                }
                                fieldInfo = {};
                                fName && fName.map( (v) => {                        
                                    fieldInfo.name = v && v.name;                                                
                                    // fieldInfo.values = v.values; 
                                    valuesData = v && v.values && v.values.map((vI) => {
                                        filtervaluesData = {};
                                        filtervaluesData.valueParentId = vI && vI._id
                                        filtervaluesData.valueParent = vI && vI.valueParent
                                        childData = vI && vI.valueChild && vI.valueChild.map((j) => {
                                            childData = {};
                                            childData.valueChildId = j && j._id
                                            childData.valueChildData = j && j.valueChildData
                                            return childData;
                                        })
                                        filtervaluesData.valueChild = childData
                                        return filtervaluesData;
                                    })   
                                    fieldInfo.values = valuesData;                  
                                });  
                                if(specFilter && specFilter !== undefined){
                                    fieldInfo.filterId = i && i.filterId;
                                    fieldInfo.isMandatory = i && i.isMandatory;
                                    fieldInfo.inputTag = specFilter && specFilter.inputTag;
                                    fieldInfo.min = specFilter && specFilter.min;
                                    fieldInfo.max = specFilter && specFilter.max;
                                    filterIdData.push(i.filterId)
                                    if (i.isMandatory != null) {
                                        IsMandatory.push(i.isMandatory)
                                    }
                                }                              
                        return fieldInfo;                  
                    });

                    productCategory = productInfo && item && productInfo.filter((f) => f.categoryId == item.id);
                    item = {
                        id: item && item.id,
                        language: item && item.language,                      
                        status: item && item.status,
                        isFeatured: item && item.isFeatured,
                        image : item && (item.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${item.id}/${item.image}` : (item.imageSource === "cloud") ? item.image : "",
                        fields : fieldData,
                        createdAt: item && item.createdAt,
                        updatedAt: item && item.updatedAt,
                        allIsMandatory: IsMandatory,
                        allFilterId: filterIdData,
                        instantBuy: item && item.instantBuy,
                        productExisted: (productCategory && productCategory.length > 0) ? true : false
                    };
                    return item;     
                });               
                return categoryDetails;
            // }
        },

        getAdminCategorybyId: async (root, { id },{req, category}) => {
            var result = await category.findById(id);
            result.image = `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${result.id}/${result.image}`;
            return result;
        },

        getCategoryDetails: async (root, {fetch}, params) => {
            let {req, currentUser, filterCategory, site, currency, chat, message, adBanner, category } = params;            
                var fName;

                // fetching category details               
                var categoryDetails = await category.find({status: "Active"}).sort("_id");;
                filterInfo = await filterCategory.find();

                let filteredCategoryInfo = categoryDetails && categoryDetails.map( (item) => {
                    var categoryInfo = {};
                    categoryInfo.id = item && item._id,
                    categoryInfo.image = item && (item.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${item.id}/${item.image}` : (item.imageSource === "cloud") ? item.image : "",
                    categoryInfo.isFeatured = item && item.isFeatured,
                    categoryInfo.status = item && item.status,
                    categoryInfo.createdAt = item && item.createdAt,
                    categoryInfo.updatedAt = item &&  item.updatedAt;
                    categoryInfo.instantBuy = item && item.instantBuy
                    
                    fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item.language.filter((f) => f.langCode === "en");
                    }
                      fName.map((i) => {                        
                        categoryInfo.name = i && i.name,
                        categoryInfo.description = i && i.description;
                    }); 

                    fieldData = item && item.fields && item.fields.map((i) => {
                        var specFilter = filterInfo && filterInfo.find((fI) => fI.id == i.filterId);  
                                specFilterName = specFilter && specFilter.language && specFilter.language.filter((f) => f.langCode === req.headers.lang);
                                if (specFilterName.length === 0){                        
                                    specFilterName = specFilter && specFilter.language && specFilter.language.filter((f) => f.langCode === "en");
                                }
                                fieldInfo = {};
                                specFilterName.map( (v) => {   
                                    fieldInfo.name = v && v.name;                                                
                                    valuesData = v && v.values && v.values.map((vI) => {
                                        filtervaluesData = {};
                                        filtervaluesData.valueParentId = vI && vI._id
                                        filtervaluesData.valueParent = vI && vI.valueParent
                                        childData = vI && vI.valueChild && vI.valueChild.map((j) => {
                                            childData = {};
                                            childData.valueChildId = j && j._id
                                            childData.valueChildData = j && j.valueChildData
                                            return childData;
                                        })
                                        filtervaluesData.valueChild = childData
                                        return filtervaluesData;
                                    })   
                                    fieldInfo.values = valuesData;
                                });
                        fieldInfo.filterId = i && i.filterId;
                        fieldInfo.isMandatory = i && i.isMandatory;
                        fieldInfo.inputTag = specFilter && specFilter.inputTag;
                        fieldInfo.min = specFilter && specFilter.min;
                        fieldInfo.max = specFilter && specFilter.max;
                        return fieldInfo;
                    });  
                    categoryInfo.fields = fieldData;      
                    return categoryInfo;
                });                                 

                // fetching frequency details               
                var Frequency = [
                    "Hourly", "Daily", "Weekly", "Biweekly", "Monthly", "Yearly", "One-time"
                ];                

                // fetching currency details               
                var siteSetting = await site.findOne({}, "defaultCurrency");
                var getDefault = site && await currency.findOne({code: siteSetting.defaultCurrency}, "code symbol");
                var defaultCurrencyCode = getDefault && getDefault.code;
                var defaultCurrencySymbol = getDefault && getDefault.symbol;

                // fetching unread message count details               
                if (currentUser.userId ) {
                    var chatResult1 = await chat.find({productuserId: currentUser.userId});
                    var chatResult2 = await chat.find({userId: currentUser.userId});          
                    var chatResult = chatResult1.concat(chatResult2);
                    var chatMsg = chatResult && chatResult.map( (item) => {
                        return item._id;
                    });                     
                        var msg = await message.find({room: chatMsg});                        
                        var rM = msg && msg.filter((a) => a.userId != currentUser.userId);

                        var readMessage = rM && rM.map( (item) => {
                            return item.readMessage;
                        });
                        var filtered = readMessage && readMessage.filter(function (el) {
                            return el == false ;
                        });                    
                        var unreadMessage = filtered && filtered.length;                    
                    } else {
                        unreadMessage = 0;
                }

                // fetching adBannerDetails details               
                var adBannerDetails = await adBanner.find({status: "Active"});                  
                var bannerInfo = await adBannerDetails.map(function(res) {
                    var response = {
                        id: res && res.id,
                        name: res && res.name,
                        webBannerImage: res && (res.webBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage.image}` : (res.webBannerImage.imageSource === "cloud") ? res.webBannerImage.image : "",
                        mobileBannerImage: res && (res.mobileBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage.image}` : (res.mobileBannerImage.imageSource === "cloud") ? res.mobileBannerImage.image : "",
                        bannerUrl: res && res.bannerUrl,
                        status: res && res.status,
                        updatedAt: res && res.updatedAt ,
                        createdAt: res && res.createdAt,
                    }
                    return response;
                    // res.webBannerImage = (res.webBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage.image}` : (res.webBannerImage.imageSource === "cloud") ? res.webBannerImage.image : "";              
                    // res.mobileBannerImage = (res.mobileBannerImage.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage.image}` : (res.mobileBannerImage.imageSource === "cloud") ? res.mobileBannerImage.image : "";
                });
                adBannerDetails = bannerInfo;

                // result for all
                var result = {
                    category : filteredCategoryInfo,                    
                    frequency: Frequency,                    
                    adBannerDetails: adBannerDetails,
                    currencyCode: defaultCurrencyCode,
                    currencySymbol: defaultCurrencySymbol,
                    unreadMessage: unreadMessage
                };
                return result;
        },

        // get all currencies info like currencycode, symbol, rate,..
        
        getCurrencies: async (root, {fetch}, {currentUser, currency}) => {
                const currencies = fetch === "all" ? 
                await currency.find({}).sort("-default")
                : await currency.find({status: "Active"}).sort("-default");
                return currencies;
        },
        // get specific currency details like currencycode, symbol, rate,.. by id
        getCurrency: async (root, {id}, {currentUser, currency}) => {
            if (currentUser.adminUserId) {
                const foundCurrency = await currency.findOne({_id: id});
                return foundCurrency;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        },
        // get all countries info
        getCountries: async (root, args, {currentUser, country}) => {
                const countries = await country.find();
                return countries;
        },
        // get all timezone informations
        getTimezone: async (root, args, {currentUser, timezone}) => {
                const timeZone = await timezone.find({}, "name");
                return timeZone;
        },

        getStripePayoutCountries: async(root,args,_) => {
            const payOutData = await payoutCountry;
            return payOutData;
        },         
        // get all featured informations
        getFeaturedDetails: async (root, args, {req, currentUser, featured, currency,site}) => {
            var featuredDetails = await featured.find({status: "Active"}).sort("createdAt");    
            const currencies = await currency.find({}, "code symbol rate");
            var chosenCurrency = await currency.findOne({code: req.headers.currency});
            var USDCurrency = await currency.findOne({code: "USD"});
            var siteSetting = await site.findOne({});
            var paymentInfoData = [];
          
                let filteredFeatured = featuredDetails.map( (item) => {
                    var featuredInfo = {};
                    featuredInfo.id = item && item._id,                   
                    featuredInfo.validationPeriod = item && item.validationPeriod,             
                    featuredInfo.status = item && item.status,
                    featuredInfo.createdAt = item && item.createdAt,
                    featuredInfo.updatedAt = item && item.updatedAt;
                    
                    var fName = item && item.language && item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName && fName.length === 0){                        
                        fName = item && item.language && item.language.filter((f) => f.langCode === "en");
                    }
                    fName && fName.map((i) => {                        
                        featuredInfo.name = i && i.name,
                        featuredInfo.description = i && i.description;        
                    });     

                    if(item && item.image) {
                        featuredInfo.image = item && (item.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/${item.id}/${item.image}` : (item.imageSource === "cloud") ? item.image : "";
                    }
    
                   
                    var featuredCurrentRate = currencies && item && currencies.find((c) => c.code == item.currencyCode);   
                    var featuredConversionRate = item && featuredCurrentRate && (item.price / featuredCurrentRate.rate).toFixed(2);                   

                    if (item.currencyCode !== "USD"){                     
                        featuredInfo.price = featuredConversionRate;
                        featuredInfo.currencyCode = "USD";
                        featuredInfo.currencySymbol = USDCurrency && USDCurrency.symbol;
                    } else {
                        featuredInfo.price = item.price;
                        featuredInfo.currencyCode = "USD";
                        featuredInfo.currencySymbol = USDCurrency && USDCurrency.symbol;
                    }
                    
                    if (item.currencyCode !== req.headers.currency) {                      
                        var msg = chosenCurrency && featuredConversionRate && (featuredConversionRate * chosenCurrency.rate).toFixed(2);  
                        featuredInfo.beforeconversionMsg = msg && `${msg}`;
                        featuredInfo.afterconversionMsg = `${featuredInfo.price}`;
                    } else {
                        featuredInfo.beforeconversionMsg = `${item.price}`;
                        featuredInfo.afterconversionMsg = `${featuredInfo.price}`;
                    }
                 
                    return featuredInfo;
                });
                 
                if(siteSetting.stripe){
                    let stripePayData = {
                        payment_type: "Stripe",
                        value:"Stripe",
                        icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/stripe.png`,
                        key:siteSetting.stripePublishKey,
                        mode:""
                    }
                    paymentInfoData.push(stripePayData)
                }
                if(siteSetting.paypal){
                    try{
                        var gateway = braintree.connect({
                            accessToken: siteSetting.paypalAppId
                        });
                        let res = await gateway.clientToken.generate({});
                        let paypalPayData = {
                            payment_type:"Paypal",
                            value :"Paypal",
                            icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/paypal.png`,
                            key: res && res.clientToken,
                            mode : ""
                        }
                        paymentInfoData.push(paypalPayData)
                    }
                    catch(error){
                        if(error){
                            let paypalPayData = {
                                payment_type:"Paypal",
                                value :"Paypal",
                                icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/paypal.png`,
                                key: "",
                                mode : ""
                            }
                            paymentInfoData.push(paypalPayData)
                        }
                    }    
                }
                if(siteSetting.braintree){
                    let braintreePayData = {
                        payment_type:"Braintree",
                        value :"Braintree",
                        icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/braintree.jpg`,
                        key:"",
                        mode :""
                    }
                    paymentInfoData.push(braintreePayData)
                }

                var returnData = {
                    paymentInfo: paymentInfoData,
                    featuredInfo: filteredFeatured
                }
                 return returnData;

        },

        getAdminFeaturedDetails: async (root, args, {req, currentUser, featured, currency}) => {
            var featuredDetails = await featured.find({}).sort("createdAt");                                
            featuredDetails.forEach(function(res) {
                if(res.image) {
                    res.image = (res.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/${res.id}/${res.image}` : (res.imageSource === "cloud") ? res.image : "";
                }
            });
            return featuredDetails;                        
        },                                        

        getCommonData: async (root, {version, deviceType}, {req, currentUser, site, staticPages, forceUpdate}) => {
            var siteDate = await site.findOne();
            var staticPagesDetails = await staticPages.find({_id: [1, 2]});
            var terms = staticPagesDetails && staticPagesDetails.find(i => i._id == 1) 
            var termsUrl = `${process.env.URL + req.headers.host}/pages/${terms.url}`
            var privacy = staticPagesDetails && staticPagesDetails.find(i => i._id == 2) 
            var privacyUrl = `${process.env.URL + req.headers.host}/pages/${privacy.url}`
            var forceUpdateData = await forceUpdate.find();
            var currentForceUpdate = forceUpdateData && forceUpdateData.find(i => i.deviceType == deviceType && i.version == version)
            // var deviceTypeForceUpdates = forceUpdateData && currentForceUpdate && forceUpdateData.filter(i => i.deviceType == deviceType && i._id > currentForceUpdate._id)
            var deviceTypeForceUpdates = forceUpdateData && currentForceUpdate && forceUpdateData.filter(i => i.deviceType == deviceType && i.version > currentForceUpdate.version)
            if(deviceTypeForceUpdates && deviceTypeForceUpdates.length > 0) {
                for(i=1; i<=deviceTypeForceUpdates.length; i++) { 
                    if(deviceTypeForceUpdates && deviceTypeForceUpdates[deviceTypeForceUpdates.length-i] &&  deviceTypeForceUpdates[deviceTypeForceUpdates.length-i].forceUpdate == "Yes") {
                        var forceUpdateStatus = "force_update"
                        break;
                    }
                    else if(deviceTypeForceUpdates && deviceTypeForceUpdates[deviceTypeForceUpdates.length-i] &&  deviceTypeForceUpdates[deviceTypeForceUpdates.length-i].forceUpdate == "No") {
                        var forceUpdateStatus = "skip_update"
                    }
                }
            }
            else {
                var forceUpdateStatus = "no_update"
            }
            var response = {
                googleLogin: siteDate && siteDate.googleLogin,
                facebookLogin: siteDate && siteDate.facebookLogin,
                appleLogin: siteDate && siteDate.appleLogin,
                admob: siteDate && siteDate.admob,
                admobBanner: siteDate && siteDate.admobBanner,
                paymentSDKMode : siteDate && siteDate.paymentSDKMode,
                termsUrl: termsUrl,
                privacyUrl: privacyUrl,
                forceUpdateStatus: forceUpdateStatus
            }
            return response;
        }

        // getReportOptions: async(root, args, {currentUser, report, req}) => {
        //     if (currentUser) {
        //         const reportList = await report.find({});
        //         if (reportList && reportList.length) {
        //             reportList.forEach((rl) => {
        //                 rl.imageUrl = rl.imageUrl && URL + req.headers.host + "/fileStorage/uploads/report/" + rl.id +"/" + rl.imageUrl;
        //             });
        //         } 
        //         return reportList;
        //     }
        // }
    },
    Mutation: {
        //api to update informations of categories
        updateCategory: async (root, {id, data}, params) => {
            let {currentUser, product, category, site} = params;
            var siteData = await site.findOne();
            if(currentUser.adminUserId) {
                    if (id) {
                        var categoryDetails = await category.findOne({_id: id})
                        var productData = await product.find({categoryId: id});
                        if(data.allFilterId || data.allIsMandatory) {
                            if(productData && productData.length > 0) {                                     
                                throw new UserInputError("Category already updated with the existing product, So you can't edit this category filters");                             
                            }                                                
                        }

                        if(data.instantBuy === false) {
                            var instantBuyProduct = productData && productData.filter(x => x.instantBuy == true)
                            if(instantBuyProduct && instantBuyProduct.length > 0) {
                                throw new UserInputError("BuyNow option already enabled with the existing product, So you can't edit this category Buynow option");                             
                            }
                            else if(instantBuyProduct && instantBuyProduct.length === 0) {
                                var instantBuyProduct = productData && productData.filter(x => x.instantBuy == false)
                                var instantBuyProductId = instantBuyProduct && instantBuyProduct.map((i) => {
                                    return i._id
                                })
                                const productUpdate = await product.updateMany({_id: instantBuyProductId}, {$set: {instantBuy: null, shippingRate: null}}, {new: true})
                            }
                        }
                        
                        if(data.isFeatured == false) {
                            var categoryData = await category.find({isFeatured: true});
                            if (categoryData && categoryData.length === 1) {                                    
                                if (categoryData[0]._id === id) {
                                    throw new UserInputError(`${errors.cannotIsfeaturedFalse}`);
                                }
                            }
                        }                        
                        
                        if(data.instantBuy === true) {
                            var instantBuyProduct = productData && productData.filter(x => x.instantBuy == null)
                            var instantBuyProductId = instantBuyProduct && instantBuyProduct.map((i) => {
                                return i._id
                            })
                            const productUpdate = await product.updateMany({_id: instantBuyProductId}, {$set: {instantBuy: false, shippingRate: null}}, {new: true})
                        }
                        // if (data.status === "Inactive") {
                            // var productData = await product.find({categoryId: id});
                            // if(productData && productData.length !== 0) {     
                            //     prodId = productData.map((i) => {
                            //         return i._id;
                            //     })
                            //     const prod = await product.updateMany({_id: prodId}, {$set: {status: "Rejected"}}, {new: true})
                            // }                                                                                       
                        // }                          

                        if (data.allFilterId) {
                            var filterIdInput = data.allFilterId
                            delete data.allFilterId
                        }
                        if (data.allIsMandatory) {
                            var isMandatoryInput = data.allIsMandatory
                            delete data.allIsMandatory
                        }
                        if (filterIdInput) {
                            data.fields = [];
                            filterIdInput.map((i) => {
                                fieldsData = {};
                                if (isMandatoryInput) {
                                    isMandatoryInput.map((j) => {
                                        if(i === j){                                                                                    
                                            fieldsData.isMandatory = j;
                                        }                                    
                                    }) 
                                }                                   
                                fieldsData.filterId = i;                                                           
                                data.fields.push(fieldsData)
                            })
                        }                                       
                        if (data.image) {                            
                            const { stream, filename } = await data.image;
                            let ext = filename.split(".")[1];
                            if(siteData.imageHost == "local") {
                                fileName = `category_${new Date().getTime()}.${ext}`;
                                await storeUpload({ stream }, fileName, String(id), "category");
                                data.image = fileName;
                                data.imageSource = "local"                                
                            }
                            else if(siteData.imageHost == "cloud") {
                                var response = await cloudinaryUpload({ stream }, "fileName", String(id), "category");
                                // fileData = await response && response.public_id.replace(`fileStorage/uploads/category/${String(id)}/`, "")+"."+response.format
                                fileData = await response && response.secure_url
                                data.image = fileData;
                                data.imageSource = "cloud"                                
                            }
                            if (fs.existsSync(`fileStorage/uploads/category/${id}/${categoryDetails.image}`)) {
                                fs.removeSync(`fileStorage/uploads/category/${id}/${categoryDetails.image}`);
                            }
                            else if(categoryDetails.imageSource == "cloud") {
                                await cloudinaryImageDelete(categoryDetails.image)
                            }
                        }                        
                        data.updatedAt = date();     
                        const updated = await category.findOneAndUpdate({_id: id}, {$set: data}, {new: true}).then(function(data){
                            if (data) {
                                return true;
                            }
                            return false;
                        });
                        return updated;                               
                    } 
                    else {
                        var image = data.image;
                        delete data.image;
                        if (data.allFilterId) {
                            var filterIdInput = data.allFilterId
                            delete data.allFilterId
                        }
                        if (data.allIsMandatory) {
                            var isMandatoryInput = data.allIsMandatory
                            delete data.allIsMandatory
                        }                                               
                        const resultInfo = await new category(data).save();
                        if (filterIdInput) {
                            fields = [];
                            filterIdInput.map((i) => {
                                fieldsData = {};
                                if (isMandatoryInput) {
                                    isMandatoryInput.map((j) => {
                                        if(i === j){                                                                                    
                                            fieldsData.isMandatory = j;
                                        }                                    
                                    }) 
                                }                                   
                                fieldsData.filterId = i;                                                           
                                fields.push(fieldsData)
                            })
                        }   
                        if (image) {
                            const { stream, filename } = await image;
                            let ext = filename.split(".")[1];
                            if(siteData.imageHost == "local") {
                                fileName = `category_${new Date().getTime()}.${ext}`;
                                await storeUpload({ stream }, fileName, String(resultInfo._id), "category");
                                image = fileName;
                                imageSource = "local"                                
                            }
                            else if(siteData.imageHost == "cloud") {
                                var response = await cloudinaryUpload({ stream }, "fileName", String(resultInfo._id), "category");
                                // fileData = await response && response.public_id.replace(`fileStorage/uploads/category/${String(resultInfo._id)}/`, "")+"."+response.format
                                fileData = await response && response.secure_url
                                image = fileData;
                                imageSource = "cloud"
                            }
                        }
                        const updated = await category.findOneAndUpdate({_id: resultInfo._id}, {$set: {image: image, imageSource: imageSource, fields: fields}}, {new: true}).then(function(data){
                            if (data) {
                                return true;
                            }
                            return false;
                        });
                        return updated;
                    }
            }
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        },

        // api to update currency informations
        updateCurrency: async (root, {id, data}, {currentUser, currency, product, site}) => {
            if (currentUser.adminUserId) {
                var currencyInfo;
                if (id) {         
                    if(id === 1) {
                        throw new UserInputError(`Cannot edit USD currency`);
                    }
                    if (data.status === "Inactive") {
                        var defaultData = await site.findOne({}, "defaultCurrency");
                        var currencyData = await currency.findOne({code: defaultData.defaultCurrency});
                        var currencyDetail = await currency.findOne({_id: id});
                        if (currencyData && currencyData._id == id){
                            throw new UserInputError(`Currency is ${errors.cannotEditDefault} currency. So you can't inactive this currency`);
                        }
                        else {
                            productData = await product.find({currencyCode: currencyDetail.code});
                            if(productData && productData.length !== 0) {                                     
                                throw new UserInputError(`Currency ${errors.cannotInactive} currency`);                             
                            }
                        }
                    }
                    currencyInfo = await currency.findOneAndUpdate({_id: id}, {$set: data}, {new: true})
                    .then(function(data) { if (data) {
                        return true; 
                    }
                    });
                }

                else {
                currencyInfo = await  new currency(data).save()
                .then((data) => { if (data) {
                    return true; 
                }
                });
                }
                return currencyInfo;
            }
        },

        // update featured list
        updateFeatured: async (root, {id, data}, {currentUser, featured, currency, product, site}) => {
            // var data1 = await JSON.parse(JSON.stringify(data));
            if (currentUser.adminUserId) {
                var siteData = await site.findOne();
                if(data.currencyCode) {
                    var currencyInfo = await currency.findOne({code: data.currencyCode});
                }
                var featuredInfo;
                if (id) {
                    var featuredDetails = await featured.findOne({_id: id});
                    if (data.status === "Inactive") {                                          
                        var productData = await product.find({featured: id});
                        if(productData.length !== 0) {                                     
                            throw new UserInputError(`Featured ${errors.cannotInactive} featured`);                             
                        }
                    }
                    if(data.currencyCode) {
                        data.currencySymbol = currencyInfo && currencyInfo.symbol;
                    }
                    if (data.image) {                        
                        const { stream, filename } = await data.image;
                        let ext = filename.split(".")[1];
                        // var fileName = `featured_${new Date().getTime()}.${ext}`;
                        // await storeUpload({ stream }, fileName, String(id), "featured");
                        // data.image = fileName;

                        if(siteData.imageHost == "local") {
                            fileName = `featured_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(id), "featured");
                            data.image = fileName;
                            data.imageSource = "local"                                
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(id), "featured");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/featured/${String(id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data.image = fileData;
                            data.imageSource = "cloud"                                
                        }
                        if (fs.existsSync(`fileStorage/uploads/featured/${id}/${featuredDetails.image}`)) {
                            fs.removeSync(`fileStorage/uploads/featured/${id}/${featuredDetails.image}`);
                        }
                        else if(featuredDetails.imageSource == "cloud") {
                            await cloudinaryImageDelete(featuredDetails.image)
                        }
                    }                    
                    featuredInfo = await featured.findOneAndUpdate({_id: id}, {$set: data});
                }else{
                    data.currencySymbol = currencyInfo && currencyInfo.symbol;
                    var image = data.image;
                    delete data.image;
                    var featuredData = await  new featured(data).save();
                    if (image) {
                        const { stream, filename } = await image;
                        let ext = filename.split(".")[1];
                        // fileName = `featured_${new Date().getTime()}.${ext}`;
                        // await storeUpload({ stream }, fileName, String(featuredData._id), "featured");
                        // data1.image = fileName;

                        if(siteData.imageHost == "local") {
                            fileName = `featured_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(featuredData._id), "featured");
                            data.image = fileName;
                            data.imageSource = "local"                                
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(featuredData._id), "featured");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/featured/${String(featuredData._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data.image = fileData;
                            data.imageSource = "cloud"                                
                        }
                    }
                     var featuredInfo = await featured.findOneAndUpdate({_id: featuredData._id}, {$set: {image: data.image, imageSource: data.imageSource}});
                }
                return featuredInfo;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }        
    }
};

module.exports = resolvers;
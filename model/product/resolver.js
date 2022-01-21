const { errors } = require("../../error");
const language = require("../../src/translations/api/lang.json");
const { ForbiddenError, AuthenticationError, UserInputError } = require("apollo-server");
const path = require("path");
const fs = require("fs-extra");
const { date, storeUpload, imageUpload, deleteImage, dateAdd, updateFetchedProducts, sortConfig, createToken, updateAdminFetchedProducts, cloudinaryUpload, deleteImageFolder, commonRoster, cloudinaryImageDelete, deleteCloudImageFolder } = require("../../handler");
const paginate = 20;
const URL = process.env.URL;
const sendMailAction = require("../../mailtemp");
const { Site_Url, env } = process.env;
const moment = require('moment');
const { fieldChildFilter } = require("./filtering_handler")



const resolvers = {
    Query: {
        // api to get a product details by id
        getProduct: async (root, { id, pageNumber }, data) => {
            var filter = {};
            var filters = {};
            let { product, req, currentUser, user } = data;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else {
                var ActiveUser = await user.find({ status: "Active", $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });
                var ActiveuserId = ActiveUser && ActiveUser.map((item) => {
                    return item._id;
                });
                if(currentUser.userId) {
                    ActiveuserId.push(currentUser.userId)
                }
                var fetchedproduct = await product.findOne({ _id: id, isDeleted: false, status: "Approved", userId: ActiveuserId });
                if (!fetchedproduct) {
                    throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
                }
                var similarList = await product.find({ categoryId: fetchedproduct.categoryId, _id: { "$nin": fetchedproduct._id }, sellingStatus: "ForSale", status: "Approved", userId: ActiveuserId }).skip((pageNumber - 1) * 10).limit(9);
                similarList.unshift(fetchedproduct);
                const similarProducts = await updateFetchedProducts(pageNumber, filters, filter, data, similarList, "needMore");
                return similarProducts;
            }
        },

        // api to get a product details by id
        getAdminByProduct: async (root, { id }, data) => {
            let { product, req, currentUser, category } = data;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(errors.unauthorized);
            }
            else {
                var products = await product.find({ _id: id, isDeleted: false });
                if (!products) {
                    throw new ForbiddenError("Product " + errors.notFound);
                }
                return updateAdminFetchedProducts(data, products, "needMore");
            }
        },
        
        // api to get all product details
        getAllProducts: async (root, { filter, pageNumber, deviceId, device }, data) => {

            let { user, product, currentUser, req, site, featured, transaction, filterCategory, category } = data;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            var getDefault = await site.findOne({}, "defaultCurrency");

            var sortOrder, sortBy, filters = {};
            // filters
            let textSearch = ["title", "description", "categoryId"]; // title only passed via frontend for text search filter
            filters.isDeleted = false;
            filters.sellingStatus = "ForSale";
            filters.status = "Approved";

            if (filter) {

                // To update device id for mobile
                if (currentUser.userId && deviceId) {
                    await user.findOneAndUpdate({ _id: currentUser.userId }, { $set: { "deviceId": deviceId }, "device": device }, { new: true });
                }
                // text search
                for (var i = 0; i < textSearch.length; i++) {
                    if (!!filter[textSearch[i]] && filter[textSearch[i]].toString().length) {
                        if (textSearch[i] == "title" || textSearch[i] === "description") {
                            var res = filter[textSearch[i]].split(" ");
                            var filtered = res && res.filter(function (el) {
                                return el != "";
                            });
                            var result = `${filtered[0] + "|" + filtered[1]}`;
                            var searchKey = new RegExp(result, "i");
                            filters[`language.${textSearch[i]}`] = searchKey
                        }
                        else {
                            filters[textSearch[i]] = filter[textSearch[i]];
                        }
                    }
                }

                // date filter
                if (filter.dateBy === 1) {
                    var fromDate = moment().add("-1", "days").format();
                    var toDate = moment().format();
                    filters.createdAt = { $gte: fromDate, $lt: toDate }
                }
                if (filter.dateBy === 2) {
                    var fromDate = moment().add("-7", "days").format();
                    var toDate = moment().format();
                    filters.createdAt = { $gte: fromDate, $lt: toDate }
                }
                if (filter.dateBy === 3) {
                    var fromDate = moment().add("-30", "days").format();
                    var toDate = moment().format();
                    filters.createdAt = { $gte: fromDate, $lt: toDate }
                }

                // location filter
                if (filter.location && filter.location.lat_lon) {
                    var l1 = filter.location.lat_lon[1];
                    var l2 = filter.location.lat_lon[0]
                    let distance = (filter.radius && filter.unit) ? filter.unit === "KM" ? Number(filter.radius) * 1000
                        : filter.unit === "MI" ? Number(filter.radius) * 1609.34 : 1000 * 1000 : 1000 * 1000;
                    if (filter.sortBy == 4) {
                        filters["location.lat_lon"] = {
                            $near: {
                                $geometry:
                                {
                                    type: "Point",
                                    coordinates: [l1, l2]
                                },
                                $maxDistance: distance
                            }
                        }
                    } else if (filter.radius && filter.unit) {
                        var radians = (filter.unit === "MI" ? filter.radius : filter.radius / 1.6093) / 3963.2;
                        filters["location.lat_lon"] = { $geoWithin: { $centerSphere: [[l1, l2], radians] } }
                    } else {
                        filters["location.lat_lon"] = { $geoWithin: { $centerSphere: [[l1, l2], 50 / 3963.2] } }
                    }

                    if (!!currentUser.userId) {
                        await user.findOneAndUpdate({ _id: currentUser.userId }, { $set: { "radius": filter.radius } }, { new: true });
                    }
                }

                // Sort by
                if (filter.sortBy && filter.sortBy != 0) {
                    sortConfig.forEach((sort) => {
                        if (sort.key == filter.sortBy) {
                            sortBy = sort.value;
                            sortOrder = sort.order;
                        }
                    });
                }

                // Find active user
                ActiveUser = await user.find({ status: "Active", $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });
                ActiveuserId = ActiveUser && ActiveUser.map((item) => {
                    return item._id;
                });

                // Find Active category
                var activeCategory = await category.find({status: "Active"});
                var activeCategoryId = activeCategory && activeCategory.map((i) => {
                    return i._id
                })

                // All page
                if (pageNumber === "all") {
                    if (filter.fieldChild && filter.fieldChild.length > 0) {
                        var valuesChild = await fieldChildFilter(filter, data)
                        var approvedSellingProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }, { isDeleted: false }, { "categoryFields.fieldChild": { $in: valuesChild } }] });
                    }
                    else {
                        var approvedSellingProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }, { isDeleted: false }] });
                    }
                    //"images isFree title rate currencyCode userId userName location createdAt updatedAt status viewers");
                }

                // With page number
                else {
                    var approvedSellingProducts = [];
                    if (!filter.sortBy) {
                        if (filter.fieldChild && filter.fieldChild.length > 0) {
                            var valuesChild = await fieldChildFilter(filter, data)
                            var fetchedProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }, { "categoryFields.fieldChild": { $in: valuesChild } }] }).sort([["featured", "-1"], ["createdAt", "-1"]]).skip((pageNumber - 1) * paginate).limit(paginate);
                        }
                        else {
                            var fetchedProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }] }).sort([["featured", "-1"], ["createdAt", "-1"]]).skip((pageNumber - 1) * paginate).limit(paginate);
                        }
                        featuredProducts = fetchedProducts && fetchedProducts.filter((a) => a.featured != null);
                        // featuredItems = featuredProducts.map( item => {
                        //         return item.featured
                        //     })    

                        for (i = 0; i < featuredProducts.length; i++) {
                            transactionCreatedAt = await transaction.findOne({ transactionId: featuredProducts[i].featuredTransactionId });
                            currentTime = new Date();
                            transactionTime = new Date(transactionCreatedAt.createdAt);
                            const diffTime = Math.abs(currentTime - transactionTime);
                            const diffHrs = Math.floor(diffTime / (1000 * 60 * 60));
                            // const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                            // console.log("day", diffHrs)
                            // featuredId = featuredItems[i]
                            // featuredDetails = await featured.findOne({_id: featuredId}) 
                            if (featuredProducts[i] != undefined) {
                                if (diffHrs >= featuredProducts[i].featuredValidation) {
                                    const featuredProductsUpdate = await product.updateOne({ _id: featuredProducts[i]._id }, { $set: { featured: null, featuredExpiry: null, featuredName: null, featuredTransactionId: null, featuredValidation: null, featuredDescription: null } })
                                }
                            }
                        }
                    }
                    else if (filter.sortBy && filter.sortBy != 0) {
                        if (filter.fieldChild && filter.fieldChild.length > 0) {
                            var valuesChild = await fieldChildFilter(filter)
                            var fetchedProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }, { "categoryFields.fieldChild": { $in: valuesChild } }] }).sort([["featured", "-1"], ["createdAt", "-1"]]).skip((pageNumber - 1) * paginate).limit(paginate);
                        }
                        //old
                        // if(filter.fieldChild && filter.fieldChild.length > 0) {
                        //     var fetchedProducts = await product.find({$and: [filters,{userId: ActiveuserId},{"categoryFields.fieldChild": {$all: filter.fieldChild}}]}).sort(sortOrder+sortBy).skip((pageNumber-1)*paginate).limit(paginate);
                        // }
                        else {
                            var fetchedProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }] }).sort(sortOrder + sortBy).skip((pageNumber - 1) * paginate).limit(paginate);
                        }
                    }
                    //"images isFree title rate currencyCode userId userName location createdAt updatedAt status viewers")
                    var users = await user.find({ status: "Active", $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });
                    fetchedProducts && fetchedProducts.forEach((p) => {
                        var pp = users && users.filter((u) => p.userId == u.id);
                        if (pp) {
                            approvedSellingProducts = approvedSellingProducts.concat(p);
                        }
                    });
                }
            }
            if (!filter && pageNumber) {
                ActiveUser = await user.find({ status: "Active", $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });
                ActiveuserId = ActiveUser && ActiveUser.map((item) => {
                    return item._id;
                });
                if (pageNumber === "all") {
                    var approvedSellingProducts = await product.find({ $and: [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }] });
                    //"images isFree title rate currencyCode userId userName location createdAt updatedAt status viewers");
                } else {
                    var approvedSellingProducts = [];
                    var fetchedProducts = await product.find({
                        $and:
                            [filters, { userId: ActiveuserId }, {categoryId: activeCategoryId }]
                    }).sort(sortOrder + sortBy).skip((pageNumber - 1) * paginate).limit(paginate);
                    //"images isFree title rate currencyCode userId userName location createdAt updatedAt status viewers")
                    var users = await user.find({ status: "Active", $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });
                    fetchedProducts && fetchedProducts.forEach((p) => {
                        var pp = users && users.filter((u) => p.userId == u.id);
                        if (pp) {
                            approvedSellingProducts = approvedSellingProducts.concat(p);
                        }
                    });
                }
            }
            //var products = await product.find(filters, "images isFree title rate currencyCode userId location createdAt").sort({sortBy: sortOrder}).skip((pageNumber-1)*paginate).limit(paginate);
            return updateFetchedProducts(pageNumber, filters, filter, data, approvedSellingProducts, "needMore"); // call the function to get customised products information
        },

        // api to get all product details
        getAllAdminProducts: async (root, { filter }, data) => {
            let { user, product, currentUser, req } = data;
            var filters = {};
            if (!!req.headers.authorization && !currentUser.adminUserId) {
                throw new AuthenticationError(errors.unauthorized);
            }
            // if (currentUser.adminUserId) {
                if (filter) {
                    filters.isDeleted = false;
                    ActiveUser = await user.find({ status: "Active" })
                    ActiveuserId = ActiveUser && ActiveUser.map((item) => {
                        return item._id;
                    });

                    var products = await product.aggregate([
                        {   
                          "$match" : {
                            "isDeleted": false,
                            // "userId": 10001
                          }
                        },
                        {   
                          "$lookup": {
                            "localField": "userId",
                            "from": "users",
                            "foreignField": "_id",
                            "as": "userData"
                          }
                        },
                        { "$unwind" : "$userData" },
                        { 
                          "$group" : {
                            "_id" : "$_id",
                            "id": { $first: "$_id" },
                            // "images": { $first: "$images" },
                            "language": { $first: "$language" },
                            "userId":  { $first: "$userId" },
                            "userName":  { $first: "$userData.userName" },   
                            "status": { $first: "$status" },
                            "sellingStatus": { $first: "$sellingStatus" },
                            "createdAt": { $first: "$createdAt" },
                            "isFree": { $first: "$isFree" },
                          }
                        },                        
                      ])
                }
            // }
            //"images isFree title rate currencyCode userId userName location createdAt updatedAt status viewers");
            //var products = await product.find(filters, "images isFree title rate currencyCode userId location createdAt").sort({sortBy: sortOrder}).skip((pageNumber-1)*paginate).limit(paginate);
            // return updateAdminFetchedProducts(data, products, "needMore"); // call the function to get customised products information
            return products
        },

        // get informations of roster users for chat list
        getRoster: async (root, { type }, params) => {
            let { chat, user, product, currentUser, req, bUser, message, currency, deleteChat } = params;
            if (params.currentUser.userId) {
            //     // var currentUser = { };
            // currentUser.userId = 10001;
            //     var allUsers = await user.find({ status: "Active" });
            //     var allProducts = await product.find({ status: "Approved" });
            //     var allBlocked = await bUser.find({});
            //     var allDeletechat = await deleteChat.find({});

            //     var currencies = await currency.find({ status: "Active" });
            //     var chatResult1 = await chat.find({ productuserId: currentUser.userId });
            //     var chatResult2 = await chat.find({ userId: currentUser.userId });
            //     var chatResult = chatResult1.concat(chatResult2);
            //     // var ch = chatResult1.concat(chatResult2);
            //     // p = ch.map( item => {
            //     //     return item.productId
            //     // })
            //     // pr = await product.find({_id:  p })          
            //     // prodResult = pr.map( item => {
            //     //     return item._id
            //     // })
            //     // ch1 = await chat.find({ productId: prodResult})
            //     // u = ch1.map( item => {
            //     //     return item.userId
            //     // })
            //     // us = await user.find({_id: u})
            //     // us2 = await user.find({status: "Active"})
            //     // us = await user.find({$and: [us1,us2]})
            //     // console.log("us",us)
            //     // userResult = us.map( item => {
            //     //      return item._id  
            //     // })                    
            //     // chatResult = await chat.find({userId: userResult})
            //     // chatResult = await chat.find({ productId: prodResult})
            //     // var chatResult = ch1.concat(ch2);
            //     var msg = await message.find({});
            //     // const readMessage = await message.find({$and: [{room : data.id}, {userId: {$ne: currentUser.userId}}]})

                ///
                return await commonRoster(params, type);
                ///

                // chatResult.forEach((cr) => {
                //     var newId;
                //     if (currentUser.userId == cr.productuserId) {
                //         newId = cr.userId;
                //     } else if (currentUser.userId == cr.userId) {
                //         newId = cr.productuserId;
                //     }
                //     var specUser = allUsers.find((au) => au.id == newId);
                //     var specProduct = allProducts.find((ap) => ap.id == cr.productId);

                //     if (specUser && specProduct) {
                //         cr.userName = specUser.userName;
                //         cr.userId = specUser.id;
                //         var IsBlocked = allBlocked.find((ab) => ab.userFrom == currentUser.userId && ab.userTo == specUser.id);
                //         var BlockedBy = allBlocked.find((ab) => ab.userTo == currentUser.userId && ab.userFrom == specUser.id);
                //         if (IsBlocked) {
                //             cr.isBlocked = true;
                //         }
                //         if (BlockedBy) {
                //             cr.blockedBy = true;
                //         }
                //         var DeleteChat = allDeletechat.find((ad) => ad.userFrom == currentUser.userId && ad.userTo == newId && ad.chatroomId == cr.id)
                //         if (DeleteChat) {
                //             cr.deleteChat = true;
                //         }
                //         cr.profileImage = specUser.profileImage ?
                //             (specUser.profileImage.indexOf("graph.facebook.com") >= 0 || specUser.profileImage.indexOf("googleusercontent.com") >= 0) ?
                //                 specUser.profileImage : (specUser.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(specUser._id)}/${specUser.profileImage}` : (specUser.imageSource === "cloud") ? specUser.profileImage : ""
                //             : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`;
                //         if (cr.productuserId == currentUser.userId) {
                //             cr.role = "seller";
                //         }
                //         else {
                //             cr.role = "buyer";
                //         }
                //         fName = specProduct.language.filter((f) => f.langCode === req.headers.lang);
                //         if (fName.length === 0) {
                //             fName = specProduct.language.filter((f) => f.langCode === "en");
                //         }
                //         fName.map((i) => {
                //             cr.productName = i.title;
                //         });

                //         var chosenCurrency = currencies.find(c => c.code == req.headers.currency);
                //         if (specProduct.currencyCode != req.headers.currency && specProduct.currencyCode != "") {
                //             var speCurr = currencies.find((c) => c.code == specProduct.currencyCode);
                //             productConversionRate= specProduct.rate && (specProduct.rate / speCurr.rate).toFixed(2);
                //             cr.rate = productConversionRate && (productConversionRate * chosenCurrency.rate).toFixed(2);
                //             cr.currencyCode = req.headers.currency;
                //             cr.currencySymbol = chosenCurrency.symbol;
                //             shippingConversionRate = specProduct.shippingRate && (specProduct.shippingRate / speCurr.rate).toFixed(2);
                //             cr.shippingRate = shippingConversionRate && (shippingConversionRate * chosenCurrency.rate).toFixed(2);  
                //         }
                //         else {
                //             cr.rate = (specProduct.rate).toFixed(2);
                //             cr.currencyCode = specProduct.currencyCode;
                //             var speCurr = currencies.find((c) => c.code == specProduct.currencyCode);
                //             if (speCurr) {
                //                 cr.currencySymbol = speCurr.symbol;
                //             }
                //             cr.shippingRate = specProduct.shippingRate && (specProduct.shippingRate).toFixed(2);
                //         }

                //         cr.sellingStatus = specProduct.sellingStatus === "SoldOut" ?
                //             !!specProduct.isFree ? "SoldOut" : "Soldout" : "";
                //         if (specProduct.images && specProduct.images.length) {
                //             if (specProduct.images[0] == "") {
                //                 cr.image = `${URL + req.headers.host}/fileStorage/static/defaultproduct.png`;
                //             }
                //             else {
                //                 cr.image = (specProduct.images[0].imageSource === "local") ? `${URL + req.headers.host}/fileStorage/uploads/products/${String(specProduct._id)}/${specProduct.images[0].image}` : (specProduct.images[0].imageSource === "cloud") ? specProduct.images[0].image : "";
                //             }
                //         }
                //         if(specProduct.images && specProduct.images.length == 0) {
                //             cr.image = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;                                
                //         }
                //         if(specProduct.isDeleted === true){
                //             cr.isDeleted = true;
                //         }
                //         if (cr.id) {
                //             cr.groupId = cr.id;
                //         }
                //         var m = msg.filter((a) => a.room == cr.id);
                //         message = m.map((item) => {
                //             return item.createdAt;
                //         });
                //         cr.lastseen = message[message.length - 1]
                //         if (cr.lastseen == undefined) {
                //             cr.lastseen = cr.createdAt
                //         }

                //         var rM = msg.filter((a) => a.room == cr.id && a.userId != currentUser.userId);
                //         readMessage = rM.map((item) => {
                //             return item.readMessage;
                //         });
                //         var filtered = readMessage.filter(function (el) {
                //             return el == false;
                //         });
                //         cr.unreadMessage = filtered.length;
                //     }
                // })
                // switch (type) {
                //     case "Selling":
                //         return chatResult.filter((cr) => cr.role === "seller");
                //     case "Buying":
                //         return chatResult.filter((cr) => cr.role === "buyer");
                //     case "Blocked":
                //         var pus = [];
                //         let blocked = chatResult.filter((cr) => !!cr.isBlocked);
                //         blocked.length && blocked.map((m) => !(pus.find(f => f.userId == m.userId)) && pus.push(m));
                //         return pus;
                //     default:
                //         const sorted = chatResult.sort((a, b) => {
                //             if ((a.lastseen && b.lastseen) != undefined) {
                //                 const aDate = a.lastseen;
                //                 const bDate = b.lastseen;
                //                 return bDate - aDate;
                //             }
                //             else if ((a.lastseen == undefined) && (b.lastseen != undefined)) {
                //                 const aDate = a.createdAt;
                //                 const bDate = b.lastseen;
                //                 return bDate - aDate;
                //             }
                //             else if ((b.lastseen == undefined) && (a.lastseen != undefined)) {
                //                 const aDate = a.lastseen;
                //                 const bDate = b.createdAt;
                //                 return bDate - aDate;
                //             }
                //             else if ((a.lastseen && b.lastseen) == undefined) {
                //                 const aDate = a.createdAt;
                //                 const bDate = b.createdAt;
                //                 return bDate - aDate;
                //             }
                //         })

                //         return sorted;
                // }
            }
            else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        }
    },

    Mutation: {
        updateProduct: async (root, { id, data }, { user, currency, filterCategory, bUser, currentUser, chat, product, req, category, mailtemp, site, featured, transaction }) => {
            var filter = {};
            var filters = {};
            var pageNumber = {};
            var categories = await category.find({});
            var siteData = await site.findOne();
            if (!currentUser.userId && !currentUser.adminUserId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            // else if (currentUser.userId) {
            //     var userData = await user.findOne({ _id: currentUser.userId });
            //     var verifiData = userData.verifications
            //     if(!verifiData.faceBook && !verifiData.google && !verifiData.email && !verifiData.apple) {
            //         throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._userNotVerified : language.en._userNotVerified);
            //     }
            // }
            
            else if (!!id) {
                // console.log("daaaaaaaaaa", data)
                const uid = await product.findOne({ _id: id, isDeleted: false });
                if ((uid.userId && currentUser.userId && currentUser.userId == uid.userId) || currentUser.adminUserId) {
                    var imgs = [];

                    if (data.title && !data.description) {
                        data.language = [{
                            langCode: "en",
                            title: data.title
                        }]
                    }
                    if (data.title && data.description) {
                        data.language = [{
                            langCode: "en",
                            title: data.title,
                            description: data.description
                        }]
                    }
                    // Checking language
                    if(data.language && data.language.length == 0) {
                        throw new ForbiddenError("Please fill the required fields");
                    }
                    else if(data.language && data.language.length > 0) {
                        data.language.map((i) => {
                            if (i.title == undefined || i.title == null) {
                                throw new ForbiddenError("Please fill the tilte field");
                            }
                        })
                    }
                    // Checking category mandatory fields
                    if(data.categoryId) {
                        var catData = categories && categories.find(i => i._id == data.categoryId);
                        if(catData && catData.fields && catData.fields.length > 0) {
                            var mandatoryFields = catData.fields.map((i) => {
                                if(!!i.isMandatory) {
                                    // console.log("iiiii", i)
                                    return i.isMandatory
                                }
                            })
                        }
                    }
                    if(mandatoryFields && mandatoryFields.length > 0) {
                        mandatoryFields.map((i) => {
                            if (data.categoryFields && data.categoryFields.length > 0) {
                                if (i != undefined || i != null) {
                                    // console.log("iiiii", i)
                                    var mandatory = data.categoryFields.find(f => f.fieldId == i)
                                    if(!mandatory || mandatory == undefined) {
                                        throw new ForbiddenError("Please fill the mandatory category fields");
                                    }
                                    // console.log("qwqwqwqwqw", qw)
                                }
                            }
                            // else {
                            //     throw new ForbiddenError("Please fill the mandatory category fields");
                            // }
                        })
                    }

                    // Checking shipping Rate
                    if(data.instantBuy == true) {
                        if(data.shippingRate == null || data.shippingRate == undefined) {
                            throw new ForbiddenError("Please fill the Shipping Rate");
                        }
                    }

                    //delete images from server
                    if (data && data.deleteImages && data.deleteImages.length && uid.images && uid.images.length) {

                        var delImgs = data.deleteImages.map((i) => {
                            if(i.includes("cloud")) {
                                return i
                            }
                            else {
                                var delName = i.split("/");
                                var fileName = delName[delName.length-1];
                                return fileName
                            }
                        })

                        delImgs && delImgs.forEach((dele) => {
                            if (fs.existsSync(`fileStorage/uploads/products/${id}/${dele}`)) {
                                fs.removeSync(`fileStorage/uploads/products/${id}/${dele}`);
                            }
                            else {
                                cloudinaryImageDelete(dele)
                            }
                        });
                        // data.deleteImages.forEach((del) => {
                            // var index = uid.images.indexOf(del);    // <-- Not supported in <IE9
                            // if (index !== -1) {
                            //     uid.images.splice(index, 1);
                            // }
                            var imgData = delImgs && uid && uid.images && uid.images.map((i) => {
                                if(delImgs.includes(i.image)) {
                                    delete i;
                                }
                                else {
                                    return i
                                }
                            })
                        // });
                        delete data.deleteImages;
                        var imgData = imgData && imgData.filter(f => f != undefined || f != null);
                        // console.log("uiddddd", imgData)
                        await product.findOneAndUpdate({ _id: id }, { $set: { images: imgData } });
                    }

                    //add images for already existing product - web services
                    if (data.images && data.images.length) {
                        imgs = data.images;
                        for (let i = 0; i < imgs.length; i++) {
                            // console.log("immm", i,)
                            const { stream, filename } = await imgs[i];
                            // var stt = createReadStream();
                            // console.log("stt", stt)
                            let ext = filename.split(".")[1];
                            // imgs[i] = fileName;
                            if(siteData.imageHost == "local") {
                                var fileName = `products_${new Date().getTime()}.${ext}`;
                                await storeUpload({ stream }, fileName, String(id), "products");
                                imgs[i] = {
                                    image: fileName,
                                    imageSource: "local"
                                }
                            }
                            else if(siteData.imageHost == "cloud") {
                                var response = await cloudinaryUpload({ stream }, "fileName", String(id), "products");
                                // fileData = await response && response.public_id.replace(`fileStorage/uploads/products/${String(id)}/`, "")+"."+response.format
                                fileData = await response && response.secure_url
                                imgs[i] = {
                                    image: fileData,
                                    imageSource: "cloud"
                                }
                            }
                        }
                        delete data.images;
                    }
                    //add images for already existing product - mobile services
                    else if (data.iosImages && data.iosImages.length) {
                        imgs = data.iosImages;
                        for (let i = 0; i < imgs.length; i++) {                            
                            if(siteData.imageHost == "local") {
                                if(imgs[i].includes("fakepath")) {
                                    const fileName = imgs[i].replace(/.*(\/|\\)/, "");
                                    imgs[i] = fileName;
                                }
                                // if (found.profileImage) {        
                                //     //delete old profile image while user tries to update new image
                                //     deleteImage(found.profileImage, found._id, "users");
                                // }
                                imgs[i] = {
                                    image: imageUpload(imgs[i], String(id), "products", "qwe"),
                                    imageSource: "local"
                                }                               
                            }
                            else if(siteData.imageHost == "cloud") {
                                var response = await cloudinaryUpload("stream", "fileName", String(id), "products", imgs[i], "ios");
                                // fileData = await response && response.public_id.replace(`fileStorage/uploads/products/${String(id)}/`, "")+"."+response.format
                                fileData = await response && response.secure_url
                                imgs[i] = {
                                    image: fileData,
                                    imageSource: "cloud"
                                }                                                              
                            }
                        }
                        delete data.iosImages;
                        //add images for already existing product - mobile services
                    } else if (data.mobileUploads && data.mobileUploads.length) {
                        data.mobileUploads.forEach((upload) => {
                            if (fs.existsSync(`fileStorage/uploads/products/${id}/${upload}`)) {
                                imgs.push(upload);
                            }
                        });
                        delete data.mobileUploads;
                    }
                    data.updatedAt = date();
                    if (data.sellingStatus === "SoldOut") data.sellingTimeStamp = date();
                    if (data.isFree) {
                        data.rate = 0;
                        data.currencyCode = "";
                        // data.shippingRate = 0;
                    }
                    //swap lat, lon to store values lon, lat format
                    if (data.location && data.location.lat_lon && data.location.lat_lon.length) {
                        var temp = data.location.lat_lon[0];
                        data.location.lat_lon[0] = data.location.lat_lon[1];
                        data.location.lat_lon[1] = temp;
                    }
                    // edit category type by Admin user

                    if (currentUser.adminUserId && data.status === "Rejected") {
                        productDetail = await product.findOne({ _id: id });
                        productUserDetail = await user.findOne({ _id: productDetail.userId });
                        var headermailtempDetail = await mailtemp.findOne({ title: "header" }, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({ title: "rejection-mail" });
                        var footermailtempDetail = await mailtemp.findOne({ title: "footer" }, "mailcontent")
                        let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                        var getDefault = await site.find({});
                        var sites = getDefault && getDefault.find((a) => a);
                        let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";
                        let link = `${URL + Site_Url}`;
                        let facebookLink = `${sites.fbLink}`;
                        let fbshow = "display:none";
                        if (facebookLink) {
                            fbshow = "";
                        }
                        let instagramlink = `${sites.instagramLink}`;
                        let instagramshow = "display:none";
                        if (instagramlink) {
                            instagramshow = "";
                        }
                        let twitterLink = `${sites.twLink}`;
                        let twittershow = "display:none";
                        if (twitterLink) {
                            twittershow = "";
                        }
                        let youtubeLink = `${sites.utubeLink}`;
                        let youtubeshow = "display:none";
                        if (youtubeLink) {
                            youtubeshow = "";
                        }
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{OOPS}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Oops : language.en._Oops).replace(/{{CANNOTPOST}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._cannotPost : language.en._cannotPost).replace(/{{REASONCANNOTPOST}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reasonCannotPost : language.en._reasonCannotPost).replace(/{{MOREITEMS}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._moreItems : language.en._moreItems).replace(/{{SELLSOMETHING}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._sellSomething : language.en._sellSomething) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
                        var mailAddr = productUserDetail.email;
                        let values = {
                            to: mailAddr,
                            html: etempdataDynamic,
                            req: req
                        };
                        sendMailAction.sendMail("rejectionMail", values, mailAddr, (callback) => {
                        })
                    }
                    //edit product values
                    if (data.images) {
                        delete data.images;
                    }

                    
                    const foundProductListed = await product.findOneAndUpdate({ _id: id }, { "$push": { "images": imgs }, $set: data }, { new: true });
                    let getDetails = [foundProductListed];
                    data.user = user;
                    data.currency = currency;
                    data.bUser = bUser;
                    data.currentUser = currentUser;
                    data.chat = chat;
                    data.product = product;
                    data.req = req;
                    data.category = category;
                    data.user = user;
                    data.mailtemp = mailtemp;
                    data.featured = featured;
                    data.transaction = transaction;
                    data.filterCategory = filterCategory;
                    data.site = site;
                    const foundProductArray = await updateFetchedProducts(pageNumber, filters, filter, data, getDetails, "needMore");
                    let foundProduct = foundProductArray[0]
                    if (!foundProduct) {
                        throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
                    }
                    //get customised image urls from found product
                    //URL + req.headers.host+"/fileStorage/uploads/products/"+String(foundProduct._id)+"/"+foundProduct.images[i].name;

                    /* if (foundProduct.images.length) {
                        for (var i=0; i<foundProduct.images.length; i++) {
                            //if (!foundProduct.images[i].url && foundProduct.images[i].name && foundProduct._id) {

                                foundProduct.images[i] =  `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(foundProduct._id)}/${foundProduct.images[i]}`
                            //}
                        }
                    } */
                    foundProduct.isNew = false; // flag to mention whether the product is new(true)/old(false)
                    var ci = (categories.find((cat) => cat.id == foundProduct.categoryId) || []);
                    foundProduct.type = ci.type; // add the category type to found product
                    foundProduct.category = ci.name; // add the category name to found product
                    if(currentUser.userId) {
                        userDetails = await user.findOne({ _id: currentUser.userId });
                        var userVer = ( userDetails.verifications && userDetails.verifications.faceBook == true || userDetails.verifications.google == true || userDetails.verifications.email == true || userDetails.verifications.apple == true ) ? true : false
                        foundProduct.isUserVerified = userVer
                        if(userVer != true) {
                            foundProduct.userVerifyMessage = ( typeof(language[req.headers.lang]) !== "undefined" ) ? language[req.headers.lang]._userNotVerified : language.en._userNotVerified
                        }
                    }
                    return foundProduct;
                } else {
                    throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
                }
            } else {
                // Admin users needs to provide userId & userName while creating products
                if (currentUser.adminUserId) {
                    if (!data.userId || !data.userName) {
                        throw new Error("User Information is needed");
                    }
                } else {
                    data.userId = currentUser.userId;
                    data.userName = currentUser.userName;
                }
                // timestap to update selling time
                if (data.sellingStatus === "SoldOut") {
                    data.sellingTimeStamp = date();
                }

                //swap lat, lon to store it in mongo db
                if (data.location && data.location.lat_lon && data.location.lat_lon.length) {
                    var temp = data.location.lat_lon[0];
                    data.location.lat_lon[0] = data.location.lat_lon[1];
                    data.location.lat_lon[1] = temp;
                }
                if (data.title && !data.description) {
                    data.language = [{
                        langCode: "en",
                        title: data.title
                    }]
                }
                if (data.title && data.description) {
                    data.language = [{
                        langCode: "en",
                        title: data.title,
                        description: data.description
                    }]
                }
                // Checking language
                if(data.language && data.language.length == 0) {
                    throw new ForbiddenError("Please fill the required fields");
                }
                else if(data.language && data.language.length > 0) {
                    data.language.map((i) => {
                        if (i.title == undefined || i.title == null) {
                            throw new ForbiddenError("Please fill the tilte field");
                        }
                    })
                }

                // Checking category mandatory fields
                if(data.categoryId) {
                    var catData = categories && categories.find(i => i._id == data.categoryId);
                    if(catData && catData.fields && catData.fields.length > 0) {
                        var mandatoryFields = catData.fields.map((i) => {
                            if(!!i.isMandatory) {
                                // console.log("iiiii", i)
                                return i.isMandatory
                            }
                        })
                    }
                }
                if(mandatoryFields && mandatoryFields.length > 0) {
                    mandatoryFields.map((i) => {
                        if (data.categoryFields && data.categoryFields.length > 0) {
                            if (i != undefined || i != null) {
                                // console.log("iiiii", i)
                                var mandatory = data.categoryFields.find(f => f.fieldId == i)
                                if(!mandatory || mandatory == undefined) {
                                    throw new ForbiddenError("Please fill the mandatory category fields");
                                }
                                // console.log("qwqwqwqwqw", qw)
                            }
                        }
                        // else {
                        //     throw new ForbiddenError("Please fill the mandatory category fields");
                        // }
                    })
                }

                // Checking shipping Rate
                if(data.instantBuy == true) {
                    if(data.shippingRate == null || data.shippingRate == undefined) {
                        throw new ForbiddenError("Please fill the Shipping Rate");
                    }
                }
                // create new product from given info
                const newProduct = await new product(data).save();

                var data1 = await JSON.parse(JSON.stringify(data));
                var fName = newProduct && newProduct.language && newProduct.language.filter((f) => f.langCode === req.headers.lang);
                if (fName.length === 0) {
                    var fName = newProduct && newProduct.language && newProduct.language.filter((f) => f.langCode === "en");
                }
                fName.map((i) => {
                    langTitle = i.title;
                });
                //store product images in the server and db with the specified path including product id - for web services
                if (data.images && data.images.length) {
                    // imgs = data1.images;
                    for (let i = 0; i < data.images.length; i++) {
                        // console.log("imagggggggg", data.images[i])
                        // const {  filename, createReadStream } = await data.images[i];
                        const { stream, filename } = await data.images[i];
                        let ext = filename.split(".")[1];
                        // var fileName = `product_${new Date().getTime()}.${ext}`;
                        // storeUpload({ stream }, fileName, String(newProduct._id), "products");
                        // data.images[i] = fileName;

                        if(siteData.imageHost == "local") {
                            var fileName = `products_${new Date().getTime()}.${ext}`;
                            await storeUpload( {stream} , fileName, String(newProduct._id), "products");
                            data1.images[i] = {
                                image: fileName,
                                imageSource: "local"
                            }
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(newProduct._id), "products");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/products/${String(newProduct._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data1.images[i] = {
                                image: fileData,
                                imageSource: "cloud"
                            }
                        }
                    }
                    // delete data1.images;
                }

                else if (data.iosImages && data.iosImages.length) {
                    imgs = data.iosImages;
                    for (let i = 0; i < imgs.length; i++) {                            
                        if(siteData.imageHost == "local") {
                            if(imgs[i].includes("fakepath")) {
                                const fileName = imgs[i].replace(/.*(\/|\\)/, "");
                                imgs[i] = fileName;
                            }                            
                            imgs[i] = {
                                image: await imageUpload(imgs[i], String(newProduct._id), "products", "qwe"),
                                imageSource: "local"
                            }                               
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload("stream", "fileName", String(newProduct._id), "products", imgs[i], "ios");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/products/${String(newProduct._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            imgs[i] = {
                                image: fileData,
                                imageSource: "cloud"
                            }                                                              
                        }
                    }
                    data1.images = imgs
                    delete data1.iosImages
                }
                //store product images in the server and db with the specified path including product id - for mobile servives
                if (data.mobileUploads && data.mobileUploads.length) {
                    var uploaded = [];
                    if (fs.existsSync(`fileStorage/temp/${currentUser.userId}`)) {
                        data.mobileUploads.forEach((upload) => {
                            if (fs.existsSync(`fileStorage/temp/${currentUser.userId}/${upload}`)) {
                                if (!fs.existsSync(`fileStorage/uploads/products/${String(newProduct._id)}`)) {
                                    fs.mkdirSync(`fileStorage/uploads/products/${String(newProduct._id)}`);
                                }
                                fs.createReadStream(`fileStorage/temp/${currentUser.userId}/${upload}`)
                                    .pipe(fs.createWriteStream(`fileStorage/uploads/products/${String(newProduct._id)}/${upload}`))
                                    .on("finish", () => {
                                        fs.removeSync(`fileStorage/temp/${currentUser.userId}/${upload}`);
                                    })
                                    .on("error", () => {
                                        console.log("error")
                                    })
                                uploaded.push(upload);
                            }
                        });
                        data.images = uploaded;
                    }
                    delete data.mobileUploads;
                }
                // store images name in db that already stored in server
                // const foundProduct = await product.findOneAndUpdate({ _id: newProduct._id }, {"$push": { "images": imgs }, $set: data1 }, { new: true });
                const foundProduct = await product.findOneAndUpdate({ _id: newProduct._id }, { $set: data1 }, { new: true });

                //get customised image urls from found product
                if (foundProduct.images.length) {
                    for (var i = 0; i < foundProduct.images.length; i++) {
                        foundProduct.images[i] = (foundProduct.images[i].imageSource === "local") ? URL + req.headers.host + "/fileStorage/uploads/products/" + String(foundProduct._id) + "/" + foundProduct.images[i].image : (foundProduct.images[i].imageSource === "cloud") ? foundProduct.images[i].image : "";
                    }
                }
                foundProduct.isNew = true; // flag to mention whether the product is new/old
                var ci = categories && (categories.find((cat) => cat.id == foundProduct.categoryId) || []);
                foundProduct.type = ci && ci.type; // add the category type to found product
                foundProduct.category = ci && ci.name; // add the category name to found product
                // console.log("admin console", foundProduct)

                if (currentUser.userId) {
                    userDetails = await user.findOne({ _id: currentUser.userId });
                    var userVer = ( userDetails.verifications && userDetails.verifications.faceBook == true || userDetails.verifications.google == true || userDetails.verifications.email == true || userDetails.verifications.apple == true ) ? true : false
                    foundProduct.isUserVerified = userVer
                    if(userVer != true) {
                        foundProduct.userVerifyMessage = ( typeof(language[req.headers.lang]) !== "undefined" ) ? language[req.headers.lang]._userNotVerified : language.en._userNotVerified
                    }

                    var headermailtempDetail = await mailtemp.findOne({ title: "header" }, "mailcontent")
                    var bodymailtempDetail = await mailtemp.findOne({ title: "congradulations-mail" });
                    var footermailtempDetail = await mailtemp.findOne({ title: "footer" }, "mailcontent")
                    let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                    productImg = (foundProduct.images[0].imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/products/${newProduct._id}/${data.images[0].image}` :(foundProduct.images[0].imageSource === "cloud") ? data.images[0].image : "";
                    var getDefault = await site.find({});
                    var sites = getDefault && getDefault.find((a) => a);
                    let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";
                    let link = `${URL + Site_Url}`;
                    let facebookLink = `${sites.fbLink}`;
                    let fbshow = "display:none";
                    if (facebookLink) {
                        fbshow = "";
                    }
                    let instagramlink = `${sites.instagramLink}`;
                    let instagramshow = "display:none";
                    if (instagramlink) {
                        instagramshow = "";
                    }
                    let twitterLink = `${sites.twLink}`;
                    let twittershow = "display:none";
                    if (twitterLink) {
                        twittershow = "";
                    }
                    let youtubeLink = `${sites.utubeLink}`;
                    let youtubeshow = "display:none";
                    if (youtubeLink) {
                        youtubeshow = "";
                    }
                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{PRODUCTNAME}}/g, langTitle).replace(/{{PRODUCTPRICE}}/g, newProduct.rate == 0 ? "Free" : newProduct.rate).replace(/{{PRODUCTCURRENCY}}/g, newProduct.currencyCode).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{PRODUCTIMG}}/g, productImg).replace(/{{LINK}}/g, link).replace(/{{YOUAREIN}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._YouAreIn : language.en._YouAreIn).replace(/{{CONGRATULATIONS}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Congratulations : language.en._Congratulations).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{SELLER}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._seller : language.en._seller).replace(/{{LISTINGPOSTED}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._listingPosted : language.en._listingPosted).replace(/{{POSTANOTHER}}/g, typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._postAnother : language.en._postAnother) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
                    var mailAddr = userDetails.email;
                    let values = {
                        to: mailAddr,
                        html: etempdataDynamic,
                        req: req
                    }
                    sendMailAction.sendMail("congradulationsMail", values, mailAddr, (callback) => {
                        //   console.log("cb", callback)
                    })
                }
                return foundProduct;
            }
        },
        //remove uploaded images from temporary path 
        discardImages: async (root, { toDiscard, userId }, { currentUser, req }) => {
            var id = currentUser.userId;
            if (id) {
                if (id == userId) {
                    toDiscard && toDiscard.forEach((disc) => {
                        if (fs.existsSync(disc)) {
                            fs.removeSync(disc);
                        }
                    });
                    return { result: "success" };
                } else {
                    throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
                }
            } else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
        // update selling status of the product either `forsale` or `soldout`
        updateSellingStatus: async (root, { id, sellingStatus }, { user, currentUser, product, chat, req }) => {
            const uid = await product.findOne({ _id: id, isDeleted: false });
            var userInfo = [];
            if (!currentUser.userId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else if (currentUser.userId == uid.userId) {
                const foundProduct = await product.findOneAndUpdate({ _id: id }, { $set: { sellingStatus, updatedAt: date(), sellingTimeStamp: date() } }, { new: true });
                if (!foundProduct) {
                    throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
                }
                if (sellingStatus == "SoldOut") {
                    var grpUserIds = await chat.find({ productId: id }, "userId");
                    var users = await user.find({}, "userName profileImage imageSource");
                    // getting group id"s of chatted users to avail rating option while changing status..
                    grpUserIds && grpUserIds.forEach((gid) => {
                        var find = users && users.find((u) => u.id == gid.userId);
                        find.profileImage = find.profileImage ?
                            (find.profileImage.indexOf("graph.facebook.com") >= 0 || find.profileImage.indexOf("googleusercontent.com") >= 0) ?
                                find.profileImage : (find.imageSource === "local") ? URL + req.headers.host + "/fileStorage/uploads/users/" + String(find.id) + "/" + find.profileImage : (find.imageSource === "cloud") ? find.profileImage : ""
                            : `${URL + req.headers.host}/fileStorage/static/default.png`;
                        userInfo.push(find);
                    });
                }
                return { status: sellingStatus, userInfo };
            } else {
                throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
            }
        },
        // delete product listing

        deleteProduct: async(root, {id}, {currentUser, product, chat, req}) => {                   
            const uid = await product.findOne({_id:id, isDeleted: false});
            if (!currentUser.userId && !currentUser.adminUserId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);            
            }
            else if (currentUser.userId == uid.userId || currentUser.adminUserId) { 
                // const foundProduct = await product.deleteOne({_id: id});
                if (!uid) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
                }
                del_prod = {
                    "images" : [],
                    "viewers" : [],
                    "isDeleted" : true,
                    "likedUsers" : [],
                    // "language" : [ 
                    //     {
                    //         "langCode" : "en",
                    //         "title" : "Deleted Product",
                    //     }
                    // ],
                    "categoryId" : null,
                    "location" : {},
                    // "isFree" : null,
                    // "rate" : null,
                    // "currencyCode" : null,
                    "categoryFields" : [],
                }                
                var delProd = await product.findOneAndUpdate({_id: id}, {$set: del_prod}, {new: true});
                if(delProd) {
                    deleteImageFolder(id, "products");
                    await deleteCloudImageFolder(id, "products");
                    return {result: "sucess"};
                }
                else {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
                }
            } 
            else {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
            }
        },
        
        // deleteProduct: async (root, { id }, { currentUser, product, chat, req }) => {
        //     const uid = await product.findOne({ _id: id, isDeleted: false });
        //     if (!currentUser.userId) {
        //         throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        //     }
        //     else if(!uid) {
        //         throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
        //     }
        //     else if (currentUser.userId == uid.userId) {
        //         var chatUser = await chat.count({ productId: id })
        //         if (chatUser > 0) {
        //             throw new UserInputError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._deleteLater : language.en._deleteLater);
        //         }
        //         // const foundProduct = await product.findOneAndUpdate({_id: id}, {$set: {isDeleted: true, deletedAt: date(), updatedAt: date()}}, {new: true});
        //         const foundProduct = await product.deleteOne({ _id: id });
        //         if (!foundProduct) {
        //             throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
        //         }
        //         return { result: "sucess" };
        //     } else {
        //         throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
        //     }
        // },
        //update favourited products by users
        likesUpdate: async (root, { id }, { user, currentUser, product, req }) => {
            var { userId } = currentUser;
            const uid = await product.findOne({ _id: id, isDeleted: false }, (err, res) => { return res; }, { new: true });
            if (!userId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else if (!uid) {
                throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
            }
            else if (userId && uid.userId && userId != uid.userId) {
                if (!!uid.likedUsers.includes(parseInt(userId))) {
                    product.update({ _id: id }, { "$pull": { "likedUsers": parseInt(userId) } })
                        .then(() => {
                            user.update({ _id: userId }, { "$pull": { "favourites": id } }).exec()
                        });
                    return { result: "removed" };
                } else {
                    product.update({ _id: id }, { "$push": { "likedUsers": parseInt(userId) } })
                        .then(() => {
                            user.update({ _id: userId }, { "$push": { "favourites": id } }).exec()
                        });
                    return { result: "inserted" };
                }
            } else {
                throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._noPermission : language.en._noPermission);
            }
        },
        // update viewers count based on product viewed by users
        viewersUpdate: async (root, { id }, { currentUser, product, req }) => {
            var { userId } = currentUser;
            var found, result;
            if (!userId) {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            var fetchedproduct = await product.findOne({ _id: id, isDeleted: false });
            if (!fetchedproduct) {
                throw new ForbiddenError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
            }
            else if (currentUser && userId != fetchedproduct.userId) {
                if (!fetchedproduct.viewers.length) {
                    result = await product.findOneAndUpdate({ _id: id }, { "$push": { "viewers": userId } }, { new: true });
                }
                else if (fetchedproduct.viewers.length) {
                    fetchedproduct.viewers.forEach(function (view) {
                        if (userId == view) { return found = true; }
                    });
                    result = !found ?
                        await product.findOneAndUpdate({ _id: id }, { "$push": { "viewers": userId } }, { new: true })
                        : await product.findOne({ _id: id });
                }
            } else {
                result = await product.findOne({ _id: id });
            }
            return result.viewers && { result: result.viewers.length };
        },
        // create chat group when a user interested in any product
        updateChatGroup: async (root, { data }, { chat, currentUser, product, user, req, currency }) => {
            if (currentUser.userId) {
                data.userId = currentUser.userId;
                var productUser = await product.findOne({ _id: data.productId }, "userId");
                data.productUser = productUser ? productUser.userId : "";
                var result = await new chat(data).save();
                var userInfo = await user.findOne({ _id: data.productUser });
                var productInfo = await product.findOne({ _id: data.productId });
                var currencyInfo = await currency.findOne({ code: productInfo.currencyCode });
                if (result.id) {
                    var rosterInfo = {
                        userId: data.productUser,
                        groupId: data.groupId,
                        groupName: data.groupName,
                        userName: userInfo.userName,
                        imageUrl: productInfo && productInfo.images && productInfo.images.length ?
                        (productInfo.images[i].imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0].image}` : (productInfo.images[i].imageSource === "cloud") ? productInfo.images[0].image : "" : "",
                        productName: productInfo && productInfo.title,
                        profileUrl: userInfo && userInfo.profileImage ? (userInfo.profileImage.indexOf("graph.facebook.com") >= 0 || userInfo.profileImage.indexOf("googleusercontent.com") >= 0) ?
                            userInfo.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userInfo._id)}/${userInfo.profileImage}`
                            : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`,
                        sellingStatus: productInfo.sellingStatus === "SoldOut" ?
                            !!productInfo.isFree ? "Given away" : "Soldout" : "",
                        productId: data.productId,
                        currencyCode: !productInfo.isFree ? productInfo.currencyCode : "",
                        currencySymbol: !productInfo.isFree ? currencyInfo.symbol : "",
                        rate: !productInfo.isFree && productInfo.rate
                    }
                    return rosterInfo;
                }
                //} else {
                //     data.userId = 10016;
                //     var productUser = await product.findOne({_id: data.productId}, "userId");
                //     data.productUser = productUser ? productUser.userId : "";
                //     var result = await new chat(data).save();
                //     var userInfo = await user.findOne({_id: data.productUser});
                //     var productInfo = await product.findOne({_id: data.productId});
                //     var currencyInfo = await currency.findOne({code: productInfo.currencyCode});
                //     if (result.id) {
                //         var rosterInfo = {
                //             userId: data.productUser,
                //             groupId: data.groupId,
                //             groupName: data.groupName,
                //             userName: userInfo._id,
                //             imageUrl: productInfo.images && productInfo.images.length ?
                //             `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0]}` : "",
                //             productName: productInfo.title,
                //             profileUrl: userInfo.profileImage ? (userInfo.profileImage.indexOf("graph.facebook.com") >=0 || userInfo.profileImage.indexOf("googleusercontent.com") >=0) ? 
                //             userInfo.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userInfo._id)}/${userInfo.profileImage}`
                //             : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`,
                //             sellingStatus: productInfo.sellingStatus == "SoldOut" ? 
                //             !!productInfo.isFree ? "Given away" : "Soldout" : "",
                //             productId: data.productId,
                //             currencyCode: !productInfo.isFree ? productInfo.currencyCode : "",
                //             currencySymbol: !productInfo.isFree ? currencyInfo.symbol : "",
                //             rate: !productInfo.isFree  && productInfo.rate
                //         }
                //         return rosterInfo;
                // }
            } else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        }
    }
};

module.exports = resolvers;




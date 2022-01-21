var bcrypt = require("bcrypt");
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
var fs = require("fs-extra");
var path = require("path");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {dateAdd, date, imageUpload, findUser, deleteImage, socialLogin, sendToken, updateFetchedProducts, typeConfig, createToken, documentUpload, iosImageUpload, cloudinaryUpload, storeUpload, cloudinaryImageDelete} = require("../../handler");
const sendMailAction = require("../../mailtemp");
const {URL, Site_Url, env} = process.env;
var Stripe = require("stripe");
const getSymbolFromCurrency = require('currency-symbol-map')

const paginate = 10;
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const resolvers = {
    Query: {
        // get all registered users detail
        getAllUsers: async (root, args, {currentUser, user}) => {
            if(currentUser.adminUserId) {
                const Users = await user.find({});
                return Users;
            } else {
            throw new AuthenticationError(errors.unauthorized);
            }
        },
        // get specific user details by id
        getUserDetails: async (root, {id, pageNumber, type}, params) => {
            var filter = {};
            var filters = {};
            const {user,currentUser, product, req, review, bUser, instantBuy, currency, site} = params;            
            var userId;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            if (id) {
                var reviews = await review.find({userTo: id}, "ratings");
                var averageRating = 0;
                reviews.forEach((r) => (averageRating += r.ratings)); // average review rating of a user

                // get user details from db
                var foundUser = currentUser.userId ? id == currentUser.userId
                ? await user.findOne({_id: currentUser.userId})
                : await user.findOne({_id: id}, "_id location profileImage userName bio email status updatedAt createdAt buyerShippingAddress payOutMethod imageSource password")
                : await user.findOne({_id: id}, "_id location profileImage userName bio email status updatedAt createdAt buyerShippingAddress payOutMethod imageSource password");
                // check whether the found user blocked by current user in the condition `id != currentUser.userId`
                if (currentUser.userId && id != currentUser.userId) {
                    var foundBlocked = await bUser.findOne({userFrom: currentUser.userId, userTo: id});
                    if (foundBlocked) {
                        foundUser.isBlocked = !!foundBlocked.id;
                    }
                    else {
                        foundUser.isBlocked = false;
                    }
                }
            }
            if (foundUser) {
                // console.log("founnnnn", foundUser.password)
                foundUser.profileImage = foundUser.profileImage ? (foundUser.profileImage.indexOf("graph.facebook.com") >=0 || foundUser.profileImage.indexOf("googleusercontent.com") >=0) ? 
                foundUser.profileImage : (foundUser.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(foundUser._id)}/${foundUser.profileImage}` : (foundUser.imageSource === "cloud") ? foundUser.profileImage : "" : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`;
                foundUser.userRating = reviews.length ? averageRating/reviews.length : 0;
                if(foundUser.password != null && foundUser.password != undefined) {
                    foundUser.passwordGiven = true
                }
                else {
                    foundUser.passwordGiven = false
                }
            }
            var foundProducts = await product.find({"userId": id, "isDeleted": false});
            if (!!foundUser) {
                var data = {};
                var users;
                var favourites = (await user.findOne({_id: id})) ; 
                if (!!foundProducts && !type) {
                    // get all products under `forsale`, `soldout`, `favourites` & `user reviews`
                    data.ForSale = await product.find({userId: id, isDeleted: false, status: "Approved" ,sellingStatus: "ForSale"});
                    data.SoldOut = await product.find({userId: id, isDeleted: false,  status: "Approved" ,sellingStatus: "SoldOut"});
                    data.review = await review.find({userTo: id}).sort("-createdAt");
                    if (data.review && data.review.length) {
                        users = await user.find({}, "userName profileImage imageSource");
                        data.review && data.review.forEach((gid) => {
                            if (gid.updatedAt) {
                                gid.timeAgo = dateAdd(gid.updatedAt, "", req.headers.lang);
                            }
                            var find = users && users.find((u) => u.id == gid.userFrom);
                            var to = users && users.find((u) => u.id == gid.userTo);
                            gid.imageUrl = find && find.profileImage ? (find.profileImage.indexOf("graph.facebook.com") >=0 || find.profileImage.indexOf("googleusercontent.com") >=0) ? 
                            find.profileImage : (find.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${gid.userFrom}/${find.profileImage}` : (find.imageSource === "cloud") ? find.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            gid.fromName = find && find.userName;
                            //gid.toName = (users.find((u) => u.id = id) || {}).userName;
                            gid.toName = to && to.userName;  // to.userName alone  
                        });
                    }
                    if (currentUser.userId && id == currentUser.userId) {
                        data.favourites = await product.find({"_id": {$in:favourites.favourites} , status: "Approved","isDeleted": false });
                    }
                } else if(!!foundProducts && type && pageNumber) {
                    // get type values w.r.t types..
                    var typeVal = typeConfig.filter((ty) => {return ty.key == type})[0].value;
                    // get all the products favourited by the current user
                    if (typeVal == "favourites" && currentUser && id == currentUser.userId) {
                        data["favourites"] = await product.find({"_id": {$in:favourites.favourites},  status: "Approved", "isDeleted": false}).skip((pageNumber-1)*paginate).limit(paginate);                                           

                    }
                    // get all user reviews for current user
                    else if (typeVal === "review") {
                        data["review"] = await review.find({userTo: id}).sort("-createdAt").skip((pageNumber-1)*paginate).limit(paginate);
                        if (data.review && data.review.length) {
                            users = await user.find({}, "userName profileImage imageSource");
                            data.review.forEach((gid) => {
                                if (gid.updatedAt) {
                                    gid.timeAgo = dateAdd(gid.updatedAt, "", req.headers.lang);
                                }
                                var find = users.find((u) => u.id == gid.userFrom);
                                var to = users.find((u) => u.id == gid.userTo);                                
                                gid.imageUrl = find && find.profileImage ? (find.profileImage.indexOf("graph.facebook.com") >=0 || find.profileImage.indexOf("googleusercontent.com") >=0) ? 
                                find.profileImage : (find.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${gid.userFrom}/${find.profileImage}` : (find.imageSource === "cloud") ? find.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;                   
                                gid.fromName = find && find.userName;
                                //gid.toName = (users.find((u) => u.id = id) || {}).userName;
                                gid.toName = to && to.userName;  // to.userName alone  
                            });
                        }
                    }
                    // get products under `forsale`
                    else if (typeVal === "ForSale" && id) {
                        data[typeVal] = typeVal && await product.find({userId: id, isDeleted: false, status: "Approved", sellingStatus: `${typeVal}`}).skip((pageNumber-1)*paginate).limit(paginate);
                    }
                    // get products under "SoldOut"
                    else if (typeVal === "SoldOut"&& id) {
                        data[typeVal] = typeVal && await product.find({userId: id, isDeleted: false, status: "Approved", sellingStatus: `${typeVal}`}).skip((pageNumber-1)*paginate).limit(paginate);
                    }
                }             
                // else if(type) {
                    if ( currentUser && id == currentUser.userId) {
                        var allProducts = await product.find();
                        // console.log("paaaaaa", pageNumber)
                        if(pageNumber) {
                            orderDetails = await instantBuy.find({buyerUserId: currentUser.userId}).sort("-_id").skip((pageNumber-1)*paginate).limit(paginate);
                        }
                        else {
                            orderDetails = await instantBuy.find({buyerUserId: currentUser.userId}).sort("-_id")
                        }
                        // currencyDetails = await currency.findOne({code: "USD"});
                        orders = orderDetails && orderDetails.map(async (i) => {
                            const orderProductData = allProducts && allProducts.find(a => a._id == i.productId)
                            if(orderProductData && orderProductData.images.length == 0) {
                                i.orderDetails.productImage = `${URL + req.headers.host}/fileStorage/static/defaultproduct.png`;
                            }
                            else {
                                i.orderDetails.productImage = orderProductData && orderProductData.images && orderProductData.images.length > 0 && orderProductData.images[0].imageSource && (orderProductData.images[0].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/products/${String(i.productId)}/${orderProductData.images[0].image}` : (orderProductData.images[0].imageSource === "cloud") ? orderProductData.images[0].image : "";
                            }
                            i.priceDetails = [];
                            ///
                            var productCurrentRate = await currency.findOne({code: i.orderDetails.currency})
                            var chosenCurrency = await currency.findOne({code: req.headers.currency});
                            i.orderDetails["currencySymbol"] = chosenCurrency && chosenCurrency.symbol
                            if (i.orderDetails.currency != req.headers.currency && i.orderDetails.currencyCode != "") {
                                if(orderProductData && orderProductData.currencyCode != req.headers.currency){
                                    productConversionRate = i.orderDetails.productFee && productCurrentRate && (i.orderDetails.productFee / productCurrentRate.rate).toFixed(2);
                                    i.orderDetails.productFee = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);
                                    shippingConversionRate = i.orderDetails.shippingRate && productCurrentRate && (i.orderDetails.shippingRate / productCurrentRate.rate).toFixed(2);
                                    i.orderDetails.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate).toFixed(2);   
                                }
                                else {
                                    i.orderDetails.productFee = orderProductData && orderProductData.rate && orderProductData.rate.toFixed(2);
                                    i.orderDetails.shippingRate = orderProductData && orderProductData.shippingRate && orderProductData.shippingRate.toFixed(2);   
                                }
                                
                                var serviceFeeBuyerRate = i.orderDetails.serviceFeeBuyerRate && productCurrentRate && (i.orderDetails.serviceFeeBuyerRate / productCurrentRate.rate).toFixed(2);
                                i.orderDetails.serviceFeeBuyerRate = serviceFeeBuyerRate && chosenCurrency && (serviceFeeBuyerRate * chosenCurrency.rate).toFixed(2);          

                                totalFeeConversionRate = i.orderDetails.totalFee && productCurrentRate && (i.orderDetails.totalFee / productCurrentRate.rate).toFixed(2);
                                i.orderDetails.totalFee = totalFeeConversionRate && chosenCurrency && (totalFeeConversionRate * chosenCurrency.rate).toFixed(2);
                            }
                            ///                           
                            if (i.orderDetails.serviceFeeBuyerRate && i.orderDetails.serviceFeeBuyerRate != 0) {
                                priceDate = [{
                                    key: "productFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ProductPrice : language.en._ProductPrice),
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.productFee.toFixed(2)}`
                                },
                                {
                                    key: "shippingRate",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ShippingPrice : language.en._ShippingPrice),
                                    value: i.orderDetails.shippingRate > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.shippingRate.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                },
                                {
                                    key: "serviceFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ServiceFee : language.en._ServiceFee),
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + Number(i.orderDetails.serviceFeeBuyerRate).toFixed(2)}`
                                },
                                {
                                    key: "totalFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._TotalPrice : language.en._TotalPrice),
                                    value: (i.orderDetails.totalFee > 0) ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.totalFee.toFixed(2) }` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                }]
                            }
                            else {
                                priceDate = [{
                                    key: "productFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ProductPrice : language.en._ProductPrice),
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.productFee.toFixed(2)}`
                                },
                                {
                                    key: "shippingRate",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ShippingPrice : language.en._ShippingPrice),                                    
                                    value: i.orderDetails.shippingRate > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.shippingRate.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                },
                                {
                                    key: "totalFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._TotalPrice : language.en._TotalPrice),                                    
                                    value: (i.orderDetails.totalFee > 0)  ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.totalFee.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                }]
                            }
                            i.priceDetails = priceDate
                            var sellerUser = users && users.find((u) => u.id == i.sellerUserId);
                            i.sellerUserName = sellerUser && sellerUser.userName
                            i.sellerImage = sellerUser && sellerUser.profileImage ? (sellerUser.profileImage.indexOf("graph.facebook.com") >=0 || sellerUser.profileImage.indexOf("googleusercontent.com") >=0) ? sellerUser.profileImage : (sellerUser.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${i.sellerUserId}/${sellerUser.profileImage}` : (sellerUser.imageSource === "cloud") ? sellerUser.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            i.fromName = sellerUser && sellerUser.userName
                            i.imageUrl = sellerUser && sellerUser.profileImage ? (sellerUser.profileImage.indexOf("graph.facebook.com") >=0 || sellerUser.profileImage.indexOf("googleusercontent.com") >=0) ? sellerUser.profileImage : (sellerUser.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${i.sellerUserId}/${sellerUser.profileImage}` : (sellerUser.imageSource === "cloud") ? sellerUser.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            i.userFrom = i.sellerUserId
                            // i.status = typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang][`_${i.status}`] : language.en[`_${i.status}`]
                            // console.log("iiiiii",i.orderDetails.imageSource,  i.orderDetails.productImage)                           
                            return i 
                        })
                        data["myOrders"] = orders

                        if(pageNumber) {
                            salesDetails = await instantBuy.find({sellerUserId: currentUser.userId}).sort("-_id").skip((pageNumber-1)*paginate).limit(paginate);
                        }
                        else {
                            salesDetails = await instantBuy.find({sellerUserId: currentUser.userId}).sort("-_id")
                        }
                        sales = salesDetails && salesDetails.map(async (i) => { 
                            const orderProductData = allProducts && allProducts.find(a => a._id == i.productId)
                            if(orderProductData && orderProductData.images.length == 0) {
                                i.orderDetails.productImage = `${URL + req.headers.host}/fileStorage/static/defaultproduct.png`;
                            }
                            else {
                                i.orderDetails.productImage = orderProductData && orderProductData.images && orderProductData.images.length > 0 && orderProductData.images[0].imageSource && (orderProductData.images[0].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/products/${String(i.productId)}/${orderProductData.images[0].image}` : (orderProductData.images[0].imageSource === "cloud") ? orderProductData.images[0].image : "";
                            }
                            // i.orderDetails["currencySymbol"] = currencyDetails.symbol
                            i.priceDetails = [];
                            ///
                            var productCurrentRate = await currency.findOne({code: i.orderDetails.currency})
                            var chosenCurrency = await currency.findOne({code: req.headers.currency});
                            i.orderDetails["currencySymbol"] = chosenCurrency && chosenCurrency.symbol
                            if (i.orderDetails.currency != req.headers.currency && i.orderDetails.currencyCode != "") {
                                if(orderProductData && orderProductData.currencyCode != req.headers.currency){
                                    productConversionRate = i.orderDetails.productFee && productCurrentRate && (i.orderDetails.productFee / productCurrentRate.rate).toFixed(2);
                                    i.orderDetails.productFee = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);
                                    shippingConversionRate = i.orderDetails.shippingRate && productCurrentRate && (i.orderDetails.shippingRate / productCurrentRate.rate).toFixed(2);
                                    i.orderDetails.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate).toFixed(2);   
                                }
                                else {
                                    i.orderDetails.productFee = orderProductData && orderProductData.rate && orderProductData.rate.toFixed(2);
                                    i.orderDetails.shippingRate = orderProductData && orderProductData.shippingRate && orderProductData.shippingRate.toFixed(2);   
                                }
                                
                                var serviceFeeBuyerRate = i.orderDetails.serviceFeeBuyerRate && productCurrentRate && (i.orderDetails.serviceFeeBuyerRate / productCurrentRate.rate).toFixed(2);
                                i.orderDetails.serviceFeeBuyerRate = serviceFeeBuyerRate && chosenCurrency && (serviceFeeBuyerRate * chosenCurrency.rate).toFixed(2);          

                                totalFeeConversionRate = i.orderDetails.totalFee && productCurrentRate && (i.orderDetails.totalFee / productCurrentRate.rate).toFixed(2);
                                i.orderDetails.totalFee = totalFeeConversionRate && chosenCurrency && (totalFeeConversionRate * chosenCurrency.rate).toFixed(2);
                            }
                            ///
                            if (i.orderDetails.serviceFeeBuyerRate && i.orderDetails.serviceFeeBuyerRate != 0) {
                                priceDate = [{
                                    key: "productFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ProductPrice : language.en._ProductPrice),
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.productFee.toFixed(2)}`
                                },
                                {
                                    key: "shippingRate",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ShippingPrice : language.en._ShippingPrice),                                    
                                    value: i.orderDetails.shippingRate > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.shippingRate.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                },
                                {
                                    key: "serviceFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ServiceFee : language.en._ServiceFee),                                    
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + Number(i.orderDetails.serviceFeeBuyerRate).toFixed(2)}`
                                },
                                {
                                    key: "totalFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._TotalPrice : language.en._TotalPrice),                                    
                                    value: (i.orderDetails.totalFee) > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.totalFee.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                }]
                            }
                            else {
                                priceDate = [{
                                    key: "productFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ProductPrice : language.en._ProductPrice),                                
                                    value: `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.productFee.toFixed(2)}`
                                },
                                {
                                    key: "shippingRate",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ShippingPrice : language.en._ShippingPrice),                                    
                                    value: i.orderDetails.shippingRate > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.shippingRate.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                },
                                {
                                    key: "totalFee",
                                    title: (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._TotalPrice : language.en._TotalPrice),                                    
                                    value:(i.orderDetails.totalFee) > 0 ? `${getSymbolFromCurrency(req.headers.currency) + " " + i.orderDetails.totalFee.toFixed(2)}` : (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Free : language.en._Free)
                                }]
                            }
                            i.priceDetails = priceDate
                            var buyerUser = users && users.find((u) => u.id == i.buyerUserId);
                            i.buyerUserName = buyerUser && buyerUser.userName
                            i.buyerImage = buyerUser && buyerUser.profileImage ? (buyerUser.profileImage.indexOf("graph.facebook.com") >=0 || buyerUser.profileImage.indexOf("googleusercontent.com") >=0) ? buyerUser.profileImage : (buyerUser.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${i.buyerUserId}/${buyerUser.profileImage}` : (buyerUser.imageSource === "cloud") ? buyerUser.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            i.fromName = buyerUser && buyerUser.userName
                            i.imageUrl = buyerUser && buyerUser.profileImage ? (buyerUser.profileImage.indexOf("graph.facebook.com") >=0 || buyerUser.profileImage.indexOf("googleusercontent.com") >=0) ? buyerUser.profileImage : (buyerUser.imageSource === "local") ? `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${i.buyerUserId}/${buyerUser.profileImage}` : (buyerUser.imageSource === "cloud") ? buyerUser.profileImage : "" : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            i.userFrom = i.buyerUserId
                            // i.status = typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang][`_${i.status}`] : language.en[`_${i.status}`]                           
                            return i 
                        })
                        data["mySales"] = sales
                    }
                // }
                // Mapping all products under `forsale`, `soldout`, `favourites` & users `reviews` into single object w.r.t keys
                Object.keys(data).forEach(function(key) {                  
                    if (key !== "review" && key !== "myOrders" && key !== "mySales") {
                        data[key] = updateFetchedProducts(pageNumber, filters, filter, params, data[key],"needMore");
                    }
                });
                siteDetails = await site.findOne();
                data["hideOrderCancelStatus"] = siteDetails.hideOrderCancelStatus

                return {...data, foundUser};
            }
        }
    },
    Mutation: {

        // register new user
        signup : async (root, { data }, {user,req, site, currency,mailtemp, currentUser}) => {
                data.email = data.email.toLowerCase();         
                if (!REGEX.test(data.email)) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
                }
                const foundUser =  await user.findOne({email: data.email});
                if (foundUser) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._alreadyExists : language.en._alreadyExists);
                }
                data.EmailExpires = Date.now() + 86400000; // 24 hour
                const newUser = await new user(data).save();
                //await user.findOneAndUpdate({_id: newUser._id});
                let result = findUser(newUser, "", {headers: req.headers, site, currency}); // call the function to get the expected output                
                if(!("type" in data)){
                    if (req.session && !req.headers.channel && !req.session.role) {
                        // update session values to use througout the session exists
                        req.session.userId = newUser.id;
                        req.session.role = newUser.role;
                        req.session.userName = newUser.userName;
                    }
                }
                // const token = createToken(newUser, process.env.JWT_SECRET, "1d")

                const obj = { id: newUser._id, email: newUser.email } 
                const encrypt = Buffer.from(JSON.stringify(obj)).toString('base64')  
                var confirmLink = `${URL + Site_Url}/?pop=confirm-mail&id=${encrypt}`
                var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                var bodymailtempDetail = await mailtemp.findOne({title: "confirmation-mail"});  
                var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
                let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
                var getDefault = await site.find({});
                var sites = getDefault && getDefault.find((a) => a);
                let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";
                let link = `${URL + Site_Url}`;
                let facebookLink = `${sites.fbLink }`;
                let fbshow = "display:none";
                if(facebookLink){
                    fbshow = "";     
                }                   
                let instagramlink = `${sites.instagramLink}`;
                let instagramshow = "display:none";
                if(instagramlink){
                    instagramshow = "";  
                }                     
                let twitterLink = `${sites.twLink}`;
                let twittershow = "display:none";
                if(twitterLink){
                    twittershow = "";       
                }  
                let youtubeLink = `${sites.utubeLink}`;
                let youtubeshow = "display:none";
                if(youtubeLink){
                    youtubeshow = "";       
                }                 
                var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, newUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{CONFIRMLINK}}/g, confirmLink).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{WELCOME}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Welcome : language.en._Welcome).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{confirmBtn}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._confirmMailBtn : language.en._confirmMailBtn) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
                var mailAddr = newUser.email;
                let values = {
                     to: mailAddr,    // email 
                     html: etempdataDynamic,
                     req: req
                 };
                 sendMailAction.sendMail("confirmationMail",values, mailAddr, (callback) => {
                //   console.log("cb", callback)
                 });
                return result;
        },

        verifyEmail: async (root, {code}, {user, req, site, currency, mailtemp}) => {            
            if(code && code != "" || code != undefined) {
                const codeData = Buffer.from(code, 'base64').toString();
                try {
                    var temp = JSON.parse(codeData)
                } catch (e) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidUrl : language.en._invalidUrl);
                }                
                if(temp && temp.id && temp.email) {
                    var foundNewUser = await user.findOne({_id: temp.id, email: temp.email});
                    if(foundNewUser && foundNewUser.verifications.email == true) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._alreadyMailVerified : language.en._alreadyMailVerified);
                    }
                    else if (foundNewUser && new Date(foundNewUser.EmailExpires).getTime() < Date.now()) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._expired : language.en._expired);
                    }                    
                    else if(foundNewUser && foundNewUser.verifications.email !== true) {
                        var foundUser = await user.findOneAndUpdate({_id: temp.id}, {$set: {"verifications.email": true, status: "Active"}});
                    }
                    else {
                        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                    }
                }
                else {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidUrl : language.en._invalidUrl);
                }                
                return true;
            }                                                
        },

        ResendverifyEmailLink: async (root, {code}, {user, req, site, currency, mailtemp, currentUser}) => {
            if(currentUser.userId) {
                var newUser = await user.findOne({ _id: currentUser.userId});
                if (newUser){
                    var userData = await user.findOne({ _id: currentUser.userId, $or: [{"verifications.email": true}, {"verifications.faceBook": true}, {"verifications.google": true}, {"verifications.apple": true}] });                
                    if(userData) { 
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._alreadyMailVerified : language.en._alreadyMailVerified);
                    } 
                    else {
                        EmailExpires = Date.now() + 86400000; // 24 hour
                        await user.findOneAndUpdate({_id: currentUser.userId}, {$set: {"EmailExpires": EmailExpires}});
                        const obj = { id: newUser._id, email: newUser.email } 
                        const encrypt = Buffer.from(JSON.stringify(obj)).toString('base64')  
                        var confirmLink = `${URL + Site_Url}/?pop=confirm-mail&id=${encrypt}`
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "confirmation-mail"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
                        let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
                        var getDefault = await site.find({});
                        var sites = getDefault && getDefault.find((a) => a);
                        let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";
                        let link = `${URL + Site_Url}`;
                        let facebookLink = `${sites.fbLink }`;
                        let fbshow = "display:none";
                        if(facebookLink){
                            fbshow = "";     
                        }                   
                        let instagramlink = `${sites.instagramLink}`;
                        let instagramshow = "display:none";
                        if(instagramlink){
                            instagramshow = "";  
                        }                     
                        let twitterLink = `${sites.twLink}`;
                        let twittershow = "display:none";
                        if(twitterLink){
                            twittershow = "";       
                        }  
                        let youtubeLink = `${sites.utubeLink}`;
                        let youtubeshow = "display:none";
                        if(youtubeLink){
                            youtubeshow = "";       
                        }                 
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, newUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{CONFIRMLINK}}/g, confirmLink).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{WELCOME}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Welcome : language.en._Welcome).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{confirmBtn}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._confirmMailBtn : language.en._confirmMailBtn) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
                        var mailAddr = newUser.email;
                        let values = {
                             to: mailAddr,    // email 
                             html: etempdataDynamic,
                             req: req
                         };
                         sendMailAction.sendMail("confirmationMail",values, mailAddr, (callback) => {
                        //   console.log("cb", callback)
                         });                         
                        return true
                    }
                }
                else {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);                    
                }                
            }
            else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },        

        // login with social media credentials like facebook, google...
        socialLogin: async (root, {data}, {user, req, site, currency}) => {
                if (data.faceBookId) {
                    return socialLogin(user, data, {faceBookId: data.faceBookId}, {req, site, currency});
                } else if (data.googleId) {
                    return socialLogin(user, data, {googleId: data.googleId}, {req, site, currency});
                } else if(data.appleId){
                    return socialLogin(user, data, {appleId: data.appleId}, {req, site, currency});
                }
            },

        //login with already registered user credentials...
        signin: async (root, {email, password, code}, {user, req, site, currency}) => {
            if (!REGEX.test(email)) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
            }
            var foundUser = await user.findOne({email});
            if(!foundUser) {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
            if(foundUser.password === undefined){
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._PasswordFailed : language.en._PasswordFailed);
            }
            const isValid= await bcrypt.compare(password, foundUser.password);
            if(!isValid) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidPassword : language.en._invalidPassword);
            }
            // verify mail for new user 
            // if(code && code != "" || code != undefined) {
            //     const codeData = Buffer.from(code, 'base64').toString();
            //     try {
            //         var temp = JSON.parse(codeData)
            //     } catch (e) {
            //         throw new AuthenticationError("Invalid URL");
            //     }                
            //     if(temp && temp.id && temp.email && email === temp.email) {
            //         const foundNewUser = await user.findOne({_id: temp.id, email: temp.email});
            //         if(foundNewUser && foundNewUser.verifications.email !== true) {
            //             var foundUser = await user.findOneAndUpdate({_id: temp.id}, {$set: {"verifications.email": true, status: "Active"}});
            //         }
            //         else {
            //             throw new AuthenticationError("Already email verified");
            //         }
            //     }
            //     else {
            //         throw new AuthenticationError("Invalid URL");
            //     }
            // }
            else {
                // if (foundUser.verifications.email !== true) {
                //     throw new ForbiddenError("Verify your email");
                // }
                if (foundUser.status !== "Active") {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
                }
            }
                        
            let result = findUser(foundUser, "signin", {headers: req.headers, site, currency}); // call the function to get the expected output            
            if (req.session && !req.headers.channel) {
                // update session values to use througout the session exists
                req.session.userId = foundUser.id;
                req.session.role = foundUser.role;
                req.session.userName = foundUser.userName;
            }
            return result;
        },

        // edit user profile
        editProfile: async (root, { data }, { currentUser, user, req, mailtemp, site }) => {
            var {email, password, id, unit, profileImage, oldPassword, newPassword, iosProfileImage} = data;
            if(data.email) {
                data.email = data.email.toLowerCase();                
            }            
            let {userId, adminUserId} = currentUser;
            if(!userId && !adminUserId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }

            if (!!email && !REGEX.test(email)) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
            }

            const checkEmail =  await user.findOne({"_id": {$nin:id}, email: email});
            if (checkEmail) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._emailExists : language.en._emailExists);
            }

            if(data.status === "Inactive") {                
                if(("type" in data)){                    
                    delete req.session.userId;
                    delete req.session.userName;
                    delete currentUser.userId;
                    delete currentUser.userName;                    
                }
            }
                // if(password){
                //     const saltRounds = 10;
                //     data.password = await bcrypt.hash(password, saltRounds);
                // }
                if(!("type" in data) && !!oldPassword){
                    if(newPassword !== password) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordMatchError : language.en._passwordMatchError);
                    }
                    let foundUser = await user.findOne({ _id: data.id });
                    if(!foundUser) {
                        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                    }
                    if (foundUser.status !== "Active") {
                        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
                    }
                    const isValid= await bcrypt.compare(oldPassword, foundUser.password);
                    if(!isValid) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidPassword : language.en._invalidPassword); 
                    }
                    const saltRounds = 10;
                    data.password = await bcrypt.hash(newPassword, saltRounds); 
                }
                else if(password) {
                    const saltRounds = 10;
                    data.password = await bcrypt.hash(password, saltRounds); 
                }
            

                data.updatedAt = date(); 
                if(("type" in data)){
                    /* condition for prevent maintain unique user name */
                    /* const checkUserName = await user.findOne({"_id": {$nin:data.id}, userName: data.userName});
                    if (checkUserName) throw new AuthenticationError(errors.userNameExists); */
                const foundUser = await user.findOneAndUpdate({_id: id}, {$set: data}, {new: true})
                .select("-password, -resetPasswordToken");
                
                if(!foundUser) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                }
                return foundUser;

                  } 
                    if (unit) {                    
                        var bool = unit === "KM" ? true : unit === "MI" ? true : false;
                        if (!bool) {
                            throw new UserInputError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unitError : language.en._unitError);
                        }
                    }
                    /////  base 64444444
                    // if (profileImage) {                        
                    //     var siteData = await site.findOne();
                    //     var found = await user.findOne({_id: userId});
                    //     if(siteData.imageHost == "local") {
                    //         if(profileImage.includes("fakepath")) {
                    //             const fileName = profileImage.replace(/.*(\/|\\)/, "");
                    //             profileImage = fileName;
                    //         }
                    //         if (found.profileImage) {        
                    //             //delete old profile image while user tries to update new image
                    //             deleteImage(found.profileImage, found._id, "users");
                    //         }
                    //          // store newly uploaded user"s profile image in server
                    //         data.profileImage = imageUpload(profileImage, found._id, "users", "qwe");
                    //         data.imageSource = "local"
                    //     }
                    //     else if(siteData.imageHost == "cloud") {
                    //         var response = await cloudinaryUpload("stream", "fileName", found._id, "users", profileImage);
                    //         fileData = await response && response.public_id.replace(`fileStorage/uploads/users/${found._id}/`, "")+"."+response.format
                    //         data.profileImage = fileData,
                    //         data.imageSource = "cloud"                                
                    //     }
                    // }

                    // file
                    if (profileImage) {                        
                        var siteData = await site.findOne();
                        var found = await user.findOne({_id: userId});
                        const { stream, filename } = await profileImage;
                        let ext = filename.split(".")[1];
                        if(siteData.imageHost == "local") {
                            var fileName = `users_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(found._id), "users");
                            data.profileImage = fileName
                            data.imageSource = "local"
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload({ stream }, "fileName", String(found._id), "users");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/users/${String(found._id)}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data.profileImage = fileData,
                            data.imageSource = "cloud"
                        }
                        if (fs.existsSync(`fileStorage/uploads/users/${id}/${found.profileImage}`)) {
                            fs.removeSync(`fileStorage/uploads/users/${id}/${found.profileImage}`);
                        }
                        else if(found.imageSource == "cloud") {
                            await cloudinaryImageDelete(found.profileImage)
                        }
                    }
                    if (iosProfileImage) {                        
                        var siteData = await site.findOne();
                        var found = await user.findOne({_id: userId});
                        if(siteData.imageHost == "local") {
                            if(iosProfileImage.includes("fakepath")) {
                                const fileName = iosProfileImage.replace(/.*(\/|\\)/, "");
                                iosProfileImage = fileName;
                            }
                            // if (found.profileImage) {        
                            //     //delete old profile image while user tries to update new image
                            //     deleteImage(found.profileImage, found._id, "users");
                            // }
                            data.profileImage = imageUpload(iosProfileImage, found._id, "users", "qwe");
                            data.imageSource = "local"
                        }
                        else if(siteData.imageHost == "cloud") {
                            var response = await cloudinaryUpload("stream", "fileName", String(found._id), "users", iosProfileImage, "ios");
                            // fileData = await response && response.public_id.replace(`fileStorage/uploads/users/${found._id}/`, "")+"."+response.format
                            fileData = await response && response.secure_url
                            data.profileImage = fileData,
                            data.imageSource = "cloud"                                
                        }
                        if (fs.existsSync(`fileStorage/uploads/users/${id}/${found.profileImage}`)) {
                            fs.removeSync(`fileStorage/uploads/users/${id}/${found.profileImage}`);
                        }
                        else if(found.imageSource == "cloud") {
                            await cloudinaryImageDelete(found.profileImage)
                        }
                    }
                if(email) {
                    var userVerifydata = await user.find({email: email})
                    if(userVerifydata && userVerifydata.length > 0) {
                        var foundUser = await user.findOneAndUpdate({_id: userId}, {$set: data}, {new: true}).select("-password, -resetPasswordToken");
                    }
                    else {
                        data["verifications.email"] = false;
                        data["verifications.faceBook"] = false;
                        data["verifications.google"] = false;
                        data["verifications.apple"] = false;
                        data.EmailExpires = Date.now() + 86400000; // 24 hour
                        var foundUser = await user.findOneAndUpdate({_id: userId}, {$set: data}, {new: true}).select("-password, -resetPasswordToken");
                        const obj = { id: id, email: email } 
                        const encrypt = Buffer.from(JSON.stringify(obj)).toString('base64')  
                        var confirmLink = `${URL + Site_Url}/?pop=confirm-mail&id=${encrypt}`
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "confirmation-mail"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
                        let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
                        var getDefault = await site.find({});
                        var sites = getDefault.find((a) => a);
                        let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";
                        let link = `${URL + Site_Url}`;
                        let facebookLink = `${sites.fbLink }`;
                        let fbshow = "display:none";
                        if(facebookLink){
                            fbshow = "";     
                        }                   
                        let instagramlink = `${sites.instagramLink}`;
                        let instagramshow = "display:none";
                        if(instagramlink){
                            instagramshow = "";  
                        }                     
                        let twitterLink = `${sites.twLink}`;
                        let twittershow = "display:none";
                        if(twitterLink){
                            twittershow = "";       
                        }  
                        let youtubeLink = `${sites.utubeLink}`;
                        let youtubeshow = "display:none";
                        if(youtubeLink){
                            youtubeshow = "";       
                        }                 
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, foundUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{CONFIRMLINK}}/g, confirmLink).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{WELCOME}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Welcome : language.en._Welcome).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{confirmBtn}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._confirmMailBtn : language.en._confirmMailBtn) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
                        var mailAddr = email;
                        let values = {
                             to: mailAddr,    // email 
                             html: etempdataDynamic,
                             req: req
                         };
                         sendMailAction.sendMail("confirmationMail",values, mailAddr, (callback) => {
                        //   console.log("cb", callback)
                         });                         
                    }
                }
                else {
                    var foundUser = await user.findOneAndUpdate({_id: userId}, {$set: data}, {new: true}).select("-password, -resetPasswordToken");
                }
                if(!foundUser) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                }
                if(foundUser.imageSource == "local") {
                    foundUser.profileImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(foundUser._id)}/${foundUser.profileImage}`
                }
                return foundUser;
        },

        //  // api for get forgot password link via email of the user   hijan97246@troikos.com
        // forgotPassword: async(root, {email}, {user,mailtemp, req, site}) => {
        //     var foundUser = await user.findOne({email});
        //     if (!foundUser) throw new AuthenticationError("User " + errors.notFound);
        //     const token = createToken(foundUser, process.env.JWT_SECRET, "1d")
        //     console.log("token",token)
        //                  sendMailAction.sendMail("forgetPwd",values, callback => {
        //      })
        //       return sendToken({email, user, req, emailAdmin});
        //     //return { result: "Email sent successfully!" };
        // },
        
        // api for get forgot password link via email of the user
        forgotPassword: async(root, {email}, {user, req, site,mailtemp}) => {
            var emailAdmin = await site.findOne({}, "fromAddress fromName uName password");
            var foundUser = await user.findOne({email});
            if (!foundUser) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
            //const token = createToken(foundUser, process.env.JWT_SECRET, "1d")
            // call the function for sending password reset token to the user`s email
            return sendToken({email, user, req, emailAdmin, mailtemp, site});
        },


        // api for reset the password through the reset password link
        resetPassword: async(root, { input }, {user, req}) => {
            const {password, confirmPassword, token} = input;
            if (password !== confirmPassword) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordMismatch : language.en._passwordMismatch);
            }
            if (password.length < 4) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordLength : language.en._passwordLength);
            }
            const foundUser = await user.findOne({resetPasswordToken: token});
            if (foundUser) {
                if (new Date(foundUser.resetPasswordExpires).getTime() < Date.now()) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._expired : language.en._expired);
                }
                const saltRounds = 10;
                var passwordHash = await bcrypt.hash(password, saltRounds);
                await user.findOneAndUpdate({_id: foundUser._id}, {password: passwordHash, updatedAt: date()});
            } else {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
                return (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._resetSuccess : language.en._resetSuccess);
        },

        addPayOutMethod: async(root, {data}, {user, req, currentUser, site}) => {
            console.log("addPayOutMethodData", data)
            if (!currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else {
                var siteInfo = await site.findOne();
                var stripe = Stripe(siteInfo.stripeSecretKey);
                const foundUser = await user.findOne({_id: currentUser.userId})
                if(foundUser && foundUser.payOutMethod && foundUser.payOutMethod.length <= 0) {
                    data["default"] = true
                }

                if(data.documentImage) {
                    const { stream, filename } = await data.documentImage;
                    let ext = filename.split(".")[1];
                    fileName = `document_${new Date().getTime()}.${ext}`;
                    await documentUpload({ stream }, fileName);
                    data.documentImage = fileName;
                }

                if(data.documentAdditionalImage) {
                    const { stream, filename } = await data.documentAdditionalImage;
                    let ext = filename.split(".")[1];
                    fileName = `additional_document_${new Date().getTime()}.${ext}`;
                    await documentUpload({ stream }, fileName);
                    data.documentAdditionalImage = fileName;
                }

                if (data.iosImage) {
                    // const { stream, filename } = await data.documentImage;
                    let ext = data.iosImage.originalName.split(".")[1];
                    fileName = `document_${new Date().getTime()}.${ext}`;
                    // if(data.iosImage.data.includes("fakepath")) {
                    //     const fileName = profileImage.replace(/.*(\/|\\)/, "");
                    //     profileImage = fileName;
                    // }                    
                    await iosImageUpload(data.iosImage.data, fileName);
                    data.documentImage = fileName;
                }

                if (data.iosAdditionalImage) {
                    let ext = data.iosAdditionalImage.originalName.split(".")[1];
                    fileName = `additional_document_${new Date().getTime()}.${ext}`;
                    await iosImageUpload(data.iosAdditionalImage.data, fileName);
                    data.documentAdditionalImage = fileName;
                }

                // await user.findOneAndUpdate({_id: currentUser.userId}, { $push: { payOutMethod: data } });

                //  acc CREATE
                if (data.type == "Stripe") {
                    if(data.DOB) {
                        var dateofBirth = data.DOB.split('/');
                        var year = dateofBirth[2]
                        var month = dateofBirth[0]
                        var date = dateofBirth[1]
                    } else {
                        var year = "1986"
                        var month = "04"
                        var date = "15"
                    }
                    if(data.stripeCountry === "JP") {
                        var individualData = {
                            // "address" : {
                            //     "line1" 	: data.address1,
                            //     "postal_code": data.postal_code,
                            //     "city":     data.city,
                            //     "state" 	: data.state,
                            //     "country": data.country
                            // },
                            "address_kana" : {
                                "line1" 	: data.address1,
                                "postal_code": data.postal_code,
                                "city":     data.city,
                                "state" 	: data.state,
                                "country": data.country
                            },
                            "address_kanji" : {
                                "line1" 	: data.kanji.address1,
                                "postal_code": data.kanji.postal_code,
                                "city":     data.kanji.city,
                                "state" 	: data.kanji.state,
                                "country": data.kanji.country
                            },
                            "dob" : {
                                "day" 	: date,
                                "month" : month,
                                "year" 	: year,
                            },
                            // "first_name" 	: foundUser.userName,
                            // "last_name" 	: foundUser.userName,
                            "first_name_kana": data.account_holder_name,
                            "last_name_kana": data.account_holder_name,
                            "first_name_kanji": data.account_owner_name,
                            "last_name_kanji": data.account_owner_name,
                            "gender": data.gender ? data.gender : "male",
                            "phone" 		: data.phone_number, ////// "8888675309" data.phone_number
                            "email"			: foundUser.email,
                            // "id_number": "000000000", // for US canada optional
                        }
                    }
                    else {
                        var individualData = {
                            "address" : {
                                "line1" 	: data.address1,
                                "postal_code": data.postal_code,
                                "city":     data.city,
                                "state" 	: data.state,
                                "country": data.country
                            },
                            "dob" : {
                                "day" 	: date,
                                "month" : month,
                                "year" 	: year,
                            },
                            "first_name" 	: foundUser.userName,
                            "last_name" 	: foundUser.userName,
                            "phone" 		: data.phone_number, ////// "8888675309" data.phone_number
                            "email"			: foundUser.email,
                            // "id_number": "000000000", // for US canada optional
                        }
                    }                    
                    externalAccountData = {
                        "object": "bank_account",
                        "account_holder_name": data.account_holder_name,
                        "account_holder_type": "individual",
                        "country": data.stripeCountry,
                        "currency": data.currency_code,
                        "metadata": {
                        },
                        //"account_number" : data.account_number,
                        // "routing_number": "110000000",
                    }

                // if (data.stripeCountry === "US") {
                if (data.ssn_last_4_digits) {
                    individualData["ssn_last_4"] = data.ssn_last_4_digits
                    // individualData["ssn"] = data.ssn_last_4_digits
                    // externalAccountData["routing_number"] = "110000000"
                }
                if(data.personal_Id) {
                    individualData["id_number"] = data.personal_Id
                }

                // if (data.stripeCountry === "US" || "AU" || "CA" || "NZ" || "NO") {
                if (data.routing_number) {
                    externalAccountData["routing_number"] = data.routing_number
                }

                if(data.transit_Number) {
                    externalAccountData["routing_number"] = data.transit_Number
                }
                
                if (data.account_number) {
                    externalAccountData["account_number"] = data.account_number
                    // externalAccountData["routing_number"] = "110000000"
                }

                // if (data.stripeCountry === "HK" ) {
                if (data.clearing_Code) {                    
                    externalAccountData["routing_number"] = data.clearing_Code
                }
                // if (data.stripeCountry === "IN" ) {
                if (data.IFSC_code) {
                    externalAccountData["routing_number"] = data.IFSC_code
                }
                // if (data.stripeCountry === "SG" ) {
                if (data.bank_Code) {
                    externalAccountData["routing_number"] = data.bank_Code
                }

                if (data.stripeCountry === "SG" && data.bank_Code && data.branch_code) {
                    externalAccountData["routing_number"] = `${data.bank_Code}-${data.branch_code}`
                }

                if (data.stripeCountry === "JP" && data.bank_Code && data.branch_code) {
                    externalAccountData["routing_number"] = `${data.bank_Code}${data.branch_code}`
                }

                // if (data.stripeCountry === "GB" ) {
                if (data.sort_Code) {
                    externalAccountData["routing_number"] = data.sort_Code
                }
                // if (data.stripeCountry === "AT" || "BE" || "DK" || "FI" || "FR" || "DE" || "IE" || "IT" || "LU" || "NL" || "PT" || "ES" || "SE" || "CH") {
                if (data.IBAN_Number) {
                    externalAccountData["account_number"] = data.IBAN_Number
                }

                if(data.BSB){
                    externalAccountData["routing_number"] = data.BSB
                }

                if(data.CLABE){
                    externalAccountData["routing_number"] = data.CLABE
                }
                ////

                // console.log("externalAccountData", externalAccountData)
                // console.log("individualData",individualData)
                const account = await stripe.accounts.create({
                    type: 'custom',
                    country: data.stripeCountry,
                    email: foundUser.email,
                    capabilities: {
                      card_payments: {requested: true},
                      transfers: {requested: true},
                    },
                    business_type: "individual",
                    "business_profile" : {
                      'mcc' : 5814,
                      'url' : "www.google.com",
                    }, 
                    individual: individualData,                  
                    tos_acceptance: {
                      date: Math.floor(Date.now() / 1000),
                      ip: "172.18.80.19"  //////  "13.112.224.240", // Assumes you're not using a proxy
                    },
                    external_account: externalAccountData                        
                  })
                  .then(async res => {
                      console.log("res", res.id, res.individual.id)

                      if(res.id && data.documentImage) {
                          var file = await stripe.files.create({
                          purpose: 'identity_document',
                          file: {
                              data: fs.readFileSync(`fileStorage/uploads/stripeDocuments/${data.documentImage}`),
                            //   data: fs.readFileSync(`fileStorage/static/default.png`),
                              name: data.documentImage,
                              type: 'application/octet-stream',
                          },
                          }, {
                          stripeAccount: res.id,
                          });
                      }

                      if(res.id && data.documentAdditionalImage) {
                        var additionalFile = await stripe.files.create({
                        purpose: 'identity_document',
                        file: {
                            data: fs.readFileSync(`fileStorage/uploads/stripeDocuments/${data.documentAdditionalImage}`),
                          //   data: fs.readFileSync(`fileStorage/static/default.png`),
                            name: data.documentAdditionalImage,
                            type: 'application/octet-stream',
                        },
                        }, {
                        stripeAccount: res.id,
                        });
                      }
                    //   console.log("File upload ids", additionalFile.id, file.id)
                      if(file.id && res.id && res.individual.id && additionalFile.id) {
                          const person = await stripe.accounts.updatePerson(
                            res.id,
                            res.individual.id,
                            {
                              verification: {
                                document: {
                                  front: file.id,
                                },
                                additional_document: {
                                    front: additionalFile.id,
                                }
                              },
                            }
                          );
                      }

                      data["stripeAccountCreatedNumber"] = res.id
                      await user.findOneAndUpdate({_id: currentUser.userId}, { $push: { payOutMethod: data } });
                      status = true
                  }).catch(err => {
                      console.log("add payout err", err)
                      status = err.raw.message
                  })
                }
                else {
                    await user.findOneAndUpdate({_id: currentUser.userId}, { $push: { payOutMethod: data } });
                    var status = true
                }
                return await status
            }
        },

        deletePayOutMethod: async(root, {id}, {user, req, currentUser}) => {
            if (!currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else {                
                await user.findOneAndUpdate({ _id: currentUser.userId, "payOutMethod._id": id }, { $pull: { payOutMethod: { _id: id } } })
                return true
            }
        },
        setDefaultPayout: async(root, {id}, {user, req, currentUser}) => {
            if (!currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else {                
                await user.findOneAndUpdate({ _id: currentUser.userId, "payOutMethod.default": true }, { $set: { "payOutMethod.$[].default": false } } )

                await user.findOneAndUpdate({ _id: currentUser.userId, "payOutMethod._id": id }, { $set: { "payOutMethod.$.default": true } } )
                return true
            }
        }

        }
    };

module.exports = resolvers;
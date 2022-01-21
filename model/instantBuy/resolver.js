
const { errors } = require("../../error");
const { AuthenticationError, UserInputError } = require("apollo-server");
const language = require("../../src/translations/api/lang.json");
const product = require("../../schema/product");
const sendMailAction = require("../../mailtemp");
const {Site_Url, env, URL} = process.env;
var admin = require("firebase-admin");

const resolvers = {
    Query: {
        getOrderDetails: async (root, { }, { currentUser, instantBuy, user, req, site, mailtemp, currency, product }) => {
            var orders = await instantBuy.find();
            var paypalPayout = orders && orders.filter(i => i.payoutMethod == "Paypal")
            var siteInfo = await site.findOne();
            var allProducts = await product.find();
            var paypal = require('paypal-rest-sdk');
            await paypal.configure({
                'mode': siteInfo.paypalEnvironment,
                'client_id': siteInfo.paypalClientId,  ////// 'AWtYIcinE841jOBtaPlQcEgAbqoIsi35iyITWEOD4WLatuWiia9MrzIcj3lUVz2cPW0Mr9lvSeVqh_FX',
                'client_secret': siteInfo.paypalSecretKey ////'EGnbKyLj-UMntOsMfmTOTG0o_VirJbITU_VYSPfgRIa3D8dFTaVaNSldsnDbSVcw_xgoay9HUAQNh9qn'
            });
            if(paypalPayout && paypalPayout.length > 0) {
                // for(i=0; i<paypalPayout.length; i++) {
                paypalPayout.map(async (i) => {
                    if(i.status != "COMPLETED") {
                        // console.log("fffffffff", i)
                        await paypal.payout.get(i.payoutBatchId, async function (error, payout) {
                            if (error) {
                                // console.log("paypal error", error);
                                throw error;
                            } else {
                                // console.log("Get order paypal Payout Response");
                                // console.log((payout));
                                if(payout && payout.items && payout.items[0].transaction_status && payout.items[0].transaction_status == "SUCCESS") {                                    
                                    var payoutStatus = payout.items[0].transaction_status
                                    await instantBuy.findOneAndUpdate({ _id: i._id }, { $set: { payoutStatus: payoutStatus, status: "COMPLETED" } })
                                    var orderdata = await instantBuy.findOne({_id: i._id})
                                    var userData = await user.findOne({_id: orderdata.sellerUserId})
                                    // service fee calc
                                    var totalRate = orderdata && orderdata.orderDetails && Number(orderdata.orderDetails.productFee + orderdata.orderDetails.shippingRate)
                                    var payoutFee = orderdata && orderdata.orderDetails && totalRate && (Number(totalRate) - (Number(orderdata.orderDetails.serviceFeeSellerRate)))
                                    // send mail                            
                                    var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                                    var bodymailtempDetail = await mailtemp.findOne({title: "PAYMENT RELEASE"});  
                                    var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                                    let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;                     
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
                                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{SellerName}}/g, orderdata.orderDetails.sellerName).replace(/{{PAYOUTAMOUNT}}/g, payoutFee).replace(/{{PAYOUTCURRENCY}}/g, "$").replace(/{{ProductName}}/g, orderdata.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{payTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt1 : language.en._payTxt1).replace(/{{payTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt2 : language.en._payTxt2).replace(/{{payTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt3 : language.en._payTxt3).replace(/{{payTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt4 : language.en._payTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                                    var mailAddr = userData && userData.email;
                                    let values = {
                                        to: mailAddr,    
                                        html: etempdataDynamic,
                                        req: req
                                    };
                                    await sendMailAction.sendMail("PAYMENT RELEASE",values, mailAddr, (callback) => {     
                                    })
                                }
                                else {
                                    var payoutStatus = payout.items[0].transaction_status
                                    await instantBuy.findOneAndUpdate({ _id: i._id }, { $set: { payoutStatus: payoutStatus } })
                                }
                            }
                        });
                    }
                })
            }
            
            // var orders = await JSON.parse(JSON.stringify(orders1));
            var orderData = orders && orders.map(async (i) => {
                var userData = await user.findOne({_id: i.sellerUserId})
                var userPayoutData = userData && userData.payOutMethod && userData.payOutMethod.find(a => a.default == true)
                if(userPayoutData && userPayoutData.type == "Paypal") {
                    i["isBeforeDefaultPayout"] = true
                    i["beforePayoutDefaultType"] = "Paypal"
                    i["beforePayoutDefaultDetails"] = userPayoutData.paypal_email
                }
                else if(userPayoutData && userPayoutData.type == "Stripe") {
                    i["isBeforeDefaultPayout"] = true
                    i["beforePayoutDefaultType"] = "Stripe"
                    i["beforePayoutDefaultDetails"] = userPayoutData.stripeAccountCreatedNumber
                }
                else {
                    i["isBeforeDefaultPayout"] = false
                }
                // Currency conversion
                const orderProductData = allProducts && allProducts.find(a => a._id == i.productId)
                var productCurrentRate = await currency.findOne({code: i.orderDetails.currency})
                var chosenCurrency = await currency.findOne({code: siteInfo.defaultCurrency});
                i.orderDetails["currencySymbol"] = chosenCurrency && chosenCurrency.symbol
                if (i.orderDetails.currency != siteInfo.defaultCurrency && i.orderDetails.currencyCode != "") {                    
                    if(orderProductData && orderProductData.currencyCode != siteInfo.defaultCurrency){
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

                    var serviceFeeSellerRate = i.orderDetails.serviceFeeSellerRate && productCurrentRate && (i.orderDetails.serviceFeeSellerRate / productCurrentRate.rate).toFixed(2);
                    i.orderDetails.serviceFeeSellerRate = serviceFeeSellerRate && chosenCurrency && (serviceFeeSellerRate * chosenCurrency.rate).toFixed(2);
                }
                //
                return i
            })
            // var siteInfo = await site.findOne();
            // var serviceFeeSellerPercentage = Number(siteInfo.serviceFeeSeller)
            // var usdServiceFeeSellerRate = ((orders.orderDetails.productFee) * (serviceFeeSellerPercentage / 100)).toFixed(2)
            // orders["serviceFeeSellerRate"] = usdServiceFeeSellerRate
            // console.log("sss", orders)
            return orderData
        },
    },
    Mutation: {
        updateShippingAddress: async (root, { id, data }, { currentUser, instantBuy, user, req }) => {
            if (currentUser.userId) {
                if (id) {
                    var updateAddress = await user.findOneAndUpdate({ _id: currentUser.userId, "buyerShippingAddress._id": id }, { $set: { "buyerShippingAddress.$": data } })
                    return true
                }
                else {
                    var updateAddress = await user.findOneAndUpdate({ _id: currentUser.userId }, { $push: { buyerShippingAddress: data } })
                    return true
                }
            }
            else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },

        deleteShippingAddress: async (root, { id }, { currentUser, user, req }) => {
            if (currentUser.userId) {
                if (id) {
                    await user.findOneAndUpdate({ _id: currentUser.userId, "buyerShippingAddress._id": id }, { $pull: { buyerShippingAddress: { _id: id } } })
                    return true
                }
            }
            else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },

        updateShippingDetails: async (root, { id, data }, { currentUser, instantBuy, user, req }) => {
            if (currentUser.userId) {
                if (id) {
                    var orderInfo = await instantBuy.findOne({_id: id})
                    if(orderInfo && orderInfo.status === "CANCELLED") {
                        throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang].CANCELLED : language.en._yourOrder + " " + language.en.CANCELLED);
                    }
                    // data.shippmentDate = Date.now();
                    await instantBuy.findOneAndUpdate({ _id: id }, { $set: { shippingDetails: data } })
                    return true
                }
            }
            else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
        updateOrderStatus: async (root, { id, status, cancelReason }, { currentUser, instantBuy, user, req, product, mailtemp, site }) => {
            if (currentUser.userId) {
                // Push notification for mobile      
                const notify = async (newId, status, productId) => {
                    var device = await user.findOne({_id: newId})
                    var productInfo = await product.findOne({_id: productId})
                    var fName = productInfo && productInfo.language && productInfo.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = productInfo && productInfo.language && productInfo.language.filter((f) => f.langCode === "en");
                    }
                    fName.map(i => {          
                        productTitle = i && i.title                      
                    });
                    if(typeof(device.deviceId) !== "undefined") { 
                        if(device.device === "android") {
                            var payload = {
                                notification: {
                                    title: productTitle,
                                    body: typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${status}`] : language.en._yourOrder + " " + language.en[`${status}`]
                                },
                                data: {
                                    type: "Order",
                                    user_id: String(newId),
                                    order_id: id,
                                    title: productTitle,
                                    // message: typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${status}`] : language.en._yourOrder + " " + language.en[`${status}`],
                                    message:  language.en._yourOrder + " " + language.en[`${status}`],
                                },                  
                                token: device.deviceId
                            };
                            admin.messaging().send(payload)
                            .then((result) => {
                            //    console.log("result", result)
                            })
                            .catch((err) => {
                                console.log("err", err);
                                throw new Error(err); 
                            });
                        }

                        if(device.device === "ios") {
                            var payload = {
                                notification: {
                                    title: productTitle,
                                    body: typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${status}`] : language.en._yourOrder + " " + language.en[`${status}`]
                                },
                                data: {
                                    type: "Order",
                                    user_id: String(newId),
                                    order_id: id,
                                    title: productTitle,
                                    message: typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${status}`] : language.en._yourOrder + " " + language.en[`${status}`],
                                },
                            };      
                            admin.messaging().sendToDevice(device.deviceId, payload)
                            .then((result) => {
                            // console.log("result", result)
                            }).catch((err) => {
                                // console.log("err", err);
                                throw new Error(err); 
                            });    
                        }     
                    }
                }

                if (id) {
                    if (status === "PROCESSING") {
                        var orderInfo = await instantBuy.findOne({_id: id})
                        if(orderInfo && orderInfo.status === "CANCELLED") {
                            throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang].CANCELLED : language.en._yourOrder + " " + language.en.CANCELLED);
                        }
                        var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status } })
                        await notify(buyData.buyerUserId, status, buyData.productId)
                    }  
                    else if (status === "CLAIMED") {
                        var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status, updatedAt: Date.now() } })
                        await notify(buyData.buyerUserId, status, buyData.productId)
                    }                                        
                    
                    else if(status === "RECEIVED") {
                        status = "DELIVERED"
                        var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status } })
                        await notify(buyData.sellerUserId, status, buyData.productId)
                    }
                    else if (status === "CANCELLED") {
                        var orderInfo = await instantBuy.findOne({_id: id})
                        var sites = await site.findOne({});
                        if(sites && sites.hideOrderCancelStatus == "PROCESSING") {
                            if(orderInfo && orderInfo.status != "PENDING") {
                                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${orderInfo.status}`] : language.en._yourOrder + " " + language.en[`${orderInfo.status}`]);
                            }
                        }
                        if(sites && sites.hideOrderCancelStatus == "SHIPPED") {
                            if(orderInfo && orderInfo.status != "PENDING" && orderInfo.status != "PROCESSING") {
                                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang][`${orderInfo.status}`] : language.en._yourOrder + " " + language.en[`${orderInfo.status}`]);
                            }
                        }
                        var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status, cancelReason: cancelReason, updatedAt: Date.now() } })
                        await product.findOneAndUpdate({ _id: buyData.productId }, { $set: { sellingStatus: "ForSale" } });
                        await notify(buyData.sellerUserId, status, buyData.productId)

                        var userInfo = await user.findOne({_id: buyData.sellerUserId});
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "orderCancel"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                        let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;                     
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
                        let cancelReasonshow = "display:none";
                        if(cancelReason != ""){
                            cancelReasonshow = ""
                            var cancelReasonData = `${typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._cancelReason : language.en._cancelReason} : ${cancelReason}`;
                        }
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{SellerName}}/g, buyData.orderDetails.sellerName).replace(/{{CustomerName}}/g, buyData.orderDetails.buyerName).replace(/{{ProductName}}/g, buyData.orderDetails.productName).replace(/{{your}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._your : language.en._your).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{item}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._item : language.en._item).replace(/{{cancelTxt}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._cancelTxt : language.en._cancelTxt).replace(/{{ReasonShow}}/g, cancelReasonshow).replace(/{{Reason}}/g, cancelReasonData).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                        var mailAddr = userInfo.email;
                        let values = {
                             to: mailAddr,    
                             html: etempdataDynamic,
                             req: req
                         };
                        sendMailAction.sendMail("orderCancel",values, mailAddr, (callback) => {     
                        })
                    }
                    // else {
                    //     var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status } })
                    //     // await notify(buyData.buyerUserId, status)
                    // }
                    else if (status === "SHIPPED") {
                        var orderInfo = await instantBuy.findOne({_id: id})
                        if(orderInfo && orderInfo.status === "CANCELLED") {
                            throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._yourOrder + " " + language[req.headers.lang].CANCELLED : language.en._yourOrder + " " + language.en.CANCELLED);
                        }
                        var buyData = await instantBuy.findOneAndUpdate({ _id: id }, { $set: { status: status } })
                        // await product.findOneAndUpdate({ _id: buyData.productId }, { $set: { sellingStatus: "ForSale" } });
                        await notify(buyData.buyerUserId, status, buyData.productId)

                        var userInfo = await user.findOne({_id: buyData.buyerUserId});
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "SHIPPED TO CUSTOMER"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                        let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
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
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{SellerName}}/g, buyData.orderDetails.sellerName).replace(/{{CustomerName}}/g, buyData.orderDetails.buyerName).replace(/{{ProductName}}/g, buyData.orderDetails.productName).replace(/{{trackingNumber}}/g, buyData.shippingDetails.trackingId).replace(/{{LOGO}}/g, logoImg).replace(/{{your}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._your : language.en._your).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{item}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._item : language.en._item).replace(/{{trackTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._trackTxt1 : language.en._trackTxt1).replace(/{{trackTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._trackTxt2 : language.en._trackTxt2).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                        var mailAddr = userInfo && userInfo.email;
                        let values = {
                             to: mailAddr,    
                             html: etempdataDynamic,
                             req: req
                         };
                        sendMailAction.sendMail("SHIPPED TO CUSTOMER",values, mailAddr, (callback) => {     
                        })
                    }
                    return true
                }
            }
            else {
                throw new AuthenticationError(typeof (language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        }
    }
};

module.exports = resolvers;


const {ForbiddenError, AuthenticationError} = require("apollo-server");
const paginate = 20;
var braintree = require("braintree");
const language = require("../../src/translations/api/lang.json");
var Stripe = require("stripe");
var paypal = require('paypal-rest-sdk');
const sendMailAction = require("../../mailtemp");
const user = require("../../schema/user");
const { defaultDataIdFromObject } = require("apollo-boost");
const { updateFetchedProducts } = require("../../handler");
const {Site_Url, env, URL} = process.env;
var admin = require("firebase-admin");

const resolvers = {
    Query: {
        getTransactionDetails: async (root, args, {currentUser, transaction, currency, site}) => {
            var transactionDetails = await transaction.find({});
            var siteData = await site.findOne({});
            var currencies = await currency.find();
                            
                transactionDetails.forEach(async function(res) { 
                    var conversionData = currencies && currencies.find((c) => c.code === siteData.defaultCurrency);
                    res.amount = res && conversionData && (res.amount * conversionData.rate).toFixed(2);
                    res.currencyIsoCode = siteData && siteData.defaultCurrency;
                    var currencySym = currencies && currencies.find((c) => c.code === siteData.defaultCurrency);
                    res.currencySymbol = currencySym && currencySym.symbol;                 
                });
                return transactionDetails;                                   
        },
    },

    Mutation: {
        createClientToken: async (root,args,{currentUser,site,req}) => {
            //if (currentUser.userId) {
                try {
                    var siteinfo = await site.findOne({});                    
                    var gateway = braintree.connect({
                        environment: braintree.Environment[siteinfo.Environment],
                        merchantId: siteinfo.MerchantId,
                        publicKey: siteinfo.PublicKey,
                        privateKey: siteinfo.PrivateKey
                    });
                    let res = await gateway.clientToken.generate({});
                    return res;                                                                 
                }catch(error){
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentDenied : language.en._paymentDenied);
                }
            // } else {
            //     throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            // }
        },
        createStripeClientToken: async (root, {data}, dBdata) => {
            let { product, req, currentUser, user, site,featured, currency } = dBdata;
            // data.type = "instantBuy"
            // data.productId = 10037
            if (data.type === "instantBuy") {
                var pageNumber;
                var filter = {};
                var filters = {};
                var stripekeyInfo = await site.findOne();
                var stripe = Stripe(stripekeyInfo.stripeSecretKey);
                var customer = await stripe.customers.create({
                    name: 'Jenny Rosen',
                    address: {
                      line1: '510 Townsend St',
                      postal_code: '98140',
                      city: 'San Francisco',
                      state: 'CA',
                      country: 'US',
                    }
                });
                prodData = await product.find({_id: data.productId})
                const prodDetails = await updateFetchedProducts(pageNumber, filters, filter, dBdata, prodData, "needMore");
                var totalAmount = prodDetails && (prodDetails[0].usdProductRate ? Number(prodDetails[0].usdProductRate) : Number(0)) + (prodDetails[0].usdShippingRate ? Number(prodDetails[0].usdShippingRate) : Number(0)) + (Number(prodDetails[0].usdServiceFeeBuyerRate) ? Number(prodDetails[0].usdServiceFeeBuyerRate) : Number(0));
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: totalAmount && Number((totalAmount * 100).toFixed(2)),
                    currency: "USD",
                    customer: customer.id,
                    description: 'Software development services',
                    // buyOption: true
                });

                let paymentObject = {};
                paymentObject.clientSecret = paymentIntent.client_secret;
            
                return paymentObject;
            }
            else {
                var stripekeyInfo = await site.findOne();
                var featuredlist = await featured.findOne({_id: data.featuredId});
                if (featuredlist && featuredlist.currencyCode !== "USD"){                     
                    var featuredCurrentRate = await currency.findOne({code: featuredlist.currencyCode});   
                    var featuredConversionRate = featuredCurrentRate && (featuredlist.price / featuredCurrentRate.rate).toFixed(2);
                    var amount = featuredConversionRate;
                } else {
                    var amount = featuredlist && featuredlist.price;
                }
                var stripe = Stripe(stripekeyInfo.stripeSecretKey);
                var customer = await stripe.customers.create({
                    name: 'Jenny Rosen',
                    address: {
                      line1: '510 Townsend St',
                      postal_code: '98140',
                      city: 'San Francisco',
                      state: 'CA',
                      country: 'US',
                    }
                });

                // const setup_intent =  await stripe.setupIntents.create({
                //     customer: customer.id,
                //   });
                const paymentIntent = await stripe.paymentIntents.create({
                    amount:  amount && Number((amount * 100).toFixed(2)),   //Number((featuredlist.price * 100).toFixed(2)),
                    currency: "USD",  // featuredlist.currencyCode,
                    customer: customer.id,
                    description: 'Software development services'
                });

                let paymentObject = {};
                paymentObject.clientSecret = paymentIntent.client_secret;
            
                return paymentObject;
            }            
        },
        ChargePaymentMethod: async(root,{data}, dBdata) => {
            let { transaction, currentUser, site, product, user, currency, featured, req, instantBuy, mailtemp } = dBdata;
            // data.type = "instantBuy"
            // data.addressId = "606aa96b9fcc87260daedccf"
            // data.channel = "mobile"
            console.log("payment Data", data)
            // console.log("header", req.headers)
            //console.log("payment Id", req.headers.paymentUserId )
            console.log("currentUser.userId", currentUser.userId )
                const orderMail = async (mailAddr, buyData) => {
                    var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                    var bodymailtempDetail = await mailtemp.findOne({title: "ITEM BOUGHT"});  
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
                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{SellerName}}/g, buyData.orderDetails.sellerName).replace(/{{ProductName}}/g, buyData.orderDetails.productName).replace(/{{your}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._your : language.en._your).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{buyTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._buyTxt1 : language.en._buyTxt1).replace(/{{buyTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._buyTxt2 : language.en._buyTxt2).replace(/{{buyTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._buyTxt3 : language.en._buyTxt3).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);     
                    // var mailAddr = userInfo.email;
                    let values = {
                         to: mailAddr,    
                         html: etempdataDynamic,
                         req: req
                     };
                    sendMailAction.sendMail("ITEM BOUGHT",values, mailAddr, (callback) => {     
                    })
                }

                const orderConfirmMail = async (mailAddr, buyData) => {
                    var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                    var bodymailtempDetail = await mailtemp.findOne({title: "Order Confirmation"});  
                    var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                    let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;                     
                    var getDefault = await site.find({});
                    var sites = getDefault && getDefault.find((a) => a);
                    let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
                    let link = `${URL + Site_Url}`;                                        
                    let facebookLink = `${sites.fbLink }`;
                    let siteName = `${sites.name}`                                    
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
                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{CustomerName}}/g, buyData.orderDetails.buyerName).replace(/{{ProductName}}/g, buyData.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{QUANTITY}}/g, 1).replace(/{{SHIPPING_ADDRESS1}}/g, buyData.buyerShippingAddress.address1).replace(/{{SHIPPING_CITY}}/g, buyData.buyerShippingAddress.city).replace(/{{SHIPPING_STATE}}/g, buyData.buyerShippingAddress.state).replace(/{{SHIPPING_ZIPCODE}}/g, buyData.buyerShippingAddress.zipCode).replace(/{{SITE_NAME}}/g, siteName).replace(/{{ADMIN_SUPPORT_EMAIL}}/g, sites.adminSupportMail).replace(/{{orderTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._orderTxt1 : language.en._orderTxt1).replace(/{{orderTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._orderTxt2 : language.en._orderTxt2).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                    // var mailAddr = userInfo.email;
                    let values = {
                         to: mailAddr,    
                         html: etempdataDynamic,
                         req: req
                     };
                    sendMailAction.sendMail("Order Confirmation",values, mailAddr, (callback) => {     
                    })
                }
                
                const notify = async (newId, status, productTitle, buy) => {
                    var device = await user.findOne({_id: newId})                    
                    if(typeof(device.deviceId) !== "undefined") { 
                        if(device.device === "android") {
                            var payload = {
                                notification: {
                                    title: productTitle && productTitle[0],
                                    body: "A new order received"
                                },
                                data: {
                                    type: "Order",
                                    user_id: String(newId),
                                    order_id: String(buy._id),
                                    title: productTitle && productTitle[0],
                                    message: "A new order received"
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
                                    title: productTitle && productTitle[0],
                                    body: "A new order received"
                                },
                                data: {
                                    type: "Order",
                                    user_id: String(newId),
                                    order_id: String(buy._id),
                                    title: productTitle && productTitle[0],
                                    message: "A new order received"
                                },
                            };
                            admin.messaging().sendToDevice(device.deviceId, payload)
                            .then((result) => {
                            // console.log("result", result)
                            }).catch((err) => {
                                console.log("err", err);
                                throw new Error(err); 
                            });    
                        }
                        // admin.messaging().sendToDevice(device.deviceId, payload)
                        // .then((result) => {
                        //    console.log("orrr result", result)
                        // })
                        // .catch((err) => {
                        //     console.log("orr notification err", err);
                        //     throw new Error(err); 
                        // }); 
                    }
                }
            // for mobile
            if(data.paymentUserId) {
               try{                       
                    var productinfo = await product.find({_id: data.productId});
                    var productData = await JSON.parse(JSON.stringify(productinfo)); 
                    var userinfo = await user.findOne({_id: productinfo[0].userId});
                    var currentUserInfo = await user.findOne({_id: data.paymentUserId})
                    var siteData = await site.findOne({});
                    var productTitle = productinfo && productinfo[0] && productinfo[0].language && productinfo[0].language.filter(x => x.langCode === "en").map(t=>{
                        return t.title
                    })
                    var pageNumber;
                    var filter = {};
                    var filters = {};
                    const prodDetails = await updateFetchedProducts(pageNumber, filters, filter, dBdata, productData, "needMore");

                    if(data.type === "instantBuy") {
                        var paymentFor = "instantBuy"
                        var amount = prodDetails && prodDetails[0] && (prodDetails[0].usdProductRate ? Number(prodDetails[0].usdProductRate) : Number(0)) + (prodDetails[0].usdShippingRate ? Number(prodDetails[0].usdShippingRate) : Number(0)) + (Number(prodDetails[0].usdServiceFeeBuyerRate) ? Number(prodDetails[0].usdServiceFeeBuyerRate) : Number(0));                    
                        var totalSellerServiceFee = prodDetails && prodDetails[0] && ((prodDetails[0].usdProductRate ? Number(prodDetails[0].usdProductRate) : Number(0)) * (Number(siteData.serviceFeeSeller) / 100))
                        var addrData = currentUserInfo && currentUserInfo.buyerShippingAddress && currentUserInfo.buyerShippingAddress.find(i => i._id == data.addressId)
                    }
                    else {
                        var paymentFor = "featured"
                        var featuredlist = await featured.findOne({_id: data.featuredId});
                        if (featuredlist && featuredlist.currencyCode !== "USD"){                     
                            var featuredCurrentRate = await currency.findOne({code: featuredlist.currencyCode});   
                            var featuredConversionRate = featuredlist && featuredCurrentRate && (featuredlist.price / featuredCurrentRate.rate).toFixed(2);
                            var amount = Number(featuredConversionRate);
                        } else {
                            var amount = featuredlist && featuredlist.price;
                        }
                    }                    

                    // Braintree                    
                    if(data.paymentMode === "Braintree") {
                        var siteinfo = await site.findOne({});
                        var gateway = braintree.connect({
                            environment: braintree.Environment[siteinfo.Environment],
                            merchantId: siteinfo.MerchantId,
                            publicKey: siteinfo.PublicKey,
                            privateKey: siteinfo.PrivateKey
                        });
                        var newTransaction = await gateway.transaction.sale(
                            {
                            amount: amount && amount.toFixed(2),
                            paymentMethodNonce: data.nonce,
                            options: {
                                submitForSettlement: true
                              }
                            } 
                        );
                        var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                        var transactions = await new transaction({
                            transactionId: newTransaction.transaction.id,
                            status: newTransaction.transaction.status,
                            amount: newTransaction.transaction.amount,
                            currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                            paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                            cardType: newTransaction.transaction.creditCard.cardType,
                            maskedNumber: newTransaction.transaction.creditCard.maskedNumber,
                            cardholderName: newTransaction.transaction.creditCard.cardholderName,
                            createdAt: newTransaction.transaction.createdAt,
                            updatedAt: newTransaction.transaction.updatedAt,
                            success: newTransaction.success,
                            productName: productTitle && productTitle[0],
                            productuserName: userinfo && userinfo.userName,
                            currencySymbol: currencyInfo && currencyInfo.symbol,
                            paymentMethod: "Braintree",
                            paymentFor: paymentFor
                        }).save();

                        if (newTransaction.success === true){
                            if(data.type === "instantBuy") { 
                                var buy = await new instantBuy({
                                    productId: data.productId,
                                    buyerUserId: data.paymentUserId, 
                                    sellerUserId: userinfo._id, 
                                    status: "PENDING",
                                    // transactionId: data.tokenId,
                                    orderDetails: {
                                        productId: data.productId,
                                        productName: productTitle && productTitle[0],
                                        productImage: productinfo[0] && productinfo[0].images[0] && productinfo[0].images[0].image, 
                                        productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                        shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                        totalFee: amount, 
                                        currency: "USD",
                                        currencySymbol: currencyInfo && currencyInfo.symbol,
                                        transactionId: newTransaction.transaction.id, 
                                        buyerName: currentUserInfo && currentUserInfo.userName, 
                                        sellerName: userinfo && userinfo.userName, 
                                        paymentStatus: "Success",
                                        paymentType: "Braintree",
                                        transactionId: newTransaction.transaction.id,
                                        serviceFeeBuyerRate: prodDetails[0] && Number(prodDetails[0].usdServiceFeeBuyerRate),
                                        serviceFeeSellerRate: totalSellerServiceFee
                                    },
                                    buyerShippingAddress: {
                                        Name: addrData && addrData.Name,
                                        country: addrData && addrData.country,
                                        address1: addrData && addrData.address1,
                                        address2: addrData && addrData.address2,
                                        city: addrData && addrData.city,
                                        state: addrData && addrData.state,
                                        zipCode: addrData && addrData.zipCode,
                                        phoneNumber: addrData && addrData.phoneNumber   
                                    }
                                }).save()
                                await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                                await orderMail(userinfo.email, buy)
                                await orderConfirmMail(currentUserInfo.email, buy)
                                await notify(userinfo._id, "PENDING", productTitle, buy)
                            }
                            else {
                                var featuredlist = await featured.findOne({_id: data.featuredId})   ;                             
                                var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                                var featuredExpiry = featuredlist && new Date(transTime + (featuredlist.validationPeriod * 60 * 60  * 1000));
                                var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set:  { featuredTransactionId : newTransaction.transaction.id, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.   validationPeriod, featuredExpiry: featuredExpiry, featuredDescription:     featuredlist.description}});
                            }
                        }
                        if(data.channel == "mobile") {
                            delete newTransaction.transaction
                            return newTransaction
                        }
                        else {
                            return newTransaction;
                        }
                    }

                    //Paypal
                    if(data.paymentMode === "Paypal") {
                        var siteinfo = await site.findOne({});
                        var gateway = braintree.connect({
                            accessToken: siteinfo.paypalAppId
                        });
                        var newTransaction = await gateway.transaction.sale(
                            {
                            amount: amount && amount.toFixed(2),
                            paymentMethodNonce: data.nonce,
                            options: {
                                submitForSettlement: true
                              }
                            } 
                        );
                        var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                        var transactions = await new transaction({
                            transactionId: newTransaction.transaction.id,
                            status: newTransaction.transaction.status,
                            amount: newTransaction.transaction.amount,
                            currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                            paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                            payerEmail: newTransaction.transaction.paypal.payerEmail,
                            paymentId: newTransaction.transaction.paypal.paymentId,
                            createdAt: newTransaction.transaction.createdAt,
                            updatedAt: newTransaction.transaction.updatedAt,
                            success: newTransaction.success,
                            productName: productTitle && productTitle[0],
                            productuserName: userinfo && userinfo.userName,
                            currencySymbol: currencyInfo && currencyInfo.symbol,
                            paymentMethod: "Paypal",
                            paymentFor: paymentFor
                        }).save();
                        if (newTransaction.success === true) {
                            // var buyOption = true //
                            if(data.type === "instantBuy") { // data.buyOption
                                var buy = await new instantBuy({
                                    productId: data.productId,
                                    buyerUserId: data.paymentUserId, 
                                    sellerUserId: userinfo._id, 
                                    status: "PENDING",
                                    transactionId: data.tokenId,
                                    orderDetails: {
                                        productId: data.productId,
                                        productName: productTitle && productTitle[0],
                                        productImage: productinfo[0] && productinfo[0].images[0] &&productinfo[0].images[0].image, 
                                        productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                        shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                        totalFee: amount, 
                                        currency: "USD",
                                        currencySymbol: currencyInfo && currencyInfo.symbol,
                                        transactionId: newTransaction.transaction.id, 
                                        buyerName: currencyInfo && currentUserInfo.userName, 
                                        sellerName: userinfo && userinfo.userName, 
                                        paymentStatus: "Success",
                                        paymentType: "Paypal",
                                        transactionId: newTransaction.transaction.id,
                                        serviceFeeBuyerRate: prodDetails[0] && Number(prodDetails[0].usdServiceFeeBuyerRate),
                                        serviceFeeSellerRate: totalSellerServiceFee
                                    },
                                    buyerShippingAddress: {
                                        Name: addrData && addrData.Name,
                                        country: addrData && addrData.country,
                                        address1: addrData && addrData.address1,
                                        address2: addrData && addrData.address2,
                                        city: addrData && addrData.city,
                                        state: addrData && addrData.state,
                                        zipCode: addrData && addrData.zipCode,
                                        phoneNumber: addrData && addrData.phoneNumber   
                                    }
                                }).save()
                                await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                                await orderMail(userinfo.email, buy);
                                await orderConfirmMail(currentUserInfo.email, buy)
                                await notify(userinfo._id, "PENDING", productTitle, buy)
                            }
                            else {
                                var featuredlist = await featured.findOne({_id: data.featuredId});                             
                                var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                                var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60  * 1000));
                                var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set:  { featuredTransactionId : newTransaction.transaction.id, featured: data. featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.   validationPeriod, featuredExpiry: featuredExpiry, featuredDescription:     featuredlist.description}});    
                            }                            
                        }   
                        if(data.channel == "mobile") {
                            delete newTransaction.transaction
                            console.log("mobile paypal response", newTransaction);
                            return newTransaction
                        }
                        else {
                            console.log("paypal response", newTransaction);
                            return newTransaction;
                        }
                    }

                    // Stripe payment
                    if (data.paymentMode === "Stripe") {
                        var stripeInfo = {
                            success : true,
                            transaction : {
                                amount : amount && amount.toFixed(2)
                            }
                        };
                        await new transaction({
                            transactionId: data.tokenId,
                            status: data.status,
                            amount: amount,
                            productName: productTitle && productTitle[0],
                            productuserName: userinfo && userinfo.userName,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            paymentMethod: "Stripe",
                            paymentFor: paymentFor
                        }).save();

                        if(data.type === "instantBuy") { 
                            var buy = await new instantBuy({
                                productId: data.productId,
                                buyerUserId: data.paymentUserId, 
                                sellerUserId: userinfo && userinfo._id, 
                                status: "PENDING",
                                transactionId: data.tokenId,
                                orderDetails: {
                                    productId: data.productId,
                                    productName: productTitle && productTitle[0],
                                    productImage: productinfo[0] && productinfo[0].images[0] && productinfo[0].images[0].image, 
                                    productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                    shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                    totalFee: amount, 
                                    currency: "USD",
                                    currencySymbol: "&#36;",
                                    transactionId: data.tokenId, 
                                    buyerName: currentUserInfo && currentUserInfo.userName, 
                                    sellerName: userinfo.userName, 
                                    paymentStatus: "Success",
                                    paymentType: "Stripe",
                                    serviceFeeBuyerRate: Number(prodDetails[0].usdServiceFeeBuyerRate),
                                    serviceFeeSellerRate: totalSellerServiceFee
                                },
                                buyerShippingAddress: {
                                    Name: addrData && addrData.Name,
                                    country: addrData && addrData.country,
                                    address1: addrData && addrData.address1,
                                    address2: addrData && addrData.address2,
                                    city: addrData && addrData.city,
                                    state: addrData && addrData.state,
                                    zipCode: addrData && addrData.zipCode,
                                    phoneNumber: addrData && addrData.phoneNumber   
                                }
                            }).save()
                            await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                            await orderMail(userinfo.email, buy)
                            await orderConfirmMail(currentUserInfo.email, buy)
                            await notify(userinfo._id, "PENDING", productTitle, buy)
                        }
                        else {
                            var featuredlist = await featured.findOne({_id: data.featuredId});                   
                            var transTime = new Date().getTime();
                            var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                            var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : data.tokenId, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
                        }
                        if(data.channel == "mobile") {
                            delete stripeInfo.transaction
                            return stripeInfo
                        }
                        else {
                            return stripeInfo;
                        }
                    }                    
                }catch(error){
                    console.log("data.paymentUserId", error)
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentLater : language.en._paymentLater);
                }
            }
            // for web
            else if(currentUser.userId) {


                try{   
                     // if(req.headers.currency != "USD") {
                     //     var featuredRate = await currency.findOne({code: req.headers.currency});  
                     //     featuredConversionAmount= (data.amount / featuredRate.rate).toFixed(2);
                     // }
                     // else {
                     //     featuredConversionAmount = data.amount;
                     // }
 
                     var productinfo = await product.find({_id: data.productId});
                     var productData = await JSON.parse(JSON.stringify(productinfo)); 
                     var userinfo = await user.findOne({_id: productinfo[0].userId});
                     var currentUserInfo = await user.findOne({_id: currentUser.userId})
                     var siteData = await site.findOne({});
                     var productTitle = productinfo && productinfo[0] && productinfo[0].language && productinfo[0].language.filter(x => x.langCode === "en").map(t=>{
                         return t.title
                     })
                     var pageNumber;
                     var filter = {};
                     var filters = {};
                     const prodDetails = await updateFetchedProducts(pageNumber, filters, filter, dBdata, productData, "needMore");
 
                     if(data.type === "instantBuy") {
                         var paymentFor = "instantBuy"
                         var amount = prodDetails && prodDetails[0] && (prodDetails[0].usdProductRate ? Number(prodDetails[0].usdProductRate) : Number(0)) + (prodDetails[0].usdShippingRate ? Number(prodDetails[0].usdShippingRate) : Number(0)) + (Number(prodDetails[0].usdServiceFeeBuyerRate) ? Number(prodDetails[0].usdServiceFeeBuyerRate) : Number(0));                    
                         var totalSellerServiceFee = prodDetails && prodDetails[0] && ((prodDetails[0].usdProductRate ? Number(prodDetails[0].usdProductRate) : Number(0)) * (Number(siteData.serviceFeeSeller) / 100))
                         var addrData = currentUserInfo && currentUserInfo.buyerShippingAddress && currentUserInfo.buyerShippingAddress.find(i => i._id == data.addressId)
                     }
                     else {
                         var paymentFor = "featured"
                         var featuredlist = await featured.findOne({_id: data.featuredId});
                         if (featuredlist && featuredlist.currencyCode !== "USD"){                     
                             var featuredCurrentRate = await currency.findOne({code: featuredlist.currencyCode});   
                             var featuredConversionRate = featuredlist && featuredCurrentRate && (featuredlist.price / featuredCurrentRate.rate).toFixed(2);
                             var amount = Number(featuredConversionRate);
                         } else {
                             var amount = featuredlist && featuredlist.price;
                         }
                     }                    
 
                     // Braintree                    
                     if(data.paymentMode === "Braintree") {
                         var siteinfo = await site.findOne({});
                         var gateway = braintree.connect({
                             environment: braintree.Environment[siteinfo.Environment],
                             merchantId: siteinfo.MerchantId,
                             publicKey: siteinfo.PublicKey,
                             privateKey: siteinfo.PrivateKey
                         });
                         var newTransaction = await gateway.transaction.sale(
                             {
                             amount: amount && amount.toFixed(2),
                             paymentMethodNonce: data.nonce,
                             options: {
                                 submitForSettlement: true
                               }
                             } 
                         );
                         var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                         var transactions = await new transaction({
                             transactionId: newTransaction.transaction.id,
                             status: newTransaction.transaction.status,
                             amount: newTransaction.transaction.amount,
                             currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                             paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                             cardType: newTransaction.transaction.creditCard.cardType,
                             maskedNumber: newTransaction.transaction.creditCard.maskedNumber,
                             cardholderName: newTransaction.transaction.creditCard.cardholderName,
                             createdAt: newTransaction.transaction.createdAt,
                             updatedAt: newTransaction.transaction.updatedAt,
                             success: newTransaction.success,
                             productName: productTitle && productTitle[0],
                             productuserName: userinfo && userinfo.userName,
                             currencySymbol: currencyInfo && currencyInfo.symbol,
                             paymentMethod: "Braintree",
                             paymentFor: paymentFor
                         }).save();
 
                         if (newTransaction.success === true){
                             if(data.type === "instantBuy") { 
                                 var buy = await new instantBuy({
                                     productId: data.productId,
                                     buyerUserId: currentUser.userId, 
                                     sellerUserId: userinfo._id, 
                                     status: "PENDING",
                                     // transactionId: data.tokenId,
                                     orderDetails: {
                                         productId: data.productId,
                                         productName: productTitle && productTitle[0],
                                         productImage: productinfo[0] && productinfo[0].images[0] && productinfo[0].images[0].image, 
                                         productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                         shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                         totalFee: amount, 
                                         currency: "USD",
                                         currencySymbol: currencyInfo && currencyInfo.symbol,
                                         transactionId: newTransaction.transaction.id, 
                                         buyerName: currentUserInfo && currentUserInfo.userName, 
                                         sellerName: userinfo && userinfo.userName, 
                                         paymentStatus: "Success",
                                         paymentType: "Braintree",
                                         transactionId: newTransaction.transaction.id,
                                         serviceFeeBuyerRate: prodDetails[0] && Number(prodDetails[0].usdServiceFeeBuyerRate),
                                         serviceFeeSellerRate: totalSellerServiceFee
                                     },
                                     buyerShippingAddress: {
                                         Name: addrData && addrData.Name,
                                         country: addrData && addrData.country,
                                         address1: addrData && addrData.address1,
                                         address2: addrData && addrData.address2,
                                         city: addrData && addrData.city,
                                         state: addrData && addrData.state,
                                         zipCode: addrData && addrData.zipCode,
                                         phoneNumber: addrData && addrData.phoneNumber   
                                     }
                                 }).save()
                                 await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                                 await orderMail(userinfo.email, buy)
                                 await orderConfirmMail(currentUserInfo.email, buy)
                                 await notify(userinfo._id, "PENDING", productTitle, buy)
                             }
                             else {
                                 var featuredlist = await featured.findOne({_id: data.featuredId})   ;                             
                                 var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                                 var featuredExpiry = featuredlist && new Date(transTime + (featuredlist.validationPeriod * 60 * 60  * 1000));
                                 var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set:  { featuredTransactionId : newTransaction.transaction.id, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.   validationPeriod, featuredExpiry: featuredExpiry, featuredDescription:     featuredlist.description}});
                             }
                         }
                         if(data.channel == "mobile") {
                             delete newTransaction.transaction
                             return newTransaction
                         }
                         else {
                             return newTransaction;
                         }
                     }
 
                     //Paypal
                     if(data.paymentMode === "Paypal") {
                         var siteinfo = await site.findOne({});
                         var gateway = braintree.connect({
                             accessToken: siteinfo.paypalAppId
                         });
                         var newTransaction = await gateway.transaction.sale(
                             {
                             amount: amount && amount.toFixed(2),
                             paymentMethodNonce: data.nonce,
                             options: {
                                 submitForSettlement: true
                               }
                             } 
                         );
                         var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                         var transactions = await new transaction({
                             transactionId: newTransaction.transaction.id,
                             status: newTransaction.transaction.status,
                             amount: newTransaction.transaction.amount,
                             currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                             paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                             payerEmail: newTransaction.transaction.paypal.payerEmail,
                             paymentId: newTransaction.transaction.paypal.paymentId,
                             createdAt: newTransaction.transaction.createdAt,
                             updatedAt: newTransaction.transaction.updatedAt,
                             success: newTransaction.success,
                             productName: productTitle && productTitle[0],
                             productuserName: userinfo && userinfo.userName,
                             currencySymbol: currencyInfo && currencyInfo.symbol,
                             paymentMethod: "Paypal",
                             paymentFor: paymentFor
                         }).save();
                         if (newTransaction.success === true) {
                             // var buyOption = true //
                             if(data.type === "instantBuy") { // data.buyOption
                                 var buy = await new instantBuy({
                                     productId: data.productId,
                                     buyerUserId: currentUser.userId, 
                                     sellerUserId: userinfo._id, 
                                     status: "PENDING",
                                     transactionId: data.tokenId,
                                     orderDetails: {
                                         productId: data.productId,
                                         productName: productTitle && productTitle[0],
                                         productImage: productinfo[0] && productinfo[0].images[0] &&productinfo[0].images[0].image, 
                                         productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                         shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                         totalFee: amount, 
                                         currency: "USD",
                                         currencySymbol: currencyInfo && currencyInfo.symbol,
                                         transactionId: newTransaction.transaction.id, 
                                         buyerName: currencyInfo && currentUserInfo.userName, 
                                         sellerName: userinfo && userinfo.userName, 
                                         paymentStatus: "Success",
                                         paymentType: "Paypal",
                                         transactionId: newTransaction.transaction.id,
                                         serviceFeeBuyerRate: prodDetails[0] && Number(prodDetails[0].usdServiceFeeBuyerRate),
                                         serviceFeeSellerRate: totalSellerServiceFee
                                     },
                                     buyerShippingAddress: {
                                         Name: addrData && addrData.Name,
                                         country: addrData && addrData.country,
                                         address1: addrData && addrData.address1,
                                         address2: addrData && addrData.address2,
                                         city: addrData && addrData.city,
                                         state: addrData && addrData.state,
                                         zipCode: addrData && addrData.zipCode,
                                         phoneNumber: addrData && addrData.phoneNumber   
                                     }
                                 }).save()
                                 await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                                 await orderMail(userinfo.email, buy);
                                 await orderConfirmMail(currentUserInfo.email, buy)
                                 await notify(userinfo._id, "PENDING", productTitle, buy)
                             }
                             else {
                                 var featuredlist = await featured.findOne({_id: data.featuredId});                             
                                 var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                                 var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60  * 1000));
                                 var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set:  { featuredTransactionId : newTransaction.transaction.id, featured: data. featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.   validationPeriod, featuredExpiry: featuredExpiry, featuredDescription:     featuredlist.description}});    
                             }                            
                         }   
                         if(data.channel == "mobile") {
                             delete newTransaction.transaction
                             return newTransaction
                         }
                         else {
                             return newTransaction;
                         }
                     }
 
                     // Stripe payment
                     if (data.paymentMode === "Stripe") {
                         var stripeInfo = {
                             success : true,
                             transaction : {
                                 amount : amount && amount.toFixed(2)
                             }
                         };
                         await new transaction({
                             transactionId: data.tokenId,
                             status:  data.status,
                             amount: amount,
                             productName: productTitle && productTitle[0],
                             productuserName: userinfo && userinfo.userName,
                             createdAt: new Date().toISOString(),
                             updatedAt: new Date().toISOString(),
                             paymentMethod: "Stripe",
                             paymentFor: paymentFor
                         }).save();
 
                         if(data.type === "instantBuy") { 
                             var buy = await new instantBuy({
                                 productId: data.productId,
                                 buyerUserId: currentUser.userId, 
                                 sellerUserId: userinfo && userinfo._id, 
                                 status: "PENDING",
                                 transactionId: data.tokenId,
                                 orderDetails: {
                                     productId: data.productId,
                                     productName: productTitle && productTitle[0],
                                     productImage: productinfo[0] && productinfo[0].images[0] && productinfo[0].images[0].image, 
                                     productFee: prodDetails[0] && Number(prodDetails[0].usdProductRate),
                                     shippingRate: prodDetails[0] && Number(prodDetails[0].usdShippingRate),
                                     totalFee: amount, 
                                     currency: "USD",
                                     currencySymbol: "&#36;",
                                     transactionId: data.tokenId, 
                                     buyerName: currentUserInfo && currentUserInfo.userName, 
                                     sellerName: userinfo.userName, 
                                     paymentStatus: "Success",
                                     paymentType: "Stripe",
                                     serviceFeeBuyerRate: Number(prodDetails[0].usdServiceFeeBuyerRate),
                                     serviceFeeSellerRate: totalSellerServiceFee
                                 },
                                 buyerShippingAddress: {
                                     Name: addrData && addrData.Name,
                                     country: addrData && addrData.country,
                                     address1: addrData && addrData.address1,
                                     address2: addrData && addrData.address2,
                                     city: addrData && addrData.city,
                                     state: addrData && addrData.state,
                                     zipCode: addrData && addrData.zipCode,
                                     phoneNumber: addrData && addrData.phoneNumber   
                                 }
                             }).save()
                             await product.findOneAndUpdate({_id: data.productId}, {$set: {sellingStatus: "SoldOut"}})
                             await orderMail(userinfo.email, buy)
                             await orderConfirmMail(currentUserInfo.email, buy)
                             await notify(userinfo._id, "PENDING", productTitle, buy)
                         }
                         else {
                             var featuredlist = await featured.findOne({_id: data.featuredId});                   
                             var transTime = new Date().getTime();
                             var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                             var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : data.tokenId, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
                         }
                         if(data.channel == "mobile") {
                             delete stripeInfo.transaction
                             return stripeInfo
                         }
                         else {
                             return stripeInfo;
                         }
                     }
 
                     // Paypal
                     // if (data.paymentID) {
                     //         var paypalInfo = {
                     //             success : true,
                     //             transaction : {
                     //                 amount : data.amount,
                     //                 id: data.paymentID
                     //             }
                     //         };                            
                     //           await new transaction({
                     //             transactionId: data.paymentID,
                     //             amount: data.amount,
                     //             success: true,
                     //             productName: productTitle,
                     //             productuserName: userinfo.userName,
                     //             createdAt: new Date().toISOString(),
                     //             updatedAt: new Date().toISOString(),
                     //             paymentMethod: "Paypal"
                     //         }).save();
                     //             featuredlist = await featured.findOne({_id: data.featuredId});                   
                     //             transTime = new Date().getTime();
                     //             featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                     //             featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : data.paymentID, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
 
                     //         // paypal.configure({
                     //         //     'mode': 'sandbox', 
                     //         //     'client_id': 'AV1HpdhjmnA25Dmf24PTvGvygrUyFBZfpAevPD9JnzkO3-un64eEFSROI_t1gDUUHiyyzzRvFeHG9ZUk',
                     //         //     'client_secret': 'EMmenMl9ALnJ1nVZCQBfMwgiARoLT2Xqi1NM2Yquqxdks6RBJ3M_rurWQTnJ7G6Jm6ZwIycA6Y-VARs4'
                     //         //   });
                               
                     //         // paypal.payment.get(data.paymentID, async function (error, payment) {
                     //         //         if(payment){
                     //         //             console.log(payment)
                     //         //         } 
                     //         //         else{
                     //         //             throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentLater : language.en._paymentLater);
                     //         //         }
                     //         // });
                     //         return paypalInfo;
                     // }
                 }catch(error){
                     console.log("errrrr", error)
                     throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentLater : language.en._paymentLater);
                 }
            }
            else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
        refund: async (root,{id},{currentUser,site,req, instantBuy, user, mailtemp}) => {
            var burOrderDetails = await instantBuy.findOne({_id: id});
            var siteInfo = await site.findOne({});     
            
            if(burOrderDetails.orderDetails.paymentType === "Braintree"){
                var userData = await user.findOne({_id: burOrderDetails.buyerUserId});               
                var gateway = braintree.connect({
                    environment: braintree.Environment[siteInfo.Environment],
                    merchantId: siteInfo.MerchantId,
                    publicKey: siteInfo.PublicKey,
                    privateKey: siteInfo.PrivateKey
                });
                const res = await gateway.transaction.refund(burOrderDetails.orderDetails.transactionId);  
                if(res && res.success == false) {
                    // console.log("error", res)
                    throw new AuthenticationError(res.message);
                    // return res.message
                }
                if(res && res.success == true) {
                    // console.log("resp", res)
                    await instantBuy.findOneAndUpdate({_id: id}, { $set: { "orderDetails.refundSuccess": true, "orderDetails.refundId": res.transaction.id, "orderDetails.refundAmount": res.transaction.amount, "orderDetails.refundCurrency": res.transaction.currencyIsoCode } })
                    ///////  Mail
                    var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                    var bodymailtempDetail = await mailtemp.findOne({title: "Refund"});  
                    var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                    let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                    var getDefault = await site.find({});
                    var sites = getDefault && getDefault.find((a) => a);
                    let logoImg = sites && (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
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
                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{CustomerName}}/g, burOrderDetails.orderDetails.buyerName).replace(/{{REFUNDAMOUNT}}/g, burOrderDetails.orderDetails.totalFee).replace(/{{REFUNDCURRENCY}}/g, "$").replace(/{{ProductName}}/g, burOrderDetails.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{refundPayTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt1 : language.en._refundPayTxt1).replace(/{{refundPayTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt2 : language.en._refundPayTxt2).replace(/{{refundPayTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt3 : language.en._refundPayTxt3).replace(/{{refundPayTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt4 : language.en._refundPayTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                    var mailAddr = userData && userData.email;
                    let values = {
                            to: mailAddr,    
                            html: etempdataDynamic,
                            req: req
                        };
                    await sendMailAction.sendMail("Refund",values, mailAddr, (callback) => {     
                    })
                    ////
                    return "Refund Success"
                }
            }

            if(burOrderDetails.orderDetails.paymentType === "Stripe"){
                    var userData = await user.findOne({_id: burOrderDetails.buyerUserId});
                    var stripe = Stripe(siteInfo.stripeSecretKey);            
                    const res = await stripe.refunds.create({
                        payment_intent: burOrderDetails.orderDetails.transactionId,
                    })
                    if(res) {
                        await instantBuy.findOneAndUpdate({_id: id}, { $set: { "orderDetails.refundSuccess": true, "orderDetails.refundId": res.id, "orderDetails.refundAmount": res.amount, "orderDetails.refundCurrency": res.currency } })
                        ///////  Mail
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "Refund"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                        let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                        var getDefault = await site.find({});
                        var sites = getDefault && getDefault.find((a) => a);
                        let logoImg = sites && (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
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
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{CustomerName}}/g, burOrderDetails.orderDetails.buyerName).replace(/{{REFUNDAMOUNT}}/g, burOrderDetails.orderDetails.totalFee).replace(/{{REFUNDCURRENCY}}/g, "$").replace(/{{ProductName}}/g, burOrderDetails.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{refundPayTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt1 : language.en._refundPayTxt1).replace(/{{refundPayTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt2 : language.en._refundPayTxt2).replace(/{{refundPayTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt3 : language.en._refundPayTxt3).replace(/{{refundPayTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt4 : language.en._refundPayTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                        var mailAddr = userData && userData.email;
                        let values = {
                            to: mailAddr,    
                            html: etempdataDynamic,
                            req: req
                        };
                        await sendMailAction.sendMail("Refund",values, mailAddr, (callback) => {     
                        })
                        return await "Refund Success"
                    }
            }

            if(burOrderDetails.orderDetails.paymentType === "Paypal"){                
                var userData = await user.findOne({_id: burOrderDetails.buyerUserId});
                var gateway = braintree.connect({
                    accessToken: siteInfo.paypalAppId
                });              
                const res = await gateway.transaction.refund(burOrderDetails.orderDetails.transactionId);  
                if(res && res.success == true) {
                    await instantBuy.findOneAndUpdate({_id: id}, { $set: { "orderDetails.refundSuccess": true, "orderDetails.refundId": res.transaction.id, "orderDetails.refundAmount": res.transaction.amount, "orderDetails.refundCurrency": res.transaction.currencyIsoCode } })
                    ///////  Mail
                    var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                    var bodymailtempDetail = await mailtemp.findOne({title: "Refund"});  
                    var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                    let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                    var getDefault = await site.find({});
                    var sites = getDefault && getDefault.find((a) => a);
                    let logoImg = sites && (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
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
                    var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{CustomerName}}/g, burOrderDetails.orderDetails.buyerName).replace(/{{REFUNDAMOUNT}}/g, burOrderDetails.orderDetails.totalFee).replace(/{{REFUNDCURRENCY}}/g, "$").replace(/{{ProductName}}/g, burOrderDetails.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{refundPayTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt1 : language.en._refundPayTxt1).replace(/{{refundPayTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt2 : language.en._refundPayTxt2).replace(/{{refundPayTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt3 : language.en._refundPayTxt3).replace(/{{refundPayTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._refundPayTxt4 : language.en._refundPayTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                    var mailAddr = userData && userData.email;
                    let values = {
                        to: mailAddr,    
                        html: etempdataDynamic,
                        req: req
                    };
                    await sendMailAction.sendMail("Refund",values, mailAddr, (callback) => {     
                    })
                    return "Refund Success"
                }
                if(res && res.success == false) {
                    throw new AuthenticationError(res.message);
                    // return res.message
                }                          
            }           
        },        
        
        PayoutMethod: async (root, {id}, {site, instantBuy, user, product, req, mailtemp}) => {

            var siteInfo = await site.findOne();
            var orderdata = await instantBuy.findOne({_id: id})
            var userData = await user.findOne({_id: orderdata.sellerUserId})
            var stripe = Stripe(siteInfo.stripeSecretKey);  

            // service fee calc
            var totalRate = orderdata && orderdata.orderDetails && Number(orderdata.orderDetails.productFee + orderdata.orderDetails.shippingRate)
            var payoutFee = orderdata && orderdata.orderDetails && totalRate && Number(Number(totalRate) - (Number(orderdata.orderDetails.serviceFeeSellerRate))).toFixed(2)
            defaultData = userData && userData.payOutMethod && userData.payOutMethod.find((a) => a.default === true)
            if(defaultData == undefined) {
                throw new AuthenticationError("Seller doesn't add payout preference");                
            }

            if(defaultData && defaultData.type === "Stripe") {
                //  transfer        
                const tr = await stripe.transfers.create({
                amount: payoutFee && Number((payoutFee * 100).toFixed(2)),
                currency: 'USD',
                transfer_group: 'ORDER_95',
                destination: defaultData.stripeAccountCreatedNumber        
            })
            .then(async (res) => {
                // console.log("rrrr", res)
                if(res) {
                    await instantBuy.findOneAndUpdate({ _id: id }, { $set: { payoutStatus: "COMPLETED", status: "COMPLETED", payoutMethod: "Stripe", payoutId: defaultData.stripeAccountCreatedNumber, payoutAmount: payoutFee, payoutCurrency: "USD" } })
                    status = "Payment Success"
                        // var userInfo = await user.findOne({_id: orderdata.sellerUserId});
                        var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                        var bodymailtempDetail = await mailtemp.findOne({title: "PAYMENT RELEASE"});  
                        var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                        let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;
                        var getDefault = await site.find({});
                        var sites = getDefault && getDefault.find((a) => a);
                        let logoImg = sites && (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
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
                        var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{SellerName}}/g, orderdata.orderDetails.sellerName).replace(/{{PAYOUTAMOUNT}}/g, payoutFee).replace(/{{PAYOUTCURRENCY}}/g, "$").replace(/{{ProductName}}/g, orderdata.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{payTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt1 : language.en._payTxt1).replace(/{{payTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt2 : language.en._payTxt2).replace(/{{payTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt3 : language.en._payTxt3).replace(/{{payTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt4 : language.en._payTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{payTxt5}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt5 : language.en._payTxt5) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                        var mailAddr = userData && userData.email;
                        let values = {
                             to: mailAddr,    
                             html: etempdataDynamic,
                             req: req
                         };
                        await sendMailAction.sendMail("PAYMENT RELEASE",values, mailAddr, (callback) => {     
                        })
                }                
                // await user.findOneAndUpdate({_id: currentUser.userId}, { $push: { payOutMethod: data } });
            }).catch(err => {
                console.log("Stripe payout error", err)
                status = "Payment Failed"
            }); 
            }
            
            if(defaultData && defaultData.type === "Paypal") {
                var status;
                var paypal = require('paypal-rest-sdk');
                await paypal.configure({
                    'mode': siteInfo.paypalEnvironment,
                    'client_id': siteInfo.paypalClientId,  ////// 'AWtYIcinE841jOBtaPlQcEgAbqoIsi35iyITWEOD4WLatuWiia9MrzIcj3lUVz2cPW0Mr9lvSeVqh_FX',
                    'client_secret': siteInfo.paypalSecretKey ////'EGnbKyLj-UMntOsMfmTOTG0o_VirJbITU_VYSPfgRIa3D8dFTaVaNSldsnDbSVcw_xgoay9HUAQNh9qn'
                });
                var create_payment_json = {
                    "sender_batch_header": {
                        "email_subject": "You have a Payout!",
                        "recipient_type": "EMAIL"
                    },
                    "items": [
                        {
                            "recipient_type": "EMAIL",
                            "amount": {
                                "value": payoutFee,
                                "currency": "USD"
                            },
                            "note": "Thanks for your patronage!",
                            "sender_item_id": "201403140001",
                            "receiver": defaultData.paypal_email
                        }
                    ]
                };
    
                // await paypal.payout.create(create_payment_json,async function (err, data) {
                //     if (err) {
                //         console.log("ERRRRR", err);
                //         status = "Payment Failed"; 
                //     }
                //     else {
                //         console.log("Create Payment Response");
                //         console.log(data);
                //         status = "Payment Success";
                //     }  
                // });      

                let promise = new Promise( function(resolve, reject) {
                    paypal.payout.create(create_payment_json,async function (err, data) {
                        if (err) {
                            console.log("Paypal payout error", err);
                            status = "Payment Failed";
                            // status = err
                            reject(status) 
                        }
                        else {
                            console.log("Create Payment Response");
                            console.log(data);
                            data && await instantBuy.findOneAndUpdate({ _id: id }, { $set: { payoutStatus: data.batch_header.batch_status, payoutBatchId: data.batch_header.payout_batch_id, payoutMethod: "Paypal", payoutId: defaultData.paypal_email, payoutAmount: payoutFee, payoutCurrency: "USD" } })
                            status = "Payout Processing";
                            resolve(status)
                            // send mail                            
                            // var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                            // var bodymailtempDetail = await mailtemp.findOne({title: "PAYMENT RELEASE"});  
                            // var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent")
                            // let reqPath = `${process.env.URL + Site_Url}/fileStorage/uploads/img`;                     
                            // var getDefault = await site.find({});
                            // var sites = getDefault.find((a) => a);
                            // let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
                            // let link = `${URL + Site_Url}`;                                        
                            // let facebookLink = `${sites.fbLink }`;                                          
                            // let fbshow = "display:none";
                            // if(facebookLink){
                            //     fbshow = "";                 
                            // }                   
                            // let instagramlink = `${sites.instagramLink}`; 
                            // let instagramshow = "display:none";
                            // if(instagramlink){
                            //     instagramshow = "";                   
                            // }                     
                            // let twitterLink = `${sites.twLink}`;
                            // let twittershow = "display:none";
                            // if(twitterLink){
                            //     twittershow = "";                    
                            // }  
                            // let youtubeLink = `${sites.utubeLink}`;
                            // let youtubeshow = "display:none";
                            // if(youtubeLink){
                            //     youtubeshow = "";                    
                            // }                      
                            // var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{SellerName}}/g, orderdata.orderDetails.sellerName).replace(/{{PAYOUTAMOUNT}}/g, payoutFee).replace(/{{PAYOUTCURRENCY}}/g, "$").replace(/{{ProductName}}/g, orderdata.orderDetails.productName).replace(/{{Dear}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Dear : language.en._Dear).replace(/{{payTxt1}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt1 : language.en._payTxt1).replace(/{{payTxt2}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt2 : language.en._payTxt2).replace(/{{payTxt3}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt3 : language.en._payTxt3).replace(/{{payTxt4}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._payTxt4 : language.en._payTxt4).replace(/{{thankyou}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thankyou : language.en._thankyou).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);   
                            // var mailAddr = userData && userData.email;
                            // let values = {
                            //     to: mailAddr,    
                            //     html: etempdataDynamic,
                            //     req: req
                            // };
                            // await sendMailAction.sendMail("PAYMENT RELEASE",values, mailAddr, (callback) => {     
                            // })                            
                        }  
                    });
                })
                await promise;
            }
            return await status           
        }        
    }
};

module.exports = resolvers;
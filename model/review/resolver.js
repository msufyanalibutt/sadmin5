
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {ForbiddenError, AuthenticationError} = require("apollo-server");
const {feedBackTemplate} = require("../../handler");
const {URL} = process.env;
const {site} = require("../../dbSchema");
var request = require("request");
var admin = require("firebase-admin");


// reusable function for send notifications to devices based on deviceId
// var callNotify = async function(message, deviceId) {
//     var siteSetting = await site.findOne({}, "fcmServerKey fcmSenderId");
//         var data = {
//             "data": {
//                 type: 'review',
//                 body: message
//             },
//             "to": deviceId
//         };
//         console.log(data)
//         const dataString = JSON.stringify(data);
//         const headers = {
//             'Authorization': `key=${siteSetting.fcmServerKey}`,
//             'Content-Type': 'application/json',
//             'Content-Length': dataString.length
//         }
//         const options = {
//             url: 'https://fcm.googleapis.com/fcm/send',
//             method: 'POST',
//             headers: headers,
//             json: data
//         }
//         request(options, function (err, res, body) {
//             if (err) throw err
//             else console.log("notified")
//         })
// }


const resolvers = {
    Query: {
        // get all product based review shared between the users..
        getReviews: async (root, args, {review, currentUser, user}) => {
            if (currentUser.adminUserId) {
                const userList = await user.find({}, "userName");
                var reviews = await review.find({});
                if (reviews && reviews.length) {
                    reviews.forEach((r) => {
                        var uf = userList && userList.find((u) => u.id == r.userFrom);
                        if (uf.userName) {
                            r.fromName = uf.userName;
                        }
                        var ut = userList && userList.find((u) => u.id == r.userTo);
                        if (ut.userName) {
                            r.toName = ut.userName;
                        }
                    });
                    return reviews;
                }
            }
            throw new AuthenticationError(errors.unauthorized);
        },
        // get a review based on from & to user Id's
        getReview: async (root, {userId}, {review, currentUser, req, user}) => {
            // currentUser.userId == 10001
           // if(currentUser.userId) {
                feedBackTemplate(req);  
                var foundReview = await review.findOne({userFrom: currentUser.userId, userTo: userId});
                // var foundReview = await review.findOne({userFrom: 10001, userTo: 10000});

                // console.log("ffff", foundReview)
                if (foundReview) {
                    const userList = await user.find({}, "userName profileImage imageSource");
                    var ut = userList && userList.find((u) => u.id == foundReview.userTo);
                    if (ut.userName) {
                        foundReview.toName = ut.userName;
                    }
                    if (ut.profileImage) { 
                        foundReview.imageUrl = (ut.profileImage.indexOf("graph.facebook.com") >=0 || ut.profileImage.indexOf("googleusercontent.com") >=0) ? 
                        ut.profileImage : (ut.imageSource === "local") ? `${URL + req.headers.host}/fileStorage/uploads/users/${ut.id}/${ut.profileImage}` : (ut.imageSource === "cloud") ? ut.profileImage : "";
                    }
                    else {
                        foundReview.imageUrl = `${URL + req.headers.host}/fileStorage/static/default.png`;                    
                    }
                    return {foundReview, feedBack};
                } else {
                    return {feedBack};
                }
            //}
           // throw new AuthenticationError(errors.unauthorized);
        }
    },
    Mutation: {
        updateReview: async (root, {id, data}, {currentUser, review, notification, user, req}) => {
            if (currentUser.userId) {
                var message, deviceToken;
                data.userFrom = currentUser.userId;
                if (data.reviewId) {
                    // review update operation goes here..
                   let alreadyReviewedUser =  await review.find({reviewId: data.reviewId})
                   if(alreadyReviewedUser && alreadyReviewedUser.length > 0){
                    data.updatedAt = Date.now();
                    data.createdAt = Date.now();
                    var updatedReview = await review.findOneAndUpdate({reviewId: data.reviewId}, {$set: data});
                    if (updatedReview) {
                        // message = `${currentUser.userName} ${typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reviewUpdateMessage : language.en._reviewUpdateMessage}`;                       
                        message = `${currentUser.userName} ${language.en._reviewUpdateMessage}`;
                        var notifyData = {
                            type: "review",
                            userFrom: currentUser.userId,
                            userTo: data.userTo,
                            new: false
                        };
                        await new notification(notifyData).save();
                        deviceToken = await user.findOne({_id: data.userTo});
                        if(typeof(deviceToken.deviceId) !== "undefined") {
                            if(deviceToken.device === "android") {
                                var payload = {
                                    notification: {
                                        title: message,
                                        body: data.feedBack[0]
                                        },
                                    data: {
                                    type: "review",
                                    title: message,
                                    message: data.feedBack[0],
                                    },                  
                                    token: deviceToken.deviceId
                                };
                                admin.messaging().send(payload)
                                    .then((result) => {
                                       console.log("review push notification result", result)
                                    })
                                    .catch((err) => {
                                        console.log("review push notification err", err);
                                        throw new Error(err); 
                                    });
                                }
                                if(deviceToken.device === "ios") {                        
                                    var payload = {
                                        notification: {
                                        title: message,
                                        body: data.feedBack[0]
                                        },
                                        data: {
                                            type: "review",
                                            title: message ,
                                            message: data.feedBack[0],
                                        }
                                    };
                                    admin.messaging().sendToDevice(deviceToken.deviceId, payload)
                                    .then((result) => {
                                    console.log("review push notification result", result)
                                    }).catch((err) => {
                                    console.log("review push notification err", err);
                                    throw new Error(err); 
                                    });  
                                }
                            }
                        // if (deviceToken && deviceToken.deviceId)
                        // await callNotify(message, deviceToken.deviceId); //call for send notifications to a user who"s review updated by current user
                        return true;
                    }else {
                        throw new Error(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reviewError : language.en._reviewError);
                    }
                   }else{
                    data.updatedAt = Date.now();
                    data.createdAt = Date.now();
                    var updatedReview = await await new review(data).save();
                    if (updatedReview) {
                        // message = `${currentUser.userName} ${typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reviewUpdateMessage : language.en._reviewUpdateMessage}`;                       
                        message = `${currentUser.userName} ${language.en._reviewUpdateMessage}`;
                        var notifyData = {
                            type: "review",
                            userFrom: currentUser.userId,
                            userTo: data.userTo,
                            new: false
                        };
                        await new notification(notifyData).save();
                        deviceToken = await user.findOne({_id: data.userTo});
                        // deviceToken.deviceId = "eY7wMSxmUkfxml5Uue6tuk:APA91bFbhHpZSqrKPmm3nNlsadoeQxCpITggH5t558BB00FjiuA9UYvj2Ydi0s3GCPA_8zQaaF2IidHiuop-ByzHDhE4Z9y0rTErRT1B-4wvZTy8iDLtKL2w4IZhxxIbvL8yBXg9SkXu"
                        // deviceToken.device = "ios"
                        if(typeof(deviceToken.deviceId) !== "undefined") {
                            if(deviceToken.device === "android") {
                                var payload = {
                                    notification: {
                                        title: message,
                                        body: data.feedBack[0]
                                        },
                                    data: {
                                    type: "review",
                                    title: message,
                                    message: data.feedBack[0],
                                    },                  
                                    token: deviceToken.deviceId
                                };
                                admin.messaging().send(payload)
                                    .then((result) => {
                                       console.log("review push notification result", result)
                                    })
                                    .catch((err) => {
                                        console.log("review push notification err", err);
                                        throw new Error(err); 
                                    });
                                }
                                if(deviceToken.device === "ios") {                        
                                    var payload = {
                                        notification: {
                                        title: message,
                                        body: data.feedBack[0]
                                        },
                                        data: {
                                            type: "review",
                                            title: message ,
                                            message: data.feedBack[0],
                                        }
                                    };
                                    admin.messaging().sendToDevice(deviceToken.deviceId, payload)
                                    .then((result) => {
                                    console.log("review push notification result", result)
                                    }).catch((err) => {
                                    console.log("review push notification err", err);
                                    throw new Error(err); 
                                    });  
                                }
                            }
                        // if (deviceToken && deviceToken.deviceId)
                        // await callNotify(message, deviceToken.deviceId); //call for send notifications to a user who"s review updated by current user
                        return true;
                    }else {
                        throw new Error(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reviewError : language.en._reviewError);
                    }
                   }
                   
                } 
                
               
                return false;
            }
            throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        }
    }
};

module.exports = resolvers;
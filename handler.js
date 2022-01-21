const jwt = require("jsonwebtoken");
const path = require("path");
const Base64 = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
const { errors } = require("./error");
const language = require("./src/translations/api/lang.json");
var nodemailer = require("nodemailer");
var async = require("async");
var fs = require("fs-extra");
var crypto = require("crypto");
var schedule = require("node-schedule");
const { blackList, user } = require("./dbSchema");
var { ForbiddenError, AuthenticationError } = require("apollo-server");
const sendMailAction = require("./mailtemp");
const uuidv4 = require("uuid/v4");
var paginate = 20;
var rimraf = require("rimraf");
const getSymbolFromCurrency = require('currency-symbol-map')
var cloudinary = require('cloudinary').v2
const {site} = require("./dbSchema");

const fetch = require("node-fetch");
const exec = require('child_process').exec;

const { DB_Name, DB_Username, DB_Password, DB_Host, DB_Backup, REACT_APP_Domain_Url, Site_Url, URL,Currency_Conversion_AppId, cloud_name, api_key, api_secret } = process.env;

const currentPath = process.cwd();

const bkpfilePath = path.join(currentPath, '/upload/backup/');
var dbOptions = {
    user: DB_Username,
    pass: DB_Password,
    host: DB_Host,
    port: 27017,
    database: DB_Name,
    autoBackup: DB_Backup === "true" ? true : false,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: bkpfilePath // i.e. /var/database-backup/
};

/* return date object */
const stringToDate = function (dateString) {
    return new Date(dateString);
}

/* return if variable is empty or not. */
const empty = function (mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};

const getClientSecret = (appleClientId,appleKeyIdentifier,appleTeamId,appleP8File) => {
  const privateKey = fs.readFileSync(`fileStorage/uploads/appleAuth/authp8File/${appleP8File}`);
  const headers = {
        alg: "ES256",
        kid: appleKeyIdentifier
    }
    const timeNow = Math.floor(Date.now() / 1000);
    const claims = {
          "iss": appleTeamId,
          "iat": timeNow,
          "exp": timeNow + 15777000,
          "aud": "https://appleid.apple.com",
          "sub": appleClientId,
    }

  var token = jwt.sign(claims, privateKey, {
    algorithm: "ES256",
    header: headers,
    //expiresIn: "24h"
  });
  return token;
  
}

const getUserId = (token) => {
	const parts = token.split(".");
	try {
        //console.log("inside getUser",JSON.parse(new Buffer(parts[1], "base64").toString("ascii")))
		return JSON.parse(new Buffer(parts[1], "base64").toString("ascii"));
	} catch (e) {
		return null;
	}
}


  // JWT Middleware
  const getUser = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization;
    if (!!token && token !== "undefined") {
      var foundBlackList = await blackList.findOne({token: token});
      if (foundBlackList) {
        req.user = null;
      } else {
        req.user = await jwt.verify(token, process.env.JWT_SECRET);
        if (req.user) {
          var found = await user.findOne({_id: req.user.userId});
          if (!found) {
            req.user = null;
          }
          else if (found.status === "Inactive") {
            req.user = null;
          }
        }
      }
    } else {
      req.user = null;
    }
    next();
  };
  var session = require("express-session");
  var MemoryStore = require("session-memory-store")(session);
  // config for SESSION middleware
  const options = {
    name: "access_token",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
      httpOnly: true,
      path: "/",
      //maxAge: new Date(Date.now() + (30 * 86400 * 1000)),
      secure: false
    }
  };

  // create JWT token with current user informations.
  const createToken = (user, secret, expiresIn) => {
    const { userName, email, id} = user;
    return jwt.sign({userName, email, userId: id}, secret, {expiresIn});
  };

  // reusable function to get result in user signin/signup
  const findUser = async function(found, loginType, {headers, site, currency}) {
    var {host, channel, lang} = headers;
    if(!found) {
      throw new ForbiddenError(typeof(language[lang]) !== "undefined" ? language[lang]._usernotFound : language.en._usernotFound);
    }
    var getDefault = await site.findOne({}, "defaultCurrency");
    const currecy = getDefault && await currency.findOne({code: getDefault.defaultCurrency}, "code symbol");
    let result = {
        userId: found.id,
        userName : found.userName,
        profileImage : found.profileImage ? 
        loginType === "signin" ? (found.imageSource === "local") ? `${process.env.URL+host}/fileStorage/uploads/users/${String(found._id)}/${found.profileImage}` : (found.imageSource === "cloud") ? found.profileImage : "" :
        (found.profileImage.indexOf("graph.facebook.com") >=0 || found.profileImage.indexOf("googleusercontent.com") >=0) ? 
        found.profileImage : (found.imageSource === "local") ? `${process.env.URL+host}/fileStorage/uploads/users/${String(found._id)}/${found.profileImage}` : (found.imageSource === "cloud") ? found.profileImage : "" : `${process.env.URL+host}/fileStorage/static/default.png`,
        currencyCode: currecy ? currecy.code : "",
        currencySymbol: currecy ? currecy.symbol : "",
        token : !!(channel === "mobile")
         ? createToken(found, process.env.JWT_SECRET, "1yr")
         : "",
        location: found.location
    };
    return {result};
  }
  
  // social login reusable function
  const socialLogin = async function (user, data, loginType, {req, site, currency}) {
    var foundUser = await user.findOne(loginType);
    if (foundUser) {
      if (foundUser.status !== "Active") {
        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
      }
      if (req.session && !req.headers.channel) {
        req.session.userId = foundUser.id;
        req.session.role = foundUser.role;
        req.session.userName = foundUser.userName;
    }
      return findUser(foundUser, "", {headers: req.headers, site, currency});
    } else {
        if (data.email) {
            var foundAgain = await user.findOne({email: data.email});
            if (foundAgain) {
              let key = Object.keys(loginType)[0];
              if (foundAgain.status !== "Active") {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
              } else if (!foundAgain[key]) {
                let pImage = foundAgain.profileImage ? foundAgain.profileImage : data.profileImage;
                var toInsert = {};
                toInsert[key] = data[key];
                toInsert.profileImage = pImage;
                if(data.googleId) {
                  toInsert["verifications.google"] = true
                } else if(data.faceBookId) {
                  toInsert["verifications.faceBook"] = true
                } else if(data.appleId) {
                  toInsert["verifications.apple"] = true
                }
                const updateInfo = await user.findOneAndUpdate({_id: foundAgain._id}, {$set: toInsert}, {new: true});
                if (req.session && !req.headers.channel) {
                  req.session.userId = foundAgain.id;
                  req.session.role = foundAgain.role;
                  req.session.userName = foundAgain.userName;
              }
                return findUser(updateInfo, "", {headers: req.headers, site, currency});
              } else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._emailExists : language.en._emailExists);
              }
            } else if (!foundAgain) {
              if(data.googleId) {
                data["verifications.google"] = true
              } else if(data.faceBookId) {
                data["verifications.faceBook"] = true
              } else if(data.appleId) {
                data["verifications.apple"] = true
              }
              var newUser = await new user(data).save();
              //await user.findOneAndUpdate({_id: newUser._id});
              if (req.session && !req.headers.channel) {
                req.session.userId = newUser.id;
                req.session.role = newUser.role;
                req.session.userName = newUser.userName;
            }
              return findUser(newUser, "", {headers: req.headers, site, currency});
            }
        } else {
            return {noEmail: true};
        }
    }
}

  //to get customized time values
  const dateAdd = function (date, type, reqLang) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return type === "short" ? interval + "y" : interval + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._yearsago : language.en._yearsago)}`;
    }
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return type === "short" ? interval + "m" : interval + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._monthsago : language.en._monthsago)}`;
    }
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return type === "short" ? interval + "d" : interval + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._daysago : language.en._daysago)}`;
    }
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return type === "short" ? interval + "h" : interval + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._hoursago : language.en._hoursago)}`;
    }
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return type === "short" ? interval + "min" : interval + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._minutesago : language.en._minutesago)}`;
    }
  
    return type === "short" ? "0min" : Math.floor(seconds) + ` ${(typeof(language[reqLang]) !== "undefined" ? language[reqLang]._secondsago : language.en._secondsago)}`;
  }


// date function
const date = () => {
  return Date().toString();
};

// to check given string is Base64
const isBase64 = function(str) {
  const len = str.length;
  if (!len || !Base64.test(str)) {
    return false;
  }
  const firstPaddingChar = str.indexOf("=");
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === "=");
}

//image upload reusable function
const imageUpload = (data, id, type) => {
  if (data.includes("jpeg"||"jpg") || data.includes("png")) {
    //if(data){
    var ext = data.split(";")[0].match(/jpeg|jpg|png/)[0];
    var image = data.replace(/^data:image\/\w+;base64,/, "");
    var imageName = "user" + Date.now() + "." + ext;

    const imagePath = path.join("fileStorage", "uploads", type, String(id));
    if(!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    fs.writeFile(
      path.join(imagePath, imageName),
        image,
        "base64",
        function(err) {
           //console.log(err);
        });
        return imageName;
  } else {
    throw new ForbiddenError("Invalid file type. Images must be in PNG or JPG format and under 5mb ");
  }
};

//reusable function to delete images
const deleteImage = (data, id, type) => {
  const imagePath = path.join("fileStorage", "uploads", type, String(id), data);
  if(fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return true;
  }
};

const deleteImageFolder = (id, type) => {
  const imagePath = path.join("fileStorage", "uploads", type, String(id));
  // console.log("immmm", imagePath)
  if(fs.existsSync(imagePath)) {    
    rimraf(imagePath, function () { 
      console.log("done"); 
      return true;
    });
  }
};

const deleteCloudImageFolder = async (id, type) => {
  var siteData = await site.findOne();
  cloudinary.config({
    cloud_name: siteData && siteData.cloudName,
    api_key: siteData && siteData.cloudApiKey,
    api_secret: siteData && siteData.cloudApiSecret
  });
  const imagePath = path.join("fileStorage", "uploads", type, String(id));
  // const streamLoad = cloudinary.api.delete_folder( -- only for empty folder
  let promise = new Promise( async function(resolve, reject) {    
    const streamLoad = cloudinary.api.delete_resources_by_prefix(
        imagePath, 
        function (error, result) {
        if (result) {
          status = result
          console.log("cloudfolder result", result);
          resolve(status)
        } else {
          status = error && error.message        
          // console.log("foldele errorrrrrrrr ", error);          
          reject(status)
        }
      });
  })
  await promise;
  return await status;
};

// reusable function to get products from DB 
const updateFetchedProducts = async (pageNumber, filters, filter, data, approvedSellingProducts, type) => {
  
  let {user, currency, req, currentUser, chat, category, filterCategory, bUser, product, featured, transaction, site} = data;
  
  const users = await user.find({}, "profileImage userName imageSource");
  var categories = await category.find({});
  const currencies = await currency.find({}, "code symbol rate");
  var chosenCurrency = await currency.findOne({code: req.headers.currency});
  // var approvedSellingProducts = await product.find(filters);
  var products = approvedSellingProducts;
  var featuredDetails = await featured.find({});
  var filterData = await filterCategory.find({});
  var siteData = await site.findOne()
  // var transactionDetails = await transaction.find({})

  if (currentUser.userId) {
    var groups = await chat.find({userId: currentUser.userId});
    var blockedList = await bUser.find({userFrom: currentUser.userId});
  } else {
    groups = [];
    blockedList = [];
  }

  approvedSellingProducts && approvedSellingProducts.forEach(function(pro) {    
    // returning rate & currency according to the currency conversion   
    
    var productCurrentRate = currencies && currencies.find((c) => c.code == pro.currencyCode);
    var usdCurrency = currencies && currencies.find((c) => c.code == "USD");
    pro.purchaseCurrencyCode = "USD"
    pro.purchaseCurrencySymbol = usdCurrency && usdCurrency.symbol
    if(pro.currencyCode != "") {  ///     if  USD rate = 1
      pro.usdProductRate = pro.rate && productCurrentRate && (pro.rate / productCurrentRate.rate).toFixed(2);      
      usdShippingFee = pro.shippingRate && productCurrentRate && (pro.shippingRate / productCurrentRate.rate).toFixed(2);      
      if(isNaN(usdShippingFee) === false){
        pro.usdShippingRate = usdShippingFee
      }

      serviceFeeBuyerPercentage = siteData && siteData.serviceFeeBuyer
      var serviceFeeBuyerRate = pro.rate && serviceFeeBuyerPercentage && ((pro.rate) * (serviceFeeBuyerPercentage / 100)).toFixed(2)
      pro.serviceFeeBuyerRate = serviceFeeBuyerRate 

      var usdServiceFeeBuyerRate = pro.usdProductRate && serviceFeeBuyerPercentage && ((pro.usdProductRate) * (serviceFeeBuyerPercentage / 100)).toFixed(2)
      pro.usdServiceFeeBuyerRate = usdServiceFeeBuyerRate     
    }

    if (pro.currencyCode != req.headers.currency && pro.currencyCode != "") {
          // var productCurrentRate = currencies.find((c) => c.code == pro.currencyCode);   
          // productConversionRate = pro.rate && productCurrentRate && (pro.rate / productCurrentRate.rate).toFixed(2);
          // pro.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);

          productConversionRate = pro.rate && productCurrentRate && (pro.rate / productCurrentRate.rate);
          pro.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate);
          if(pro.rate && pro.rate > 0.1) {
            // productConversionRate = pro.rate && productCurrentRate && (pro.rate / productCurrentRate.rate).toFixed(2);
            pro.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);
          }
          else {
            pro.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(5);
          }

          // shippingConversionRate = pro.shippingRate && productCurrentRate && (pro.shippingRate / productCurrentRate.rate).toFixed(2);
          // pro.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate).toFixed(2);   
          shippingConversionRate = pro.shippingRate && productCurrentRate && (pro.shippingRate / productCurrentRate.rate);
          pro.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate);   
          if(pro.shippingRate && pro.shippingRate > 0.1) {
            pro.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate).toFixed(2);   
          }
          else {
            pro.shippingRate = shippingConversionRate && chosenCurrency && (shippingConversionRate * chosenCurrency.rate).toFixed(5);   
          }

          var serviceFeeBuyerRate = pro.rate && serviceFeeBuyerPercentage && ((pro.rate) * (serviceFeeBuyerPercentage / 100)).toFixed(2)
          pro.serviceFeeBuyerRate = serviceFeeBuyerRate         
    }

    if (pro.currencyCode != req.headers.currency && pro.currencyCode != ""){
      pro.currencyCode = req.headers.currency;
    }

    if (pro.currencyCode) {
        for(var i=0; i<currencies.length; i++) {
            if (currencies[i].code == pro.currencyCode) {
                pro.currencySymbol = currencies[i].symbol;
            }
        }
    }    
  
    pro.priceDetails = [];
    if(pro.currencyCode) {
      if(pro.rate) {
        priceData = {
          key: "rate",
          title: "Product Fee",
          value: `${getSymbolFromCurrency(pro.currencyCode) + " " + pro.rate}`
        }
        pro.priceDetails.push(priceData)
      }
      if(pro.shippingRate) {
        priceData = {
          key: "shippingRate",
          title: "Shipping Fee",
          value: `${getSymbolFromCurrency(pro.currencyCode) + " " + pro.shippingRate}`
        },
        pro.priceDetails.push(priceData)
      }
      if(pro.serviceFeeBuyerRate) {
        priceData = {
          key: "serviceFeeBuyerRate",
          title: "ServiceFeeBuyerRate",
          value: `${getSymbolFromCurrency(pro.currencyCode) + " " + pro.serviceFeeBuyerRate}`
        }
        pro.priceDetails.push(priceData)
      }
    }
  });
if (filter) {
  if (filter.rangeFilter && filter.rangeFilter.length > 0) {
    rangeFilterProducts = [];
    approvedSellingProducts && approvedSellingProducts.map((j) => {
    filteredProduct = [];
    filter.rangeFilter.map((i) => {
        if (i.rangeFrom && i.rangeTo) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue >= i.rangeFrom && a.rangeValue <= i.rangeTo && a.fieldId == i.fieldId)
        }
        if (i.rangeFrom && !i.rangeTo) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue >= i.rangeFrom && a.fieldId == i.fieldId)
        }
        if (i.rangeTo && !i.rangeFrom) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue <= i.rangeTo && a.fieldId == i.fieldId)
        }
          if(rangeData && rangeData.length > 0) {
            filteredProduct.push(j)
          }          
      })
      if (filteredProduct.length === filter.rangeFilter.length) {
        rangeFilterProducts.push(filteredProduct[0])
      }
    })
    approvedSellingProducts = rangeFilterProducts
    products =  rangeFilterProducts && rangeFilterProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
  }

  if (filter.rateFrom && filter.rateTo) {    
    approvedSellingProducts = approvedSellingProducts && approvedSellingProducts.filter((a) => a.rate >= filter.rateFrom && a.rate <= filter.rateTo);

    products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    
    if (filter.sortBy == 1){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (filter.rateFrom && !filter.rateTo) {
    approvedSellingProducts = approvedSellingProducts && approvedSellingProducts.filter((a) => a.rate >= filter.rateFrom);

    products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);

    if (filter.sortBy == 1){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (!filter.rateFrom && filter.rateTo) {
    approvedSellingProducts = approvedSellingProducts && approvedSellingProducts.filter((a) => a.rate <= filter.rateTo);

    products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    
    if (filter.sortBy == 1){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (filter.sortBy && filter.sortBy != 0) {
    if (filter.sortBy == 1){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products = approvedSellingProducts && approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }
}
    products && products.forEach(function(pro) {
    
      fName = pro && pro.language && pro.language.filter((f) => f.langCode === req.headers.lang);
        if (fName && fName.length === 0){                        
            fName = pro && pro.language && pro.language.filter((f) => f.langCode === "en");
        }
        fName && fName.map(i => {          
          pro.title = i.title,
          pro.description = i.description;                       
        });

      if (pro.location && pro.location.lat_lon && pro.location.lat_lon.length) {
        var temp = pro.location.lat_lon[0];
        pro.location.lat_lon[0] = pro.location.lat_lon[1];
        pro.location.lat_lon[1] = temp;
      }

      if(pro && pro.categoryFields) {
        pro.categoryFieldsInfo = [];
        
        pro && pro.categoryFields && pro.categoryFields.map((i) => {
          var catField = (filterData && filterData.find((f) => f.id == i.fieldId) || []);
          var catFieldLanguageParent = catField && catField.language && catField.language.map((i) => {
            valueParentData = i && i.values && i.values.map((a) => {
              return a.valueParent
            });            
          return valueParentData;
          });
  
          if (catFieldLanguageParent && catFieldLanguageParent.length > 0) {
            for (x = 0; x<catFieldLanguageParent.length; x++) {
              if ((catFieldLanguageParent[x].indexOf(i.fieldParent)) >= 0) {
                var parentIndex = catFieldLanguageParent[x].indexOf(i.fieldParent);
              }              
            }
          }

          var catFieldLanguageChild = catField && catField.language && catField.language.map((a) => {
            valueChildData = a && a.values && a.values.map((a) => {
              vC = a && a.valueChild && a.valueChild.map((b) => {                
                return b.valueChildData
              })
              return vC
            });     
          return valueChildData;
          });
          
          var catFieldLanguageChildName = catField && catField.language && catField.language.map((a) => {
            valueChildDataName = a && a.values && a.values.map((a) => {
              vCName = a && a.valueChild && a.valueChild.map((b) => {
                if (b._id == i.fieldChild) {
                  return b.valueChildData
                }
              })
              return vCName
            });     
          return valueChildDataName;
          });

          if(catFieldLanguageChildName && catFieldLanguageChildName.length > 0) {            
              arr = catFieldLanguageChildName.filter(e => String(e).trim());
              if (arr.length > 0){
                names = arr.join("").toString()
                childName = names.replace(/,/g, "")
              }
            }
         
          if (catFieldLanguageChild && catFieldLanguageChild.length > 0) {  
              for (z = 0; z<catFieldLanguageChild.length; z++) {
                for (y = 0; y<catFieldLanguageChild[z].length; y++) {
                  if ((catFieldLanguageChild[z][y].indexOf(childName)) >= 0) {
                        var childIndex = catFieldLanguageChild[z][y].indexOf(childName);
                  }                
                } 
              }                                                         
          }

          var fName = catField && catField.language && catField.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = catField && catField.language && catField.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((j) => {
            categoryFieldsData = {};            
            j && j.values && j.values.map((v) => {
              if (!!v.valueParent && v.valueChild && !(i.rangeValue)){
                if(j.values[parentIndex] != undefined) {
                  categoryFieldsData.fieldParent = j.values[parentIndex].valueParent;
                }
                // if(j.values[0].valueChild[childIndex] != undefined) {
                if(j.values[parentIndex].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[parentIndex].valueChild[childIndex]._id;                
                  categoryFieldsData.fieldChildName = j.values[parentIndex].valueChild[childIndex].valueChildData
                }
              }
              if (!!v.valueChild && !v.valueParent && !(i.rangeValue)){
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[0].valueChild[childIndex]._id;                
                  categoryFieldsData.fieldChildName = j.values[0].valueChild[childIndex].valueChildData
                }
              }
            })
            categoryFieldsData.fieldName = j.name;
            categoryFieldsData.fieldId = i.fieldId;
            categoryFieldsData.rangeValue = i.rangeValue;
            categoryFieldsData.inputTag = catField.inputTag;
            categoryFieldsData.rangeMinValue = catField.min;
            categoryFieldsData.rangeMaxValue = catField.max;
            
            pro.categoryFieldsInfo.push(categoryFieldsData)
          });              
        });
      }

      if (pro.categoryId) {
        var ci = categories && (categories.find((cat) => cat.id == pro.categoryId) || []);        
        var fName = ci && ci.language && ci.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = ci && ci.language && ci.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((i) => {                        
             pro.category = i.name;
          });     
      }
      if (groups && groups.length) {
        groups.forEach((group) => {
          if(group.productId == pro._id) {
            pro.groupsId = group.id;
            pro.groupsName = group.groupName;
          }
        });
      }
      if (pro.userId) {
        pro.isBlocked = !!((blockedList.find((bl) => bl.userTo == pro.userId ) || {}).id) || false;
        pro.userName = (users.find((u) => u._id == pro.userId) || {}).userName;
      }
      if (currentUser.userId && pro) {
        if(currentUser.userId == pro.userId) {
          pro.chatType = "seller";
        } else {
          pro.chatType = "buyer";
        }
      }
      if (pro.images && pro.images.length) {
        for (var i=0; i<pro.images.length; i++) {
          if(pro.images[i] == ""){
          pro.images[i] = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;
          } else if (pro.images[i] != "") {
            pro.images[i] = (pro.images[i].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/products/${String(pro._id)}/${pro.images[i].image}` : (pro.images[i].imageSource === "cloud") ? pro.images[i].image : "";
          }
        }
      }
      // returning rate & currency according to the currency conversion    
      if (pro.currencyCode != req.headers.currency && pro.currencyCode != "") {
            var productCurrentRate = currencies && currencies.find((c) => c.code == pro.currencyCode);   
            productConversionRate = pro.rate && productCurrentRate && (pro.rate / productCurrentRate.rate).toFixed(2);
            pro.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);   
      }
  
      if (pro.currencyCode != req.headers.currency && pro.currencyCode != ""){
        pro.currencyCode = req.headers.currency;
      }
  
      if (pro.currencyCode) {
          for(var i=0; i<currencies.length; i++) {
              if (currencies[i].code == pro.currencyCode) {
                  pro.currencySymbol = currencies[i].symbol;
              }
          }
      }    
      if (pro.userId) {
          for(var i=0; i<users.length; i++) {
              if (users[i]._id == pro.userId) {
                  var imagePath = users[i].profileImage ?
                   (users[i].profileImage.indexOf("graph.facebook.com") >=0 || users[i].profileImage.indexOf("googleusercontent.com") >=0) ? 
                   users[i].profileImage : (users[i].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}` : (users[i].imageSource === "cloud") ? users[i].profileImage : ""
                   : `${URL+req.headers.host}/fileStorage/static/default.png`;
                  // if(!fs.existsSync(`fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`)) {
                  //   imagePath = `${URL+req.headers.host}/fileStorage/static/default.png`;
                  //   }
                  pro.userProfile = imagePath;
                 //pro.ejabberId = users[i].ejabberId;
              }
          }
        }
        if (pro.createdAt) {
          pro.timeAgo = dateAdd(pro.createdAt, "", "en");
        }
        if (type === "needMore") {
          if (currentUser.userId && pro.likedUsers.length) {
            pro.likedUsers && pro.likedUsers.forEach(function(fav) {
                if (currentUser.userId == fav) {
                    return pro.isFav = true;
                }
            });
          }
          if (currentUser.userId && pro.viewers.length) {
            pro.viewers && pro.viewers.forEach(function(view) {
              if (currentUser.userId == view || currentUser.userId == pro.userId) { return pro.viewed = true; }
            });
          }
        }
        
        //pro.ProductsCount = approvedSellingProducts.length        
        // pro.ProductsCount = Math.ceil(approvedSellingProducts.length / paginate)
       
       if (pro.featured != null) {
          featuredData = featuredDetails.find((f) => f._id == pro.featured);
            fName = featuredData && featuredData.language && featuredData.language.filter((f) => f.langCode === req.headers.lang);
              if (fName.length === 0){                        
                  fName = featuredData.language.filter((f) => f.langCode === "en");
              }
              fName && fName.map((i) => {
                  pro.featuredName = i.name,
                  pro.featuredDescription = i.description;                     
              });
        }
      });
    
    return products;
  };

  // cofiguration for sort
  const sortConfig = [
    {key:0, value: "createdAt", order:"-"},
    {key:1, value: "rate", order:""},
    {key:2, value: "rate", order:"-"},
    {key:3, value:"location", order: null},
  ];

  // reusable function to get admin products from DB 
  const updateAdminFetchedProducts = async (data, products, type) => {
    let {user, currency, req, currentUser, chat, category,filterCategory, bUser, featured, transaction} = data;
    
    const users = await user.find({}, "profileImage userName imageSource");
    var categories = await category.find({}, "name type");
    const currencies = await currency.find({}, "code symbol");
    var filterData = await filterCategory.find({});
  
    if (currentUser.userId) {
      var groups = await chat.find({userId: currentUser.userId});
      var blockedList = await bUser.find({userFrom: currentUser.userId});
    } else {
      groups = [];
      blockedList = [];
    }
  
      products.forEach(function(pro) {
      
      if (pro.location && pro.location.lat_lon && pro.location.lat_lon.length) {
        var temp = pro.location.lat_lon[0];
        pro.location.lat_lon[0] = pro.location.lat_lon[1];
        pro.location.lat_lon[1] = temp;
      }
  
      if(pro.categoryFields) {
        pro.categoryFieldsInfo = [];
        
        pro && pro.categoryFields && pro.categoryFields.map((i) => {
          var catField = (filterData && filterData.find((f) => f.id == i.fieldId) || []);
  
          var catFieldLanguageParent = catField && catField.language && catField.language.map((i) => {
            valueParentData = i && i.values && i.values.map((a) => {
              return a.valueParent
            });            
          return valueParentData;
          });
  
          if (catFieldLanguageParent && catFieldLanguageParent.length > 0) {
            for (x = 0; x<catFieldLanguageParent.length; x++) {
              if ((catFieldLanguageParent[x].indexOf(i.fieldParent)) >= 0) {
                var parentIndex = catFieldLanguageParent[x].indexOf(i.fieldParent);
              }              
            }
          }
  
          var catFieldLanguageChild = catField && catField.language && catField.language.map((a) => {
            valueChildData = a && a.values && a.values.map((a) => {
              vC = a && a.valueChild && a.valueChild.map((b) => {                
                return b.valueChildData
              })
              return vC
            });     
          return valueChildData;
          });
          
          var catFieldLanguageChildName = catField && catField.language && catField.language.map((a) => {
            valueChildDataName = a && a.values && a.values.map((a) => {
              vCName = a && a.valueChild.map((b) => {
                if (b._id == i.fieldChild) {
                  return b.valueChildData
                }
              })
              return vCName
            });     
          return valueChildDataName;
          });
  
          if(catFieldLanguageChildName && catFieldLanguageChildName.length > 0) {            
              arr = catFieldLanguageChildName.filter(e => String(e).trim());
              if (arr.length > 0){
                names = arr.join("").toString()
                childName = names.replace(/,/g, "")
              }
            }
         
          if (catFieldLanguageChild && catFieldLanguageChild.length > 0) {  
              for (z = 0; z<catFieldLanguageChild.length; z++) {
                for (y = 0; y<catFieldLanguageChild[z].length; y++) {
                  if ((catFieldLanguageChild[z][y].indexOf(childName)) >= 0) {
                        var childIndex = catFieldLanguageChild[z][y].indexOf(childName);
                  }                
                } 
              }                                                         
          }
  
          var fName = catField && catField.language && catField.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = catField && catField.language && catField.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((j) => {
            categoryFieldsData = {};            
            j && j.values && j.values.map((v) => {
              if (!!v.valueParent && v.valueChild && !(i.rangeValue)){
                if(j.values[parentIndex] != undefined) {
                  categoryFieldsData.fieldParent = j.values[parentIndex].valueParent;
                }
                // if(j.values[0].valueChild[childIndex] != undefined) {
                if(j.values[parentIndex].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[parentIndex].valueChild[childIndex]._id;
                }
               // categoryFieldsData.fieldChildName = j.values[parentIndex].valueChild[childIndex].valueChildData
              }
              if (!!v.valueChild && !v.valueParent && !(i.rangeValue)){
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[0].valueChild[childIndex]._id;
                }
               // categoryFieldsData.fieldChildName = j.values[0].valueChild[childIndex].valueChildData
              }
            })
            categoryFieldsData.fieldName = j.name;
            categoryFieldsData.fieldId = i.fieldId;
            categoryFieldsData.rangeValue = i.rangeValue;
            pro.categoryFieldsInfo.push(categoryFieldsData)
          });              
        });
      }
  
      if (pro.categoryId) {
        var ci = (categories && categories.find((cat) => cat.id == pro.categoryId) || []);
        pro.category = ci.name;
      }
      if (groups && groups.length) {
        groups.forEach((group) => {
          if(group.productId == pro._id) {
            pro.groupsId = group.id;
            pro.groupsName = group.groupName;
          }
        });
      }
      if (pro.userId) {
        pro.isBlocked = !!((blockedList.find((bl) => bl.userTo == pro.userId ) || {}).id) || false;
        pro.userName = users && (users.find((u) => u._id == pro.userId) || {}).userName;
      }
      if (currentUser.userId && pro) {
        if(currentUser.userId == pro.userId) {
          pro.chatType = "seller";
        } else {
          pro.chatType = "buyer";
        }
      }
      if (pro.images && pro.images.length) {
        for (var i=0; i<pro.images.length; i++) {
          if(pro.images[i] == ""){
          pro.images[i] = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;
          } else if (pro.images[i] != "") {
            pro.images[i] = (pro.images[i].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/products/${String(pro._id)}/${pro.images[i].image}` : (pro.images[i].imageSource === "cloud") ? pro.images[i].image : "";
          }
        }
      }
      if (pro.currencyCode) {
          for(var i=0; i<currencies.length; i++) {
              if (currencies[i].code == pro.currencyCode) {
                  pro.currencySymbol = currencies[i].symbol;
              }
          }
      }
      if (pro.userId) {
          for(var i=0; i<users.length; i++) {
              if (users[i]._id == pro.userId) {
                  var imagePath = users[i].profileImage ?
                   (users[i].profileImage.indexOf("graph.facebook.com") >=0 || users[i].profileImage.indexOf("googleusercontent.com") >=0) ? 
                   users[i].profileImage : (users[i].imageSource === "local") ? `${URL+req.headers.host}/fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}` : (users[i].imageSource === "cloud") ? users[i].profileImage : "" 
                   : `${URL+req.headers.host}/fileStorage/static/default.png`;
                  // if(!fs.existsSync(`fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`)) {
                  //   imagePath = `${URL+req.headers.host}/fileStorage/static/default.png`;
                  //   }
                  pro.userProfile = imagePath;
                 //pro.ejabberId = users[i].ejabberId;
              }
          }
        }
        if (pro.createdAt) {
          pro.timeAgo = dateAdd(pro.createdAt, "", "en");
        }
        if (type === "needMore") {
          if (currentUser.userId && pro.likedUsers.length) {
            pro.likedUsers.forEach(function(fav) {
                if (currentUser.userId == fav) {
                    return pro.isFav = true;
                }
            });
          }
          if (currentUser.userId && pro.viewers.length) {
            pro.viewers.forEach(function(view) {
              if (currentUser.userId == view || currentUser.userId == pro.userId) { return pro.viewed = true; }
            });
          }
        }
  
      });
    
      return products;
    };

  // cofiguration for feedback types
  // const feedBack = {
  //   "primaryLevel": ["Polite", "Showed up on time", "Quick responses", "Fair prices", "Helpful", "Trustworthy"],
  //   "secondaryLevel": ["Not Polite", "Didn"t show up", "Slow responses", "Unfair prices", "Item not as advertised", "Not trustworthy"]
  // };
// console.log(feedBack)

const commonRoster = async (params, type) => {
  let { chat, user, product, currentUser, req, bUser, message, currency, deleteChat } = params;
    var currentUserData = await user.findOne({_id: currentUser.userId})
    if(currentUserData.status != "Active") {
      throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
    }
    var allUsers = await user.find();
    var allProducts = await product.find();
    var allBlocked = await bUser.find({});
    var allDeletechat = await deleteChat.find({});
    var currencies = await currency.find({ status: "Active" });
    var chatResult1 = await chat.find({ productuserId: currentUser.userId });
    var chatResult2 = await chat.find({ userId: currentUser.userId });
    var chatResult = chatResult1.concat(chatResult2);                
    var msg = await message.find({});
    // const readMessage = await message.find({$and: [{room : data.id}, {userId: {$ne: currentUser.userId}}]})

    chatResult.forEach((cr) => {
      var newId;
      if (currentUser.userId == cr.productuserId) {
          newId = cr.userId;
      } else if (currentUser.userId == cr.userId) {
          newId = cr.productuserId;
      }
      var specUser = allUsers && allUsers.find((au) => au.id == newId);
      var specProduct = allProducts && allProducts.find((ap) => ap.id == cr.productId);
      if (specUser && specProduct) {
        cr.userName = specUser && specUser.userName;
        cr.userId = specUser && specUser.id;
        var IsBlocked = allBlocked && allBlocked.find((ab) => ab.userFrom == currentUser.userId && ab.userTo == specUser.id);
        var BlockedBy = allBlocked && allBlocked.find((ab) => ab.userTo == currentUser.userId && ab.userFrom == specUser.id);
        if (IsBlocked) {
            cr.isBlocked = true;
        }
        if (BlockedBy) {
            cr.blockedBy = true;
        }
        var DeleteChat = allDeletechat && allDeletechat.find((ad) => ad.userFrom == currentUser.userId && ad.userTo == newId && ad.chatroomId == cr.id)
        if (DeleteChat) {
            cr.deleteChat = true;
        }
        cr.profileImage = specUser.profileImage ?
            (specUser.profileImage.indexOf("graph.facebook.com") >= 0 || specUser.profileImage.indexOf("googleusercontent.com") >= 0) ?
                specUser.profileImage : (specUser.imageSource === "local") ? `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(specUser._id)}/${specUser.profileImage}` : (specUser.imageSource === "cloud") ? specUser.profileImage : ""
            : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`;
        if (cr.productuserId == currentUser.userId) {
            cr.role = "seller";
        }
        else {
            cr.role = "buyer";
        }
        fName = specProduct && specProduct.language && specProduct.language.filter((f) => f.langCode === req.headers.lang);
        if (fName.length === 0) {
            fName = specProduct && specProduct.language && specProduct.language.filter((f) => f.langCode === "en");
        }
        fName.map((i) => {
            cr.productName = i.title;
        });

        var chosenCurrency = currencies && currencies.find(c => c.code == req.headers.currency);
        if (specProduct.currencyCode != req.headers.currency && specProduct.currencyCode != "") {
          var speCurr = currencies && currencies.find((c) => c.code == specProduct.currencyCode);
          productConversionRate= specProduct && speCurr && specProduct.rate && speCurr.rate && (specProduct.rate / speCurr.rate);
          cr.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate);
          if(cr.rate && cr.rate > 0.1) {
            cr.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(2);            
          }
          else {
            cr.rate = productConversionRate && chosenCurrency && (productConversionRate * chosenCurrency.rate).toFixed(5);
          }
          cr.currencyCode = req.headers.currency;
          cr.currencySymbol = chosenCurrency && chosenCurrency.symbol;
          shippingConversionRate = specProduct.shippingRate && (specProduct.shippingRate / speCurr.rate);
          cr.shippingRate = shippingConversionRate && (shippingConversionRate * chosenCurrency.rate);  
          if(cr.shippingRate && cr.shippingRate > 0.1) {
            cr.shippingRate = shippingConversionRate && (shippingConversionRate * chosenCurrency.rate).toFixed(2);  
          }
          else {
            cr.shippingRate = shippingConversionRate && (shippingConversionRate * chosenCurrency.rate).toFixed(5);  
          }
        }
        else {
          cr.rate = specProduct && specProduct.rate && (specProduct.rate).toFixed(2);
          cr.currencyCode = specProduct && specProduct.currencyCode;
          var speCurr = currencies && currencies.find((c) => c.code == specProduct.currencyCode);
          if (speCurr) {
              cr.currencySymbol = speCurr.symbol;
          }
          cr.shippingRate = specProduct && specProduct.shippingRate && (specProduct.shippingRate).toFixed(2);
        }

        cr.sellingStatus = specProduct.sellingStatus === "SoldOut" ? !!specProduct.isFree ? "SoldOut" : "Soldout" : "";
        if (specProduct.images && specProduct.images.length) {
            if (specProduct.images[0] == "") {
                cr.image = `${URL + req.headers.host}/fileStorage/static/defaultproduct.png`;
            }
            else {
                cr.image = (specProduct.images[0].imageSource === "local") ? `${URL + req.headers.host}/fileStorage/uploads/products/${String(specProduct._id)}/${specProduct.images[0].image}` : (specProduct.images[0].imageSource === "cloud") ? specProduct.images[0].image : "";
            }
        }
        if(specProduct.images && specProduct.images.length == 0) {
            cr.image = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;                                
        }
        if(specProduct.isDeleted === true){
            cr.isDeleted = true;
        }
        if(specUser.status != "Active") {
          cr.chatStatusMsg = (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._userInactive : language.en._userInactive)
        }
        else if(specProduct.isDeleted == true) {
          cr.chatStatusMsg = (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productDeleted : language.en._productDeleted)
        }
        else if(specProduct.status == "Rejected") {
          cr.chatStatusMsg = (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productRejected : language.en._productRejected)
        }
        if (cr.id) {
            cr.groupId = cr.id;
        }
        var m = msg && msg.filter((a) => a.room == cr.id);
        message = m && m.map((item) => {
            return item.createdAt;
        });
        cr.lastseen = message[message.length - 1]
        if (cr.lastseen == undefined) {
            cr.lastseen = cr.createdAt
        }
        if(m && m.length == 0) {
          cr.isEmptyMsg = true
        }
        else {
          cr.isEmptyMsg = false
        }

        var rM = msg && msg.filter((a) => a.room == cr.id && a.userId != currentUser.userId);
        readMessage = rM && rM.map((item) => {
            return item.readMessage;
        });
        var filtered = readMessage && readMessage.filter(function (el) {
            return el == false;
        });
        cr.unreadMessage = filtered && filtered.length;
      }
    })
    switch (type) {
      case "Selling":
        return chatResult && chatResult.filter((cr) => cr.role === "seller");
      case "Buying":
        return chatResult && chatResult.filter((cr) => cr.role === "buyer");
      case "Blocked":
        var pus = [];
        let blocked = chatResult && chatResult.filter((cr) => !!cr.isBlocked);
        blocked.length && blocked.map((m) => !(pus.find(f => f.userId == m.userId)) && pus.push(m));
        return pus;
      default:
        const sorted = chatResult && chatResult.sort((a, b) => {
          if ((a.lastseen && b.lastseen) != undefined) {
              const aDate = a.lastseen;
              const bDate = b.lastseen;
              return bDate - aDate;
          }
          else if ((a.lastseen == undefined) && (b.lastseen != undefined)) {
              const aDate = a.createdAt;
              const bDate = b.lastseen;
              return bDate - aDate;
          }
          else if ((b.lastseen == undefined) && (a.lastseen != undefined)) {
              const aDate = a.lastseen;
              const bDate = b.createdAt;
              return bDate - aDate;
          }
          else if ((a.lastseen && b.lastseen) == undefined) {
              const aDate = a.createdAt;
              const bDate = b.createdAt;
              return bDate - aDate;
          }
        })
        // console.log("roosss", sorted)
        return sorted;
    }
}

const feedBackTemplate = (req) => {
  feedBack = {
    "primaryLevel": [typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Polite : language.en._Polite, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Showedupontime : language.en._Showedupontime, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Quickresponses : language.en._Quickresponses, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Fairprices : language.en._Fairprices, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Helpful : language.en._Helpful, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Trustworthy : language.en._Trustworthy],
    "secondaryLevel": [typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._NotPolite : language.en._NotPolite, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Didnotshowup : language.en._Didnotshowup, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Slowresponses : language.en._Slowresponses, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Unfairprices : language.en._Unfairprices, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Itemnotadvertised : language.en._Itemnotadvertised, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Nottrustworthy : language.en._Nottrustworthy]
  };
  return feedBack;      
};

  // configuration for delete operation
  const mapConfig = (params) => {
    let { user, category, filterCategory, product, admin, chat, currency, reason, feedBack,featured,adBanner,language,metatags,staticPages, forceUpdate } = params;
    var configArray = [
      {key: "category", value: category},
      {key:"product", value: product},
      {key:"admin", value: admin},
      {key:"chat", value: chat},
      {key:"user", value: user},
      {key:"currency", value: currency},
      {key:"reason", value: reason},
      {key:"feedback", value : feedBack},
      {key:"featured", value: featured},
      {key:"banner", value: adBanner},
      {key:"language",value:language},
      {key: "metatags", value:metatags},
      {key: "staticPages", value:staticPages},
      {key: "filterCategory", value:filterCategory},
      {key: "forceUpdate", value:forceUpdate}
  ];
  return configArray;
  };

  // configuration for map products & user reviews w.r.t types like ForSale, SoldOut, favourites
  // And review is to list user reviews
  const typeConfig = [
    {key:1, value: "ForSale"},
    {key:2, value:"SoldOut"},
    {key:3, value: "favourites"},
    {key:4, value:"review"}
  ];

// reusable function to send token to user email id 
var sendToken = function(params, callback) {
  var {email, user, req, emailAdmin,mailtemp,site} = params;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function(token, done) {
      user.findOne({email}, function(err, foundUser) {
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        foundUser.save(function(err) {
          done(err, token, foundUser);
        });
      });
    },
    async function(token, foundUser, done) {
      var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
      var bodymailtempDetail = await mailtemp.findOne({title: "forgot_password"});  
      var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
      let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
      var getDefault = await site.find({});
      var sites = getDefault && getDefault.find((a) => a);
      let link = `${REACT_APP_Domain_Url+"reset-password/" + token}`;
      let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : ""; 

      //let link = "http://localhost:3000/reset-password/"+token;
      let headerlink = `${URL + Site_Url}`; 
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
      var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, headerlink) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, foundUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{RESET}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reset : language.en._reset).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{PASSWORD}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._password : language.en._password).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{RESETCONTENT}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._resetContent : language.en._resetContent).replace(/{{SETPASSWORD}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._setPassword : language.en._setPassword).replace(/{{IGNOREMAIL}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ignoreMail : language.en._ignoreMail) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow).replace(/{{YOUTUBETITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._youtubeTitle : language.en._youtubeTitle).replace(/{{TWITTERTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._twitterTitle : language.en._twitterTitle).replace(/{{INSTAGRAMTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._instagramTitle : language.en._instagramTitle).replace(/{{FACEBOOKTITLE}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._facebookTitle : language.en._facebookTitle);
      // var emailAdmin = await site.findOne({}, "fromAddress fromName uName password");         
      // call the function for sending password reset token to the user`s email
      // return sendToken({email, user, req, emailAdmin});
      var mailAddr = email;
       let values = {
           to: mailAddr,    // email 
           html: etempdataDynamic,
           req: req
       };

      sendMailAction.sendMail("forgetPwd",values, mailAddr, function(err, res) {
              done(err, res);
            });
          }
        ], function(err) { if (err) console.log("err",err); });
        return { result: typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._successMailSend : language.en._successMailSend };
      }

      // reusable function to create non existing path
  const createPath = (imagePath, name) => {
        if(!fs.existsSync(imagePath)) {
          fs.mkdirSync(imagePath);
        }
        return path.join(imagePath, name);
    }

// store uploaded files in specified path (Web Services)
  // const storeUpload = async ({ createReadStream }, filename, id, type) => {
  const storeUpload = async ({ stream }, filename, id, type) => {
    let promise = new Promise(async(resolve, reject) => {
      // const stream = createReadStream();
      // console.log("streammmmm")
      await stream
        .pipe(fs.createWriteStream(createPath(path.join("fileStorage", "uploads", type, String(id)), filename)))
        .on("finish", () => resolve())
        .on("error", reject)
    }
    );
    await promise;
    // console.log("gggg", promise)
    // await Promise.all([promise]);
  }

  // const storeUpload = ({ stream }, filename, id, type) => 
  //   new Promise((resolve, reject) =>
  //   stream
  //     .pipe(fs.createWriteStream(createPath(path.join("fileStorage", "uploads", type, String(id)), filename)))
  //     .on("finish", () => resolve())
  //     .on("error", reject),
  //   console.log("fffffffff")
  // );

  const documentUpload = ({ stream }, filename) => 
    new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(createPath(path.join("fileStorage", "uploads", "stripeDocuments"), filename)))
      .on("finish", () => resolve())
      .on("error", reject)
  );

  const iosImageUpload = (data, fileName) => {
    if (data.includes("jpeg"||"jpg") || data.includes("png")) {
      //if(data){
      // var ext = data.split(";")[0].match(/jpeg|jpg|png/)[0];
      var image = data.replace(/^data:image\/\w+;base64,/, "");
      // var imageName = "documentImage" + Date.now() + "." + ext;
  
      const imagePath = path.join("fileStorage", "uploads", "stripeDocuments");
      if(!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath);
      }
      fs.writeFile(
        path.join(imagePath, fileName),
          image,
          "base64",
          function(err) {
             //console.log(err);
          });
          console.log("afteriosImageUpload", image)
          return fileName;
    } else {
      throw new ForbiddenError("Invalid file type. Images must be in PNG or JPG format and under 5mb ");
    }
  };

  // store uploaded files in specified path (Web Services)   
// const storeUpload = async ({ stream }, filename, id, type) => {
//   cloudinary.config({
//     cloud_name: 'deonpjx2g',
//     api_key: '762959425588872',
//     api_secret: 'Gz-67Dw7Y7kktXBhAK5ngc87ooo',
//   });
//   await cloudinaryUpload({ stream }, filename, id, type);
// }
//  new Promise((resolve, reject) =>   
//    stream     
//      .pipe(fs.createWriteStream(createPath(path.join("fileStorage", "uploads", type, String(id)), filename)))     //   .on("finish", () => resolve())     //   .on("error", reject)   }

const cloudinaryUpload = async ({ stream }, filename, id, type, base64File, device) => {
  var siteData = await site.findOne();
  cloudinary.config({
    cloud_name: siteData && siteData.cloudName,
    api_key: siteData && siteData.cloudApiKey,
    api_secret: siteData && siteData.cloudApiSecret
  });
  let promise = new Promise( async function(resolve, reject) {
    if(device == "ios") {
      var imgName = `product_${Date.now()}`;
      cloudinary.uploader.upload(base64File,
        { public_id: `fileStorage/uploads/${type}/${String(id)}/${imgName}` },
        function(error, result) {
        if (result) {
          status = result
          // console.log("baseeeeeeee", result);
          resolve(status)
        } else {
          status = error && error.message        
          console.log("base error ", error);
          reject(status)
        }
      });
    }
    else {
      const streamLoad = cloudinary.uploader.upload_stream(
        {
          folder: `fileStorage/uploads/${type}/${String(id)}`,
          // use_filename: true
        },
        function (error, result) {
        if (result) {
          status = result
          // console.log("resultttttttttttttt ", result);
          resolve(status)
        } else {
          status = error && error.message        
          console.log("error ", error);
          reject(status)
        }
      });
      // var stream = createReadStream();
      stream.pipe(streamLoad);
    }
  })
  await promise;
  return await status;
};

const cloudinaryImageDelete = async (imageUrl) => {
  var siteData = await site.findOne();
  cloudinary.config({
    cloud_name: siteData && siteData.cloudName,
    api_key: siteData && siteData.cloudApiKey,
    api_secret: siteData && siteData.cloudApiSecret
  });

  var imageName = imageUrl.split("fileStorage").pop();
  var deleteImg = imageName.split(".").shift();
  // console.log("ffffffff", `fileStorage${deleteImg}`)
  let promise = new Promise( async function(resolve, reject) {    
    const streamLoad = cloudinary.uploader.destroy(
       `fileStorage${deleteImg}`,
        function (error, result) {
        if (result) {
          status = result
          console.log("cloud dele result", result);
          resolve(status)
        } else {
          status = error && error.message        
          // console.log("dele errorrrrrrrr ", error);
          reject(status)
        }
      });    
  })
  await promise;
  return await status;
};


const currencyUpdateCron = () => {
  schedule.scheduleJob("0 0 * * *", function(){
    // fetch(`https://api.exchangeratesapi.io/latest?base=${result.defaultCurrency}`)
      fetch(`https://openexchangerates.org/api/latest.json?app_id=${Currency_Conversion_AppId}`)
      .then((res) => res.json())
      .then((json) => {
          let bulkOps = [];
          let rateData = json.rates;
          Object.keys(rateData).forEach((k, index) => {
            bulkOps.push({
              updateOne: {
                filter: { code: k },
                update: { $set: {rate: rateData[k]} }
              }
            });
          });

          //Model.bulkWrite returns a promise allows using (then, catch)
          currency.bulkWrite(bulkOps)
            .then((result) => {
              //console.info("Bulk update information::", result);
            })
            .catch(e => {
              console.error("Error at bulk update::", e);
            });
      });
  })
}

 // Auto backup script
const dbAutoBackUp = () => {
    // check for auto backup is enabled or disabled
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        const currentDate = stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            // beforeDate = _.clone(currentDate);
            // beforeDate = JSON.stringify(JSON.parse(currentDate));
            beforeDate = currentDate;
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) {});
                    }
                }
            }
            console.log("backup successfully")
        });
    }
}

  const payoutCountry = [
    {
      "country_id": 13,
      "country_name": "Australia",
      "country_code": "AU",
      "currency_code": [
        "AUD"
      ]
    },
    {
      "country_id": 14,
      "country_name": "Austria",
      "country_code": "AT",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 21,
      "country_name": "Belgium",
      "country_code": "BE",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 38,
      "country_name": "Canada",
      "country_code": "CA",
      "currency_code": [
        "CAD",
        "USD"
      ]
    },
    {
      "country_id": 58,
      "country_name": "Denmark",
      "country_code": "DK",
      "currency_code": [
        "DKK",
        "EUR",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 72,
      "country_name": "Finland",
      "country_code": "FI",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 73,
      "country_name": "France",
      "country_code": "FR",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 80,
      "country_name": "Germany",
      "country_code": "DE",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 96,
      "country_name": "Hong Kong",
      "country_code": "HK",
      "currency_code": [
        "HKD"
      ]
    },
    {
      "country_id": 103,
      "country_name": "Ireland",
      "country_code": "IE",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 105,
      "country_name": "Italy",
      "country_code": "IT",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 107,
      "country_name": "Japan",
      "country_code": "JP",
      "currency_code": [
        "JPY"
      ]
    },
    {
      "country_id": 124,
      "country_name": "Luxembourg",
      "country_code": "LU",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 150,
      "country_name": "Netherlands",
      "country_code": "NL",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 153,
      "country_name": "New Zealand",
      "country_code": "NZ",
      "currency_code": [
        "NZD"
      ]
    },
    {
      "country_id": 160,
      "country_name": "Norway",
      "country_code": "NO",
      "currency_code": [
        "NOK",
        "EUR",
        "DKK",
        "GBP",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 172,
      "country_name": "Portugal",
      "country_code": "PT",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 192,
      "country_name": "Singapore",
      "country_code": "SG",
      "currency_code": [
        "SGD"
      ]
    },
    {
      "country_id": 199,
      "country_name": "Spain",
      "country_code": "ES",
      "currency_code": [
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 206,
      "country_name": "Sweden",
      "country_code": "SE",
      "currency_code": [
        "SEK",
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 207,
      "country_name": "Switzerland",
      "country_code": "CH",
      "currency_code": [
        "CHF",
        "EUR",
        "DKK",
        "GBP",
        "NOK",
        "SEK",
        "USD"
      ]
    },
    {
      "country_id": 226,
      "country_name": "United Kingdom",
      "country_code": "GB",
      "currency_code": [
        "GBP",
        "EUR",
        "DKK",
        "NOK",
        "SEK",
        "USD",
        "CHF"
      ]
    },
    {
      "country_id": 227,
      "country_name": "United States",
      "country_code": "US",
      "currency_code": [
        "USD"
      ]
    },
    {
      "country_id": 228,
      "country_name": "Brazil",
      "country_code": "BR",
      "currency_code": [
        "BRL"
      ]
    },
    {
      "country_id": 229,
      "country_name": "Mexico",
      "country_code": "MX",
      "currency_code": [
        "MXN"
      ]
    }
  ]

module.exports = {
  createToken,
  imageUpload,
  date,
  getUser,
  findUser,
  deleteImage,
  deleteImageFolder,
  isBase64,
  dateAdd,
  socialLogin,
  updateFetchedProducts,
  sortConfig,
  sendToken,
  typeConfig,
  storeUpload,
  mapConfig,
  feedBackTemplate,
  options,
  updateAdminFetchedProducts,
  getClientSecret,
  getUserId,
  payoutCountry,
  documentUpload,
  iosImageUpload,
  cloudinaryUpload,
  commonRoster,
  dbAutoBackUp,
  currencyUpdateCron,
  cloudinaryImageDelete,
  deleteCloudImageFolder
};


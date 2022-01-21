require("dotenv").config();
var fs = require("fs-extra");
const express = require("express");
var Path = require("path");
var cors = require("cors");
const {ApolloServer} = require("apollo-server-express");
var multer  = require("multer");
var upload = multer({ dest: "upload/" });
var session = require("express-session");
var cookieParser = require("cookie-parser");
var http = require("http");
var https = require("https");
var bodyParser = require("body-parser");
var schedule = require("node-schedule");
const axios = require("axios");
const querystring = require("querystring");
var compression = require("compression");

const {
    user,
    product,
    category,
    timezone,
    currency,
    country,
    admin,
    chat,
    site,
    review,
    bUser,
    uReport,
    pReport,
    reason,
    notification,
    blackList,
    feedBack,
    message,
    mailtemp,
    deleteChat,
    contactUs,
    featured,
    transaction,
    adBanner,
    language,
    staticPages,
    metatags,
    filterCategory,
    instantBuy,
    forceUpdate
} = require("./dbSchema");

const {getUser, options,getClientSecret,getUserId,socialLogin,dbAutoBackUp, currencyUpdateCron} = require("./handler");

const {
	URL,
	Port_Number, 
	Site_Url, 
	NODE_ENV, 
	REACT_APP_Domain_Url,
	SSLSecure,
    KeyFileName,
    KeyExtension,
    CertFileName,
    CertExtension
} = process.env;

const schema = require("./graphqlHelper");
process.env.NODE_ENV === "package" ? require('./connectPackage') : require('./connect')

const app = express();

app.use(compression());
// JWT Middelware
app.use(getUser);
// Cookie Parser middleware
app.use(cookieParser());
// Session middleware
app.use(session(options));
//app.use(bodyParser({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
    limit: "20mb",
    parameterLimit: 100000,
    extended: false
}));
app.use(bodyParser.json({
    limit: "20mb"
}));
app.use("/fileStorage", express.static("fileStorage"));
app.use("/readme", express.static("readme"));

const corsOptions = { credentials: true, origin: [
    URL+"localhost:3000", //for development use,
    URL+"localhost:4000",
    //`https://cowardly-starfish-15.localtunnel.me/graphql`,
    //`https://cowardly-starfish-15.localtunnel.me`,
    URL+`localhost:${Port_Number}`,
    URL+Site_Url,
    //`http://1ead8ac0.ngrok.io`
    //`https://localhost:4000`
], methods: ["GET", "POST"] };

//upload images to the server using rest api for mobile devices
app.post("/upload", upload.single("image"), function (req, res, next) {
    var target_path;
    var {type, productId, userId} = req.body;
    var id = req.user && req.user.userId;
    var {path, originalname} = req.file;
    if (id) {
        switch(type) {
            //upload images for users
            case "users":
            if (id == userId) {
                target_path = `fileStorage/uploads/${type}/${id}/${originalname}`;
                var src = fs.createReadStream(path);
                if(!fs.existsSync(`fileStorage/uploads/${type}/${id}`)) {
                    fs.mkdirSync(`fileStorage/uploads/${type}/${id}`);
                  }
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                src.on("end", async function() {
                    await user.findOneAndUpdate({_id: id}, {$set: {profileImage: originalname}});
                    fs.removeSync(path);
                    res.json({
                        status_message: "success",
                        status_code: "1",
                        path: `${URL + req.headers.host}/fileStorage/uploads/users/${String(id)}/${originalname}`
                });
                });
            } else {
                res.json({status_message: 'permission denied', status_code: '0'});
            }
            break;

            //upload images for products
            case "products":
            if (id == userId) {
                if (productId) {
                    target_path = Path.join("fileStorage", "uploads", type, productId);
                } else {
                    if (!fs.existsSync(Path.join("fileStorage", "temp"))) {
                        fs.mkdirSync(Path.join("fileStorage", "temp"));
                    }
                    target_path = Path.join("fileStorage", "temp", id);
                }
                src = fs.createReadStream(path);
                if(!fs.existsSync(target_path)) {
                    fs.mkdirSync(target_path);
                  }
                  var dest = fs.createWriteStream(Path.join(target_path, originalname));
                  src.pipe(dest);
                  src.on("end", async function() {
                      fs.removeSync(path);
                      res.json({status_message: "success", status_code: "1", image_url: URL + req.headers.host +"/"+ dest.path, image_name: originalname});
                    });
            } else {
                res.json({status_message: "permission denied", status_code: "0"});
            }
            break;
        }
        src.on("error", function(err) { res.json({status_message: "failure", status_code: "0"}); });
    } else {
            res.json({status_message: "user not authorized", status_code: "0"});
        }
    });


// configuration to customize graphql playground settings
    const GRAPHQL_PLAYGROUND_CONFIG = {
        folderName: "Passup",
        settings: {
            "request.credentials": "include",
        }
    };

// connect schema with graphql
const apollo = new ApolloServer({
    schema: schema,
    context: ({req}) => {
        if (req) {
            return {
                user,
                currentUser: req.user || req.session,
                product,
                category,
                country,
                currency,
                timezone,
                admin,
                chat,
                site,
                req,
                review,
                bUser,
                uReport,
                pReport,
                reason,
                notification,
                blackList,
                feedBack,
                message,
                mailtemp,
                deleteChat,
                contactUs,
                featured,
                transaction,
                adBanner,
                language,
                staticPages,
                metatags,
                filterCategory,
                instantBuy,
                forceUpdate
            }
        }
    },
    /*
    Disable/enable graphql playground depends on environment mode (production/development)
    "playground: false" used to disable graphql playground
    */

    playground: {GRAPHQL_PLAYGROUND_CONFIG,version: "1.7.25"},
    introspection: true
});



if(NODE_ENV === "development") {
    apollo.applyMiddleware({
        app,
        path: "/graphql",
        cors: corsOptions
    });
} else {
    apollo.applyMiddleware({
        app,
        path: "/graphql",
    });
}

  //https://silly-termite-4.localtunnel.me/fileStorage/uploads/products/${request.params.id}/${result.images[0]}
  //${process.env.REACT_APP_Domain_Url}fileStorage/uploads/products/${request.params.id}/${result.images[0]}
  //${process.env.REACT_APP_Domain_Url}products/${request.params.id}
  //https://silly-termite-4.localtunnel.me/products/${request.params.id}
app.get("/", function(request, response) {
    const filePath = Path.resolve(__dirname, "./build", "index.html");
    fs.readFile(filePath, "utf8", function (err,data) {
    if (err) {
      return console.log(err);
    }
    metatags.findOne({pageUrl: "/"}).then((result) => {
        if(result){
            if(result.language[0]){
                site.findOne({}, "googleAnalyticKey").then((res) => {
                    var title = result.language[0].pageTitle;
                    var description = result.language[0].metaDescription;
                    data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}`);
                    data = data.replace(/\$OG_TITLE/g, title);
                    data = data.replace(/\$An_Data/g, res.googleAnalyticKey)
                    result = data.replace(/\$OG_DESCRIPTION/g, description);
                    response.send(result);
                }).catch((err) => {
                    if(err){
                      site.findOne({}, "name googleAnalyticKey").then((result) => {
                          var title = result.name;
                          var description = result.name;
                          data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}`);
                          data = data.replace(/\$OG_TITLE/g, title);
                          data = data.replace(/\$An_Data/g, result.googleAnalyticKey);
                          result = data.replace(/\$OG_DESCRIPTION/g, description);
                          response.send(result);
                    });
                  }
                })
            } else{
                site.findOne({}, "name googleAnalyticKey").then((result) => {
                    var title = result.name;
                    var description = result.name;
                    data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}`);
                    data = data.replace(/\$OG_TITLE/g, title);
                    data = data.replace(/\$An_Data/g, result.googleAnalyticKey);
                    result = data.replace(/\$OG_DESCRIPTION/g, description);
                    response.send(result);
              });
            }
        }
      }).catch((err) => {
          if(err){
            site.findOne({}, "name googleAnalyticKey").then((result) => {
                var title = result.name;
                var description = result.name;
                data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}`);
                data = data.replace(/\$OG_TITLE/g, title);
                data = data.replace(/\$An_Data/g, result.googleAnalyticKey);
                result = data.replace(/\$OG_DESCRIPTION/g, description);
                response.send(result);
          });
        }
      })
    })
})

app.get("/products/:id", function(request, response) {
    const filePath = Path.resolve(__dirname, "./build", "index.html");
    fs.readFile(filePath, "utf8", function (err,data) {
      var productInfo = product.findOne({_id: Number(request.params.id)}, function(err,result){
        if (result === null || result === undefined || result.isDeleted == true){
            return response.redirect("/")
        }
        if(err){
            return response.redirect("/")
        }
        if (result && result.isDeleted != true) {
            var img = (result.images[0].imageSource === "local") ? `${REACT_APP_Domain_Url}fileStorage/uploads/products/${request.params.id}/${result.images[0].image}` : (result.images[0].imageSource === "cloud") ? result.images[0].image : "";
            data = data.replace(/\$OG_TITLE/g, result.language[0].title);
            data = data.replace(/\$OG_DESCRIPTION/g, result.language[0].description);
            data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}products/${request.params.id}`);
            data = data.replace(/\$OG_IMAGE_SECURE/g, img);
            result = data.replace(/\$OG_IMAGE/g, img);
            response.send(result);
        }else {
            site.findOne({}, "name").then((result) => {
                var title = result.name;
                var description = result.name;
                data = data.replace(/\$OG_TITLE/g, title);
                data = data.replace(/\$OG_DESCRIPTION/g, description);
                data = data.replace(/\$OG_URL/g, `${REACT_APP_Domain_Url}products/${request.params.id}`);
                response.send(result);
          });
        }
      });

    });
  });


app.post("/auth/callback", bodyParser.urlencoded({ extended: false }), async (req, res) => {
    let SiteData = await site.findOne({}, "appleClientId appleKeyIdentifier appleTeamId appleP8File")
    const clientSecret = getClientSecret(SiteData.appleClientId, SiteData.appleKeyIdentifier, SiteData.appleTeamId, SiteData.appleP8File);
    const requestBody = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: `${REACT_APP_Domain_Url}auth/callback`,
        client_id: SiteData.appleClientId,
        client_secret: clientSecret,
        scope: "name email"
    };

    axios.request({
        method: "POST",
        url: "https://appleid.apple.com/auth/token",
        data: querystring.stringify(requestBody),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(async (response) => {
        let userResponse = getUserId(response.data.id_token);
        let userData = await user.findOne({appleId: userResponse.sub});
        if(userData !== null){
            res.status(200).json({
                status_code: "2",
                status_message:"Old User",
                status:userData.status,
                apple_id: userData.appleId,
                email: userData.email,
                userName: userData.userName,
                userId: userData._id
            })
        } else{
            res.status(200).json({
                status_code: "1",
                apple_id: userResponse.sub,
                status_message:"New User"
            })
        }
    }).catch((error) => {
        console.log("error",error)
        return res.status(500).json({
            success: false,
            error: error.response.data
        });
    })
})


app.post("/web/auth/callback", bodyParser.urlencoded({ extended: false }), async (req, res) => {
    let SiteData = await site.findOne({}, "appleClientId appleKeyIdentifier appleTeamId appleP8File")
    const clientSecret = getClientSecret(SiteData.appleClientId, SiteData.appleKeyIdentifier, SiteData.appleTeamId, SiteData.appleP8File);
    const requestBody = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: `${REACT_APP_Domain_Url}web/auth/callback`,
        client_id: SiteData.appleClientId,
        client_secret: clientSecret,
        scope: "name email"
    };

    axios.request({
        method: "POST",
        url: "https://appleid.apple.com/auth/token",
        data: querystring.stringify(requestBody),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(async (response) => {
        let userResponse = getUserId(response.data.id_token);
        let userData = await user.findOne({appleId: userResponse.sub});
        if(userData !== null){
        const data = {
            email: userData.email,
            userName: userData.userName,
            appleId: userData.appleId
        }
         await socialLogin(user, data, {appleId: userData.appleId}, {req,site, currency})
         res.redirect("/")
        }else{
            res.redirect("/web/appleLogin/"+ response.data.id_token);
        }
    }).catch((error) => {
        console.log("error",error)
        res.redirect("/")
    })
})


schedule.scheduleJob("0 0 * * *", async function(){
   await dbAutoBackUp()
    await currencyUpdateCron()
})

app.use(express.static(Path.join(__dirname, "build")));
app.get("*", function(req, res) {
    res.sendFile(Path.join(__dirname, "build", "index.html"));
});

/* ssl  */
var server;

if (SSLSecure === "true") {
    server = https.createServer({
        key: fs.readFileSync(`cert/${KeyFileName}.${KeyExtension}`),
        cert: fs.readFileSync(`cert/${CertFileName}.${CertExtension}`)
      }, app)
      apollo.installSubscriptionHandlers(server);
    }else {
        server = http.createServer(app)
        apollo.installSubscriptionHandlers(server);
    }



server.listen(Port_Number, () => {
    console.log(
        'ðŸš€ Server ready at',
        `http${SSLSecure === "true" ? 's' : ''}://${Site_Url}`
      )
  });


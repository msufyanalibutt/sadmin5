const {errors} = require("../../error");
const {AuthenticationError} = require("apollo-server");
const {URL, Site_Url, env} = process.env;
const sendMailAction = require("../../mailtemp");
const language = require("../../src/translations/api/lang.json");

const resolvers = {
  Query: {
    getAllContactUs: async(_,args,{contactUs}) => {
        return await contactUs.find();       
    },                        
  },

  Mutation: {
    addContactUs: async(root, data, {contactUs, mailtemp, site, req}) => {     
          var result = await new contactUs(data).save();
          var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
          var bodymailtempDetail = await mailtemp.findOne({title: "contect-us"});  
          var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
          let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
          var getDefault = await site.find({});
          var sites = getDefault && getDefault.find((a) => a);
          let logoImg = (sites.logo.imageSource === "local") ? `${process.env.URL + Site_Url}/fileStorage/uploads/site/images/${sites.logo.image}` :(sites.logo.imageSource === "cloud") ? sites.logo.image : "";                      
          var mailAddr = sites && sites.contactUs
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
          // console.log("qqq", foundUser)             
          var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LOGO}}/g, logoImg).replace(/{{LINK}}/g, link).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{YOUAREIN}}/g, "admin").replace(/{{WELCOME}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Welcome : language.en._Welcome).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{_name}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._name : language.en._name).replace(/{{name}}/g, data.name).replace(/{{_email}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._email : language.en._email).replace(/{{email}}/g, data.email).replace(/{{_feedback}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._feedback : language.en._feedback).replace(/{{feedback}}/g, data.feedback).replace(/{{thanks}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._thanks : language.en._thanks)  + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow);
          // var mailAddr = data.email;
          let values = {
              to: mailAddr,    // email 
              html: etempdataDynamic,
              req: req
          };
          // delete data.email
          sendMailAction.sendMail("contect-us",values, mailAddr, (callback) => {
          //   console.log("cb", callback)
          });
          // Returning contactUs details
            var contactUsInfo ={
                id : result._id,
                name: result.name,                                                        
                email: result.email, 
                feedback: result.feedback,                            
                timeStamp: result.timeStamp,                            
            };
             return contactUsInfo; 
    } 
  }      
 };
 module.exports = resolvers;

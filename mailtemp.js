const express = require("express");
const nodemailer = require("nodemailer");
const language = require("./src/translations/api/lang.json");
const site = require("./schema/siteSettings/index.js");

// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "android@trioangle.com",
//     pass: "xnwhhbvujrqixcdj"
//   }
// });
// let transporter_support = nodemailer.createTransport({
//   host: "",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "",
//     pass: ""
//   }
// });


module.exports = {
	sendMail : async function(type,values, mailAddr, callback){
    var siteName = await site.findOne();

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: siteName.uName,
        pass: siteName.password
      }
    });
    var transporter_support = nodemailer.createTransport({
      host: "",
      port: 465,
      secure: true,
      auth: {
        user: "",
        pass: ""
      }
    });

    let mailOptions = {
      // from: `${siteName.fromName} <support@passup.com>`,
      from: `${siteName.fromName +" "+ siteName.fromAddress}`,
      to: mailAddr,
    };
	switch(type){
      case "confirmationMail":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._Welcome : language.en._Welcome} ${siteName.fromName}`;
        mailOptions["html"] = values.html;
      break;

      case "forgetPwd":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._resetPasswordReq : language.en._resetPasswordReq}`;
        mailOptions["html"] = values.html;
      break;

      case "congradulationsMail":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._congratulationsMail : language.en._congratulationsMail}`;
        mailOptions["html"] = values.html;
      break;

      case "rejectionMail":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._rejectionMail : language.en._rejectionMail}`;
        mailOptions["html"] = values.html;
      break;

      case "orderBuyer":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._orderDelivered : language.en._orderDelivered}`;
        mailOptions["html"] = values.html;
      break;

      case "ITEM BOUGHT":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._orderPlaced : language.en._orderPlaced}`;
        mailOptions["html"] = values.html;
      break;

      case "orderCancel":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._orderCancel : language.en._orderCancel}`;
        mailOptions["html"] = values.html;
      break;

      case "PAYMENT RELEASE":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._paymentRelease : language.en._paymentRelease}`;
        mailOptions["html"] = values.html;
      break;

      case "SHIPPED TO CUSTOMER":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._shipped : language.en._shipped}`;
        mailOptions["html"] = values.html;
      break;

      case "Order Confirmation":
        mailOptions["subject"] = `${siteName.fromName} - ${typeof(language[values.req.headers.lang]) !== "undefined" ? language[values.req.headers.lang]._orderConfirmed : language.en._orderConfirmed}`;
        mailOptions["html"] = values.html;
      break;

      case "Refund":
        mailOptions["subject"] = `${siteName.fromName} - Refund Success`;
        mailOptions["html"] = values.html;
      break;

      case "contect-us":
        mailOptions["subject"] = "Contact Us"
        mailOptions["html"] = values.html;
      break;

      case "bulkmail":
        mailOptions["subject"] = values.subject;
        mailOptions["html"] = values.html;
      break;

      default:
      break;
    }
    transporter.sendMail(mailOptions, (error, info) => {
      //console.log("error mail", error);
      //console.log("res mail", info);
      (info) ?callback(true) : callback(false);
    });
    //callback(true);
	},

  sendMail_support : function(type,values,callback){
    let mailOptions = {
      from: "support@passup.com", // sender address
      to: values.to,
    };
    // console.log(values);
    switch(type){
      case "contactus":
        mailOptions["subject"] = values.subject;
        mailOptions["text"] = values.text;
        mailOptions["html"] = values.html;
      break;

      default:
      break;
    }
    transporter_support.sendMail(mailOptions, (error, info) => {
    });
    callback(true);
  },


};

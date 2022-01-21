const mongoose = require("mongoose");
const { DB_Name, DB_Password, DB_Username, DB_Url, DB_Host } = process.env;

// DB schema
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
    feedBack,
    message,
    mailtemp,
    deleteChat,
    contactUs,
    featured,
    adBanner,
    language,
    staticPages,
    metatags,
    filterCategory,
    transaction,
    forceUpdate
} = require("./dbSchema");

// default seed scripts to be inserted
const {
    categorySeed,
    timezoneSeed,
    currencySeed,
    countrySeed,
    userSeed,
    productSeed,
    adminSeed,
    siteSeed,
    reportSeed,
    reviewSeed,
    blockSeed,
    uReportSeed,
    pReportSeed,
    notificationSeed,
    feedBackSeed,
    mailtempSeed,
    deletechatSeed,
    contactUsSeed,
    featuredSeed,
    adBannerSeed,
    languageSeed,
    staticPagesSeed,
    metatagsSeed,
    filterSeed,
    transactionSeed
} = require("./seedScript");

const seedToRemove = [
    admin,
    user,
    category,
    timezone,
    currency,
    country,
    product,
    chat,
    site,
    review,
    bUser,
    uReport,
    pReport,
    reason,
    notification,
    message,
    featured,
    adBanner,
    staticPages,
    metatags,
    filterCategory
];

const seedToInsert = [
    { key: admin, value: adminSeed },
    { key: category, value: categorySeed },
    { key: timezone, value: timezoneSeed },
    { key: currency, value: currencySeed },
    { key: country, value: countrySeed },
    { key: site, value: siteSeed },
    { key: reason, value: reportSeed },
    { key: user, value: userSeed },
    { key: product, value: productSeed },
    { key: review, value: reviewSeed },
    { key: bUser, value: blockSeed },
    { key: uReport, value: uReportSeed },
    { key: pReport, value: pReportSeed },
    { key: notification, value: notificationSeed },
    { key: feedBack, value: feedBackSeed },
    { key: mailtemp, value: mailtempSeed },
    { key: deleteChat, value: deletechatSeed },
    { key: contactUs, value: contactUsSeed },
    { key: featured, value: featuredSeed },
    { key: adBanner, value: adBannerSeed },
    { key: language, value: languageSeed },
    { key: staticPages, value: staticPagesSeed },
    { key: metatags, value: metatagsSeed },
    { key: filterCategory, value: filterSeed },
    { key: transaction, value: transactionSeed }
];

// connect with MongoDB //encodeURIComponent
// console.log(`${DB_Url}://${DB_Username}:${DB_Password}@${DB_Host}/${DB_Name}`);
console.log(`mongodb+srv://${DB_Url}://${DB_Username}:${DB_Password}@${DB_Host}/${DB_Name}`);

var connect = mongoose.connect(`mongodb://localhost:27017/${DB_Name}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(async () => {
        // // erase the data from DB while server re-runs.
        //     for(var i=0; i<seedToRemove.length; i++) {
        //         await seedToRemove[i].deleteMany()
        //     };
        // }).then(async () => {
        // write the data to DB while server re-runs.
        for (var i = 0; i < seedToInsert.length; i++) {
            var found = await seedToInsert[i].key.find();
            if (!found.length) {
                seedToInsert[i].key.create(seedToInsert[i].value);
            }
        }
    })
    .then(() => {
        console.log("Connection established with" + " " + `${DB_Url}://${DB_Username}:${DB_Password}@${DB_Host}/${DB_Name}`);
        const notify = require("./pushNotificationConfig");
        notify.callPushnotification();
    }).catch((err) => {
        throw new Error(err);
    });

module.exports = connect;

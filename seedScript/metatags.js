const { REACT_APP_ADMIN_PATH } = process.env;
const metatagsSeed = [
    {
        _id: 1,
        language:[{
            langCode: "en",
            pageTitle: "Home Page",
            metaDescription: "Home Page",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "Page d'accueil",
            metaDescription: "Page d'accueil",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "الصفحة الرئيسية",
            metaDescription: "الصفحة الرئيسية",
            keywords: "passup"
        }],
        pageUrl: "/"
    },
    {
        _id: 2,
        language:[{
            langCode: "en",
            pageTitle: "Chat",
            metaDescription: "Chat",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "Bavarder",
            metaDescription: "Bavarder",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "دردشة",
            metaDescription: "دردشة",
            keywords: "passup"
        }],
        pageUrl: "/chat/conversation"
    },
    {
        _id: 3,
        language:[{
            langCode: "en",
            pageTitle: "Product Details",
            metaDescription: "Product Details",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "détails du produit",
            metaDescription: "détails du produit",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "تفاصيل المنتج",
            metaDescription: "تفاصيل المنتج",
            keywords: "passup"
        }],
        pageUrl: "/products"
    },
    {
        _id: 4,
        language:[{
            langCode: "en",
            pageTitle: "Seller Details",
            metaDescription: "Seller Details",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "Détails du vendeur",
            metaDescription: "Détails du vendeur",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "تفاصيل البائع",
            metaDescription: "تفاصيل البائع",
            keywords: "passup"
        }],
        pageUrl: "/SellerDetails"
    },
    {
        _id: 5,
        language:[{
            langCode: "en",
            pageTitle: "Edit Profile",
            metaDescription: "Edit Profile",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "Editer le profil",
            metaDescription: "Editer le profil",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "تعديل الملف الشخصي",
            metaDescription: "تعديل الملف الشخصي",
            keywords: "passup"
        }],
        pageUrl: "/EditProfile"
    },
    {
        _id: 6,
        language:[{
            langCode: "en",
            pageTitle: "Contact Us",
            metaDescription: "Contact Us",
            keywords: "passup"
        },
        {
            langCode: "fr",
            pageTitle: "Nous contacter",
            metaDescription: "Nous contacter",
            keywords: "passup"
        },
        {
            langCode: "ar",
            pageTitle: "اتصل بنا",
            metaDescription: "اتصل بنا",
            keywords: "passup"
        }],
        pageUrl: "/Info/contact"
    },
    {
        _id: 7,
        language:[{
            langCode: "en",
            pageTitle: "Dashboard",
            metaDescription: "Dashboard",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/dashboard`
    },
    {
        _id: 8,
        language:[{
            langCode: "en",
            pageTitle: "Admin Users",
            metaDescription: "Admin Users",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/adminUsers`
    },
    {
        _id: 9,
        language:[{
            langCode: "en",
            pageTitle: "Users",
            metaDescription: "Users",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/users`
    },
    {
        _id: 10,
        language:[{
            langCode: "en",
            pageTitle: "Admin Products",
            metaDescription: "Admin Products",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/Products`
    },
    {
        _id: 11,
        language:[{
            langCode: "en",
            pageTitle: "Categories",
            metaDescription: "Categories",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/categories`
    },
    {
        _id: 12,
        language:[{
            langCode: "en",
            pageTitle: "Services",
            metaDescription: "Services",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/services`
    },
    {
        _id: 13,
        language:[{
            langCode: "en",
            pageTitle: "Drive Trains",
            metaDescription: "Drive Trains",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/driveTrains`
    },
    {
        _id: 14,
        language:[{
            langCode: "en",
            pageTitle: "Fuel Types",
            metaDescription: "Fuel Types",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/fuelTypes`
    },
    {
        _id: 15,
        language:[{
            langCode: "en",
            pageTitle: "Transmission",
            metaDescription: "Transmission",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/transmissionList`
    },
    {
        _id: 16,
        language:[{
            langCode: "en",
            pageTitle: "Body Type",
            metaDescription: "Body Type",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/bodyTypes`
    },
    {
        _id: 17,
        language:[{
            langCode: "en",
            pageTitle: "Make Models",
            metaDescription: "Make Models",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/makeModels`
    },
    {
        _id: 18,
        language:[{
            langCode: "en",
            pageTitle: "Site Settings",
            metaDescription: "Site Settings",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/siteSettings`
    },
    {
        _id: 19,
        language:[{
            langCode: "en",
            pageTitle: "Reviews",
            metaDescription: "Reviews",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/reviews`
    },
    {
        _id: 20,
        language:[{
            langCode: "en",
            pageTitle: "Feedback",
            metaDescription: "Feedback",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/contactus`
    },
    {
        _id: 21,
        language:[{
            langCode: "en",
            pageTitle: "Block Users",
            metaDescription: "Block Users",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/blockedUsers`
    },
    {
        _id: 22,
        language:[{
            langCode: "en",
            pageTitle: "Reported Users",
            metaDescription: "Reported Users",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/reportedUsers`
    },
    {
        _id: 23,
        language:[{
            langCode: "en",
            pageTitle: "Reported Products",
            metaDescription: "Reported Products",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/reportedProducts`
    },
    {
        _id: 24,
        language:[{
            langCode: "en",
            pageTitle: "Transactions",
            metaDescription: "Transactions",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/TransactionList`
    },
    {
        _id: 25,
        language:[{
            langCode: "en",
            pageTitle: "Feature List",
            metaDescription: "Feature List",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/featureList`
    },
    {
        _id: 26,
        language:[{
            langCode: "en",
            pageTitle: "Banner",
            metaDescription: "Banner",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/manageBanner`
    },
    {
        _id: 27,
        language:[{
            langCode: "en",
            pageTitle: "Language",
            metaDescription: "Language",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/ManageLanguage`
    },
    {
        _id: 28,
        language:[{
            langCode: "en",
            pageTitle: "Static Pages",
            metaDescription: "Static Pages",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/staticPages`
    },
    {
        _id: 29,
        language:[{
            langCode: "en",
            pageTitle: "Report Reasons",
            metaDescription: "Report Reasons",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/reportReasons`
    },
    {
        _id: 30,
        language:[{
            langCode: "en",
            pageTitle: "Currencies",
            metaDescription: "Currencies",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/currencies`
    },
    {
        _id: 31,
        language:[{
            langCode: "en",
            pageTitle: "Admin Login",
            metaDescription: "Admin Login",
            keywords: "passup"
        }],
        pageUrl: `${REACT_APP_ADMIN_PATH }/login`
    },
    {
        "_id" : 32,
        "language" : [
            {
                "langCode" : "en",
                "pageTitle" : "Filters",
                "metaDescription" : "Filters",
                "keywords" : "Filters"
            }
        ],
        "pageUrl" : `${REACT_APP_ADMIN_PATH }/filters`
    },
    {
        "_id" : 33,
        "language" : [
            {
                "langCode" : "en",
                "pageTitle" : "Orders",
                "metaDescription" : "Orders",
                "keywords" : "Orders"
            }
        ],
        "pageUrl" : `${REACT_APP_ADMIN_PATH }/orders`
    }
];

module.exports = { metatagsSeed };
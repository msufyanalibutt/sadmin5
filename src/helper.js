import saveAs from "file-saver";
import XLSX from "xlsx";
import EditProfile from "./views/UserPages/Dashboard/EditProfile.jsx";

export const downloadCSV = (e, args) => {
    e.preventDefault();
    if (args && args.length) {

        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet(args);
        
        /* write workbook (use type "binary") */
        var csv = XLSX.utils.sheet_to_csv(ws);

        /* generate a download */
        saveAs(new Blob(["\ufeff" + csv],{type:"text/csv;charset=utf-8"}),`export_${new Date().toJSON()}.csv`);
    }
}

export const downloadXLSX = (e, args) => {
    e.preventDefault();
    if (args && args.length) {
        args.forEach((arg) => arg.__typename && delete arg.__typename);
        var ws = XLSX.utils.json_to_sheet(args);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().toJSON()}`);
        /* generate an XLSX file */
        XLSX.writeFile(wb, `export_${new Date().toJSON()}.xlsx`);
        }
    }

export const print = (e, args) => {
    e.preventDefault();
    if (args && args.length) {
        var ws = XLSX.utils.json_to_sheet(args);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `export`);
        var worksheet = wb.Sheets[wb.SheetNames[0]];
        var container = document.getElementById("root");
        container.innerHTML = XLSX.utils.sheet_to_html(worksheet);
        }
    }
// currency sy,bol conversion with html symbol code
export const getSymbol = (symbol) => {
        if (symbol) {
          const parser = new DOMParser();
          return parser.parseFromString(
            `<!doctype html><body>${symbol}`, "text/html").body.textContent;
        }
        return symbol;
      }

// to get customized date-time format
export const dateSet = (dd) => {
    var date = new Date(Number(dd));
    var resultDate = date !== "Invalid Date" && date.toISOString();
    return resultDate.replace(/[TZ]/g," ");
  }

      export const dateAdd = function (date, time, t) {
        var seconds = Math.floor((time - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) { 
          return interval === 1 ? interval + " " + t("Productdetails._yearago") : interval + " " + t("Productdetails._yearsago");  
        }
      
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          return interval  === 1 ? interval + " " + t("Productdetails._monthago") : interval + " " + t("Productdetails._monthsago"); 
        }
      
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          return interval === 1 ? interval + " " + t("Productdetails._dayago") : interval + " " + t("Productdetails._daysago")
        }
      
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          return interval === 1 ? interval + " " + t("Productdetails._hourago") :  interval+ " " + t("Productdetails._hoursago"); 
        }
      
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval === 1 ? interval + " " + t("Productdetails._minuteago") :  interval + " " +t("Productdetails._minutesago")
        }
      
        return Math.floor(seconds) <= 0 ? t('Productdetails._now') :  !(interval === NaN) ?  t('Productdetails._now') :  Math.floor((seconds)) + " " +t('Productdetails._secondsago') ;
      }
  
// reusable function map locations
const locTypes = ["locality", "postal_code", "administrative_area_level_1", "country"];
const locals = ["administrative_area_level_2", "locality", "postal_code", "administrative_area_level_1", "country", "street_number", "route"];
export const mapLocation = (locs) => {
    var location={};
    var findLocName, findLocals;
    if (locs[0].address_components) {
        locs[0].address_components.forEach((addComp) => {
            findLocals = locals.find((find) => {
                return find === addComp.types[0];
            });
            if (findLocals) {
                location[findLocals] = addComp.long_name
            }
        });
    } else if (locs[0].types) {
            findLocName = locTypes.find((loc) => {
                if (loc === locs[0].types[0]) return loc;
                return 0;
            });
            var locations = locs[0].formatted_address.split(",");
    switch(findLocName) {
        case "administrative_area_level_1":
        location = {
            administrative_area_level_1: locations[0],
            country: locations[1],
        }
        break;

        case "locality":
        location = {
            locality: locations[0],
            administrative_area_level_1: locations[1],
            country: locations[2]
        }
        break;

        case "country":
        location = {
            country: locations[0]
        }
        break;

        case "postal_code": 
        location = {
            locality: locations[0],
            administrative_area_level_1: locations[1],
            country: locations[2]
        }
        break;

        default:
        console.log("nope");
        break;
    }
    
}
    return location;
}

export const mapLocation1 = (locs) => {
  var location={};
  var findLocName, findLocals;
  if (locs.address_components) {
      locs.address_components.forEach((addComp) => {
          findLocals = locals.find((find) => {
              return find === addComp.types[0];
          });
          if (findLocals) {
              location[findLocals] = addComp.long_name
          }
      });
  } else if (locs.types) {
          findLocName = locTypes.find((loc) => {
              if (loc === locs.types[0]) return loc;
              return 0;
          });
          var locations = locs.formatted_address.split(",");
  switch(findLocName) {
      case "administrative_area_level_1":
      location = {
          administrative_area_level_1: locations[0],
          country: locations[1],
      }
      break;

      case "locality":
      location = {
          locality: locations[0],
          administrative_area_level_1: locations[1],
          country: locations[2]
      }
      break;

      case "country":
      location = {
          country: locations[0]
      }
      break;

      case "postal_code": 
      location = {
          locality: locations[0],
          administrative_area_level_1: locations[1],
          country: locations[2]
      }
      break;

      default:
      console.log("nope");
      break;
  }
  
}
  return location;
}

export const dateSet1 = (dd) => {
  var date = new Date(Number(dd));
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
    var hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return (MM + "." + dd  + "." + yyyy + ' ' + hours + ':' + minutes);
  }


export const getColumnWidth = (data, accessor, headerText) => {
    if (typeof accessor === "string" || accessor instanceof String) {
      accessor = d => d[accessor]; // eslint-disable-line no-param-reassign
    }
    const maxWidth = 600;
    const magicSpacing = 10;
    const cellLength = Math.max(
      ...data.map(row => (`${accessor(row)}` || "").length),
      headerText.length,
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
  };


// prepare data for create/update product
export const prepareData = (data, id) => {
    let {generalInfo, categoryInfo, imageInfo, locationInfo} = data;
    let finalArray = [];
    var result;
    if (generalInfo.values.title && generalInfo.values.title.trim() !== "" && generalInfo.values.langCode) {
     if (generalInfo.selectedLangData && generalInfo.selectedLangData.length > 0) {
          let foundIndex = generalInfo.selectedLangData.findIndex(
            x => x.langCode === generalInfo.properties.langCode
          );
          if (foundIndex >= 0) {
            generalInfo.selectedLangData[foundIndex] = generalInfo.properties;
          } else {
            generalInfo.selectedLangData.push(generalInfo.properties);
          }
        } else {
            generalInfo.selectedLangData.push(generalInfo.properties);
        }
      }
      const enIndex = generalInfo.selectedLangData.findIndex(lang => lang.langCode === "en");
      generalInfo.selectedLangData.push(...generalInfo.selectedLangData.splice(0, enIndex));
    
      if (generalInfo.selectedLangData && generalInfo.selectedLangData.length > 0) {
        generalInfo.selectedLangData.map(item => {
          return delete item.__typename;
        });
      }
    var uniqueArray =
    generalInfo.selectedLangData &&
    generalInfo.selectedLangData.length > 0 &&
    generalInfo.selectedLangData.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    });

    uniqueArray &&
    uniqueArray.length > 0 &&
    uniqueArray.map((item, index) => {
        return finalArray[index] = {
        langCode: item.langCode,
        title: item.title.trim(),
        description: item.description ? item.description.trim() : ""
        };
    });
   if (id) {
        result = Object.assign(
            {},
            data.generalInfo.editData,
            data.categoryInfo.editData,
            data.locationInfo.editData,
            {
                deleteImages: imageInfo.deleteImages,
                images: imageInfo.images.filter(i => i != null),
                language: generalInfo.selectedLangData,
                rate: !categoryInfo.isFree ? Number(categoryInfo.rate) : 0,
                instantBuy: !categoryInfo.isFree ? categoryInfo.instantBuy : false,
                shippingRate: (categoryInfo.instantBuy && !categoryInfo.isFree) ?  Number(categoryInfo.shippingRate) : null
            },
        )
         } else {
         result = {
            id: generalInfo.values.id,
            language: generalInfo.selectedLangData,
            isFree: categoryInfo.isFree,
            categoryId: categoryInfo.categoryId,
            location: locationInfo.location,
            images: imageInfo.images.filter(i => i != null),
            rate: !categoryInfo.isFree ? Number(categoryInfo.rate) : 0,
            currencyCode: categoryInfo.currencyCode,
            userId: Number(categoryInfo.userId),
            userName: categoryInfo.userName,
            categoryFields: categoryInfo.categoryFields,
            instantBuy: !categoryInfo.isFree ? categoryInfo.instantBuy : false,
            shippingRate: (categoryInfo.instantBuy && !categoryInfo.isFree) ?  Number(categoryInfo.shippingRate) : null
        }
        if (categoryInfo.sellingStatus) {
            result = Object.assign({}, result, {sellingStatus: categoryInfo.sellingStatus});
        }
        if (categoryInfo.status) {
        result = Object.assign({}, result, {status: categoryInfo.status});
        }
     
    }
    return result;
}

export const isUrl = (str) => {
    //eslint-disable-next-line
    let regexp = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;

     if (regexp.test(str))
      {
       return true;
     }
     else
      {
       return false;
      }
}

export const validateMobileNumber = (phone) => {
  console.log("pppppp", phone)
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      // /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      // /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/           
  if(regex.test(phone)) return true 
  else return false
}

export const onTableViewChange = (current) =>
{
  if (current)
  {
    const page = current.state.page;
    const pageSize = current.state.pageSize;
    const allData = current.getResolvedState().sortedData;
    const startIdx = page * pageSize;
    const currentData = allData.slice(startIdx, startIdx + pageSize).map((item) => item._original);
    return currentData;
  }
}

export const exportData = (prop, keys) => {
    var exportInput = {};
        var output = [];
        prop && prop.map(pro => {
        keys.forEach((k) => {
            if (k.key === "viewersCount" && pro.viewers) {
                exportInput[k.value] = pro.viewers.length;
              } else if (k.key === "symbol" && pro.symbol) {
                if (pro.symbol) {
                    const parser = new DOMParser();
                    exportInput[k.value] = parser.parseFromString(
                      `<!doctype html><body>${pro.symbol}`, "text/html").body.textContent;
                  } else {
                    exportInput[k.value] = pro.symbol;
                  }
              } else {
              exportInput[k.value] = pro[k.key];
              }
            });
        output.push(exportInput);
        exportInput={};
    });
    return output;
}

// `I’m not interested!`,
//     `Is the price negotiable?`,
//     `Hi, is it still available?`,
//     `Would you trade?`,
//     `I’m interested!`,
//     `What condition is it in?`

export const customButtonKeys = [
    `Homepagefilter._Youwelcome`,
    `Homepagefilter._Noproblem`,
    `Homepagefilter._Thanks`,
    `Homepagefilter._OKthanks`
];


export const getPayoutCountries = [
  {
    shortCode : 'AT',
    name : "Austria",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'AU',
    name : "Australia",
    "currency_code": [
      "AUD"
    ],
    InputarrayData: [ "BSB","account_number" , "account_holder_name"]
  },
  {
    shortCode : 'BE',
    name : "Belgium",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'BR',
    name : "Brazil",
    "currency_code": ['BRL'],
    InputarrayData: [ "bank_Code", "branch_code","account_number" , "account_holder_name"]
  },
  // {
  //   shortCode : 'BG',
  //   name : "Bulgaria",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'CA',
    name : "Canada",
    "currency_code": [
      "CAD",
      "USD"
    ],
    InputarrayData: [ "transit_Number" , "account_holder_name" , "account_number" , "institution_Number","personal_Id"]
  },
  // {
  //   shortCode : 'CY',
  //   name : "Cyprus",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'CZ',
  //   name : "Czech Republic",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'DK',
    name : "Denmark",
    "currency_code": [
      "DKK",
      "EUR",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  // {
  //   shortCode : 'EE',
  //   name : "Estonia",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'FI',
    name : "Finland",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'FR',
    name : "France",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'DE',
    name : "Germany",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  // {
  //   shortCode : 'GR',
  //   name : "Greece",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'HK',
    name : "Hong Kong",
    "currency_code": [
      "HKD"
    ],
    InputarrayData: [ "clearing_Code" , "branch_code" ,"account_holder_name" , "account_number"]
  },
  // {
  //   shortCode : 'HU',
  //   name : "Hungary",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'IN',
  //   name : "India",
  //   "currency_code": ['INR'],
  //   InputarrayData: [ "IFSC_code" , "account_holder_name" , "account_number", "personal_Id"]
  // },
  {
    shortCode : 'IE',
    name : "Ireland",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'IT',
    name : "Italy",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'JP',
    name : "Japan",
    "currency_code": [
      "JPY"
    ],
    InputarrayData: ["bank_Code", "branch_code", "bank_name", "branch_name" ,"account_number","account_owner_name"]
  },
  {
    shortCode : 'LU',
    name : "Luxembourg",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  // {
  //   shortCode : 'LV',
  //   name : "Latvia",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'LT',
  //   name : "Lithuania",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'MY',
  //   name : "Malaysia",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'MT',
  //   name : "Malta",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'MX',
    name : "Mexico",
    "currency_code": ['MXN'],
    InputarrayData: ["CLABE"]
  },
  {
    shortCode : 'NL',
    name : "Netherlands",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'NZ',
    name : "New Zealand",
    "currency_code": [
      "NZD"
    ],
    InputarrayData: ["routing_number" , "account_holder_name" , "account_number"]
  },
  {
    shortCode : 'NO',
    name : "Norway",
    "currency_code": [
      "NOK",
      "EUR",
      "DKK",
      "GBP",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: ["IBAN_Number" , "account_holder_name"]
  },
  // {
  //   shortCode : 'PL',
  //   name : "Poland",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'PT',
    name : "Portugal",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: ["IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'SG',
    name : "Singapore",
    "currency_code": [
      "SGD"
    ],
    InputarrayData: [ "personal_Id","bank_Code","branch_code" , "account_holder_name" , "account_number"]
  },
  // {
  //   shortCode : 'RO',
  //   name : "Romania",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'SK',
  //   name : "Slovakia",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'SI',
  //   name : "Slovenia",
  //   currencyCode: 'EUR'
  // },
  {
    shortCode : 'ES',
    name : "Spain",
    "currency_code": [
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'SE',
    name : "Sweden",
    "currency_code": [
      "SEK",
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'CH',
    name : "Switzerland",
    "currency_code": [
      "CHF",
      "EUR",
      "DKK",
      "GBP",
      "NOK",
      "SEK",
      "USD"
    ],
    InputarrayData: [ "IBAN_Number" , "account_holder_name"]
  },
  {
    shortCode : 'GB',
    name : "United Kingdom",
    "currency_code": [
      "GBP",
      "EUR",
      "DKK",
      "NOK",
      "SEK",
      "USD",
      "CHF"
    ],
    InputarrayData: [ "sort_Code" , "account_holder_name" , "account_number"]
  },
  {
    shortCode : 'US',
    name : "United States",
    "currency_code": [
      "USD"
    ],
    InputarrayData: ["routing_number" , "account_holder_name" , "account_number", "ssn_last_4_digits"]
  },
  // {
  //   shortCode : 'GI',
  //   name : "Gibraltar",
  //   currencyCode: 'EUR'
  // },
  // {
  //   shortCode : 'LI',
  //   name : "Liechtenstein",
  //   currencyCode: 'EUR'
  // },
];


export const getUnderScoreRemovedString = (data,t) => {
  //let langdata = data.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  let response = t(`Payout.${data}`)
  return response
}


export const messageButtonProductPage  =
 [
    "Productdetails._available",
    "Productdetails._negotiable",
    "Productdetails._condition"
 ]
//var discover = "discover"

export const profileList = [
    {key: "discover", name:"Discover", icon:"fa fa-home", needLogin: false, path: "/"},
    {key: "chat", name:"Chat", icon:"fa fa-commenting", needLogin: true, path: "/chat/conversation"},
    {key: "profile", name:"My Profile", icon:"fa fa-user", needLogin: true,
    path: "/EditProfile", component: EditProfile },
    {key: "logout", name:"Logout", icon:"fa fa-sign-out", needLogin: true,  path: "/"},
    {key: "terms", name:"Terms and Conditions", icon:"fa fa-bookmark", needLogin: false, path: "/pages/terms_of_use"},
    {key: "policy", name:"Privacy policy", icon:"fa fa-building", needLogin: false, path: "/pages/privacy_policy"}];


    export const getRoster = function (rosters) {
        return rosters;
    }

export const getUserId = (token) => {
	const parts = token.split(".");
	try {
        //console.log("inside getUser",JSON.parse(new Buffer(parts[1], "base64").toString("ascii")))
		return JSON.parse(new Buffer(parts[1], "base64").toString("ascii"));
	} catch (e) {
		return null;
	}
}

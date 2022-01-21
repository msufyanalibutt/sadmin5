import React from "react";
import { graphql, compose } from "react-apollo";

// @material-ui/core ../../../components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";


// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import NavPills from "../../../components/NavPills/NavPills.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import PictureUpload from "../../../components/CustomUpload/ImageUpload.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";

import { GET_SITE_INFO, UPDATE_SITE, GET_CURRENCIES } from "../../../queries";

// Color Json code

import colorPalette from "../../../Json/colorPalette";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const { REACT_APP_EDIT_MODE, REACT_APP_ADMIN_PATH} = process.env;

const styles = {
  ...validationFormsStyle,
  ...extendedFormsStyle,
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  }
};

const initialState = {
  name: "",
  contactNo: "",
  version: "",
  contactUs:"",
  defaultCurrency: "",
  defaultUnit: "",
  popUpDetails: [],
  fbLink: "",
  instagramLink: "",
  googleAnalyticKey: "",
  googleAdSenseId:"",
  productPageSlotId: "",
  productDetailPageSlotId: "",
  editProfilePageSlotId: "",
  sellerDetailsPageSlotId: "",
  chatPageSlotId: "",
  Environment: "",
  MerchantId: "",
  PublicKey: "",
  PrivateKey: "",
  images: {},
  twLink: "",
  utubeLink: "",
  androidLink: "",
  iosLink: "",
  braintree:false,
  stripe: false,
  googleLogin:false,
  facebookLogin:false,
  appleLogin:false,
  paypal:false,
  fromAddress: "",
  fromName: "",
  uName: "",
  password: "",
  fcmSenderId: "",
  fcmServerKey: "",
  admob: "",
  admobBanner: "",
  googleApi: "",
  facebookAppId: "",
  googleAppId: "",
  setting: {},
  api: {},
  payment:{},
  cloud:{},
  email: {},
  joinUs: {},
  design: {},
  colorCode: "",
  subcolorCode: "",colorCode1: "",
  data: {},
  errors: {},
  firebaseJson:"",
  appleP8File:"",
  firebaseFormat: null,
  stripeSecretKey:"",
  stripePublishKey:"",
  //paypalAppId:"",
  //paypalEnvironment:"",
  p8FileError: "",
  hideOrderCancelStatus: "",
  googleAdsence: false,
  serviceFeeBuyer: 0,
  serviceFeeSeller: 0,
  adminSupportMail: "",
  paypalClientId: "",
  paypalSecretKey: "",
  imageHost:"",
  paymentSDKMode: false,
  copyrightsText: ""
};

const REGEX = RegExp(
  //serviceFee verification
  /^[0-9]+(\.[0-9]{1})?$/
);

class SiteSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      selectedFile: null,
      imagePreviewUrl: null,
      uploadErroe:"",
      filename:"",
      submitionLoad: false,
      validJson: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

   componentWillMount() {
    let { siteInfo } = this.props;
    siteInfo.refetch();
      if (siteInfo.getSiteInfo) {
        let info = siteInfo.getSiteInfo;
        this.setState({
          name: info.name,
          contactNo: info.contactNo,
          version: info.version,
          contactUs: info.contactUs,
          defaultCurrency: info.defaultCurrency,
          defaultUnit: info.defaultUnit,
          image: info.image,
          favicon: info.favicon,
          footerLogo: info.footerLogo,
          footerBatch: info.footerBatch,
          // footerBackground: info.footerBackground,
          loginImage: info.loginImage,
          adminloginImage:info.adminloginImage,
          twLink: info.twLink,
          fbLink: info.fbLink,
          instagramLink: info.instagramLink,
          googleAnalyticKey: info.googleAnalyticKey,
          productPageSlotId: info.productPageSlotId,
          productDetailPageSlotId: info.productDetailPageSlotId,
          editProfilePageSlotId: info.editProfilePageSlotId,
          sellerDetailsPageSlotId: info.sellerDetailsPageSlotId,
          chatPageSlotId: info.chatPageSlotId,
          Environment: info.Environment,
          MerchantId: info.MerchantId,
          PublicKey: info.PublicKey,
          PrivateKey: info.PrivateKey,
          utubeLink: info.utubeLink,
          androidLink: info.androidLink,
          iosLink: info.iosLink,
          fromAddress: info.fromAddress,
          fromName: info.fromName,
          uName: info.uName,
          password: info.password,
          admob: info.admob,
          admobBanner: info.admobBanner,
          googleApi: info.googleApi,
          facebookAppId: info.facebookAppId,
          googleAppId: info.googleAppId,
          firebaseJson:info.firebaseJson,
          firebaseName:info.firebaseJson,
          stripeSecretKey:info.stripeSecretKey,
          stripePublishKey:info.stripePublishKey,
          paypalAppId :info.paypalAppId,
          paypalEnvironment: info.paypalEnvironment,
          braintree:info.braintree,
          stripe:info.stripe,
          googleLogin:info.googleLogin,
          facebookLogin:info.facebookLogin,
          appleLogin:info.appleLogin,
          paypal:info.paypal,
          appleClientId: info.appleClientId,
          appleKeyIdentifier: info.appleKeyIdentifier,
          appleTeamId: info.appleTeamId,
          appleP8File: info.appleP8File,
          appleP8FileName: info.appleP8File,
          hideOrderCancelStatus: info.hideOrderCancelStatus,
          googleAdsence: info.googleAdsence,
          colorCode: info.colorCode,
          subcolorCode: info.subcolorCode,
          serviceFeeBuyer: Number(info.serviceFeeBuyer),
          serviceFeeSeller: Number(info.serviceFeeSeller),
          adminSupportMail: info.adminSupportMail,
          paypalClientId: info.paypalClientId,
          paypalSecretKey: info.paypalSecretKey,
          googleAdSenseId: info.googleAdSenseId,
          imageHost: info.imageHost,
          cloudName: info.cloudName,
          cloudApiKey: info.cloudApiKey,
          cloudApiSecret: info.cloudApiSecret,
          paymentSDKMode: info.paymentSDKMode,
          copyrightsText: info.copyrightsText
        });
      }
   }

  getServiceFeedetails =  () => {
    var serviceFee = [];
    for (let i = 0; i <= 100; i++) {
      serviceFee.push(Number(i));
    }
    this.setState({
      serviceFee: serviceFee,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let info = nextProps.siteInfo.getSiteInfo;
      this.setState({
        name: info.name,
        contactNo: info.contactNo,
        version: info.version,
        contactUs: info.contactUs,
        defaultUnit: info.defaultUnit,
        defaultCurrency: info.defaultCurrency,
        image: info.image,
        favicon: info.favicon,
        footerLogo: info.footerLogo,
        footerBatch: info.footerBatch,
        // footerBackground: info.footerBackground,
        loginImage: info.loginImage,
        adminloginImage:info.adminloginImage,
        twLink: info.twLink,
        fbLink: info.fbLink,
        instagramLink: info.instagramLink,
        googleAnalyticKey: info.googleAnalyticKey,
        productPageSlotId: info.productPageSlotId,
        productDetailPageSlotId: info.productDetailPageSlotId,
        editProfilePageSlotId: info.editProfilePageSlotId,
        sellerDetailsPageSlotId: info.sellerDetailsPageSlotId,
        chatPageSlotId: info.chatPageSlotId,
        Environment: info.Environment,
        MerchantId: info.MerchantId,
        PublicKey: info.PublicKey,
        PrivateKey: info.PrivateKey,
        utubeLink: info.utubeLink,
        androidLink: info.androidLink,
        iosLink: info.iosLink,
        fromAddress: info.fromAddress,
        fromName: info.fromName,
        uName: info.uName,
        password: info.password,
        admob: info.admob,
        admobBanner: info.admobBanner,
        googleApi: info.googleApi,
        facebookAppId: info.facebookAppId,
        googleAppId: info.googleAppId,
        firebaseJson:info.firebaseJson,
        firebaseName:info.firebaseJson,
        stripeSecretKey:info.stripeSecretKey,
        stripePublishKey:info.stripePublishKey,
        paypalAppId :info.paypalAppId,
        paypalEnvironment: info.paypalEnvironment,
        braintree:info.braintree,
        stripe:info.stripe,
        googleLogin:info.googleLogin,
        facebookLogin:info.facebookLogin,
        appleLogin:info.appleLogin,
        paypal:info.paypal,
        appleClientId: info.appleClientId,
        appleKeyIdentifier: info.appleKeyIdentifier,
        appleTeamId: info.appleTeamId,
        appleP8File: info.appleP8File,
        appleP8FileName: info.appleP8File,
        hideOrderCancelStatus: info.hideOrderCancelStatus,
        googleAdsence: info.googleAdsence,
        colorCode: info.colorCode,
        subcolorCode: info.subcolorCode,
        serviceFeeBuyer: Number(info.serviceFeeBuyer),
        serviceFeeSeller: Number(info.serviceFeeSeller),
        adminSupportMail: info.adminSupportMail,
        paypalClientId: info.paypalClientId,
        paypalSecretKey: info.paypalSecretKey,
        googleAdSenseId: info.googleAdSenseId,
        imageHost: info.imageHost,
        cloudName: info.cloudName,
        cloudApiKey: info.cloudApiKey,
        cloudApiSecret: info.cloudApiSecret,
        paymentSDKMode: info.paymentSDKMode,
        copyrightsText: info.copyrightsText,
        errors: {}
      });
    }
  }

  async componentDidMount(){
   await this.getServiceFeedetails();
  }

 
  handleUpload(type, file, err) {
    let { mutate } = this.props;
   if (err === "invalid") {
      this.setState({
        [type]: file,
        errors: Object.assign({}, this.state.errors, {
          [type]:
            "Please upload the images like JPG,JPEG,PNG and File size must be less than 5MB"
        })
      });
    } else {
      this.setState({
        [type]: file,
        errors: Object.assign({}, this.state.errors, { [type]: "" }),
        images: Object.assign({}, this.state.images, { [type]: file })
      });
    }
    mutate({ variables: { data: {[type]: file} } })
    .then(async ({ data }) => { //console.log(data)
     }).catch(e => {
       //console.log(e)
     })
  }

  fileChangedHandler(type,  event) {
    let file = event.target.files[0];
    var filename = file && file.name;
    var extension = filename.replace(/^.*\./, "");
      if(extension !== "json"){
       this.setState({
          uploadErroe :"Please upload json File"
          });
         return;
     }
      else{
      let reader = new FileReader();
        reader.onloadend = () => {
          this.setState({
            firebaseJson: file,
            firebaseFormat: file,
            [type]: file,
            api: Object.assign({}, this.state.api, { [type]: file }),
            uploadErroe:"",
           // firebaseJson: reader.result
           firebaseName :file.name

          });
        };
        reader.readAsDataURL(file);
      }
  }



  p8FileHandler(type,  event) {
    let file = event.target.files[0];
    var filename = file && file.name;
    var extension = filename.replace(/^.*\./, "");
      if(extension !== "p8"){
          this.setState({
            p8FileError :"Please upload .p8 File"
          });
         return;
     }
      else{
      let reader = new FileReader();
        reader.onloadend = () => {
          this.setState({
            appleP8File: file,
            appleP8FileFormat: file,
            [type]: file,
            api: Object.assign({}, this.state.api, { [type]: file }),
            p8FileError:"",
           // firebaseJson: reader.result
           appleP8FileName :file.name

          });
        };
        reader.readAsDataURL(file);
      }
  }


  validateInputs(type) {
    var required = [],
      error = {},
      flag = false;
    //var id = this.props.match.params.id;
    let self = this;
    switch (type) {
      case "setting":
        required = [
          { key: "name", value: "Name" },
          { key: "defaultCurrency", value: "default currency" },
          { key: "serviceFeeBuyer", value: "service fee buyer"},
          { key: "serviceFeeSeller", value:"service fee seller"},
          { key: "version", value: "version" },
          { key: "contactUs", value: "contactUs" },
          { key : "copyrightsText", value: "copyRights Text"},
          { key: "defaultUnit", value: "default unit" }
        ];
        required.forEach(data => {
          if (!self.state[data.key] && !self.state[data.key].length) {
            error[data.key] = `The ${data.value} field is required.`;
          } else if (data.key === "serviceFeeBuyer" && !REGEX.test(self.state[data.key])) {
            error["serviceFeeBuyer"] = `Single digit decimal value is required.`;
          } else if (data.key === "serviceFeeSeller" && !REGEX.test(self.state[data.key])) {
            error["serviceFeeSeller"] = `Single digit decimal value is required.`;
          } else {
            error[data.key] = "";
          }
          if (data.key === "contactUs" && !!this.state.contactUs) {
            //eslint-disable-next-line
            var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRex.test(this.state.contactUs)) {
              error.contactUs =
                "Invalid email address";
            } else {
              error.contactUs = "";
            }
          }
        });
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find(obj => {
          if (error[obj]) {
            return true;
          }
        });
        return flag;
      case "api":
        if(this.state.googleLogin === true){
          required = [  { key: "googleAppId", value: "google App Id" } ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
        if(this.state.facebookLogin === true){
          required = [   { key: "facebookAppId", value: "facebook App Id" } ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
        if(this.state.appleLogin === true){
          required = [   { key: "appleClientId", value: "apple client Id" },{ key: "appleKeyIdentifier", value: "apple key Identifier" },
          { key: "appleTeamId", value: "apple Team Id" } ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
        if(this.state.googleAdsence === true){
          required = [
            { key: "googleAdSenseId", value: "google AdSense Id" },
            { key: "productPageSlotId", value: "product Page Slot Id" },
            { key: "productDetailPageSlotId", value: "productDetail Page Slot Id"},
            { key: "editProfilePageSlotId", value: "editProfile Page Slot Id"},
            { key: "sellerDetailsPageSlotId", value: "sellerDetails Page Slot Id"},
            { key: "chatPageSlotId", value: "chat Page Slot Id"}
            ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
        required = [
          { key: "googleApi", value: "google api" },
          { key: "googleAnalyticKey", value: "google Analytic key" },
          { key: "admob", value: "google add key" },
          { key: "admobBanner", value: "google add banner key" },
        ];
        required.forEach(data => {
         if (!self.state[data.key]) {
            error[data.key] = `The ${data.value} field is required.`;
          } else {
            error[data.key] = "";
          }
        });
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find(obj => {
          if (error[obj]) {
            return true;
          }
        });
        return flag;
      case "cloud":
        if(this.state.imageHost === "cloud"){
          required = [  
            { key: "cloudName", value: "cloud Name" },
            { key: "cloudApiKey", value: "cloud Api Key" },
            { key: "cloudApiSecret", value: "cloud Api Secret" },
          ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find(obj => {
          if (error[obj]) {
            return true;
          }
        });
        return flag;
      case "payment":
          if(this.state.braintree === true){
          required = [
            { key: "Environment", value: "payment environment" },
            { key: "MerchantId", value: "payment merchant id" },
            { key: "PublicKey", value: "payment public key" },
            { key: "PrivateKey", value: "payment private key" },
            ];
          required.forEach(data => {
           if (!self.state[data.key]) {
              error[data.key] = `The ${data.value} field is required.`;
            } else {
              error[data.key] = "";
            }
          });
        }

        else if(this.state.stripe === true){
          required = [
            { key: "stripeSecretKey", value: "stripe Secret Key" },
            { key: "stripePublishKey", value: "stripe Publish Key" }
          ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }

        else if (this.state.paypal === true){
          required = [
             { key: "paypalAppId", value: "paypal App Id" },
             { key: "paypalEnvironment", value:"paypal environment"},
             { key: "paypalClientId", value: "paypal Client Id" },
             { key: "paypalSecretKey", value: "paypal Secret Key" }
            ];
          required.forEach(data => {
            if (!self.state[data.key]) {
               error[data.key] = `The ${data.value} field is required.`;
             } else {
               error[data.key] = "";
             }
           });
        }
      this.setState({
            errors: error
          });
          flag = Object.keys(error).find(obj => {
            if (error[obj]) {
              return true;
            }
          });
          return flag;
      case "images":
        required = [
          {
            key: "image",
            value: "image"
          },
          {
            key: "favicon",
            value: "favicon"
          },
          {
            key: "footerLogo",
            value: "footerLogo"
          },
          {
            key: "footerBatch",
            value: "footerBatch"
          },
          // {
          //   key: "footerBackground",
          //   value: "footerBackground"
          // },
          {
            key: "loginImage",
            value: "loginImage"
          },

          {
            key: "adminloginImage",
            value: "adminloginImage"
          }

        ];
        required.forEach(data => {
          if (!self.state[data.key]) {
            error[data.key] = `The ${data.value} field is required.`;
          } else {
            error[data.key] = "";
          }
        });
        this.setState({
          errors: error
        });
        Object.keys(error).find((obj) => {
          if (!!error[obj]) {
            flag = true;
          }
        });
        return flag;

      case "email":
        required = [
          { key: "fromAddress", value: "from address" },
          { key: "fromName", value: "from name" },
          { key: "uName", value: "user name" },
          { key: "password", value: "password" }
        ];
        required.forEach((data) => {
          if (!self.state[data.key].trim()) {
            error[data.key] = `The ${data.value} field is required.`;
          } else {
            error[data.key] = "";
          }
          if (data.key === "fromAddress" && !!this.state.fromAddress) {
            //eslint-disable-next-line
            var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRex.test(this.state.fromAddress)) {
              error.fromAddress =
                "The From Address must be a valid email address.";
            } else {
              error.fromAddress = "";
            }
          }
        });
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find((obj) => {
          if (error[obj]) {
            return true;
          }
        });
        return flag;

      case "joinUs":
        //   *********************** Disable Mantory Option  ***************************************
        //   required = [{key: "androidLink", value: "passup android link"},
        //   {key: "iosLink", value: "passup ios link"},
        //   {key: "fbLink", value: "passup facebook link"},
        //   {key: "twLink", value: "passup twitter link"},
        //   {key: "instagramLink", value: "passup instagram link"},
        //   {key: "utubeLink", value: "passup youtube link"}
        // ];
        //   var regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        //   required.forEach((data) => {
        //     if (!self.state[data.key]) {
        //       error[data.key] = `The ${data.value} field is required.`;
        //     } else if (self.state[data.key] && !regex.test(self.state[data.key])) {
        //         error[data.key] = `The ${data.key} field is required.`;
        //     } else {
        //       error[data.key] = "";
        //     }
        //   });
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find(obj => {
          if (error[obj]) {
            return true;
          }
        });
        return flag;

      default:
        break;
    }
  }

  clearState() {
    this.setState({ ...initialState });
  }

  handleSubmit(event, type) {
    event.preventDefault();
    let { mutate } = this.props;
    let { setting, email, joinUs, images, api,cloud,payment, errors, design, submitionLoad } = this.state;
    switch (type) {
      case "setting":
        if (Object.keys(setting).length && !this.validateInputs("setting")) {
          if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
            this.setState({ submitionLoad: true })
          mutate({ variables: { data: setting } })
            .then(async ({ data }) => {
              if (data.updateSiteInfo) {
                this.setState({
                  popUpDetails: this.state.popUpDetails.concat(["updated"]),
                  submitionLoad: false
                });
                window.location.reload();
              }
            })
            .catch((error) => {
              this.setState({
                popUpDetails: error.graphQLErrors.map((x) => x.message),
                submitionLoad: false
              });
            });
          }
          else{
            let error = ["Add/Edit Restricted for Live"];
            this.setState({
              popUpDetails: error
            });
          }
        }
        break;
        case "cloud":
          if (Object.keys(cloud).length && !this.validateInputs("cloud")) {
            if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
              this.setState({ submitionLoad: true })
            mutate({ variables: { data: cloud } })
              .then(async ({ data }) => {
                if (data.updateSiteInfo) {
                  this.setState({
                    popUpDetails: this.state.popUpDetails.concat(["updated"]),
                    submitionLoad: false
                  });
                }
              })
              .catch((error) => {
                this.setState({
                  popUpDetails: error.graphQLErrors.map((x) => x.message),
                  submitionLoad: false
                });
              });
            }
            else{
              let error = ["Add/Edit Restricted for Live"];
              this.setState({
                popUpDetails: error
              });
            }
          }
          break;
  

      case "images":
        let imageSet = {};
        if (images.image){
          imageSet.image = images.image;
        }
        if (images.favicon){
          imageSet.favicon = images.favicon;
        }
        if (images.footerLogo){
          imageSet.footerLogo = images.footerLogo;
        }
        if (images.footerBatch){
          imageSet.footerBatch = images.footerBatch;
        }
        if (images.loginImage){
          imageSet.loginImage = images.loginImage;
        }
        if (images.adminloginImage){
          imageSet.adminloginImage = images.adminloginImage;
        }
        // if(images.footerBackground){
        //   imageSet.footerBackground = images.footerBackground;
        // }
        if (
          !errors.favicon &&
          !errors.image &&
          !errors.cloud &&
          !errors.footerLogo &&
          !errors.footerBatch &&
          !errors.loginImage &&
          !errors.adminloginImage &&
          // !errors.footerBackground &&
          Object.keys(images).length &&
          !this.validateInputs("images")
        ) {
          if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
            this.setState({ submitionLoad: true,  popUpDetails: this.state.popUpDetails.concat(["updated"]) })
          }
          else{
            let error = ["Add/Edit Restricted for Live"];
            this.setState({
              popUpDetails: error
            });
          }
        }
        break;

      case "api":
        if(!api.firebaseJson){
          delete api.firebaseJson;
        }
        if(!api.appleP8File){
          delete api.appleP8File;
        }
        if(REACT_APP_EDIT_MODE !== "prod"){
         if (Object.keys(api).length && !this.validateInputs("api")) {
       if (!submitionLoad && !this.state.uploadErroe && !this.state.p8FileError && Object.keys(api).length && !this.validateInputs("api")) {
         this.setState({ submitionLoad: true })
         mutate({ variables: { data: api } })
            .then(async ({ data }) => {
              if (data.updateSiteInfo) {
                this.setState({
                  popUpDetails: this.state.popUpDetails.concat(["updated"]),
                  validJson:"",
                  submitionLoad: false
                });
              }
            })
            .catch((error) => {
              this.setState({
                 popUpDetails: error.graphQLErrors.map((x) => x.message),
                 validJson:"Your firebase credentials are not valid, Upload a valid firebase JSON file",
                submitionLoad: false
                });
              });
            }
          }
        } else{
          let error = ["Add/Edit Restricted for Live"];
          this.setState({
            popUpDetails: error
          });
        }
        break;

        case "payment":
         if (Object.keys(payment).length && !this.validateInputs("payment")) {
           if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
             this.setState({ submitionLoad: true });
            mutate({ variables: { data: payment } })
              .then(async ({ data }) => {
                if (data.updateSiteInfo) {
                  this.setState({
                    popUpDetails: this.state.popUpDetails.concat(["updated"]),
                    validJson:"",
                    submitionLoad: false
                  });
                }
              })
              .catch((error) => {
                this.setState({
                   popUpDetails: error.graphQLErrors.map((x) => x.message),
                  submitionLoad: false
                });
              });
            }
            else{
              let error = ["Add/Edit Restricted for Live"];
              this.setState({
                popUpDetails: error
              });
            }
          }
          break;
       case "email":
        if (Object.keys(email).length && !this.validateInputs("email")) {
          if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
            this.setState({ submitionLoad: true })
          mutate({ variables: { data: email } })
            .then(async ({ data }) => {
              if (data.updateSiteInfo) {
                this.setState({
                  popUpDetails: this.state.popUpDetails.concat(["updated"]),
                  submitionLoad: false
                });
              }
            })
            .catch((error) => {
              this.setState({
                popUpDetails: error.graphQLErrors.map((x) => x.message),
                submitionLoad: false
              });
            });
          }
          else{
            let error = ["Add/Edit Restricted for Live"];
            this.setState({
              popUpDetails: error
            });
          }
        }
        break;

      case "joinUs":
        if (Object.keys(joinUs).length && !this.validateInputs("joinUs")) {
          if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
            this.setState({ submitionLoad: true })
          mutate({ variables: { data: joinUs } })
            .then(async ({ data }) => {
              if (data.updateSiteInfo) {
                this.setState({
                  popUpDetails: this.state.popUpDetails.concat(["updated"]),
                  submitionLoad: false
                });
              }
            })
            .catch((error) => {
              this.setState({
                popUpDetails: error.graphQLErrors.map((x) => x.message),
                submitionLoad: false
              });
            });
          }
          else{
            let error = ["Add/Edit Restricted for Live"];
            this.setState({
              popUpDetails: error
            });
          }
        }
        break;
      case "design":
        if ((REACT_APP_EDIT_MODE !== "prod" )&& !submitionLoad){
          this.setState({ submitionLoad: true })
          mutate({ variables: { data: design } })
            .then(async ({ data }) => {
              if (data.updateSiteInfo) {
                this.setState({
                  popUpDetails: this.state.popUpDetails.concat(["updated"]),
                  submitionLoad: false
                });
              }
              console.log({data});
            })
            .catch((error) => {
              this.setState({
                popUpDetails: error.graphQLErrors.map((x) => x.message),
                submitionLoad: false
              });
            });
          }
          else{
            let error = ["Add/Edit Restricted for Live"];
            this.setState({
              popUpDetails: error
            });
          }

      default:  break;
    }
  }
  change(event, stateName, type) {
   //console.log("object", stateName)
    var isTrueSet;
   if (stateName === "braintree" || "stripe") {
    isTrueSet = event.target.value === "true";
  this.setState({ [stateName]: !isTrueSet});
  }
   if (stateName === "braintree" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        payment: Object.assign({}, this.state.payment, {MerchantId: this.state.MerchantId,
          Environment: this.state.Environment, PublicKey:this.state.PublicKey, PrivateKey:this.state.PrivateKey, [stateName]: !isTrueSet})
      });
    } else {
      this.setState({
        payment: Object.assign({}, this.state.payment, {[stateName]: !isTrueSet})
      });
    }
   }
  else if (stateName === "stripe" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        payment: Object.assign({}, this.state.payment, {stripePublishKey: this.state.stripePublishKey,
          stripeSecretKey: this.state.stripeSecretKey,  [stateName]: !isTrueSet})
      });
    } else {
      this.setState({
        payment: Object.assign({}, this.state.payment, {[stateName]: !isTrueSet})
      });
    }
   }

   else if (stateName === "paypal" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        payment: Object.assign({}, this.state.payment, {[stateName]: !isTrueSet},{paypalAppId: this.state.paypalAppId, paypalEnvironment: this.state.paypalEnvironment, paypalClientId: this.state.paypalClientId, paypalSecretKey: this.state.paypalSecretKey  })
      });
    } else {
      this.setState({
        payment: Object.assign({}, this.state.payment, {[stateName]: !isTrueSet})
      });
    }
   }

   else if (stateName === "googleLogin" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet},{ googleAppId : this.state.googleAppId})
      });
    } else {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet})
      });
    }
   }

   else if (stateName === "facebookLogin" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet},{ facebookAppId : this.state.facebookAppId})
      });
    } else {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet})
      });
    }
   }
   else if (stateName === "googleAdsence" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet},
          { googleAdSenseId : this.state.googleAdSenseId,
            productPageSlotId : this.state.productPageSlotId,
            productDetailPageSlotId: this.state.productDetailPageSlotId,
            editProfilePageSlotId: this.state.editProfilePageSlotId,
            sellerDetailsPageSlotId: this.state.sellerDetailsPageSlotId,
            chatPageSlotId: this.state.chatPageSlotId,})
      });
    } else {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet})
      });
    }
   }

   else if (stateName === "appleLogin" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet},{ appleClientId : this.state.appleClientId,appleKeyIdentifier : this.state.appleKeyIdentifier,
          appleTeamId: this.state.appleTeamId})
      });
    } else {
      this.setState({
        api: Object.assign({}, this.state.api, {[stateName]: !isTrueSet})
      });
    }
   }
   else if (stateName === "serviceFeeBuyer" || stateName === "serviceFeeSeller") {
    this.setState({
      [stateName]: event.target.value,
      [type]: Object.assign({}, this.state[type], {
        [stateName]: Number(event.target.value)
      })
    });
  }
  else if (stateName === "colorCode1"){
    this.setState({
      colorCode: event.target.value,
      [type]: Object.assign({}, this.state[type], {
        colorCode: event.target.value
      })
    });
  }
  else if (stateName === "paymentSDKMode" ) {
    isTrueSet = event.target.value === "true";
    if (!isTrueSet) {
      this.setState({
        payment: Object.assign({}, this.state.payment, {MerchantId: this.state.MerchantId,
          Environment: this.state.Environment, PublicKey:this.state.PublicKey, PrivateKey:this.state.PrivateKey, [stateName]: !isTrueSet})
      });
    } else {
      this.setState({
        payment: Object.assign({}, this.state.payment, {[stateName]: !isTrueSet})
      });
    }
   }
 else{
    this.setState({
      [stateName]: event.target.value,
      [type]: Object.assign({}, this.state[type], {
        [stateName]: event.target.value
      })
    });
  }
}




  cancelButtonClick = () => {
    this.props.history.push(`${REACT_APP_ADMIN_PATH}/siteSettings`);
  };
  render() {
    const { classes, currencyInfo, siteInfo } = this.props;
    let {
      name,
      defaultCurrency,
      defaultUnit,
      version,
      contactUs,
      image,
      favicon,
      footerLogo,
      footerBatch,
      // footerBackground,
      loginImage,
      adminloginImage,
      androidLink,
      iosLink,
      twLink,
      fbLink,
      instagramLink,
      utubeLink,
      googleApi,
      googleAnalyticKey,
      productPageSlotId,
      productDetailPageSlotId,
      editProfilePageSlotId,
      sellerDetailsPageSlotId,
      chatPageSlotId,
      Environment,
      MerchantId,
      PublicKey,
      PrivateKey,
      facebookAppId,
      googleAppId,
      popUpDetails,
      firebaseName,
      appleP8FileName,
      paypal,
      fromAddress,
      fromName,
      uName,
      password,
      errors,
      stripeSecretKey,
      stripePublishKey,
      paypalEnvironment,
      paypalAppId,
      braintree,
      stripe,
      googleLogin,
      facebookLogin,
      appleLogin,
      appleClientId,
      appleKeyIdentifier,
      appleTeamId,
      hideOrderCancelStatus,
      googleAdsence,
      colorCode,
      subcolorCode,
      serviceFeeBuyer,
      serviceFeeSeller,
      adminSupportMail,
      paypalClientId,
      paypalSecretKey,
      submitionLoad,
      googleAdSenseId,
      imageHost,
      cloud,
      cloudName,
      cloudApiKey,
      cloudApiSecret,
      paymentSDKMode,
      copyrightsText
    } = this.state;

    const colorJson = ["red", "#fafafa", "blue"];
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader>
                {/* <h4 className={classes.cardTitle}>
                  Navigation Pills <small> - Horizontal Tabs</small>
                </h4> */}
              </CardHeader>
              <CardBody>
                <NavPills
                  color="warning"
                  tabs={[
                    {
                      tabButton: "Site Settings",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) =>
                              this.handleSubmit(event, "setting")
                            }
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Site Name
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="name"
                                  error={!!errors["name"]}
                                  success={!!errors["name"]}
                                  helpText={errors["name"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "name", "setting"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: name
                                  }}
                                />
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Admin Currency
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="currency"
                                    className={classes.selectLabel}
                                  >
                                    {!defaultCurrency && "Choose Currency"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={defaultCurrency}
                                    onChange={(event) =>
                                      this.change(
                                        event,
                                        "defaultCurrency",
                                        "setting"
                                      )
                                    }
                                    inputProps={{
                                      name: "currency",
                                      id: "currency"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Currency
                                    </MenuItem>
                                    {currencyInfo.getCurrencies
                                      ? currencyInfo.getCurrencies.map(
                                          (cur, i) => {
                                            return (
                                              <MenuItem
                                                key={i}
                                                classes={{
                                                  root: classes.selectMenuItem,
                                                  selected:
                                                    classes.selectMenuItemSelected
                                                }}
                                                value={cur.code}
                                              >
                                                {cur.code}
                                              </MenuItem>
                                            );
                                          }
                                        )
                                      : ""}
                                  </Select>
                                </FormControl>
                                <FormHelperText
                                  error={errors["defaultCurrency"]}
                                >
                                  {errors["defaultCurrency"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Service Fee for Buyer
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="serviceFeeBuyer"
                                  error={!!errors["serviceFeeBuyer"]}
                                  success={!!errors["serviceFeeBuyer"]}
                                  helpText={errors["serviceFeeBuyer"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "serviceFeeBuyer", "setting"),
                                    type: "number",
                                    autoComplete: "off",
                                    value: serviceFeeBuyer                                                                      
                                  }}
                                />                              
                                <FormHelperText className="Notemgs">
                                NOTE: Service Fee for Buyer should be in decimal points
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Service Fee for Seller
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="serviceFeeSeller"
                                  error={!!errors["serviceFeeSeller"]}
                                  success={!!errors["serviceFeeSeller"]}
                                  helpText={errors["serviceFeeSeller"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "serviceFeeSeller", "setting"),
                                    type: "number",
                                    autoComplete: "off",
                                    value: serviceFeeSeller                                    
                                  }}
                                />                              
                                <FormHelperText className="Notemgs">
                                NOTE: Service Fee for Seller should be in decimal points
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Unit<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="unit"
                                    className={classes.selectLabel}
                                  >
                                    {!defaultUnit && "Choose Unit"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={defaultUnit}
                                    onChange={(event) =>
                                      this.change(
                                        event,
                                        "defaultUnit",
                                        "setting"
                                      )
                                    }
                                    inputProps={{
                                      name: "unit",
                                      id: "unit"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Unit
                                    </MenuItem>
                                    {["KM","MI"].map((u, i) => {
                                      return (
                                        <MenuItem
                                          key={i}
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={u}
                                        >
                                          {u}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <FormHelperText error={errors["defaultUnit"]}>
                                  {errors["defaultUnit"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Contact Us Email<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="contactUs"
                                  error={!!errors["contactUs"]}
                                  success={!!errors["contactUs"]}
                                  helpText={errors["contactUs"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "contactUs", "setting"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: contactUs
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                         
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Version<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="version"
                                  error={!!errors["version"]}
                                  success={!!errors["version"]}
                                  helpText={errors["version"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "version", "setting"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: version
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                CopyRights Content<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="copyrightsText"
                                  error={!!errors["copyrightsText"]}
                                  success={!!errors["copyrightsText"]}
                                  helpText={errors["copyrightsText"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "copyrightsText", "setting"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: copyrightsText
                                  }}
                                />
                                {/* <FormHelperText>
                                NOTE: Copy right content changes reflect only after the logout.
                              </FormHelperText> */}
                              </GridItem>
                            
                            </GridContainer>
                            <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    },
                    {
                      tabButton: "Site Images",
                      tabContent: (
                        <span>
                         <form onSubmit={(event) => this.handleSubmit(event, "images")}>
                          <GridContainer style={{ marginBottom: "20px" }}>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Logo<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof image === "string" && image}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("image", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size 382 x 95 pixels
                              </FormHelperText>
                              <FormHelperText error={errors["image"]}>
                                {errors["image"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>

                          <GridContainer>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Favicon<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof favicon === "string" && favicon}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("favicon", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size 382 x 95 pixels
                              </FormHelperText>
                              <FormHelperText error={errors["favicon"]}>
                                {errors["favicon"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>

                          <GridContainer>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Footer Logo
                                <span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={
                                  typeof footerLogo === "string" && footerLogo
                                }
                                handleSubmit={(f, e) =>
                                  this.handleUpload("footerLogo", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size 382 x 95 pixels
                              </FormHelperText>
                              <FormHelperText error={errors["footerLogo"]}>
                                {errors["footerLogo"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>



                          <GridContainer style={{ marginBottom: "20px" }}>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Admin Login Image<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof adminloginImage === "string" && adminloginImage}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("adminloginImage", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size  pixels
                              </FormHelperText>
                              <FormHelperText error={errors["adminloginImage"]}>
                                {errors["adminloginImage"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>


                       <GridContainer style={{ marginBottom: "20px" }}>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Login Image<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof loginImage === "string" && loginImage}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("loginImage", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size  pixels
                              </FormHelperText>
                              <FormHelperText error={errors["loginImage"]}>
                                {errors["loginImage"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>

                           <GridContainer style={{ marginBottom: "20px" }}>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Footer Batch<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof footerBatch === "string" && footerBatch}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("footerBatch", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size 473 x 284 pixels
                              </FormHelperText>
                              <FormHelperText error={errors["footerBatch"]}>
                                {errors["footerBatch"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>

                           {/* <GridContainer style={{ marginBottom: "20px" }}>
                            <GridItem xs={12} sm={3}>
                              <FormLabel className={classes.labelHorizontal}>
                                Footer Background<span className="validatcolor">*</span>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={7}>
                              <PictureUpload
                                mode={"edit"}
                                imageUrl={typeof footerBackground === "string" && footerBackground}
                                handleSubmit={(f, e) =>
                                  this.handleUpload("footerBackground", f, e)
                                }
                              />
                              <FormHelperText>
                                NOTE: Recommended Size 2732 x 288 pixels
                              </FormHelperText>
                              <FormHelperText error={errors["footerBackground"]}>
                                {errors["footerBackground"]}
                              </FormHelperText>
                            </GridItem>
                          </GridContainer> */}

                          <GridContainer justify="flex-end">
                            <GridItem>
                              <Button
                                className={classes.roomTypeCancelBtn}
                                onClick={() => this.cancelButtonClick()}
                              >
                                Cancel
                              </Button>
                            </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                              Submit
                            </Button>
                          </GridContainer>
                          </form>
                        </span>
                      )
                    },
                    {
                      tabButton: "Api Credentials",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) => this.handleSubmit(event, "api")}
                          >
                          <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Google Api Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="googleApi"
                                  error={!!errors["googleApi"]}
                                  success={!!errors["googleApi"]}
                                  helpText={errors["googleApi"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "googleApi", "api"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: googleApi
                                  }}
                                />
                              </GridItem>
                          </GridContainer>
                          <GridContainer>
                          <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Google Analytic Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="googleAnalyticKey"
                                  error={!!errors["googleAnalyticKey"]}
                                  success={!!errors["googleAnalyticKey"]}
                                  helpText={errors["googleAnalyticKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "googleAnalyticKey",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: googleAnalyticKey
                                  }}
                                />
                              </GridItem>
                              </GridContainer>

                          <GridContainer>
                              <GridItem xs={12} sm={3}>
                                  <FormLabel className={classes.labelHorizontal}>
                                    Google Login
                                  </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                <div style={{paddingTop:"25px"}}><FormControlLabel
                                      control={
                                        <Switch
                                          checked={googleLogin}
                                          onChange={
                                            (event) =>
                                            this.change(event, "googleLogin", "api")
                                          }
                                          value={String(googleLogin)}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            icon: classes.switchIcon,
                                            iconChecked: classes.switchIconChecked,
                                            bar: classes.switchBar
                                          }}
                                        />
                                      }
                                    /></div>
                                </GridItem>
                            </GridContainer>
                           {googleLogin &&  <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Google App Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="googleAppId"
                                  error={!!errors["googleAppId"]}
                                  success={!!errors["googleAppId"]}
                                  helpText={errors["googleAppId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "googleAppId", "api"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: googleAppId
                                  }}
                                />
                              </GridItem>
                            </GridContainer>}
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                  <FormLabel className={classes.labelHorizontal}>
                                    Facebook Login
                                  </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                <div style={{paddingTop:"25px"}}><FormControlLabel
                                      control={
                                        <Switch
                                          checked={facebookLogin}
                                          onChange={
                                            (event) =>
                                            this.change(event, "facebookLogin", "api")
                                          }
                                          value={String(facebookLogin)}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            icon: classes.switchIcon,
                                            iconChecked: classes.switchIconChecked,
                                            bar: classes.switchBar
                                          }}
                                        />
                                      }
                                    /></div>
                                </GridItem>
                            </GridContainer>
                            { facebookLogin && <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Facebook App Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="facebookAppId"
                                  error={!!errors["facebookAppId"]}
                                  success={!!errors["facebookAppId"]}
                                  helpText={errors["facebookAppId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "facebookAppId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: facebookAppId
                                  }}
                                />
                              </GridItem>
                              </GridContainer> }
                              <GridContainer>
                              <GridItem xs={12} sm={3}>
                                  <FormLabel className={classes.labelHorizontal}>
                                    Apple Login
                                  </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                <div style={{paddingTop:"25px"}}><FormControlLabel
                                      control={
                                        <Switch
                                          checked={appleLogin}
                                          onChange={
                                            (event) =>
                                            this.change(event, "appleLogin", "api")
                                          }
                                          value={String(appleLogin)}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            icon: classes.switchIcon,
                                            iconChecked: classes.switchIconChecked,
                                            bar: classes.switchBar
                                          }}
                                        />
                                      }
                                    /></div>
                                </GridItem>
                            </GridContainer>
                            {appleLogin && <><GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Apple Client Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="appleClientId"
                                  error={!!errors["appleClientId"]}
                                  success={!!errors["appleClientId"]}
                                  helpText={errors["appleClientId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "appleClientId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: appleClientId
                                  }}
                                />
                              </GridItem>
                      </GridContainer>
                      <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Apple Key Identifier
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="appleKeyIdentifier"
                                  error={!!errors["appleKeyIdentifier"]}
                                  success={!!errors["appleKeyIdentifier"]}
                                  helpText={errors["appleKeyIdentifier"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "appleKeyIdentifier",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: appleKeyIdentifier
                                  }}
                                />
                              </GridItem>
                      </GridContainer>
                      <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Apple Team Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="appleTeamId"
                                  error={!!errors["appleTeamId"]}
                                  success={!!errors["appleTeamId"]}
                                  helpText={errors["appleTeamId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "appleTeamId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: appleTeamId
                                  }}
                                />
                              </GridItem>
                                </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}>
                          <FormLabel className={classes.labelHorizontal}>
                              Apple Auth File <span className="validatcolor">*</span>
                              </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                              <div className="sadasd">
                                <div class="upload-btn-wrapper">
                                <button class="btn">Upload a file</button>
                              <input type="file" name="appleP8File"
                                accept=".p8"
                                onChange={(event) => this.p8FileHandler("appleP8File", event)}  />
                                </div>
                                <div className="previewfilenameup">
                                <p> { appleP8FileName } </p>
                                </div>
                                </div>
                                <FormHelperText className="Notemgs">
                                  NOTE: File Format should be .p8 File
                                </FormHelperText>
                                <FormHelperText className="Errormessag">
                                {this.state.p8FileError}
                                </FormHelperText>
                                {/* <p className="Errormessag">{validJson}</p> */}
                      </GridItem>
                                </GridContainer> </>}
                        <GridContainer>
                              <GridItem xs={12} sm={3}>
                                  <FormLabel className={classes.labelHorizontal}>
                                    Google Adsence
                                  </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                <div style={{paddingTop:"25px"}}><FormControlLabel
                                      control={
                                        <Switch
                                          checked={googleAdsence}
                                          onChange={
                                            (event) =>
                                            this.change(event, "googleAdsence", "api")
                                          }
                                          value={String(googleAdsence)}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            icon: classes.switchIcon,
                                            iconChecked: classes.switchIconChecked,
                                            bar: classes.switchBar
                                          }}
                                        />
                                      }
                                    /></div>
                                </GridItem>
                            </GridContainer>
                            {
                              googleAdsence &&  <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Google Adsense Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="googleAdSenseId"
                                  error={!!errors["googleAdSenseId"]}
                                  success={!!errors["googleAdSenseId"]}
                                  helpText={errors["googleAdSenseId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "googleAdSenseId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: googleAdSenseId
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Product Page Slot Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="productPageSlotId"
                                  error={!!errors["productPageSlotId"]}
                                  success={!!errors["productPageSlotId"]}
                                  helpText={errors["productPageSlotId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "productPageSlotId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: productPageSlotId
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  ProductDetails Page Slot Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="productDetailPageSlotId"
                                  error={!!errors["productDetailPageSlotId"]}
                                  success={!!errors["productDetailPageSlotId"]}
                                  helpText={errors["productDetailPageSlotId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "productDetailPageSlotId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: productDetailPageSlotId
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  EditProfile Page Slot Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="editProfilePageSlotId"
                                  error={!!errors["editProfilePageSlotId"]}
                                  success={!!errors["editProfilePageSlotId"]}
                                  helpText={errors["editProfilePageSlotId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "editProfilePageSlotId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: editProfilePageSlotId
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  SellerDetails Page Slot Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="sellerDetailsPageSlotId"
                                  error={!!errors["sellerDetailsPageSlotId"]}
                                  success={!!errors["sellerDetailsPageSlotId"]}
                                  helpText={errors["sellerDetailsPageSlotId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "sellerDetailsPageSlotId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: sellerDetailsPageSlotId
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Chat Page Slot Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="chatPageSlotId"
                                  error={!!errors["chatPageSlotId"]}
                                  success={!!errors["chatPageSlotId"]}
                                  helpText={errors["chatPageSlotId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "chatPageSlotId",
                                        "api"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: chatPageSlotId
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            }

                                <GridContainer>
                                    <GridItem xs={12} sm={3}>
                                          <FormLabel className={classes.labelHorizontal}>
                                            Firebase Json File <span className="validatcolor">*</span>
                                          </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>

                                        <div className="sadasd">
                                          <div class="upload-btn-wrapper">
                                          <button class="btn">Upload a file</button>
                                        <input type="file" name="firebaseJson"
                                          accept=".json"
                                          onChange={(event) => this.fileChangedHandler("firebaseJson", event)}  />
                                          </div>
                                          <div className="previewfilenameup">
                                          <p> {firebaseName } </p>
                                          </div>
                                          </div>
                                          <FormHelperText className="Notemgs">
                                            NOTE: File Format should be JSON File
                                          </FormHelperText>
                                          <FormHelperText className="Errormessag">
                                          {this.state.uploadErroe}
                                          </FormHelperText>
                                          {/* <p className="Errormessag">{validJson}</p> */}
                                    </GridItem>
                                </GridContainer>
                           <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    },
                    {
                      tabButton: "Cloudinary Credentials",
                      tabContent:(
                        <span>
                        <form onSubmit={(event) => this.handleSubmit(event, "cloud")}>
                        <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Image Host<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="imageHost"
                                    className={classes.selectLabel}
                                  >
                                    {!imageHost && "Choose Image Host"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={imageHost}
                                    onChange={(event) =>
                                      this.change(
                                        event,
                                        "imageHost",
                                        "cloud"
                                      )
                                    }
                                    inputProps={{
                                      name: "imageHost",
                                      id: "imageHost"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Image Host
                                    </MenuItem>
                                    {["local","cloud"].map((u, i) => {
                                      return (
                                        <MenuItem
                                          key={i}
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={u}
                                        >
                                          {u}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <FormHelperText error={errors["imageHost"]}>
                                  {errors["imageHost"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>

                           { imageHost === "cloud" && 
                              <div>
                           <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Cloud Name<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="cloudName"
                                  error={!!errors["cloudName"]}
                                  success={!!errors["cloudName"]}
                                  helpText={errors["cloudName"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "cloudName", "cloud"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: cloudName
                                  }}
                                />
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Cloud API Key<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="cloudApiKey"
                                  error={!!errors["cloudApiKey"]}
                                  success={!!errors["cloudApiKey"]}
                                  helpText={errors["cloudApiKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "cloudApiKey", "cloud"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: cloudApiKey
                                  }}
                                />
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Cloud API Secret<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="cloudApiSecret"
                                  error={!!errors["cloudApiSecret"]}
                                  success={!!errors["cloudApiSecret"]}
                                  helpText={errors["cloudApiSecret"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "cloudApiSecret", "cloud"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: cloudApiSecret
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            </div>
                           }
                         <GridContainer justify="flex-end">
                           <GridItem>
                             <Button
                               className={classes.roomTypeCancelBtn}
                               onClick={() => this.cancelButtonClick()}
                             >
                               Cancel
                             </Button>
                           </GridItem>
                             <Button type="submit" color="rose" disabled={submitionLoad}>
                             Submit
                           </Button>
                         </GridContainer>
                         </form>
                       </span>
                      )
                    },
                    {
                      tabButton: "Payment key",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) => this.handleSubmit(event, "payment")}
                          >


            <GridContainer>
                <GridItem xs={12} sm={3}>
                    <FormLabel className={classes.labelHorizontal}>
                      Brain Tree
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={7}>
                  <div style={{paddingTop:"25px"}}><FormControlLabel
                        control={
                          <Switch
                            checked={braintree}
                            onChange={
                              (event) =>
                              this.change(event, "braintree", "payment")
                            }
                            value={String(braintree)}
                            classes={{
                              switchBase: classes.switchBase,
                              checked: classes.switchChecked,
                              icon: classes.switchIcon,
                              iconChecked: classes.switchIconChecked,
                              bar: classes.switchBar
                            }}
                          />
                        }
                      /></div>
                  </GridItem>
                  </GridContainer>
                  {braintree && <> <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Payment Environment
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="Environment"
                                    className={classes.selectLabel}
                                  >
                                    {!Environment && "Choose environment"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={Environment}
                                    onChange={(event) =>
                                      this.change(event, "Environment", "payment")
                                    }
                                    inputProps={{
                                      name: "Environment",
                                      id: "Environment"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Environment
                                    </MenuItem>
                                    {["Sandbox", "Production"].map((u, i) => {
                                      return (
                                        <MenuItem
                                          key={i}
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={u}
                                        >
                                          {u}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <FormHelperText error={errors["Environment"]}>
                                  {errors["Environment"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Payment Merchant Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="MerchantId"
                                  error={!!errors["MerchantId"]}
                                  success={!!errors["MerchantId"]}
                                  helpText={errors["MerchantId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "MerchantId", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: MerchantId
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Payment Public Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="PublicKey"
                                  error={!!errors["PublicKey"]}
                                  success={!!errors["PublicKey"]}
                                  helpText={errors["PublicKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "PublicKey", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: PublicKey
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Payment Private Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="PrivateKey"
                                  error={!!errors["PrivateKey"]}
                                  success={!!errors["PrivateKey"]}
                                  helpText={errors["PrivateKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "PrivateKey", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: PrivateKey
                                  }}
                                />
                              </GridItem>
                                </GridContainer></> }

                              <GridContainer>
                                <GridItem xs={12} sm={3}>
                                    <FormLabel className={classes.labelHorizontal}>
                                      Paypal
                                    </FormLabel>
                                  </GridItem>
                                  <GridItem xs={12} sm={7}>
                                  <div style={{paddingTop:"25px"}}><FormControlLabel
                                        control={
                                          <Switch
                                            checked={paypal}
                                            onChange={
                                              (event) =>
                                              this.change(event, "paypal", "payment")
                                            }
                                            value={String(paypal)}
                                            classes={{
                                              switchBase: classes.switchBase,
                                              checked: classes.switchChecked,
                                              icon: classes.switchIcon,
                                              iconChecked: classes.switchIconChecked,
                                              bar: classes.switchBar
                                            }}
                                          />
                                        }
                                      /></div>
                                  </GridItem>
                              </GridContainer>
                              { paypal && <>
                                <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                    paypal Environment
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="paypalEnvironment"
                                    className={classes.selectLabel}
                                  >
                                    {!paypalEnvironment && "Choose environment"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={paypalEnvironment}
                                    onChange={(event) =>
                                      this.change(event, "paypalEnvironment", "payment")
                                    }
                                    inputProps={{
                                      name: "paypalEnvironment",
                                      id: "paypalEnvironment"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose paypal Environment
                                    </MenuItem>
                                    {["sandbox", "production"].map((u, i) => {
                                      return (
                                        <MenuItem
                                          key={i}
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={u}
                                        >
                                          {u}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <FormHelperText error={errors["paypalEnvironment"]}>
                                  {errors["paypalEnvironment"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Paypal Access Token
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="paypalAppId"
                                  error={!!errors["paypalAppId"]}
                                  success={!!errors["paypalAppId"]}
                                  helpText={errors["paypalAppId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "paypalAppId", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: paypalAppId
                                  }}
                                />
                              </GridItem>
                                </GridContainer>

                              <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Paypal Client Id
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="paypalClientId"
                                  error={!!errors["paypalClientId"]}
                                  success={!!errors["paypalClientId"]}
                                  helpText={errors["paypalClientId"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "paypalClientId", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: paypalClientId
                                  }}
                                />
                              </GridItem>
                                </GridContainer>
                                <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Paypal Secret Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="paypalSecretKey"
                                  error={!!errors["paypalSecretKey"]}
                                  success={!!errors["paypalSecretKey"]}
                                  helpText={errors["paypalSecretKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "paypalSecretKey", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: paypalSecretKey
                                  }}
                                />
                              </GridItem>
                                </GridContainer>
                                </>
                              }

                                <GridContainer>
                                  <GridItem xs={12} sm={3}>
                                      <FormLabel className={classes.labelHorizontal}>
                                        Stripe
                                      </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={7}>
                                    <div style={{paddingTop:"25px"}}><FormControlLabel
                                          control={
                                            <Switch
                                              checked={stripe}
                                              onChange={
                                                (event) =>
                                                this.change(event, "stripe", "payment")
                                              }
                                              value={String(stripe)}
                                              classes={{
                                                switchBase: classes.switchBase,
                                                checked: classes.switchChecked,
                                                icon: classes.switchIcon,
                                                iconChecked: classes.switchIconChecked,
                                                bar: classes.switchBar
                                              }}
                                            />
                                          }
                                        /></div>
                                    </GridItem>
                                    </GridContainer>


                          {stripe && <>  <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Stripe Secret Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="stripeSecretKey"
                                  error={!!errors["stripeSecretKey"]}
                                  success={!!errors["stripeSecretKey"]}
                                  helpText={errors["stripeSecretKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "stripeSecretKey", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: stripeSecretKey
                                  }}
                                />
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                Stripe Publish Key
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="stripePublishKey"
                                  error={!!errors["stripePublishKey"]}
                                  success={!!errors["stripePublishKey"]}
                                  helpText={errors["stripePublishKey"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "stripePublishKey", "payment"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: stripePublishKey
                                  }}
                                />
                              </GridItem>
                                </GridContainer> </> }
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                  <FormLabel className={classes.labelHorizontal}>
                                    Payment SDK Mode
                                  </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={7}>
                                <div style={{paddingTop:"25px"}}><FormControlLabel
                                      control={
                                        <Switch
                                          checked={paymentSDKMode}
                                          onChange={
                                            (event) =>
                                            this.change(event, "paymentSDKMode", "payment")
                                          }
                                          value={String(paymentSDKMode)}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            icon: classes.switchIcon,
                                            iconChecked: classes.switchIconChecked,
                                            bar: classes.switchBar
                                          }}
                                        />
                                      }
                                    /></div>
                                </GridItem>
                            </GridContainer>
{/* /**
|----------------------------------------------------------------------------------------
| Hide cancel order status option
|----------------------------------------------------------------------------------------
*/ }
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Cancel order should be hide in which status ?<span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <InputLabel
                                    htmlFor="hideOrderCancelStatus"
                                    className={classes.selectLabel}
                                  >
                                    {!hideOrderCancelStatus && "Choose hideOrderCancelStatus"}
                                  </InputLabel>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    classes={{
                                      select: classes.select
                                    }}
                                    value={hideOrderCancelStatus}
                                    onChange={(event) =>
                                      this.change(
                                        event,
                                        "hideOrderCancelStatus",
                                        "payment"
                                      )
                                    }
                                    inputProps={{
                                      name: "hideOrderCancelStatus",
                                      id: "hideOrderCancelStatus"
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose status
                                    </MenuItem>
                                    {["PROCESSING", "SHIPPED"].map((u, i) => {
                                      return (
                                        <MenuItem
                                          key={i}
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={u}
                                        >
                                          {u}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <FormHelperText error={errors["hideOrderCancelStatus"]}>
                                  {errors["hideOrderCancelStatus"]}
                                </FormHelperText>
                              </GridItem>
                            </GridContainer>
                           <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    },


                    {
                      tabButton: "Email Settings",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) =>
                              this.handleSubmit(event, "email")
                            }
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Email From Address
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="fromAddress"
                                  error={!!errors["fromAddress"]}
                                  success={!!errors["fromAddress"]}
                                  helpText={errors["fromAddress"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "fromAddress",
                                        "email"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: fromAddress
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Email From Name
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="fromName"
                                  error={!!errors["fromName"]}
                                  success={!!errors["fromName"]}
                                  helpText={errors["fromName"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "fromName", "email"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: fromName
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Email User Name
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="uName"
                                  error={!!errors["uName"]}
                                  success={!!errors["uName"]}
                                  helpText={errors["uName"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "uName", "email"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: uName
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Email Password
                                  <span className="validatcolor">*</span>
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="password"
                                  error={!!errors["password"]}
                                  success={!!errors["password"]}
                                  helpText={errors["password"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "password", "email"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: password
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    },
                    {
                      tabButton: "Join Us",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) =>
                              this.handleSubmit(event, "joinUs")
                            }
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Support Mail
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="adminSupportMail"
                                  error={!!errors["adminSupportMail"]}
                                  success={!!errors["adminSupportMail"]}
                                  helpText={errors["adminSupportMail"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "adminSupportMail", "joinUs"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: adminSupportMail
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  FaceBook Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="fbLink"
                                  error={!!errors["fbLink"]}
                                  success={!!errors["fbLink"]}
                                  helpText={errors["fbLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "fbLink", "joinUs"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: fbLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Twitter Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="twLink"
                                  error={!!errors["twLink"]}
                                  success={!!errors["twLink"]}
                                  helpText={errors["twLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "twLink", "joinUs"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: twLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Youtube Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="utubeLink"
                                  error={!!errors["utubeLink"]}
                                  success={!!errors["utubeLink"]}
                                  helpText={errors["utubeLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "utubeLink", "joinUs"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: utubeLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>

                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Instagram Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="instagramLink"
                                  error={!!errors["instagramLink"]}
                                  success={!!errors["instagramLink"]}
                                  helpText={errors["instagramLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "instagramLink",
                                        "joinUs"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: instagramLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Passup Android Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="androidLink"
                                  error={!!errors["androidLink"]}
                                  success={!!errors["androidLink"]}
                                  helpText={errors["androidLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(
                                        event,
                                        "androidLink",
                                        "joinUs"
                                      ),
                                    type: "text",
                                    autoComplete: "off",
                                    value: androidLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Passup IOS Link
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="iosLink"
                                  error={!!errors["iosLink"]}
                                  success={!!errors["iosLink"]}
                                  helpText={errors["iosLink"]}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "iosLink", "joinUs"),
                                    type: "text",
                                    autoComplete: "off",
                                    value: iosLink
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    },
                    {
                      tabButton: "Theme",
                      tabContent: (
                        <span>
                          <form
                            onSubmit={(event) =>
                              this.handleSubmit(event, "design")
                            }
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Color Code
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="colorCode"
                                  className="colorCode"
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "colorCode", "design"),
                                    type: "text",
                                    readOnly:true,
                                    value: colorCode,
                                  }}
                                />
                                <div className="custom_color_list">
                                {colorPalette.map((x , i) => {
                                  return(
                                    <>
                                    <label className={x.hexString == colorCode ? "cls_colorpalate active" :"cls_colorpalate"} key={i}>
                                    <input id="colorCode1" type="radio" name="color"  value={x.hexString} onChange={(event) =>
                                      this.change(
                                        event,
                                        "colorCode1",
                                        "design"
                                      )
                                    } />
                                    <div className="layer"></div>
                                    <div className="button"><span style={{backgroundColor:x.hexString}} title={x.hexString}></span></div><p>{x.hexString}</p>
                                  </label>
                                  </>
                                  )
                                })}
                                </div>
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={12} sm={3}>
                                <FormLabel className={classes.labelHorizontal}>
                                  Sub Color Code
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={7}>
                                <CustomInput
                                  id="subcolorCode"
                                  className="subcolorCode"
                                  inputProps={{
                                    onChange: (event) =>
                                      this.change(event, "subcolorCode", "design"),
                                    type: "color",
                                    value: subcolorCode
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer justify="flex-end">
                              <GridItem>
                                <Button
                                  className={classes.roomTypeCancelBtn}
                                  onClick={() => this.cancelButtonClick()}
                                >
                                  Cancel
                                </Button>
                              </GridItem>
                              <Button type="submit" color="rose" disabled={submitionLoad}>
                                Submit
                              </Button>
                            </GridContainer>
                          </form>
                        </span>
                      )
                    }
                  ]}
                />
              </CardBody>
              {popUpDetails.length ? (
                <Snackbar
                  place="tc"
                  color="rose"
                  message={
                    popUpDetails[0] === "updated"
                      ? "Site Setting Updated Successfully"
                      : popUpDetails[0]
                  }
                  open={!!popUpDetails.length}
                  closeNotification={() => {
                    if (!!popUpDetails.find(p => p === "updated")) {
                      this.setState({ popUpDetails: [] });
                      siteInfo.refetch();
                    }
                    this.setState({
                       popUpDetails: [],
                       firebaseJson: ""
                      });
                  }}
                  close
                />
              ) : (
                ""
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

var settings = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(UPDATE_SITE),
  graphql(GET_CURRENCIES, { name: "currencyInfo" })
)(SiteSetting);

export default withStyles(styles)(settings);

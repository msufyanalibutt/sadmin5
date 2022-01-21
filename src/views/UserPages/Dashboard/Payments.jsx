import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import powericon from "../../../assets/img/powericon.png";
import { compose, graphql } from "react-apollo";
import {
  GET_FEATURELIST_DETAILS,
  GET_PAYMENT_TOKEN,
  UPDATE_PAYMENT,
  GET_PRODUCT_ID,
  UPDATE_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_PRODUCT,
  CLOSE_MODEL,
  GET_SITE_INFO,
  GET_STRIPE_SECRET,
} from "../../../queries";
import { BraintreeDropIn } from "braintree-web-react";
import { getSymbol } from "../../../helper.js";
import * as Toastr from "../Toast.jsx";
import Modal from "react-modal";
import { withTranslation } from "react-i18next";
//import StripeCheckout from 'react-stripe-checkout';
import PaypalExpressBtn from "react-paypal-express-checkout";
import CardForm from "./CardForm.js";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { StripeProvider, Elements } from "react-stripe-elements";
import paypal from 'paypal-checkout';
import Braintree from 'braintree-web';
import PaypalCheckout from 'braintree-web/paypal-checkout';
import {DiscardPopup} from '../css/styledcomponents';
import PaymentWindow from "./PaymentWindow";
import history from "../../../history";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "auto",
    maxHeight: "100%",
    padding:"0 0 10px 0px"
  },
};

// const theme = createMuiTheme({
//   overrides: {
//     MuiTabs: {
//       indicator: {
//         backgroundColor: orange[700]
//       }
//     },
//     MuiTab: {
//       root: {},
//       selected: {
//         backgroundColor: "var(--theme-color)!important",
//         color: "#fff!important"
//       }
//     }
//   }
// });

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
}

// function getList() {
//   return new Promise(function(resolve) {
//     setTimeout(() => resolve([1, 2, 3]), 1000);
//   });
// }

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  bigIndicator: {
    backgroundColor: "transparent",
  },
});

const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

class SimpleTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      featured: [],
      clientToken: null,
      modalIsOpen: false,
      productId: "",
      //isLoading: false,
      show: false,
      isLoadingfuture: false,
      showfuture: false,
      paymentId: 1,
      clicked: true,
      PayButtonEnabled: false,
      buttonDisabled: false,
      braintreeOptions: true,
      payGetproduct: this.props.pathPush,
      braintree: false,
      stripe: false,
      paypal: false,
      paypalAppId: "",
      stripePublishKey: "",
      stripeClientSecret: "",
      paymentOptions: [],
      selectedPaymentOption: "",
      handleFeaturedData: {},
      commit: true,
      paypalEnvironment:""
    };
  
  }

  instance;

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentWillMount() {
    let { getFeatureddetails, siteInfo } = this.props;
    let featured = [];
    getFeatureddetails.refetch().then(({ data }) => {
      if(data){
        let paymentData = data.getFeaturedDetails.paymentInfo;
        paymentData.filter(x=> x.payment_type === "Paypal").map((z) => {
              this.setState({
                paypalClientKey : z.key
            })
        })
        this.setState({
          featured: data.getFeaturedDetails.featuredInfo,
        });
      }
    });
  
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      //let info = siteInfo.getSiteInfo;
      let {
        braintree,
        stripe,
        paypal,
        stripePublishKey,
        paypalEnvironment
      } = siteInfo.getSiteInfo;
    
      let paymentOptions = [];
      if (braintree) {
        paymentOptions.push(this.props.t("Productdetails.Braintree"));
      }
      if (stripe) {
        paymentOptions.push(this.props.t("Productdetails.Stripe"));
      }
      if (paypal) {
        paymentOptions.push(this.props.t("Productdetails.Paypal"));
      }

      this.setState({
        braintree,
        stripe,
        paypal,
        stripePublishKey,
        paymentOptions,
        paypalEnvironment
      });
    }
  }

  handleSubmit = (e, item) => {
    let {getCacheProductId} = this.props;
    document.body.classList.remove("scrollDisable");
    history.push(`/api/payment?type=featured&featuredId=${item.id}&productId=${getCacheProductId.productId}`)
    this.setState({
      modalIsOpen: true,
      showfuture: false,
      isLoadingfuture: true,
      //price: item.price,
      featuredId: parseInt(item.id),
      handleFeaturedData: item,
    });
  };

 
  handleChange = (event, value) => {
    this.setState({ value });
  };

  showHide = (id) => {
    this.setState({
      paymentId: id,
      value: "",
    });
    document.body.style = "overflow-y:hidden !important";
  };

  handleResponse = async (res) => {
    res.on("paymentMethodRequestable", (event) => {
      if (event.type === "CreditCard") {
        this.setState({
          PayButtonEnabled: true,
        });
      } else if (event.type === "PayPalAccount") {
        this.setState({
          PayButtonEnabled: true,
        });
      }
    });
  };

  
  render() {
    let {
      value,
      featured,
      paymentId,
      paypalClientKey,
      paypalEnvironment
    } = this.state;
    
     let { classes, t } = this.props;

    const paypalSandboxConf = {
      currency: "USD",
      env: 'sandbox',
      client:{
        sandbox: paypalClientKey
      },
      style:{
        label:"pay",
        size:"medium",
        shape:"rect",
        color:"gold"
      }
    }

    const paypalProductionConf = {
      currency: "USD",
      env: 'production',
      client:{
        production: paypalClientKey
      },
      style:{
        label:"pay",
        size:"medium",
        shape:"rect",
        color:"gold"
      }
    }

    const envData = paypalEnvironment === "sandbox" ? paypalSandboxConf : paypalProductionConf
  
    return (
      <div className="paymentwrapper">
        <div className="paymenttitle titlebgspsce">
          <h5>
            <span>
              <img src={powericon} alt="" />
            </span>
            {t("Productdetails._REACHMORE")}
          </h5>
          <h6> {t("Productdetails._UpgradeProduct")} </h6>
        </div>
        <div className={classes.root}>
          <div>
            <div
              className={
                featured.length > 3
                  ? "reactbuy"
                  : "reactbuy centeralignteactbuy"
              }
            >
              <ul value={value} onChange={this.handleChange}>
                {featured
                  .filter((item) => item.status !== "Inactive")
                  .map((item, index) => (
                    <span>
                      <li
                        className={
                          paymentId === item.id || value === index
                            ? "paymentactive btncolorchange"
                            : "noactivepayment btncolorchange"
                        }
                        onClick={() => this.showHide(item.id)}
                        title={item.name}
                      >
                        {" "}
                        <span> {item.name} </span>{" "}
                      </li>
                    </span>
                  ))}
              </ul>
            </div>
            {featured
              .filter((item) => item.status !== "Inactive")
              .map((item, index) => {
                //console.log(item)
                return (
                  <div>
                    <div>
                      {value === index || paymentId === item.id ? (
                        <div className="tabcontebt">
                          <div className="paymenttitle">
                            {/* <h5> Attract {item.name} more buyers</h5> */}
                            <p>{item.description}</p>
                          </div>
                          <div className="tabimgvw">
                            <div className="centealgnimg">
                              <img
                                src={item.image}
                                className="img-fluid"
                                alt=""
                              />
                            </div>

                            <div className="sav_chang paymentbtnres">
                              {/* <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={this.state.isLoadingfuture}
                                onClick={(e) => this.handleSubmit(e, item)}
                              >
                                {this.state.isLoadingfuture
                                  ? t("Productdetails._Loading")
                                  : t("Productdetails._FeatureIt")}{" "}
                                <span className="rtlchage">
                                  {" "}
                                  {getSymbol(item.currencySymbol)}{" "}
                                </span>
                                {item.price}
                              </button> */}
                              <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={this.state.isLoadingfuture}
                                onClick={(e) => this.handleSubmit(e, item)}
                              >{t("Productdetails._FeatureIt")}{" "}
                              <span className="rtlchage">
                                {" "}
                                {getSymbol(item.currencySymbol)}{" "}
                              </span>
                              {item.price}</button>
                            </div>
                            {localStorage.getItem("currency") !== "USD" && (
                              <div className="rtlwrapper">
                                <span className="rtlcenter">
                                  <span className="rtlchage">
                                    {t("Productdetails.note")}
                                  </span>{" "}
                                  <b>
                                    <span className="rtlchage">
                                      {getSymbol(
                                        localStorage.getItem("currencySymbol")
                                      )}
                                    </span>{" "}
                                    <span className="rtlchage">
                                      {item.beforeconversionMsg}{" "}
                                    </span>
                                    <span className="rtlchage">
                                      {t("Productdetails._convertions")}{" "}
                                    </span>{" "}
                                    <span className="rtlchage"> $ </span>
                                    <span className="rtlchage">
                                      {" "}
                                      {item.afterconversionMsg}
                                    </span>
                                  </b>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}{" "}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

var categorylist = compose(
  graphql(GET_FEATURELIST_DETAILS, {
    name: "getFeatureddetails",
  }),
  graphql(GET_PAYMENT_TOKEN, {
    name: "getPaymentToken",
  }),
  graphql(GET_STRIPE_SECRET, {
    name: "getStripeClientToken",
  }),
  graphql(UPDATE_PAYMENT, {
    name: "updatePayment",
  }),
  graphql(GET_PRODUCT_ID, {
    name: "getCacheProductId",
  }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),

  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(CLOSE_MODEL, { name: "isModelClose" })
)(SimpleTabs);

export default withTranslation("common")(withStyles(styles)(categorylist));

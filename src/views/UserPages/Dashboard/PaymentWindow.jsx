/* global Stripe */
import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import { compose, graphql } from "react-apollo";
import {
  GET_FEATURELIST_DETAILS,
  GET_PAYMENT_TOKEN,
  UPDATE_PAYMENT,
  UPDATE_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_PRODUCT,
  GET_SITE_INFO,
  GET_STRIPE_SECRET,
  GET_CURRENT_USER
} from "../../../queries";
import { BraintreeDropIn } from "braintree-web-react";
import Braintree from 'braintree-web';
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";
import CardForm from "./CardForm.js";
import history from "../../../history";

import { StripeProvider, Elements, CardElement, injectStripe } from "react-stripe-elements";
import paypal from 'paypal-checkout';
import skleton from "../../../assets/img/pro_skleton.png"; //preload image


const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  bigIndicator: {
    backgroundColor: "transparent",
  },
});



class PaymentWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      braintree: false,
      stripe: false,
      paypal: false,
      alreadyPaymentDone: false,
      isLoading: false,
      braintreeClientToken: null,
      braintreePayButtonEnable: false,
      stripeClientToken: "",
      paypalButtonEnabled: false,
      paypalClientKey: "",
      braintreeDisabled: false,
      stripeDisabled: false,
      paypalDisabled: false,
      preLoadr: false,
      featuredItem: [],
      productRate: "",
      shippingRate: "",
      usdServiceFeeBuyerRate: "",
      mobileLoader: false,
      renderData: "",
      userId: 0
    };
  }

  instance;


  // componentWillMount() {
  //   this.setState({
  //     preLoadr: true
  //   })
  //   // let { siteInfo } = this.props;
  //   // siteInfo.refetch({ filter: {} }).then(({ data }) => {
  //   //   if (data) {
  //   //     let {
  //   //       braintree,
  //   //       stripe,
  //   //       paypal,
  //   //       stripePublishKey,
  //   //       paypalEnvironment,
  //   //       colorCode
  //   //     } = data.getSiteInfo;

  //   //     this.setState({
  //   //       braintree,
  //   //       stripe,
  //   //       paypal,
  //   //       stripePublishKey,
  //   //       paypalEnvironment,
  //   //       colorCode,
  //   //       preLoadr: false
  //   //     });
  //   //   } else {
  //   //     this.setState({
  //   //       preLoadr: false
  //   //     })
  //   //   }
  //   // });
  // }

  async componentDidMount() {
    this.setState({
      preLoadr: true
    })
    await this.getSiteData();
    await this.getProdutData();
    await this.featuredData();
    await this.braintreeCheckOutToken();
    await this.stripeCheckOutToken();
    await this.enablePaypalWindow();
    await this.initailCurrentUserData();

  }
  initailCurrentUserData = async () => {
    let { currentUser } = this.props;    
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      userId: currentUser && currentUser.getCurrentUser && currentUser.getCurrentUser.id
    });    
  }
  // product data
  getProdutData = async () => {
    var url = new URL(window.location);
    if ((url.searchParams.get("productId") !== "null") && (url.searchParams.get("productId") !== "undefined")) {
      await this.props.client
        .query({
          query: GET_PRODUCT,
          variables: { id: Number(url.searchParams.get("productId")) },
          fetchPolicy: "network-only"
        })
        .then(({ data }) => {
          if (data && data.getProduct) {
            if (url.searchParams.get("featuredId") !== null) {
              const alreadyFeatured = data.getProduct.length > 0 && data.getProduct[0].featured;
              if (alreadyFeatured === null) {
                this.setState({
                  alreadyPaymentDone: false
                })
              } else {
                this.setState({
                  alreadyPaymentDone: true
                })
              }
            }
            this.setState({
              productRate: data.getProduct[0].usdProductRate,
              shippingRate: data.getProduct[0].usdShippingRate,
              usdServiceFeeBuyerRate: data.getProduct[0].usdServiceFeeBuyerRate
            })
          }
        })
        .catch(err => {
          console.log("catch", err);
        });
    }
  }

  // If featured, then get the featured amount
  featuredData = async () => {
    var url = new URL(window.location);
    let { getFeatureddetails } = this.props;
    const { paypal } = this.state;
    if ((url.searchParams.get("featuredId") !== "null")) {
      await getFeatureddetails.refetch().then(({ data }) => {
        if (data) {
          let featuredItem = data && data.getFeaturedDetails && data.getFeaturedDetails.featuredInfo.filter(x => x.id == (url.searchParams.get("featuredId")))
          this.setState({
            featuredItem
          })          
        }
      }).catch(e => {
        if (e) {
          history.push("/")
        }
      })
    }
  }


  // Site data
  getSiteData = async () => {
    await this.props.client
      .query({
        query: GET_SITE_INFO
      })
      .then(({ data }) => {
        //console.log(data.getSiteInfo, "get")
        if (data.getSiteInfo) {
          let {
            braintree,
            stripe,
            paypal,
            stripePublishKey,
            paypalEnvironment,
            colorCode,
            subcolorCode
          } = data.getSiteInfo;

          this.setState({
            braintree,
            stripe,
            paypal,
            stripePublishKey,
            paypalEnvironment,
            colorCode,
            subcolorCode,
            preLoadr: false
          });

          setTimeout(() => {
            const color1 = colorCode;
            const subcolor1 = subcolorCode;
            const r = document.querySelector(':root').style;
            r.setProperty('--theme-color', color1);
            r.setProperty("--theme-color-hvr", (color1 + "bf"));
            r.setProperty('--subtheme-color', subcolor1);
            r.setProperty("--subtheme-color-hvr", (subcolor1 + "bf"));
          }, 2000);
        }


      })
      .catch(err => {
        console.log("catch", err);
      });
    //console.log(this.state.braintree, "fdfjksd")
  }

  // braintree client token
  braintreeCheckOutToken = () => {
    const { getPaymentToken } = this.props;
    const { braintree } = this.state
    if (braintree) {
      getPaymentToken()
        .then(({ data }) => {
          if (data && data.createClientToken) {
            this.setState({
              braintreeClientToken: data.createClientToken.clientToken,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: true
            });
          }
        }).catch(e => {
          if (e) {
            this.setState({
              isLoading: true
            });
          }
        })
    }
  }

  // Card details verification by Braintree
  braintreeResponse = (res) => {
    res.on("paymentMethodRequestable", (event) => {
      if (event.type === "CreditCard") {
        this.setState({
          braintreePayButtonEnable: true
        })
      }
    });
  }

  // braintree payment
  braintreePayment = async () => {
    var url = new URL(window.location);
    var webFeaturedObject;
    const { nonce } = await this.instance.requestPaymentMethod();
    if ((url.searchParams.get("featuredId") !== null) && (url.searchParams.get("type") === "featured")) {
      webFeaturedObject = {
        data: {
          nonce: nonce,
          type: url.searchParams.get("type"),
          productId: Number(url.searchParams.get("productId")),
          featuredId: Number(url.searchParams.get("featuredId")),
          paymentMode: "Braintree",
          channel: url.searchParams.get("channel"),
          paymentUserId: Number(url.searchParams.get("paymentUserId"))
        }
      }
    } else if ((url.searchParams.get("addressId") !== null) && (url.searchParams.get("addressId") !== undefined) && (url.searchParams.get("type") === "instantBuy")) {
      webFeaturedObject = {
        data: {
          channel: url.searchParams.get("channel"),
          paymentUserId: Number(url.searchParams.get("paymentUserId")),
          nonce: nonce,
          paymentMode: "Braintree",
          addressId: url.searchParams.get("addressId"),
          productId: Number(url.searchParams.get("productId")),
          type: url.searchParams.get("type")
        }
      }
    }

    this.props
      .updatePayment({
        variables: webFeaturedObject,
      })
      .then(async ({ data }) => {
        if (url.searchParams.get("channel") === "mobile") {
          if (data.ChargePaymentMethod && data.ChargePaymentMethod.success === true) {
            this.setState({
              mobileLoader: false,
              //paymentPageRedirect: true,
              //renderData: { "is_success": true, "status_message": "payment success" }
            })
            history.push(({pathname:"/api/payment/success",search:"?is_success=1&status=payment_success",state:{ "is_success": true, "status_message": "payment success" }}));
          } else {
            this.setState({
              mobileLoader: false,
              //paymentPageRedirect: true,
              //renderData: { "is_success": false, "status_message": "payment Failed" }
            })
            history.push(({pathname:"/api/payment/success",search:"?is_success=0&status=payment_failed",state:{ "is_success": false, "status_message": "payment Failed" }}));
          
          }
        } else {
          if (data.ChargePaymentMethod && data.ChargePaymentMethod.success === true) {
            var result = {
              featuredTransactionId: data.ChargePaymentMethod.transaction.id,
            };
            this.props
              .updateProduct({
                variables: { id: Number(url.searchParams.get("productId")), data: result },
                refetchQueries: [
                  { query: GET_ALL_PRODUCTS, variables: { filter: {} } },
                  { query: GET_PRODUCT, variables: { id: Number(url.searchParams.get("productId")) } },
                ],
              })
              .then(async ({ data }) => {
                // console.log(data,"data123")                                        
              });
              this.setState({preLoadr:true})                    
            setTimeout(()=>{
             Toastr.success(
              <div className="msgg">
                <div>
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    style={{ fill: "green" }}
                  >
                    <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                  </svg>
                </div>
                <div>{this.props.t("Sellerdetails._Paymentplaced")} </div>
              </div>
            );          
            const {userId} = this.state;           
            history.push(`/EditProfile/${userId}`)
            },3000)            
  
          }
        }

      })
      .catch((error) => {
        //console.log(error)
        // var message = error.graphQLErrors.map((x) => x.message);
        this.setState({preLoadr:true})                    
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{this.props.t("orderViewPage._errorSomething")}</div>
          </div>
        );
      });
    this.setState({
      stripeDisabled: !this.state.stripeDisabled,
      paypalDisabled: !this.state.paypalDisabled
    })
  }

  // Stripe checkOut Token
  stripeCheckOutToken = () => {
    const { getStripeClientToken } = this.props;
    const { stripe } = this.state
    if (stripe) {
      var url = new URL(window.location);
      var tokenInput;
      if ((url.searchParams.get("featuredId") !== null) && (url.searchParams.get("type") === "featured")) {
        tokenInput = {
          data: {
            featuredId: Number(url.searchParams.get("featuredId"))
          },
        }
      } else if (url.searchParams.get("type") === "instantBuy") {
        tokenInput = {
          data: {
            productId: Number(url.searchParams.get("productId")),
            type: url.searchParams.get("type")
          },
        }
      }
      getStripeClientToken({
        variables: tokenInput
      })
        .then(({ data }) => {
          if (data.createStripeClientToken) {
            this.setState({
              stripeClientToken: data.createStripeClientToken.clientSecret,
            });
          }
        }).catch((error) => {
          //console.log(error);
          var message = error.graphQLErrors.map((x) => x.message);
          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "red" }}
                >
                  <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
                </svg>
              </div>
              <div>{`Stripe Error - ${message[0]}`}</div>
            </div>
          );
        })
    }
  }


  // paypal
  enablePaypalWindow = () => {
    let { getFeatureddetails } = this.props;
    const { paypal } = this.state
    if (paypal) {
      getFeatureddetails.refetch().then(({ data }) => {
        if (data) {
          let paymentData = data.getFeaturedDetails.paymentInfo;
          if (paymentData && paymentData.length > 0) {
            if (paypal) {
              paymentData.filter(x => x.payment_type === "Paypal").map((z) => {
                this.setState({
                  paypalClientKey: z.key,
                  paypalButtonEnabled: true
                })
              })
            }
          }
        }
      });
    }
  }


  //  paypal popup view
  payment(data, actions) {
    var url = new URL(window.location);
    const { featuredItem, productRate, shippingRate, usdServiceFeeBuyerRate } = this.state
    if ((url.searchParams.get("featuredId") !== null) && (url.searchParams.get("type") === "featured")) {
      return actions.braintree.create({
        flow: 'checkout',
        amount: featuredItem && featuredItem[0].price, // be sure to validate this amount on your server
        currency: 'USD'
      });
    } else if ((url.searchParams.get("addressId") !== null) && (url.searchParams.get("addressId") !== undefined) && (url.searchParams.get("type") === "instantBuy")) {
      return actions.braintree.create({
        flow: 'checkout',
        amount: ((productRate && productRate) + (shippingRate && shippingRate) + (usdServiceFeeBuyerRate && usdServiceFeeBuyerRate)).toFixed(2), // be sure to validate this amount on your server
        currency: 'USD'
      });
    }
    this.setState({
      braintreeDisabled: !this.state.braintreeDisabled,
      stripeDisabled: !this.state.stripeDisabled
    })
    // console.log(test)
  }

  // paypal payment 
  async onAuthorize(payload, actions) {
    var url = new URL(window.location);
    var setResponse
    if ((url.searchParams.get("featuredId") !== null) && (url.searchParams.get("type") === "featured")) {
      setResponse = {
        data: {
          nonce: payload.nonce,
          channel: url.searchParams.get("channel"),
          paymentUserId: Number(url.searchParams.get("paymentUserId")),
          productId: Number(url.searchParams.get("productId")),
          featuredId: Number(url.searchParams.get("featuredId")),
          paymentMode: "Paypal",
          type: url.searchParams.get("type"),

        },
      }
    } else if ((url.searchParams.get("addressId") !== null) && (url.searchParams.get("addressId") !== undefined) && (url.searchParams.get("type") === "instantBuy")) {
      setResponse = {
        data: {
          nonce: payload.nonce,
          channel: url.searchParams.get("channel"),
          paymentUserId: Number(url.searchParams.get("paymentUserId")),
          addressId: url.searchParams.get("addressId"),
          productId: Number(url.searchParams.get("productId")),
          paymentMode: "Paypal",
          type: url.searchParams.get("type"),
        }
      };
    }

    await this.props
      .updatePayment({
        variables: setResponse
      })
      .then(({ data }) => {
        if (url.searchParams.get("channel") === "mobile") {
          if (data.ChargePaymentMethod && data.ChargePaymentMethod.success === true) {
            console.log("paypal payment success");
            this.setState({
              mobileLoader: false,
             // paymentPageRedirect : true,
             // renderData: { "is_success": true, "status_message": "payment success" }
            })
            history.push(({pathname:"/api/payment/success",search:"?is_success=1&status=payment_success",state:{ "is_success": true, "status_message": "payment success" }}));
          } else {
            console.log("paypal payment failed");
            this.setState({
              mobileLoader: false,
            //paymentPageRedirect : false,
            //renderData: { "is_success": false, "status_message": "payment Failed" }
            })
            history.push(({pathname:"/api/payment/success",search:"?is_success=0&status=payment_failed",state:{ "is_success": false, "status_message": "payment Failed" }}));
          }
        } else {
          if (data.ChargePaymentMethod.success === true) {
            var result = {
              featuredTransactionId: data.ChargePaymentMethod.transaction.id,
            };
            this.props
              .updateProduct({
                variables: { id: Number(url.searchParams.get("productId")), data: result },
                refetchQueries: [
                  { query: GET_ALL_PRODUCTS, variables: { filter: {} } },
                  { query: GET_PRODUCT, variables: { id: Number(url.searchParams.get("productId")) } },
                ],
              })
              .then(async ({ data }) => {     
              });
              this.setState({preLoadr:true})     
              setTimeout(() => {
              Toastr.success(
                <div className="msgg">
                  <div>
                    <svg
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      style={{ fill: "green" }}
                    >
                      <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                    </svg>
                  </div>
                  <div>{this.props.t("Sellerdetails._Paymentplaced")} </div>
                </div>
              );
            const {userId} = this.state;                           
            history.push(`/EditProfile/${userId}`)
            },3000) 
          }
        }
      })
      .catch((error) => {
        this.setState({preLoadr:true})                    
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{this.props.t("orderViewPage._errorSomething")}</div>
          </div>
        );
      });

  }

  stripeSuccessData = (data) => {
    if (data === "success") {
      this.setState({
        mobileLoader: false,
        //paymentPageRedirect: true,
        //renderData: { "is_success": true, "status_message": "payment success" }
      });
      history.push(({pathname:"/api/payment/success", search:"?is_success=1&status=payment_success" ,state:{ "is_success": true, "status_message": "payment success" }}));
    } else {
      this.setState({
        mobileLoader: false,
       // paymentPageRedirect: true,
        //renderData: { "is_success": false, "status_message": "payment Failed" }
      })
      history.push(({pathname:"/api/payment/success", search:"?is_success=0&status=payment_failed",state:{ "is_success": false, "status_message": "payment Failed" }}));
    }
  }

  render() {
    const { t } = this.props;
    var url = new URL(window.location);
    let {
      alreadyPaymentDone,
      paypal,
      braintree,
      stripe,
      isLoading,
      braintreeClientToken,
      braintreePayButtonEnable,
      stripeClientToken,
      stripePublishKey,
      paypalButtonEnabled,
      paypalClientKey,
      paypalEnvironment,
      braintreeDisabled,
      stripeDisabled,
      paypalDisabled,
      featuredItem,
      productRate,
      shippingRate,
      usdServiceFeeBuyerRate,
      mobileLoader,
      userId
    } = this.state;

    const paypalSandboxConf = {
      currency: "USD",
      env: 'sandbox',
      client: {
        sandbox: paypalClientKey
      },
      style: {
        label: "pay",
        size: "medium",
        shape: "rect",
        color: "gold"
      }
    }

    const paypalProductionConf = {
      currency: "USD",
      env: 'production',
      client: {
        production: paypalClientKey
      },
      style: {
        label: "pay",
        size: "medium",
        shape: "rect",
        color: "gold"
      }
    }
   

    const envData = paypalEnvironment === "sandbox" ? paypalSandboxConf : paypalProductionConf

    return (
      <div className="">
        <style dangerouslySetInnerHTML={{
          __html: `
       #root{margin-top:0!important}html {height:auto}html{background-color:rgb(0 0 0 / .5)!important;}html body{background-color:rgb(0 0 0 / 0.5) !important;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;height: 100vh;} #demodata{opacity:0} div#cls_header{display:none} .payment_body{max-height:550px;overflow:auto}         .payment_wrapper{margin:2em 0;width:100%;text-align:center;border-radius:10px;} .payment_head{padding:10px 15px} .d_none{display:none} .d_block{display:block} .ht{height:100% !important;} .ht1{height:100vh} .sm_container{margin-right:auto;margin-left:auto} .payment_details{background:#fff;box-shadow:2px 2px 15px 2px rgba(0,0,0,.1);border-radius:10px} .payment_head h3, .payment_head p{padding:10px 0;color:#000;font-weight:600;font-size:1.5em;margin:0;display:inline-block}.payment_head h3 {margin-right:5px;} .payment_body{background:#f6f5f7} .d_flex{display:flex;align-items:center;flex-wrap: wrap;text-align: center;} .fx_row{flex-direction:row} .fx_col{flex-direction:column} .justify_ct{justify-content:center} .justify_sp{justify-content:space-between} .pd{padding:2em 0 0} .pd1{padding:1em 5em} .payment_wrapper h6{background-color:unset;padding:15px;border-radius:30px;margin:0} .payment_nowrap{width:0!important} .nn_chatNow{display:none} .payment_body_cont{border-radius:0 0 10px 10px} .pd2{padding:0} .wd{width:100%} .wd1{width:50%} .wd2{width:80%} .mr{margin:30px auto} .txtCenter{text-align:center;} .pay_now_btn{background-color:var(--theme-color);color:var(--subtheme-color);;font-size:16px;padding:8px 30px;font-weight:500;border-radius:10px} .stage1{width:100%;display:flex;align-items:center;justify-content:center;z-index:9999;overflow:hidden} .payment_wrapper.ht1.alreadypayment {display: flex;}.alreadypayment h6 {background-color: #fff;        font-size: 24px;}@media screen and (min-width:768px){ .sm_container{width:560px!important}}@media screen and (max-width:767px){ .payment_wrapper{padding:0;width:100%;margin:0;border-radius:0;background: #f6f5f7;display:block;} .payment_details{border-radius:0;box-shadow:none;} .payment_body, .payment_head{padding:1em} .mesg_conver{display:none!important} #demodata{opacity:0}html body{background-color:#f6f5f7 !important;align-items: baseline;}html {background-color:#f6f5f7 !important;}.alreadypayment{margin-top: 40px;} }
    `}} />
        <div className={`${(braintree || stripe || paypal) ? "payment_wrapper" : "payment_wrapper "}${(braintree && stripe && paypal) ? "" : " "}${(alreadyPaymentDone ? " alreadypayment" :"")}`}>
          {/* <div id="demodata" className={"mobile_data"}> {JSON.stringify(renderData, null, 2) } </div> */}
          {alreadyPaymentDone ? <h6> Payment Already Done </h6> : <> {!mobileLoader && <div className="sm_container payment_details d_flex fx_col">
            <div className="payment_head d_flex wd" style={{justifyContent:'center'}}>
              <h3>{t("orderViewPage._availablePayments")} </h3> <p> USD  {url.searchParams.get("type") == "featured" ? <span> {(featuredItem && featuredItem !== undefined && featuredItem.length > 0) && (featuredItem[0].price).toFixed(2)}  </span> : url.searchParams.get("type") == "instantBuy" ? <span>{Number((productRate && productRate) + (shippingRate && shippingRate) + (usdServiceFeeBuyerRate && usdServiceFeeBuyerRate)).toFixed(2)}</span> : ""} </p>
            </div>
            <div className="payment_body pd1 wd payment_body_cont fx_col">
              {!alreadyPaymentDone && <div className="d_flex justify_ct fx_col">
                {
                  <div className={`pd wd ${paypalDisabled ? "d_none" : "d_block"}`}>
                    <div>
                      {!paypal && this.state.preLoadr && (
                        <>
                          <div className="stage1"><div class="dot-bricks"></div></div>
                        </>
                      )}
                    </div>
                    {(paypalButtonEnabled && paypalClientKey !== "" && (paypal && paypal !== undefined)) &&
                      <div>
                        <PayPalButton
                          braintree={Braintree}
                          commit={this.state.commit}
                          env={envData.env}
                          client={envData.client}
                          payment={(data, actions) => this.payment(data, actions)}
                          onAuthorize={(data, actions) => this.onAuthorize(data, actions)}
                          style={envData.style}
                        />
                        {(paypal && braintree) && <div className="wd pd"><strong> {t("orderViewPage._or")} </strong></div>}
                      </div>
                    }
                  </div>
                }
                {<div className={`pd2 wd ${braintreeDisabled ? "d_none" : "d_block"}`}>
                  <div>
                    {!braintree && this.state.preLoadr && (
                      <>
                        <div className="stage1"><div class="dot-bricks"></div></div>
                      </>
                    )}
                  </div>
                  {!isLoading && (braintreeClientToken !== null) && (braintree && braintree !== undefined) ?
                    <div>
                      <BraintreeDropIn
                        options={{
                          authorization: braintreeClientToken
                        }}
                        onInstance={(instance) => {
                          this.braintreeResponse(instance);
                          this.instance = instance;
                        }}
                      />
                      <div className="">
                        {braintreePayButtonEnable &&
                          <button
                            className={"pay_now_btn" + " " + (stripeDisabled ? "d_none" : "")}
                            onClick={() => this.braintreePayment()}
                          //disabled={this.state.disabled}
                          >{t("Productdetails._Pay")}</button>
                        }
                      </div>
                      {(braintree && stripe) && <div className={`pd wd ${stripeDisabled ? "d_none" : "d_block"}`}><strong> {t("orderViewPage._or")} </strong></div>}
                    </div> : isLoading && "loading"}
                </div>}
                {<div className={`pd wd ${stripeDisabled ? "d_none" : "d_block"}`}>
                  <div>
                    {!stripe && this.state.preLoadr && (
                      <>
                        <div class="stage1"><div class="dot-bricks"></div></div>
                      </>
                    )}
                  </div>
                  {((stripeClientToken !== "") && (stripePublishKey !== undefined) && (stripe && stripe !== undefined)) &&
                    <div className="stripedf cls_stripe">
                      <StripeProvider
                        apiKey={stripePublishKey}
                      >
                        <Elements>
                          <CardForm stripeClientSecret={stripeClientToken} history={this.props.history} userId={userId} stripeSuccessData={this.stripeSuccessData} />
                          {/* stripePayment={this.stripePayment} */}
                          {/* <CardElement hidePostalCode={true}/>
                                    <div className="pay_now mr wd1">
                                      <button className="pay_now_btn" onClick={this.stripePayment}>Pay</button>
                                    </div> */}
                          {/* </CardForm> */}
                        </Elements>
                      </StripeProvider>
                    </div>
                  }
                </div>}
                {this.state.preLoadr && (                  
                  <div className="stage1">Loading.....</div>                  
                )}
                {/* <div className="mr wd1" onClick={this.hideSection}>
                  <button className="pay_now_btn">Pay</button>
                </div> */}
              </div>
              }

            </div>
          </div>} </>}
        </div>
      </div>
    );
  }
}



var categorylist = compose(
  graphql(GET_PAYMENT_TOKEN, {
    name: "getPaymentToken",
  }),
  graphql(GET_STRIPE_SECRET, {
    name: "getStripeClientToken",
  }),
  graphql(UPDATE_PAYMENT, {
    name: "updatePayment",
  }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(GET_FEATURELIST_DETAILS, {
    name: "getFeatureddetails",
  }),
  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" })

)(PaymentWindow);

export default withTranslation("common")(withStyles(styles)(categorylist));

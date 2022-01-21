import React from "react";
import {
  GET_PRODUCT,
  GET_CURRENT_USER,
  LIKES_UPDATE,
  ISOPEN,
  INACTIVE,
  GET_CATEGORIES,
  UPDATE_PRODUCT_REPORTS,
  UPDATE_SELLING_STATUS,
  POPUP_STATE_UPDATE,
  SEND_MESSAGE,
  CREATE_ROOM,
  USER_PRODUCT_DELETE,
  CATEGORY_ID,
  IS_CATEGORY_REFETCH,
  ROSTER_GROUPID,
  GET_SITE_INFO,
  PRODUCT_ID,
  IS_MODEL_CLOSE,
  CLOSE_MODEL,
  GET_PRODUCT_ID,
  GET_REVIEW,
  UPDATE_REVIEW,
  GET_CATEGORY_ID,
  GET_ROSTER,
  UPDATE_CHATNOW_STATUS,
  GET_CHATNOW_STATUS,
  GET_ROSTER_GROUPID_DETAILS,
  LOCATION_NAME,
  GET_LOCATION_NAME,
  RADIUS,
  GET_RADIUS,
  LOCATION,
  GET_LOCATION,
  PRICE,
  GET_PRICE_DETAILS,
  SORTBY,
  GET_SORTBY_DETAILS,
  SEARCH_INPUT,
  GET_SEARCH_INPUT,
  CATE_LANG_REFETCH,
  GET_FEATURELIST_DETAILS
} from "../../../queries";
import { FacebookShareButton, WhatsappShareButton } from "react-share";
import { compose, graphql, ApolloConsumer } from "react-apollo";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
// import "../css/style.css";
import { Mutation } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input";
import ReactTooltip from "react-tooltip";
import GoogleMapReact from "google-map-react";
import StarRatingComponent from "react-star-rating-component";
import marker from "../../../assets/img/marker.png";
import TextField from "@material-ui/core/TextField";
import prgd1 from "../../../assets/img/prgd1.gif";
import prgd2 from "../../../assets/img/prgd2.png";
import Footer from "../Footer/Footer.jsx";
import Slider from "react-slick";
import Error from "../../../assets/img/404error.jpg";
import { StaticGoogleMap,Marker
} from 'react-static-google-map';
import {
  getSymbol,
  dateAdd
} from "../../../helper.js";
import pagesStyle from "../../../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { withTranslation } from "react-i18next";
import Category from "../Header/Category.jsx";
import Modal from "react-modal";
import Payments from "../Dashboard/Payments.jsx";
import SlidingPane from "react-sliding-pane";
import * as Toastr from "../Toast.jsx";
import { ProviderRefech, ProductConsumer } from "../ProductContext.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Geocode from "react-geocode";
import Countdown from "react-countdown-now";
import smile from "../../../assets/img/smile.jpeg";
import ChatWindow from "../Chat/ChatWindow";
import Grid from '@material-ui/core/Grid';
//import MessageWindow from "../Chat/MessageWindow";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import OrderView from "./OrderView.jsx";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import CloseIcon from '@material-ui/icons/Close';
import {ScrollTop,ProductDetailsMain,Loader,DiscardPopup,FeaturedModal} from '../css/styledcomponents';
import AdSense from 'react-adsense';

const AnyReactComponent = ({ img_src }) => (
  <div>
    <img src={marker} style={{ height: "32px", width: "auto" }} alt=""/>
  </div>
);


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

// var styles = {
//   ...loginStyles,
//   ...headerStyles(),
//   customBtn: {
//     borderColor: "white !important",
//     "&:hover": {
//       borderColor: "white !important"
//     }
//   }
// };

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "25px"
  }
};

const customStylessocila = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "15px"
  }
};

const customStylesDetails = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const customStyles2 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "auto"
  }
};

const customStylessidebar = {
  content: {
    // top: "0%",
    //right: "0%",
    // marginRight: "0%",
    width: "400px",
    height: "100%",
    padding: "0px",
    borderRadius: "0px",
    backgroundColor: "#fff"
  }
};

const customStylesReview = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxHeight:"100%",
    padding: "0px"
  }
};

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currConv : {},
      condition: false,
      toggled: false,
      reportingList: true,
      showScroll: false,
      editSellUrStuff: false,
      editProductData: {},
      getProductMount: {},
      getProductsArray: [],
      getRenderStatus: false,
      SoldStatus: "",
      showModal: false,
      showReviewStatus: false,
      showReviewModal: false,
      reviewInfo: [],
      reviewExpInfo: [],
      reviewForm: false,
      rating: "",
      primaryButton: [],
      secondaryButton: [],
      buttonResponse: "",
      ratingResponse: "",
      getFeedBack: false,
      feedBackTextResponse: "",
      reportlistco: false,
      DeleteModelProduct: false,
      currentSlide: 1,
      center: {
        lat: "",
        lng: ""
      },
      SlidingTitle: this.props.t("Homepageheader._EditListing"),
      copied: false,
      userEditClicked: Math.floor(Math.random() * 10000),
      inputValue: "",
      FavSaveButton: this.props.t("Productdetails._Save"),
      showDiscard: false,
      modalIsOpen: false,
      formatted_address: "",
      modalIsPay: false,
      isButtonClose: true,
      pathPush: true,
      activeItem: -1,
      changeRating: false,
      puplishReview: false,
      updateComment: false,
      headerStuffClicked: false,
      moneyEvent: false,
      makeMoney: false,
      modalIsOpenshare: false,
      shareButtonview: true,
      NotFoundData: "",
      postListing: "",
      openChatWindow: false,
      butyNowClicked:false,
      googleAd: false,
      googleAdSenseId: "",
      productDetailPageSlotId: ""
    };
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
    this.backHandler = this.backHandler.bind(this);

    this.openPayment = this.openPayment.bind(this);
    this.closeModalpayment = this.closeModalpayment.bind(this);
    this.clickMoney = this.clickMoney.bind(this);
    this.makeClosemodal = this.makeClosemodal.bind(this);

    this.openModalshare = this.openModalshare.bind(this);
    this.closeModalshare = this.closeModalshare.bind(this);
    this.reviewClosemodal = this.reviewClosemodal.bind(this);
    this.congraReview = this.congraReview.bind(this);
  }

  congraReview() {
    this.setState({ showReviewStatus: false });
  }

  reviewClosemodal() {
    this.setState({ reviewForm: false });
  }
  openModalshare() {
    this.setState({ modalIsOpenshare: true });
  }

  closeModalshare() {
    this.setState({ modalIsOpenshare: false });
  }

  clickMoney() {
    this.setState({ makeMoney: true, showReviewStatus: false });
  }

  makeClosemodal() {
    this.setState({ makeMoney: false, showReviewStatus: false });
  }

  openPayment(id) {
    this.props.getProductId({ variables: { productId: id } });
    this.setState({ modalIsPay: true });
  }

  closeModalpayment() {
    this.setState({ modalIsPay: false });
    document.body.style = "overflow-y:scroll !important";
  }
  reporList = () => {
    this.setState({
      reportlistco: true
    });
  };

  closePopup = () => {
    this.setState({ reportlistco: false });
  };

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleCloseDeleteModal = () => {
    this.setState({ ...this.state.DeleteModelProduct }, () => {
      this.setState({
        DeleteModelProduct: false
      });
    });
  };

  authenticate() {
    return new Promise(resolve => setTimeout(resolve, 5000));
  }

  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }

  componentWillMount() {
    let { currentUser, siteInfo } = this.props;
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    siteInfo.refetch();
    if (siteInfo && siteInfo.getSiteInfo) {
      this.setState({
        googleApi : siteInfo.getSiteInfo.googleApi,
        braintree : siteInfo.getSiteInfo.braintree,
        stripe : siteInfo.getSiteInfo.stripe,
        paypal: siteInfo.getSiteInfo.paypal,
        googleAd: siteInfo.getSiteInfo.googleAdsence,
        googleAdSenseId: siteInfo.getSiteInfo.googleAdSenseId,
        productDetailPageSlotId: siteInfo.getSiteInfo.productDetailPageSlotId
      });
    }

    // this.setState({
    //  // reviewExpInfo : review,
    //   reviewPopupStatus : true,
    //   currentUserId : currentUser.getCurrentUser.id
    // })
  }

  componentScroll = () => {
    const scope = this;
    var winheight =
      window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
    var D = document;
    var docheight = Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
    var scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100);

    if (pctScrolled > 10) {
      scope.setState({
        showScroll: true
      });
    } else {
      scope.setState({
        showScroll: false
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
  }

  scrollToTop() {
    scroll.scrollToTop();
  }

  handleLogin(e, open) {
    e.preventDefault();
    let { updateLoginPopupStatus, session } = this.props;
    updateLoginPopupStatus({ variables: { isOpen: open } });
  }

  handleActiveScreen(e) {
    e.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.inActiveScreen({ variables: { inActive: false } });
    }
    if (this.blockRef && !this.blockRef.contains(e.target)) {
      this.props.isOpenScreen({ variables: { open: false } });
    }
  }

  componentWillReceiveProps(nextProps) {
    let {categoryRefetch, match, getProduct,siteInfo } = nextProps;
    if (siteInfo && siteInfo.getSiteInfo) {
      this.setState({
        googleApi : siteInfo.getSiteInfo.googleApi,
        braintree : siteInfo.getSiteInfo.braintree,
        stripe : siteInfo.getSiteInfo.stripe,
        paypal: siteInfo.getSiteInfo.paypal,
        googleAd: siteInfo.getSiteInfo.googleAdsence,
        googleAdSenseId: siteInfo.getSiteInfo.googleAdSenseId,
        productDetailPageSlotId: siteInfo.getSiteInfo.productDetailPageSlotId
      });
    }

    if (nextProps.getModelClose.closeModel === true) {
      this.setState({ modalIsPay: false });
      this.setState({ isButtonClose: false });
      this.props.isModelClose({ variables: { closeModel: false } });
      getProduct
        .refetch({ id: Number(nextProps.getCacheProductId.productId)})
        .then(({ data }) => {
          this.setState({
            getProductMount: data.getProduct[0],
            chatRoomId: data.getProduct[0].groupsId
          });
        })
        .catch(err => {
          console.log("catch", err);
        });
    }
    if (categoryRefetch.categoryRefetch === true) {
      if (match.params.id) {
        this.props.getRefetch({ variables: { categoryRefetch: false } });
        getProduct
          .refetch({ id: Number(match.params.id) })
          .then(({ data }) => {
            if (data) {
              this.setState({
                getProductMount: data.getProduct[0],
                chatRoomId: data.getProduct[0].groupsId
              });
            }
          })
          .catch(err => {
            console.log("catch", err);
          });
      }
    }
    if (nextProps.location.key !== this.props.location.key) {
      if (nextProps.location.pathname === this.props.location.pathname) {
        if (typeof nextProps.location.state === "undefined") {
          this._getMountedProduct(nextProps);
        } else {
          this.setState({
            ...this.state.getProductMount,
            getProductMount: nextProps.location.state.some,
            center: {
              lat: nextProps.location.state.some.location.lat_lon[0],
              lng: nextProps.location.state.some.location.lat_lon[1]
            },
            SlidingTitle: ""
          });
          Geocode.setApiKey(this.state.googleApi);
          Geocode.fromLatLng(
            nextProps.location.state.some.location.lat_lon[0],
            nextProps.location.state.some.location.lat_lon[1]
          ).then(
            response => {
              const address = response.results[0].formatted_address;
              this.setState({
                formatted_address: address
              });
              //console.log(response)
            },
            (error) => {
              //console.error(error);
            }
          );
        }
      } else {
        this._getMountedProduct(nextProps);
      }
    }
    if (nextProps.categorySubmitted !== this.props.categorySubmitted) {
      this.setState({
        postListing: ""
      });
    }
    if(nextProps != this.props){
      this.props.client
      .query({
        query: GET_PRODUCT,
        variables: { id: Number(match.params.id) },
        fetchPolicy: "network-only"
      })
      .then(({data}) => {
        this.setState({
            getProductMount: data.getProduct[0],
            chatRoomId: data.getProduct[0].groupsId
         })
      })
      .catch(err => {
        console.log("catch", err);
      });
    }
  }

  _getMountedProduct = nextProps => {
    this.setState({
      toggled: false,
      FavSaveButton: this.props.t("Productdetails._Save")
    });
    let likeUrl = nextProps.location.pathname;
    //let usersplit = likeUrl.split("/").pop();
    let prId = likeUrl.split("/");
    let paramid = prId[prId.length - 1];
    this.props.client
      .query({
        query: GET_PRODUCT,
        variables: { id: Number(paramid) }
      })
      .then(({ data, loading, error }) => {
        if (loading) return <div>loading</div>;
        if (error) return <div>Error</div>;
        if (data) {
          if (this.props.currentUser.getCurrentUser != null) {
            let likeUser = data.getProduct[0].likedUsers;
            let current = this.props.currentUser.getCurrentUser.id;
            if (likeUser.length > 0) {
              if (likeUser.includes(+current)) {
                this.setState({
                  toggled: true,
                  FavSaveButton: this.props.t("Productdetails._Saved")
                });
              }
            }
          }
          let RealatedProduct = data.getProduct.filter(
            product =>
              product.id !== paramid && product.sellingStatus !== "SoldOut"
          );

          this.setState({
            ...this.state.getProductMount,
            getProductMount: data.getProduct[0],
            chatRoomId: data.getProduct[0].groupsId,
            getProductsArray: RealatedProduct,
            getRenderStatus: true,
            SoldStatus: data.getProduct[0].sellingStatus,
            center: {
              lat: data.getProduct[0].location.lat_lon[0],
              lng: data.getProduct[0].location.lat_lon[1]
            }
          });
          Geocode.setApiKey(this.state.googleApi);
          Geocode.fromLatLng(
            data.getProduct[0].location.lat_lon[0],
            data.getProduct[0].location.lat_lon[1]
          ).then(
            response => {
              const address = response.results[0].formatted_address;
              this.setState({
                formatted_address: address
              });
              //console.log(response)
            },
            (error) => {
              //console.error(error);
            }
          );
        }
      });
  };

  componentDidMount() {
    this.authenticate().then(() => {
      const ele = document.getElementById("loader");
      if (ele) {
        setTimeout(() => {
          ele.outerHTML = "";
        }, 2000);
      }
    });

    try {
      let { match } = this.props;
      const paramid = match.params.id;
      this.RedirectProduct(paramid);
    } catch (e) {
      let { match } = this.props;
      const paramid = match.params.id;
      this.RedirectProduct(paramid);
    }
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
    // setTimeout(()=>{
    //   const a = document.getElementById("nn_procontainer").clientHeight;
    //   document.getElementById("pos_rel").style.height = a + "px";
    //   console.log(a,"fdjhfjdhfjdfhjdhfjdfhjdhfjdfhjdfhjd")
    // },1000)
    // setTimeout(()=>{
    //   const {siteInfo}=this.props;
    //   const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
    //   const r = document.querySelector(':root').style;
    //   r.setProperty('--theme-color',color1);
    //   r.setProperty("--theme-color-hvr",(color1 + "bf"));
    // },2000);
  }

  RedirectProduct = paramid => {
    this.props.client
      .query({
        query: GET_PRODUCT,
        variables: { id: Number(paramid) }
      })
      .then(({ data, loading, error }) => {
        if (loading) return <div>loading</div>;
        if (error) return <div>Error</div>;
        if (data) {
          let RealatedProduct = data.getProduct.filter(
            product =>
              product.id !== paramid && product.sellingStatus !== "SoldOut"
          );

          if (this.props.currentUser.getCurrentUser != null) {
            let likeUser = data.getProduct[0].likedUsers;
            let current = this.props.currentUser.getCurrentUser.id;
            if (likeUser.length > 0) {
              if (likeUser.includes(+current)) {
                this.setState({
                  toggled: true,
                  FavSaveButton: this.props.t("Productdetails._Saved")
                });
              }
            }
          }
          this.setState({
            ...this.state.getProductMount,
            getProductMount: data.getProduct[0],
            chatRoomId: data.getProduct[0].groupsId,
            getProductsArray: RealatedProduct,
            getRenderStatus: true,
            SoldStatus: data.getProduct[0].sellingStatus
          });
        }
      })
      .catch((error) => {
        if(error && error.graphQLErrors){
          var message = error && error.graphQLErrors && error.graphQLErrors.map(x => x.message);
          this.setState({
            NotFoundData: message[0]
          });
        }
      });
  };

  openChat = (history,productData) => {
    let { getRoster,currentUser,updateLoginPopupStatus } = this.props;
    let {chatRoomId} = this.state;
    if(chatRoomId === null){
      if (currentUser.getCurrentUser != null) {
        this.props
          .createRoom({
            variables: {
              userId: Number(currentUser.getCurrentUser.id),
              productId: Number(productData.id),
              productuserId: Number(productData.userId)
            }
          })
          .then(async ({ data }) => {
            if (data) {
              var roomId = data.createRoom.id;
              getRoster.refetch({type:"All"}).then(({data})=>{
                if(data.getRoster){
                  data.getRoster.filter(x => x.groupId == roomId).map(z=>{
                    this.setState({
                      openChatWindow : true,
                      currConv: z
                    })
                    this.props.updateChatNowStatus({variables:{ chatNow: true}})
                  })
                }
              })
            }
          });
      } else {
        updateLoginPopupStatus({
          variables: {
            isOpen: true
          }
        });
      }
    }else if(chatRoomId !== undefined && chatRoomId !== null){
      getRoster.refetch({type:"All"}).then(({data})=>{
        if(data.getRoster){
          data.getRoster.filter(x => x.groupId == chatRoomId).map(z=>{
            this.setState({
              openChatWindow : true,
              currConv: z
            })
            this.props.updateChatNowStatus({variables:{ chatNow: true}})
          })
        }
      })
    }
    if (window.screen.width < 991) {
      if(chatRoomId !== undefined && chatRoomId !== null){
        this.props.getRosterGroupId({
          variables: { rosterGroupId: chatRoomId }
        });
        history.push("/chat/conversation");
      }
    }
  }

  handleLike = (e, likesUpdate, adFav, history) => {
    likesUpdate().then(({ data }) => {
      let likedResult = data.likesUpdate.result;
      if (likedResult === "inserted") {
        this.setState({
          toggled: true,
          FavSaveButton: this.props.t("Productdetails._Saved")
        });
      } else {
        this.setState({
          toggled: false,
          FavSaveButton: this.props.t("Productdetails._Save")
        });
      }
    });
  };

  reportList = (e, value) => {
    let { match } = this.props;
    const id = match.params.id;
    this.props
      .updateProductReports({
        variables: { productId: Number(id), comments: value }
      })
      .then(async ({ data }) => {})
      .catch((error) => {
        //console.log(error);
      });

    this.setState({ reportingList: false });
  };

  editSellYourStuff = async (client, id, value) => {
    const { data } = await client.query({
      query: GET_PRODUCT,
      variables: { id: Number(id) }
    });
    this.setState({
      isPaneOpen: true,
      SlidingTitle: this.props.t("Homepageheader._EditListing"),
      editSellUrStuff: true,
      editProductData: data.getProduct[0]
    });

    this.setState({
      userEditClicked: Math.floor(Math.random() * 10000)
    });
  };

  postOther = () => {
    this.setState({
      isPaneOpenone: true,
      headerStuffClicked: true,
      // editProductData:false,
      SlidingTitleone: this.props.t("Homepageheader._Whatselling"),
      showReviewStatus: false,
      makeMoney: false
    });
  };

  closeSlidingPanel = discardType => {
    if (discardType === true) {
      this.setState({
        modalIsOpen: true,
        isPaneOpen: true,
        isPaneOpenone: false
      });
    } else {
      this.setState({ isPaneOpen: false, isPaneOpenone: false });
    }
  };

  closeModalSlide = async type => {
    if (type === "Discard") {
      await this.setState({
        modalIsOpen: false,
        showDiscard: false,
        isPaneOpen: false,
        isPaneOpenone: false
      });
    } else {
      this.setState({ modalIsOpen: false, showDiscard: true });
    }
  };

  showDiscardForProduct = async () => {
    await this.setState({
      showDiscard: true
    });
  };

  closeDiscardAfterSubmit = async () => {
    await this.setState({
      showDiscard: false
    });
  };


    // productRefetch = async(match) =>{
    //   await this.props.client
    //   .query({
    //     query: GET_PRODUCT,
    //     variables: { id: Number(match.params.id) },
    //     fetchPolicy: "network-only"
    //   })
    //   .then(({data}) => {
    //     this.setState({
    //         getProductMount: data.getProduct[0],
    //         chatRoomId: data.getProduct[0].groupsId
    //      })
    //   })
    //   .catch(err => {
    //     console.log("catch", err);
    //   });
    // }

  openConfirmModal = () => {
    this.setState({
      showModal: true
    });
  };

  backHandler = () => {
    this.props.history.goBack();
  };

  makeSoldProcess = (type, productData) => {
    let selStatus;
    let { match } = this.props;
    const paramid = match.params.id;
    if (type === "SoldOut") {
      selStatus = { id: Number(paramid), sellingStatus: "SoldOut" };
      this.setState({ isButtonClose: false });
    } else {
      selStatus = { id: Number(paramid), sellingStatus: "ForSale" };
      this.setState({ isButtonClose: true });
    }

    this.setState({
      SoldStatus: type,
      showModal: false
    });

    this.props
      .updateSellingStatus({
        variables: selStatus,
        refetchQueries: [
          { query: GET_PRODUCT, variables: { id: Number(productData.id) } }
        ]
      })
      .then(async ({ data }) => {
        if (data.updateSellingStatus.status === "SoldOut") {
          this.setState({
            showReviewStatus: true,
            shareButtonview: false,
            reviewInfo: data.updateSellingStatus.userInfo
          });
        } else {
          this.setState({
            shareButtonview: true
          });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  UserDeleteProduct = () => {
    let { match } = this.props;
    const paramid = match.params.id;
    this.props
      .deleteProduct({
        variables: { id: Number(paramid) }
      })
      .then(async ({ data }) => {
        this.props.history.push("/");
        if (data) {
          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "green" }}
                >
                  <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
                </svg>
              </div>
              <div>{this.props.t("Productdetails._ProductSuccessfully")}</div>
            </div>
          );
        }
      })
      .catch((error) => {
        this.setState({ ...this.state.DeleteModelProduct }, () => {
          this.setState({
            DeleteModelProduct: false
          });
        });
        var message = error.graphQLErrors.map((x) => x.message);
        // console.log(error);
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
            <div>{message[0]}</div>
          </div>
        );
      });
  };

  showDeleteModel = () => {
    this.setState({
      DeleteModelProduct: true
    });
  };

  _navigateToHome = async id => {
    this.props.getCategoryId({ variables: { categoryId: id.toString() } });
    this.props.getPrice({ variables: { max: 0, min: 0 } });
    this.props.getSortBy({ variables: { sort: "Most Recent" } });
    this.props.getLocation({variables: { lat_lon: null }});
    this.props.getLocationName({variables:{locationName: "" }});
    this.props.searchResult({ variables: { searchInput: ""}});
    this.props.getRadius({variables:{radius:""}})
    this.props.history.push({
      pathname: `/`,
      search: `?categoryId=${id}`,
    });
  };

  goHome = () => {
    this.props.getCategoryId({ variables: { categoryId: "" } });
    this.props.getPrice({ variables: { max: 0, min: 0 } });
    this.props.getSortBy({ variables: { sort: "Most Recent" } });
    this.props.getLocation({variables: { lat_lon: null }});
    this.props.getLocationName({variables:{locationName: "" }});
    this.props.searchResult({ variables: { searchInput: ""}});
    this.props.getRadius({variables:{radius:""}})
    this.props.history.push("/");
  };

  copyData = () => {
    this.setState({
      copied: true
    });
  };

  ModalClose = () => {
    this.setState({
      copied: false
    });
  };


  updateInputReportValue = evt => {
    this.setState({
      inputValue: evt.target.value
    });
  };


  makeReview = (e, rf) => {
    this.props.getReview.refetch({ userId: 0 }).then(({ data }) => {
      if (data) {
        const pButton = data.getReview.feedBack.primaryLevel;
        const sButton = data.getReview.feedBack.secondaryLevel;
        this.setState({
          primaryButton: pButton,
          secondaryButton: sButton
        });
      }
    });
    this.setState({
      showReviewStatus: false,
      reviewForm: true,
      reviewExpInfo: rf
    });
  };

  // onStarClick(nextValue, prevValue, name) {
  //   this.setState({ rating: nextValue, changeRating: true });
  // }

  onStarClickHalfStar(nextValue, prevValue, name, e) {
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;

    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }
    this.setState({ rating: nextValue, changeRating: true });
  }

  reviewSubmit = (e, index, cbk, rate) => {
    this.setState({
      buttonResponse: cbk,
      activeItem: index,
      ratingResponse: rate,
      puplishReview: true
    });
  };

  handleUpdateReview = () => {
    this.setState({
      getFeedBack: true,
      reviewForm: false
    });
  };

  updateInputValue = e => {
    this.setState({
      feedBackTextResponse: e.target.value,
      updateComment: true
    });
  };

  updatedReview = (txt, rate, feedBack, userTo) => {
    let {currentUser} = this.props;
    var result = {
      ratings: rate,
      feedBack: txt,
      comment: feedBack,
      userTo: userTo,
      reviewId: currentUser.getCurrentUser.id+ "_" +userTo
    };
    this.props
      .updateReview({
        variables: { data: result }
      })
      .then(async ({ data }) => {
        this.setState({
          getFeedBack: false
        });
        if (data) {
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
              <div>{this.props.t("Productdetails._FeedbackAdded")}</div>
            </div>
          );
          this.setState({
            reviewForm: false
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          getFeedBack: false
        });
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
            <div> {this.props.t("Productdetails._ErrorAdding")}</div>
          </div>
        );
      });
  };

  copyStatus = () => {
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
        <div>{this.props.t("Homepageheader._linkcopied")}</div>
      </div>
    );
  };

  BuyNowClick = (id,e,open) => {
      let {currentUser,updateLoginPopupStatus} = this.props;
      if(currentUser.getCurrentUser !== null){
        const {verifications} = currentUser.getCurrentUser;
        if(verifications.apple || verifications.google || verifications.faceBook ||verifications.email){
          this.props.history.push(`/OrderView/${id}`)
        }else{
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
              <div>{this.props.t("login._verifyMail")}</div>
            </div>
          );
        }
      } else{
        updateLoginPopupStatus({
          variables: {
            isOpen: true
          }
        });
      }
  }
      handleLogin(e, open) {
        e.preventDefault();
        let { updateLoginPopupStatus, session } = this.props;
        updateLoginPopupStatus({ variables: { isOpen: open } });
      }


  render() {
    let { match, currentUser, t, i18n, history, classes,getFeatureddetails } = this.props;
    const featuredData = getFeatureddetails.getFeaturedDetails && getFeatureddetails.getFeaturedDetails.featuredInfo && getFeatureddetails.getFeaturedDetails.featuredInfo.length
    const {
      showScroll,
      editSellUrStuff,
      editProductData,
      toggled,
      reportingList,
      getProductMount,
      getProductsArray,
      getRenderStatus,
      SoldStatus,
      SlidingTitle,
      SlidingTitleone,
      DeleteModelProduct,
      userEditClicked,
      FavSaveButton,
      showDiscard,
      formatted_address,
      reviewInfo,
      rating,
      headerStuffClicked,
      braintree,
      paypal,
      stripe,
      googleAd,
      googleAdSenseId,
      productDetailPageSlotId
    } = this.state;
    const paramid = match.params.id;
    const timestamp = Date.now();
    
    const findTimeStamp = (d, t, lang) => {
      return dateAdd(d, t, lang);
    };
    if (this.state.NotFoundData) {
      return (
        <div className="notFoundProduct">
          <img src={Error} alt="empty" width="500" />
          {/* <h5>The page you"re looking for isn"t available.</h5> */}
          <h5>{this.props.t("Homepageheader._notFound1")} </h5>
          <h6>{this.props.t("Homepageheader._notFound2")}</h6>
          <span className="logbtnss" onClick={this.goHome}>
            {this.props.t("Homepageheader._goHome")}
          </span>
        </div>
      );
    }
    // var productimg = {
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   nextArrow: <SampleNextArrow />,
    //   prevArrow: <SamplePrevArrow />,
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       productimg: {
    //         slidesToShow: 2,
    //         slidesToScroll: 3,
    //         infinite: true,
    //         dots: true
    //       }
    //     },
    //     {
    //       breakpoint: 600,
    //       productimg: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //         initialSlide: 2
    //       }
    //     },
    //     {
    //       breakpoint: 480,
    //       productimg: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1
    //       }
    //     }
    //   ]
    // };

    var settingsrtl = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      initialSlide: 5,
      rtl: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            dots: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 3,
            infinite: false,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          }
        }
      ]
    };
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      initialSlide: 0,
      //rtl: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    var produslider = {
      infinite: false,
      speed: 500,
      slidesToScroll: 1,
      slidesToShow: 1,
      swipeToSlide:true,
      dots: true
   };
    var produsliderrtl ={
      infinite: false,
      speed: 500,
      slidesToScroll: 1,
      slidesToShow: 1,
      swipeToSlide:true,
      rtl: true,
      dots: true
    }
    //const {} = this.state;

    //let inActiveStyle = inActive ? classes.inActive : "";
    let relatedWithoutsold;

    let produ = [];
    let produs = "";
    let adFav;
    let shareUrl;
    if (getRenderStatus) {
      relatedWithoutsold = getProductsArray.filter(
        product => product.sellingStatus !== "SoldOut"
      );
      produ = relatedWithoutsold.map((item, i) => (
        <div className="product-images nn_productimg">
          <Link
            title={`${item.title} ${
              item.location.city ? item.location.city : ""
            }, ${item.location.pincode ? item.location.pincode : ""}`}
            to={`/products/${item.id}`}
            className="Nounderline nn_homproductctn"
          >
            <div key={i} className="featureadd inner">
              {item.featured && (
                <div className="urgent"> {t("Editprofile._Featured")}</div>
              )}
              <img src={item.images[0]} className="mx-auto d-block"  />
            </div>
            <div className="footer">
                <h6 className="text-truncate">
                  {" "}
                  <b>{item.title}</b>{" "}
                </h6>
                <span>
                  {" "}
                  {item.location.city} {item.location.pincode && ","}{" "}
                  {item.location.pincode}
                </span>
            </div>
          </Link>
        </div>
      ));
      //${process.env.REACT_APP_Domain_Url}products/${getProductMount.id}
      produs = getProductMount.images.map(images => <img src={images} key={images} className="slider" />);
      shareUrl = `${process.env.REACT_APP_Domain_Url}products/${getProductMount.id}`;
      //shareUrl = `https://cowardly-starfish-15.localtunnel.me/products/${getProductMount.id}`;
      //imageURL = <img src={`http://passup.trioangledemo.com/fileStorage/uploads/products/10007/waterglass.jpg`} />
    }

    return (
      <>
        {getRenderStatus ? (
          <div onClick={this.handleActiveScreen} id="content">
            <ProviderRefech>
              <DiscardPopup
                isOpen={this.state.modalIsOpen}
                //onAfterOpen={this.afterOpenModal}
                //onRequestClose={this.closeModalSlide}
                style={customStylesDetails}
                contentLabel="Example Modal"
              >
                <div className="discardPopup 3">
                  {/* <h3>Listing not posted</h3>
              <hr /> */}
                  <section>
                    <article>
                      <p className="nn_popup_title">{t("Productdetails._SureEditSell")}</p>
                    </article>
                  </section>
                  <footer>
                    <div className="nn_discard_btn">
                    <button
                      className="btn1"
                      onClick={() => this.closeModalSlide("Discard")}
                    >
                      {" "}
                      {t("Productdetails._Discard")}{" "}
                    </button>
                    <button
                      className="btn2"
                      onClick={() => this.closeModalSlide("PostList")}
                    >
                      {" "}
                      {t("Productdetails._Cancel")} {" "}
                    </button>
                    </div>
                  </footer>
                </div>
              </DiscardPopup>
              <SlidingPane
                closeIcon={
                  <div
                    onClick={() => this.closeSlidingPanel(true)}
                    className="slide-pane__close lol"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                    </svg>
                  </div>
                }
                className="some-custom-class"
                overlayClass="some-custom-overlay-class"
                isOpen={this.state.isPaneOpen}
                title={SlidingTitle}
              >
                <div>
                  <ProductConsumer>
                    {value => (
                      <Category
                        test={this.state.test}
                        stuffImage={value.stuffImage}
                        CategoryWithImage={value.CategoryWithImage}
                        discardStuffStatus={value.discardStuff}
                        discardYourStuff={value.discardYourStuff}
                        manageBeforeLogin={value.stuffValue}
                        refetchValue={value}
                        userEditStuff={editSellUrStuff}
                        editProductData={editProductData}
                        userEditActivated={value.userEditActivated}
                        userEditClicked={userEditClicked}
                        innerPageEditClicked="InnerEditProduct"
                        propsHistory={this.props.history}
                        showDiscardForProduct={this.showDiscardForProduct}
                        closeDiscardAfterSubmit={this.closeDiscardAfterSubmit}
                        showValue={value.showValue}
                        postDone={value.postDone}
                        headerStuffClicked={headerStuffClicked}
                        postOther={this.postOther}
                      />
                    )}
                  </ProductConsumer>
                </div>
              </SlidingPane>

              <SlidingPane
                closeIcon={
                  <div
                    onClick={() => this.closeSlidingPanel(showDiscard)}
                    className="slide-pane__close lol"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                    </svg>
                  </div>
                }
                className="some-custom-class"
                overlayClassName="some-custom-overlay-class"
                isOpen={this.state.isPaneOpenone}
                title={SlidingTitleone}
              >
                <div>
                  <ProductConsumer>
                    {value => (
                      <Category
                        stuffImage={value.stuffImage}
                        CategoryWithImage={value.CategoryWithImage}
                        discardStuffStatus={value.discardStuff}
                        discardYourStuff={value.discardYourStuff}
                        manageBeforeLogin={value.stuffValue}
                        refetchValue={value}
                        userEditStuff={editSellUrStuff}
                        editProductData={editProductData}
                        userEditActivated={value.userEditActivated}
                        userEditClicked={value.userEditClicked}
                        headerStuffClicked={headerStuffClicked}
                        closeSlidingPanel={this.closeSlidingPanel}
                        showValue={value.showValue}
                        postDone={value.postDone}
                      />
                    )}
                  </ProductConsumer>
                </div>
              </SlidingPane>

              <ProductDetailsMain>
                <div className="nn_productdetails">
                  <Grid container className="nn_gridcontainer">
                    {/* <div className="googleadpr">
                      <img src={prgd1} className="img-fluid" />
                    </div> */}

                    <div className="nn_prodetailsctn">
                      <GridContainer className="nn_gdcontainer">
                        <GridItem xs={12} sm={12} md={6} lg={6} className="pos_rel" id="pos_rel">
                        <div className="nn_breadcrum">
                            {" "}
                            <div className="nn_breadcrumctn">
                              <span
                                onClick={this.goHome}
                                className="nn_bredcum"
                                title="Home"
                              >
                                {" "}
                                <span className="nn_ftrt">
                                  <i className="fa fa-home" aria-hidden="true"></i>
                                </span>{" "}
                                <span className="nn_ftrt"> {t("Homepageheader._Home")} </span>{" "}
                              </span>{" "}
                              <span className="nn_bredslash nn_ftrt"> / </span>{" "}
                              <span
                                onClick={() =>
                                  this._navigateToHome(getProductMount.categoryId)
                                }
                                className="nn_bretitle nn_ftrt"
                                title={getProductMount.category}
                              >
                                {getProductMount.category}
                              </span>{" "}
                              <span className="nn_bredslash nn_ftrt"> / </span>{" "}
                              <span className="nn_bretitle">{getProductMount.title}</span>{" "}
                            </div>
                          </div>
                              {SoldStatus !== "ForSale" ||
                              this.state.shareButtonview === false ? (
                                <div className="soldOption">
                                  {" "}
                                  {t("Productdetails._Sold")}
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="product-left nn_product_bg">
                              {getProductMount.featured && (
                                <div className="urgent">
                                  <div> {t("Editprofile._Featured")}</div>
                                </div>
                              )}
                              {getProductMount.isFree && (
                                <div className="ribbon">
                                  <div> {t("Editprofile._Free")}</div>
                                </div>
                              )}
                            {localStorage.getItem("lang") === "ar" ? (
                            <Slider
                              {...produsliderrtl}
                              afterChange={currentSlide => {
                                this.setState({
                                  currentSlide: currentSlide + 1
                                });
                              }}
                            >
                              {produs}
                            </Slider>
                            ) : (
                              <Slider
                              {...produslider}
                              afterChange={currentSlide => {
                                this.setState({
                                  currentSlide: currentSlide + 1
                                });
                              }}
                            >
                              {produs}
                            </Slider>
                            )}
                            {/* {getProductMount.images.length > 1 && (
                              <div className="App-testimonial-count ">
                                {this.state.currentSlide}/
                                {getProductMount.images.length}
                              </div>
                            )} */}


                            {/*reporting*/}
                            {localStorage.getItem("lang") === "ar" ? (
                              <div className="wrapprsear nn_arabic">
                                <div className="backarrowview nn_backarrow">
                                  <button
                                    type="button"
                                    //role="button"
                                    onClick={this.backHandler}
                                    className="sc-iwsKbI Productstyles__FullscreenBtn-sc-1qzhqka-21 iVoSm sc-gqjmRU jxllvb"
                                    data-test="close-item-detail"
                                    data-testid="close-item-detail"
                                  >
                                    <svg viewBox="0 0 24 24" width="24" height="24" className="sc-jTzLTM fznnpf">
                                      <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z" fill="#616161"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="wrapprsear">
                                <div className="backarrowview nn_backarrow">
                                  <button
                                    type="button"
                                    //role="button"
                                    onClick={this.backHandler}
                                    className="sc-iwsKbI Productstyles__FullscreenBtn-sc-1qzhqka-21 iVoSm sc-gqjmRU jxllvb"
                                    data-test="close-item-detail"
                                    data-testid="close-item-detail"
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="24"
                                      height="24"
                                      className="sc-jTzLTM fznnpf"
                                    >
                                      <path
                                        d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"
                                        fill="#616161"
                                      ></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                              {/* {getProductMount.images.length > 1 && <div className="App-testimonial-count resposncour">
                      {this.state.currentSlide}/{getProductMount.images.length}
                      </div>} */}
                            {/*reporing*/}
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} lg={6} className="nn_procontainer" id="nn_procontainer">
                          <div className="nn_breadcrum">
                            {" "}
                            <div className="nn_breadcrumctn">
                              <span
                                onClick={this.goHome}
                                className="nn_bredcum"
                                title="Home"
                              >
                                {" "}
                                <span className="nn_ftrt">
                                  <i className="fa fa-home" aria-hidden="true"></i>
                                </span>{" "}
                                <span className="nn_ftrt"> {t("Homepageheader._Home")} </span>{" "}
                              </span>{" "}
                              <span className="nn_bredslash nn_ftrt"> / </span>{" "}
                              <span
                                onClick={() =>
                                  this._navigateToHome(getProductMount.categoryId)
                                }
                                className="nn_bretitle nn_ftrt"
                                title={getProductMount.category}
                              >
                                {getProductMount.category}
                              </span>{" "}
                              <span className="nn_bredslash nn_ftrt"> / </span>{" "}
                              <span className="nn_bretitle">{getProductMount.title}</span>{" "}
                            </div>
                          </div>
                          <div className="bottsnn">
                            <div className="product-right cls_prodright">
                              <div className="float-left w-100 cls_sticky nn_prodetails">
                                <div className="nn_prodetails_title">
                                <div className="nn_pro_title float-left">
                                  <h1> {getProductMount.title}</h1>
                                </div>
                                <div className="nn_pro_amt float-left">
                                  {getProductMount.rate !== 0 && (
                                    <span className="rtlamtr">
                                     {t("Productdetails._Price")} :
                                      <span className="nn_currency">
                                        {" "}
                                        {getSymbol(
                                          getProductMount.currencySymbol
                                        )}{" "}
                                      </span>

                                      <span className="nn_currency">
                                        {" "}
                                        {(getProductMount && getProductMount.rate <= 0.01 ? (getProductMount && getProductMount.rate) : (getProductMount && getProductMount.rate).toFixed(2))}
                                        {/* {(getProductMount && getProductMount.rate).toFixed(2)} */}
                                      </span>
                                    </span>
                                  )}
                                  {getProductMount && getProductMount.rate === 0 && (
                                    <span className="nn_currency"> {t("Editprofile._Free")}</span>
                                  )}
                                  <div>
                                    {getProductMount && getProductMount.instantBuy === true && getProductMount.shippingRate !== 0  ? (
                                      <span className="rtlamtr">
                                      {t("orderViewPage._shippingRate")} :
                                        <span className="nn_currency">
                                          {" "}
                                          {getSymbol(
                                            getProductMount.currencySymbol
                                          )}{" "}
                                        </span>
                                        <span className="nn_currency">
                                          {" "}
                                          {(getProductMount && getProductMount.shippingRate <= 0.01 ? (getProductMount && getProductMount.shippingRate) : (getProductMount && getProductMount.shippingRate).toFixed(2))}
                                          {/* {(getProductMount.shippingRate).toFixed(2)} */}
                                        </span>
                                      </span>
                                    ): ""}
                                  </div>
                                </div>
                                </div>
                                <div className="nn_pro_share">
                                  <ul>
                                    <li>
                                      {this.props.currentUser.getCurrentUser !==
                                        null &&
                                      !(
                                        getProductMount.userId ==
                                        currentUser.getCurrentUser.id
                                      ) ? (
                                        <Mutation
                                          mutation={LIKES_UPDATE}
                                          variables={{ id: Number(paramid) }}
                                          refetchQueries={[
                                            {
                                              query: GET_PRODUCT,
                                              variables: { id: Number(paramid) }
                                            }
                                          ]}
                                        >
                                          {(likesUpdate, { data }) => (
                                            <button
                                              onClick={e =>
                                                this.handleLike(
                                                  e,
                                                  likesUpdate,
                                                  adFav,
                                                  history
                                                )
                                              }
                                              type="button"
                                              title={FavSaveButton}
                                              className="nn_bttn"
                                            >
                                              <svg className="MuiSvgIcon-root-141" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                                                width="24"
                                                height="24"
                                                className={`button ${
                                                  toggled ? "toggled" : ""
                                                }`}
                                                style={{
                                                  fill: "currentcolor",
                                                  userSelect: "none",
                                                  display: "inline-block",
                                                  verticalAlign: "middle",
                                                  lineHeight: "1",
                                                  transition:
                                                    "fill 0.25s ease 0s"
                                                }}
                                              >
                                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                <g><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                                                </path></g></svg>
                                              {/* <svg
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                                className={`button ${
                                                  toggled ? "toggled" : ""
                                                }`}
                                                style={{
                                                  fill: "currentcolor",
                                                  userSelect: "none",
                                                  display: "inline-block",
                                                  verticalAlign: "middle",
                                                  lineHeight: "1",
                                                  transition:
                                                    "fill 0.25s ease 0s"
                                                }}
                                              >
                                                <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                              </svg> */}
                                              <span className="save-like">
                                                {" "}
                                                {/* {FavSaveButton}{" "} */}
                                              </span>
                                            </button>
                                          )}
                                        </Mutation>
                                      ) : (
                                        ""
                                      )}
                                      {this.props.currentUser.getCurrentUser ===
                                        null && (
                                        <button
                                          onClick={e =>
                                            this.handleLogin(e, true)
                                          }
                                          className={
                                            classes.egQXgJ + " " + classes.kk
                                          }
                                          type="button"
                                          className="nn_bttn"
                                        >
                                          <span title={t("Productdetails._Save")}>
                                          <svg className="MuiSvgIcon-root-141" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                                              width="24"
                                              height="24">
                                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                                            <g><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                                            </path></g></svg>{" "}
                                          </span>
                                          <span className="save-like">
                                            {" "}
                                            {/* {t("Productdetails._Save")}{" "} */}
                                          </span>
                                        </button>
                                      )}
                                    </li>

                                    <li>
                                      {this.props.currentUser.getCurrentUser !==
                                        null &&
                                      getProductMount.userId ==
                                        currentUser.getCurrentUser.id ? (
                                        <div>
                                          <ApolloConsumer>
                                            {client => (
                                              <ProductConsumer>
                                                {value => (
                                                  <button
                                                    type="button"
                                                    className="nn_bttn"
                                                    onClick={() =>
                                                      this.editSellYourStuff(
                                                        client,
                                                        getProductMount.id,
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <span title={t(
                                                        "Productdetails._Edit"
                                                      )}>
                                                      {/* <i
                                                        className="fa fa-pencil-square-o"
                                                        aria-hidden="true"
                                                      ></i> */}
                                                      <EditIcon />
                                                    </span>
                                                    <span className="save-like">
                                                      {" "}
                                                      {/* {t(
                                                        "Productdetails._Edit"
                                                      )} */}
                                                    </span>
                                                  </button>
                                                )}
                                              </ProductConsumer>
                                            )}
                                          </ApolloConsumer>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </li>

                                    <>
                                      {SoldStatus === "ForSale" &&
                                      this.state.shareButtonview === true ? (
                                        <li>
                                          <button
                                            type="button"
                                            className="nn_bttn"
                                            onClick={this.openModalshare}
                                            // data-toggle="modal"
                                            // data-target="#myModal"
                                          >
                                            <span title={t("Productdetails._share")}>
                                              {/* <svg
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                                className="sc-jTzLTM eBhRKq"
                                                fill="#9e9e9e"
                                              >
                                                <path d="M7.4 7.3c-.5-.5-.5-1.4 0-1.9l3.5-3.5c.1-.1.3-.2.4-.3.1-.1.3-.1.5-.1s.4 0 .5.1c.2.1.3.2.4.3l3.5 3.5c.5.5.5 1.4 0 1.9s-1.4.5-1.9 0l-1.2-1.1v7.9c0 .7-.6 1.4-1.3 1.4-.7 0-1.4-.6-1.4-1.4V6.2L9.3 7.3c-.6.5-1.4.5-1.9 0zm11.3 2.8c-.8 0-1.4.6-1.4 1.4v6.9c0 .1 0 .2-.1.3-.1.1-.2.1-.3.1H6.6c-.1 0-.2 0-.3-.1-.1-.1-.1-.2-.1-.3v-6.9c0-.8-.6-1.4-1.4-1.4-.8 0-1.3.6-1.3 1.4v6.9c0 .8.3 1.6.9 2.2.6.6 1.4.9 2.2.9H17c.8 0 1.6-.3 2.2-.9.6-.6.9-1.4.9-2.2v-6.9c-.1-.8-.7-1.4-1.4-1.4z"></path>
                                              </svg>{" "} */}
                                              <ShareIcon />
                                            </span>
                                            <span className="save-like">
                                              {" "}
                                              {/* {t("Productdetails._share")} */}
                                            </span>
                                          </button>{" "}
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                    </>

                                    {this.props.currentUser.getCurrentUser !==
                                      null &&
                                    getProductMount.userId ==
                                    currentUser.getCurrentUser.id ? (
                                      <li>
                                        <button
                                          type="button"
                                          className="nn_bttn"
                                          onClick={this.showDeleteModel}
                                        >
                                          <DiscardPopup
                                            isOpen={DeleteModelProduct}
                                            contentLabel="Minimal Modal Example"
                                            style={customStyles}
                                          >
                                            <section className="iHQQug rtlissues">
                                              <>
                                                <div className="bwXZIf nn_discardPopup">
                                                    <h3>
                                                      {" "}
                                                      {t(
                                                        "Productdetails._DeleteProduct"
                                                      )}{" "}
                                                    </h3>
                                                    <hr></hr>
                                                </div>
                                                <article className="nn_article">
                                                  <span className="nn_popup_title">
                                                    {t(
                                                      "Productdetails._suredelete"
                                                    )}
                                                  </span>
                                                </article>
                                                <div className="sav_chang cancee nn_discard_btn">
                                                  <button
                                                    type="submit"
                                                    onClick={() =>
                                                      this.UserDeleteProduct()
                                                    }
                                                    className="btn1"
                                                  >
                                                    {t(
                                                      "Productdetails._Delete"
                                                    )}
                                                  </button>
                                                  <button
                                                    type="submit"
                                                    onClick={
                                                      this.handleCloseDeleteModal
                                                    }
                                                    className="btn2"
                                                    >
                                                    {t("Productdetails._Cancel")}
                                                   </button>
                                                </div>
                                              </>
                                              {/* <div className="sav_chang">
                                                <button
                                                  type="submit"
                                                  onClick={
                                                    this.handleCloseDeleteModal
                                                  }
                                                  className="btn iDhWYa btn-block"
                                                >
                                                  {t("Productdetails._Cancel")}
                                                </button>
                                              </div> */}
                                            </section>
                                          </DiscardPopup>
                                          <span title={t("Productdetails._Delete")}>
                                            {/* <i
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                            ></i>{" "} */}
                                            <DeleteIcon />
                                          </span>
                                          <span className="save-like">
                                            {" "}
                                              {/* {t("Productdetails._Delete")} */}
                                          </span>
                                        </button>{" "}
                                      </li>
                                    ) : (
                                      <li className="drop-btn dropdown noresponsivew nn_dropdn">
                                        <button
                                          type="button"
                                          className="btn dropdown-toggle"
                                          data-toggle="dropdown"
                                        >
                                          <span>
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="24"
                                              height="24"
                                              className="sc-jTzLTM fznnpf"
                                            >
                                              <path d="M11.785 17.139c1.375 0 2.5 1.125 2.5 2.5s-1.125 2.5-2.5 2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5zm0-2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5zm0-7.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5z"></path>
                                            </svg>{" "}
                                          </span>
                                        </button>
                                        <div className="dropdown-menu">
                                          {this.props.currentUser
                                          .getCurrentUser !== null && (
                                            <span
                                              className="dropdown-item"
                                              onClick={this.reporList}
                                            >
                                              {t(
                                                "Productdetails._Reportlisting"
                                              )}
                                            </span>
                                          )}

                                          {this.props.currentUser
                                          .getCurrentUser === null && (
                                            <span
                                              className="dropdown-item"
                                              onClick={e =>
                                                this.handleLogin(e, true)
                                              }
                                              data-toggle="modal"
                                              data-target="#report"
                                            >
                                              {t(
                                                "Productdetails._Reportlisting"
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              {this.props.currentUser.getCurrentUser !==
                                null && (
                                <DiscardPopup
                                  isOpen={this.state.reportlistco}
                                  contentLabel="Minimal Modal Example"
                                  style={customStyles2}
                                >
                                  <div className="nn_share_ctn">
                                    <button
                                      type="button"
                                      onClick={this.closePopup}
                                      className="nn_close_btn"
                                    >
                                       <CloseIcon className="nn_close_icon"/>
                                    </button>
                                  </div>
                                  {reportingList ? (
                                    <div className="botnbtn">
                                      <p className="nn_report_title">{t("Productdetails._surereport")}</p>

                                      <Input
                                        defaultValue={this.state.inputValue}
                                        className={classes.popsp}
                                        fullWidth
                                        inputProps={{
                                          onChange: e =>
                                            this.updateInputReportValue(e)
                                        }}
                                      />

                                      <div className="brbtn">
                                        <button
                                          type="button"
                                          className="reporlst"
                                          onClick={e =>
                                            this.reportList(
                                              e,
                                              this.state.inputValue
                                            )
                                          }
                                        >
                                          {t("Productdetails._Reportlisting")}
                                        </button>
                                        <button
                                          type="button"
                                          className="reporcl"
                                          onClick={this.closePopup}
                                        >
                                          {" "}
                                          {t("Productdetails._Cancel")}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center thankmsg mt-5">
                                      <p className="nn_popup_title1">
                                        {t("Productdetails._listingreported")}
                                      </p>{" "}
                                    </div>
                                  )}
                                </DiscardPopup>
                              )}
                              <div className="hours-cal">
                                <span>
                                  {/* <i className="fa fa-tint" aria-hidden="true"></i>{" "} */}
                                  <i className="fa fa-clock-o"></i>
                                </span>{" "}
                                <span>
                                  {findTimeStamp(
                                    getProductMount.createdAt,
                                    timestamp,
                                    t
                                  )}
                                </span>{" "}
                              </div>
                              <div className="nn_hours_cal cls_cateprolist">
                                <ul>
                                  {
                                    getProductMount && getProductMount.categoryFieldsInfo &&
                                    getProductMount.categoryFieldsInfo.map(z => (
                                       <>
                                        {
                                          (z.fieldParent === null && z.fieldChildName === null) ?
                                          <li> <b>{z.fieldName}: </b> {z.rangeValue} </li> :
                                          (z.fieldParent === null && z.fieldChildName !== null) ?
                                          <li> <b>{z.fieldName}: </b> {z.fieldChildName} </li> :
                                          (z.fieldParent !== null && z.fieldChildName !== null) ?
                                          <li> <b>{z.fieldParent}: </b> {z.fieldChildName} </li> : ""
                                        }

                                       </>

                                    ))
                                  }
                                </ul>
                              </div>
                              {currentUser.getCurrentUser &&
                              getProductMount.featured &&
                              getProductMount.userId ==
                              currentUser.getCurrentUser.id ? (
                                <div className="nn_countdowndts">
                                  <b>
                                    {" "}
                                    {t("Productdetails._PurchasedPlan")}:
                                    <span className="expirydt">
                                      {" "}
                                      <a data-tip data-for="global">
                                        {" "}
                                        {getProductMount.featuredName}
                                      </a>{" "}
                                    </span>{" "}
                                  </b>

                                  <ReactTooltip
                                    id="global"
                                    aria-haspopup="true"
                                    // role="example"
                                  >
                                    <span>
                                      {getProductMount.featuredDescription}
                                    </span>
                                  </ReactTooltip>
                                </div>
                              ) : (
                                ""
                              )}

                              {currentUser.getCurrentUser &&
                              getProductMount.featured &&
                              getProductMount.userId ==
                              currentUser.getCurrentUser.id ? (
                                <div className="nn_countdowndts">
                                  <b>
                                    {t("Productdetails._PlanExpires")} :
                                    <span className="expirydt">
                                      <Countdown
                                        date={
                                          new Date(
                                            +getProductMount.featuredExpiry
                                          )
                                        }
                                      />{" "}
                                    </span>{" "}
                                  </b>
                                </div>
                              ) : (
                                ""
                              )}

                              {
                                <div className="description-product notcarcatet float-left w-100 nn_pro_description">
                                  <p> {getProductMount.description} </p>
                                </div>
                              }
                            </div>
                            <div
                              className={
                                currentUser.getCurrentUser &&
                                getProductMount.userId ==
                                currentUser.getCurrentUser.id
                                  ? "bottom-chat nonebtn"
                                  : "bottom-chat"
                              }
                            >
                              {this.props.currentUser.getCurrentUser !== null &&
                              getProductMount.userId ==
                              currentUser.getCurrentUser.id &&
                              SoldStatus !== "SoldOut" ? (
                                <div>
                                  {((featuredData >= 1) && (braintree || stripe || paypal) && (getProductMount.featured === null)) ? (
                                    <div className="nn_pro_chatbtn">
                                      <button
                                        className="nn_makefeaturedbtn"
                                        onClick={() =>
                                          this.openPayment(getProductMount.id)
                                        }
                                      >
                                        {" "}
                                        {t("Productdetails._MakeFeatured")}
                                      </button>

                                      <FeaturedModal
                                        isOpen={this.state.modalIsPay}
                                        onAfterOpen={this.afterOpenModal}
                                        onRequestClose={this.closeModalpayment}
                                        style={customStylessidebar}
                                        contentLabel="Example Modal"
                                        className="payrtl"
                                      >
                                        <div className="nobgforpayment productdets">
                                          <div className="clsbtn">
                                            {" "}
                                            <div
                                              className="subclfprdet"
                                              onClick={this.closeModalpayment}
                                            >
                                              {" "}
                                              <svg viewBox="0 0 24 24">
                                                <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                                              </svg>{" "}
                                            </div>
                                          </div>
                                        </div>
                                        <Payments
                                          contextConsumer={
                                            this.props.contextConsumer
                                          }
                                          closeSlidingPanel={
                                            this.closeSlidingPanel
                                          }
                                          history={this.props.history}
                                          pathPush={this.state.pathPush}
                                          //productId={paramid}
                                        />
                                      </FeaturedModal>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ) : (
                                ""
                              )}

                              {currentUser.getCurrentUser &&
                              getProductMount.userId ==
                              currentUser.getCurrentUser.id ? (
                                <>
                                  {SoldStatus === "ForSale" && (
                                    <div className="nn_pro_chatbtn">
                                    <button
                                      className="nn_soldbtn"
                                      onClick={() =>
                                        this.openConfirmModal("SoldOut")
                                      }
                                    >
                                      {t("Productdetails._MarkSold")}
                                    </button>
                                    </div>
                                  )}
                                  {SoldStatus === "SoldOut" && (
                                    <div className="nn_pro_chatbtn">
                                    <button
                                      className="nn_sellbtn"
                                      onClick={() =>
                                        this.openConfirmModal("ForSale")
                                      }
                                    >
                                      {t("Productdetails._SellAgain")}
                                    </button>
                                    </div>
                                  )}
                                  <DiscardPopup
                                    isOpen={this.state.showModal}
                                    contentLabel="Minimal Modal Example"
                                    style={customStyles}
                                  >
                                    <section className="iHQQug rtlissues">
                                      {SoldStatus === "ForSale" && (
                                        <>
                                          <div className="nn_discardPopup">
                                              <h3>
                                                {" "}
                                                {t(
                                                  "Productdetails._MarkSold"
                                                )}{" "}
                                              </h3>
                                              <hr></hr>
                                          </div>
                                          <article className="nn_article">
                                            <span className="nn_popup_title">
                                              {t("Productdetails._suresold")}
                                            </span>
                                          </article>
                                          <div className="sav_chang cancee nn_discard_btn">
                                            {SoldStatus === "ForSale" && (
                                              <>
                                              <button
                                                type="submit"
                                                onClick={() =>
                                                  this.makeSoldProcess(
                                                    "SoldOut",
                                                    getProductMount
                                                  )
                                                }
                                                className="btn1"
                                              >
                                                {t("Productdetails._MarkSold")}
                                              </button>
                                              <button
                                                type="submit"
                                                onClick={this.handleCloseModal}
                                                className="btn2"
                                              >
                                                {t("Productdetails._Cancel")}
                                              </button>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )}
                                      {SoldStatus === "SoldOut" && (
                                        <>
                                          <div className="nn_discardPopup">
                                              <h3>
                                                {" "}
                                                {t(
                                                  "Productdetails._SellAgain"
                                                )}{" "}
                                              </h3>
                                              <hr></hr>
                                          </div>
                                          <article className="nn_article">
                                            <span className="nn_popup_title">
                                              {t("Productdetails._suresell")}
                                            </span>
                                          </article>
                                          <div className="sav_chang cancee nn_discard_btn">
                                            {SoldStatus === "SoldOut" && (
                                              <>
                                              <button
                                                type="submit"
                                                onClick={() =>
                                                  this.makeSoldProcess(
                                                    "ForSale",
                                                    getProductMount
                                                  )
                                                }
                                                className="btn1"
                                              >
                                                {t("Productdetails._SellAgain")}
                                              </button>
                                              <button
                                                type="submit"
                                                onClick={this.handleCloseModal}
                                                className="btn2"
                                              >
                                                {t("Productdetails._Cancel")}
                                              </button>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )}
                                      {/* <div className="sav_chang">
                                        <button
                                          type="submit"
                                          onClick={this.handleCloseModal}
                                          className="btn iDhWYa btn-block"
                                        >
                                          {t("Productdetails._Cancel")}
                                        </button>
                                      </div> */}
                                    </section>
                                  </DiscardPopup>
                                </>
                              ) : (
                                <>
                                  {getProductMount.sellingStatus !==
                                  "SoldOut" ? (
                                    <div className="nn_seller_msg">
                                      <div className="nn_prochatbtn1">
                                        <Link to={`/SellerDetails/${getProductMount.userId}`}>
                                          <img  src={getProductMount.userProfile} className="float-left"/>
                                        </Link>
                                        <button
                                            className="nn_chatname text-truncate"
                                            onClick={() => this.openChat(history,getProductMount)}
                                          >
                                            {t("Productdetails._ChatNow")} {getProductMount.userName}
                                        </button>
                                      </div>
                                      <div className="nn_pro_chatbtn nn_buybtn">
                                          {((getProductMount.instantBuy === true) && (!getProductMount.isFree) && (getProductMount.sellingStatus === "ForSale")) &&
                                            (
                                          <button
                                            className="nn_buynowbtn"
                                            // {console.log("")}
                                            onClick={(e) => this.BuyNowClick(getProductMount.id,e,true)}
                                              // this.openConfirmModal("SoldOut")
                                            // }
                                          >
                                            {t("Productdetails._buyNow")}
                                          </button>
                                          )}

                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </div>
                            <div>
                              {this.state.showReviewStatus ? (
                                <DiscardPopup
                                  isOpen={this.state.showReviewStatus}
                                  contentLabel="Minimal Modal Example"
                                  style={customStylesReview}
                                >
                                  {this.state.reviewInfo.length > 0 ? (
                                    <section className="iHQQug rtlissues">
                                      <>
                                        <div className="nn_share_ctn">
                                          <button
                                            type="button"
                                            onClick={this.congraReview}
                                            className="nn_markclose_btn"
                                            data-dismiss="modal"
                                          >
                                            {" "}
                                            <CloseIcon className="nn_close_icon"/>
                                          </button>
                                        </div>
                                        <article>
                                          <div className="border-bottomline">
                                            <div className="smileiconsjj">
                                              <img src={smile} />
                                            </div>
                                            <div className="congratls">
                                              <h4>
                                                {" "}
                                                {t(
                                                  "Productdetails._CONGRATULATIONS"
                                                )}
                                              </h4>
                                              <h6>
                                                {t("Productdetails._Whosell")}
                                              </h6>
                                            </div>
                                          </div>
                                          <div className="makepop">
                                            {this.state.reviewInfo.length >
                                            0 ? (
                                              <>
                                                {reviewInfo &&
                                                  reviewInfo.map((rf, i) => {
                                                    return (
                                                      <>
                                                        <div className="fullwidthuserrwe border-bottomline">
                                                          <div
                                                            onClick={e =>
                                                              this.makeReview(
                                                                e,
                                                                rf
                                                              )
                                                            }
                                                          >
                                                            <div className="rightmakeit respnsive">
                                                              <img
                                                                src={
                                                                  rf.profileImage
                                                                }
                                                              />
                                                            </div>
                                                            <div className="leftmakeit respnsive">
                                                              {" "}
                                                              {rf.userName}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </>
                                                    );
                                                  })}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>

                                          <div className="belowspave">
                                            <div
                                              className="makepop reviewitmeddd"
                                              onClick={this.clickMoney}
                                            >
                                              <h6>
                                                {" "}
                                                {t("Productdetails._Soldit")}
                                              </h6>
                                              <p>
                                                {t(
                                                  "Productdetails._sellPassUp"
                                                )}
                                              </p>
                                            </div>

                                            {/* <div className="makepop border-bottomline reviewitmeddd" onClick = {this.clickMoney}>
                                          <h6> I"ll to this later</h6>
                                          <p>Rate the buyer later</p>
                                        </div>  */}
                                          </div>
                                        </article>
                                      </>
                                    </section>
                                  ) : (
                                    <div className="nochatuser">
                                      <div className="nn_share_ctn">
                                        <button
                                          type="button"
                                          onClick={this.makeClosemodal}
                                          className="nn_close_btn"
                                          data-dismiss="modal"
                                        >
                                          {" "}
                                          <CloseIcon className="nn_close_icon"/>
                                        </button>
                                      </div>
                                      <div className="centeralignnochat nn_postlist_ctn">
                                        <h3>
                                          {" "}
                                          {t(
                                            "Productdetails._Makingmoney"
                                          )}{" "}
                                        </h3>
                                        <p className="nn_popup_title2">{t("Productdetails._keepgoing")} </p>
                                        <div className="sav_chang">
                                          <button
                                            className="btn btn-danger btn-block"
                                            onClick={this.postOther}
                                          >
                                            {t("Productdetails._Postanother")}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DiscardPopup>
                              ) : (
                                ""
                              )}

                              <DiscardPopup
                                isOpen={this.state.makeMoney}
                                onRequestClose={this.makeClosemodal}
                                style={customStylesReview}
                                contentLabel="Example Modal"
                              >
                                <div className="nochatuser">
                                  <div className="nn_share_ctn">
                                    <button
                                      type="button"
                                      onClick={this.makeClosemodal}
                                      className="location-close ltn nn_close_btn"
                                      data-dismiss="modal"
                                    >
                                      {" "}
                                      <CloseIcon className="nn_close_icon"/>
                                    </button>
                                  </div>
                                  <div className="centeralignnochat1">
                                    <h6> {t("Productdetails._Makingmoney")}</h6>
                                    <p>{t("Productdetails._keepgoing")}</p>
                                    <div className="sav_chang">
                                      <button
                                        className="btn btn-danger btn-block"
                                        onClick={this.postOther}
                                      >
                                        {t("Productdetails._Postanother")}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </DiscardPopup>
                            </div>
                            <div>
                              {this.state.reviewForm && (
                                <DiscardPopup
                                  isOpen={this.state.reviewForm}
                                  contentLabel="Minimal Modal Example"
                                  style={customStylesReview}
                                >
                                  <section className="iHQQug rtlissues">
                                    <>
                                      {this.state.reviewExpInfo && (
                                        <div className="ratingpageki">
                                          <div className="nn_share_ctn">
                                          <button
                                            type="button"
                                            onClick={this.reviewClosemodal}
                                            className="nn_close_btn"
                                            data-dismiss="modal"
                                          >
                                            {" "}
                                            <CloseIcon className="nn_close_icon"/>
                                          </button>
                                          </div>
                                          <div className="ratingprofile">
                                            <img
                                              src={
                                                this.state.reviewExpInfo
                                                  .profileImage
                                              }
                                              alt= ""
                                            />
                                          </div>
                                          <div className="profilerayingname">
                                            {" "}
                                            {this.state.reviewExpInfo.userName}
                                          </div>
                                          <div className="ratingdescription">
                                            <p>
                                              {" "}
                                              {t(
                                                "Productdetails._experiencewith"
                                              )}
                                              {" "}
                                              {
                                                this.state.reviewExpInfo
                                                  .userName
                                              }{" "}
                                              {t("Productdetails._fivestars")}
                                            </p>
                                            <StarRatingComponent
                                              name="app6"
                                              //starColor="#ffb400"
                                              // emptyStarColor="#ffb400"
                                              value={rating}
                                              onStarClick={this.onStarClickHalfStar.bind(
                                                this
                                              )}
                                              renderStarIcon={(
                                                index,
                                                value
                                              ) => {
                                                return (
                                                  <span>
                                                    <i
                                                      className={
                                                        index <= value
                                                          ? "fas fa-star"
                                                          : "far fa-star"
                                                      }
                                                    />
                                                  </span>
                                                );
                                              }}
                                              renderStarIconHalf={() => {
                                                return (
                                                  <span>
                                                    <span
                                                      style={{
                                                        position: "absolute"
                                                      }}
                                                    >
                                                      <i className="far fa-star" />
                                                    </span>
                                                    <span>
                                                      <i className="fas fa-star-half" />
                                                    </span>
                                                  </span>
                                                );
                                              }}
                                            />
                                          </div>
                                            {/* <StarRatingComponent
                                              name="rate1"
                                              starCount={5}
                                              value={rating}
                                              onStarClick={this.onStarClick.bind(
                                                this
                                              )}
                                            /> */}
                                          <div className="slaectvalue">
                                            {/* <h6>Select at least one</h6> */}
                                          </div>
                                          <div
                                            className={
                                              this.state.changeRating === true
                                                ? "beforedisabled"
                                                : "afterdisbaled"
                                            }
                                          >
                                            <div className="massgeratingvaluee">
                                              {this.state.rating <= 2
                                                ? this.state.secondaryButton &&
                                                  this.state.secondaryButton.map(
                                                    (cbk, index) => (
                                                      <div
                                                        key={index}
                                                        className="inlienbtnvalue"
                                                      >
                                                        <button
                                                          className={
                                                            this.state
                                                              .activeItem ===
                                                            index
                                                              ? "active iDhWYa"
                                                              : "iDhWYa"
                                                          }
                                                          onClick={e =>
                                                            this.reviewSubmit(
                                                              e,
                                                              index,
                                                              cbk,
                                                              this.state.rating
                                                            )
                                                          }
                                                        >
                                                          {cbk}
                                                        </button>
                                                      </div>
                                                    )
                                                  )
                                                : this.state.primaryButton &&
                                                  this.state.primaryButton.map(
                                                    (cbk, index) => (
                                                      <div
                                                        key={index}
                                                        className="inlienbtnvalue"
                                                      >
                                                        <button
                                                          className={
                                                            this.state
                                                              .activeItem ===
                                                            index
                                                              ? "active iDhWYa secondarybtn"
                                                              : "iDhWYa secondarybtn"
                                                          }
                                                          onClick={e =>
                                                            this.reviewSubmit(
                                                              e,
                                                              index,
                                                              cbk,
                                                              this.state.rating
                                                            )
                                                          }
                                                        >
                                                          {cbk}
                                                        </button>
                                                      </div>
                                                    )
                                                  )}
                                            </div>
                                            <div className="textareafiled">
                                              <TextField
                                                multiline
                                                rows="3"
                                                color="secondary"
                                                placeholder={t(
                                                  "Editprofile._Writeexperience"
                                                )}
                                                defaultValue={
                                                  this.state.inputValue
                                                }
                                                className={classes.popsp + " nn_reviewtext"}
                                                fullWidth
                                                inputProps={{
                                                  onChange: e =>
                                                    this.updateInputValue(e)
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={
                                              this.state.puplishReview === true
                                                ? "beforedisabled"
                                                : "afterdisbaled"
                                            }
                                          >
                                            {/* <div className="sav_chang">
                                        <button className="btn btn-danger btn-block" onClick={()=>this.handleUpdateReview()}>Publish Review</button>
                                        </div> */}
                                            <div className="sav_chang">
                                              <button
                                                className="btn btn-danger btn-block"
                                                onClick={() =>
                                                  this.updatedReview(
                                                    this.state.buttonResponse,
                                                    this.state.ratingResponse,
                                                    this.state
                                                      .feedBackTextResponse,
                                                    this.state.reviewExpInfo.id
                                                  )
                                                }
                                              >
                                                {this.props.t(
                                                  "Productdetails._PublishReview"
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                          {/* <h6 className="upadteyoureview">
                                            You can update review whenever you
                                            want
                                          </h6> */}
                                        </div>
                                      )}
                                    </>
                                  </section>
                                </DiscardPopup>
                              )}
                              {/* {
                        this.state.getFeedBack &&
                        <Modal
                        isOpen={this.state.getFeedBack}
                        contentLabel="Minimal Modal Example"
                        style={customStylesReview}
                        >

                        <section className="iHQQug">
                        <>
                            {
                            this.state.reviewExpInfo &&
                            <div className="ratingpageki">
                                  <div className="ratingprofile">
                                <img src={this.state.reviewExpInfo.profileImage} />
                                </div>
                                <div className="profilerayingname"> {this.state.reviewExpInfo.userName}</div>
                                <div  className="ratingdescription"><p> Does your experience with {this.state.reviewExpInfo.userName } get five stars ? Tell us how it went </p></div>

                                <div className="textareafiled">
                            <TextField
                             multiline
                             rows="3"
                             color="secondary"
                             placeholder="Write about your experience(optional) "
                             defaultValue={this.state.inputValue}
                             className={classes.popsp}
                             fullWidth
                             inputProps={{
                               onChange: e =>
                                 this.updateInputValue(e)
                             }}
                           />
                           </div>

                           {/* / <div className={this.state.updateComment === true  ? "beforedisabled": "afterdisbaled"}> */}
                              {/* <div className="sav_chang">
                               <button className="btn btn-danger btn-block" onClick={()=>this.updatedReview(this.state.buttonResponse,this.state.ratingResponse,this.state.feedBackTextResponse,
                                this.state.reviewExpInfo.id)}>Update comment</button>
                                </div>
                                {/* </div>
                            </div>

                             }

                         </>

                            </section>
                        </Modal>

                         }  */}
                            </div>
                          </div>
                        </GridItem>
                      </GridContainer>
                    </div>
                    <div className="nn_map_details">
                      <div className="nn_mapsloc">
                        {/* <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="sc-jTzLTM fznnpf"
                        >
                          <path d="M12.364 2c2.204 0 4.327.865 5.915 2.463a8.4 8.4 0 0 1 2.448 5.939 8.4 8.4 0 0 1-2.448 5.942c-2.669 2.684-5.094 5.445-5.383 5.561a1.326 1.326 0 0 1-.532.095c-.19 0-.358-.024-.544-.1-.305-.123-2.767-2.937-5.372-5.556-3.264-3.282-3.264-8.6 0-11.88A8.319 8.319 0 0 1 12.364 2zm.091 11.91A3.455 3.455 0 1 0 9 10.455a3.455 3.455 0 0 0 3.455 3.455z"></path>
                        </svg> */}
                        <LocationOnOutlinedIcon />
                        <span>
                          {" "}
                          {getProductMount.title} in{" "}
                          {formatted_address && (
                            <span>{formatted_address}</span>
                          )}{" "}
                        </span>
                      </div>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={8}>
                          <div className="nn_maps">
                          {/* style={{ height: "400px", width: "100%",boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.4)" }} */}
                             {/* <GoogleMapReact
                              bootstrapURLKeys={{
                                key: this.state.googleApi,
                                language: i18n.language
                              }}
                              defaultCenter={this.state.center}
                              defaultZoom={this.props.zoom}
                            >
                              <AnyReactComponent
                                lat={getProductMount.location.lat_lon[0]}
                                lng={getProductMount.location.lat_lon[1]}
                                img_src={"Kreyser Avrora"}
                              />
                            </GoogleMapReact> */}

                       { getProductMount && getProductMount.location && getProductMount.location.lat_lon !== null ?
                          <StaticGoogleMap size="1400x250" apiKey={this.state.googleApi} language={localStorage && localStorage.getItem("lang")}>
                              <Marker location={{ lat: getProductMount.location.lat_lon[0],
                                lng:getProductMount.location.lat_lon[1] }} color="red" label="P" />
                          </StaticGoogleMap> : "No location found"
                        }

                          </div>
                        </GridItem>
                        { googleAd ?
                            <Grid item xs={12} sm={12}  md={4} >
                              <AdSense.Google
                                  client={googleAdSenseId} // {googleAnalyticsKey}
                                  slot={productDetailPageSlotId} // {productPageSlotId}
                                  style={{ display: 'block' }}
                                  layout='in-article'
                                  format='fluid'
                                  className="nn_ad_img1"
                              />
                            </Grid> :
                            <GridItem xs={12} sm={12} md={4}>
                              <div className="nn_ad_img">
                                <img src={prgd2} className="nn_img" />
                              </div>
                            </GridItem>
                        }

                      </GridContainer>
                    </div>

                    <DiscardPopup
                      isOpen={this.state.modalIsOpenshare}
                      // onAfterOpen={this.afterOpenModal}
                      //  onRequestClose={this.closeModalshare}
                      style={customStylessocila}
                      contentLabel="Example Modal"
                    >
                      <div className="">
                        <div className="nn_share_ctn">
                        <button
                          type="button"
                          onClick={this.closeModalshare}
                          className="nn_close_btn"
                        >
                          {" "}
                         <CloseIcon className="nn_close_icon"/>
                        </button>
                        </div>
                        <div className="ovarsoculaspave">
                          <div className="nn_share_title">
                            <h3> {t("Productdetails._Sharelisting")}</h3>
                          </div>

                          <div className="input-group kPEHgG">
                            <svg
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="imgbgclg"
                            >
                              <path
                                d="M8.994 13.713a1.368 1.368 0 1 1 2.19-1.638 3.103 3.103 0 0 0 4.68.335l2.666-2.666a3.103 3.103 0 0 0-.038-4.35C17.296 4.2 15.36 4.18 14.156 5.343l-1.538 1.529a1.368 1.368 0 1 1-1.929-1.94l1.552-1.543a5.839 5.839 0 0 1 8.185.071c2.254 2.254 2.282 5.896.054 8.202l-2.682 2.682a5.839 5.839 0 0 1-8.804-.63zm5.767-3.426a1.368 1.368 0 1 1-2.19 1.638 3.103 3.103 0 0 0-4.68-.335l-2.666 2.666a3.103 3.103 0 0 0 .037 4.35c1.195 1.195 3.13 1.215 4.334.054l1.529-1.529a1.368 1.368 0 1 1 1.934 1.934l-1.546 1.546a5.839 5.839 0 0 1-8.185-.071c-2.254-2.254-2.281-5.896-.054-8.202l2.682-2.682a5.839 5.839 0 0 1 8.805.63z"
                                fill="rgb(158, 158, 158)"
                              ></path>
                            </svg>
                            <input
                              type="text"
                              className="form-control noborser"
                              placeholder="Search this blog"
                              value={shareUrl}
                              maxlength={0}
                            />
                            <div className="input-group-append ">
                              <CopyToClipboard
                                text={shareUrl}
                                onCopy={this.copyData}
                              >
                                <button
                                  onClick={this.copyStatus}
                                  className="btn btn-default copyfunction"
                                  type="button"
                                >
                                  {this.state.copied
                                    ? t("Productdetails._Copy")
                                    : t("Productdetails._Copy")}
                                </button>
                              </CopyToClipboard>
                            </div>
                          </div>

                          <div className="social-link nn_social_link">
                            <FacebookShareButton
                              url={shareUrl}
                              //quote={getProductMount.title}
                              className="nn_share_icon"
                            >
                              <div className="bg-color-media float-left">
                                <div className="soc-icon float-left">
                                  <span>
                                    {" "}
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="24"
                                      height="24"
                                    >
                                      <path d="M12 0C5.373 0 0 5.395 0 12.05c0 5.97 4.326 10.912 9.999 11.87v-9.356H7.104v-3.366h2.895V8.715c0-2.88 1.752-4.45 4.31-4.45 1.226 0 2.28.092 2.585.133v3.01l-1.775.001c-1.391 0-1.66.664-1.66 1.638v2.149h3.32l-.432 3.367H13.46V24C19.397 23.274 24 18.205 24 12.047 24 5.395 18.627 0 12 0z"></path>
                                    </svg>
                                  </span>
                                </div>
                                {/* <div className="share-text-msg float-left">
                                  <span>
                                    {t("Productdetails._ShareFacebook")}{" "}
                                  </span>
                                </div> */}
                              </div>
                            </FacebookShareButton>
                            <WhatsappShareButton
                              url={shareUrl}
                              //title={getProductMount.title}
                              className="nn_share_icon"
                            >
                              <div className="bg-color-media whatsapp nn_whatsapp_icon float-left">
                                <div className="soc-icon float-left ">
                                  {/* <WhatsappIcon size={32} round={true} borderRadius={32} logoFillColor="green" iconBgStyle="white" />  */}
                                  <svg
                                    viewBox="0 0 48 48"
                                    width="100"
                                    height="100"
                                  >
                                    <path
                                      fill="#fff"
                                      d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                                    />
                                    <path
                                      fill="rgb(4, 167, 78)"
                                      fill-rule="evenodd"
                                      d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </div>
                                {/* <div className="share-text-msg float-left whatshr">
                                  <span>
                                    {t("Productdetails._SharewhatApps")}{" "}
                                  </span>
                                </div> */}
                              </div>
                            </WhatsappShareButton>

                            {/* <div className="bg-color-media messager float-left w-100">
                                <div className="soc-icon float-left ">
                                  <span>
                                    {" "}
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="24"
                                      height="24"
                                    >
                                      <path d="M11.685 2.662C6.336 2.662 2 6.702 2 11.685c0 2.84 1.408 5.373 3.61 7.027v3.44l3.297-1.82c.88.244 1.812.376 2.778.376 5.349 0 9.685-4.04 9.685-9.023s-4.336-9.023-9.685-9.023zm.962 12.151l-2.466-2.647-4.812 2.647 5.293-5.654 2.527 2.647 4.752-2.647-5.294 5.654z"></path>
                                    </svg>
                                  </span>
                                </div>
                                <div className="share-text-msg float-left">
                                  <span>Share on Messenger </span>
                                </div>
                              </div> */}

                            {/*  <div className="bg-color-media twitter float-left w-100">
                                <div className="soc-icon float-left ">
                                  <span className="icon_bg">
                                    {" "}
                                    <svg viewBox="0 0 24 24" width="24" height="24" ><path d="M21.744 6.236a7.945 7.945 0 0 1-1.383.466 4.313 4.313 0 0 0 1.138-1.813.226.226 0 0 0-.33-.263 7.982 7.982 0 0 1-2.116.874.56.56 0 0 1-.502-.125 4.325 4.325 0 0 0-2.862-1.08c-.457 0-.918.07-1.37.211a4.19 4.19 0 0 0-2.825 3.02 4.614 4.614 0 0 0-.102 1.592.16.16 0 0 1-.174.175 11.342 11.342 0 0 1-7.795-4.165.226.226 0 0 0-.37.029 4.322 4.322 0 0 0-.587 2.175 4.32 4.32 0 0 0 1.29 3.083 3.876 3.876 0 0 1-.987-.382.226.226 0 0 0-.336.195 4.33 4.33 0 0 0 2.527 3.99 3.873 3.873 0 0 1-.821-.069.226.226 0 0 0-.258.291 4.335 4.335 0 0 0 3.424 2.949 7.982 7.982 0 0 1-4.47 1.358h-.5c-.155 0-.285.1-.325.249a.343.343 0 0 0 .165.379 11.872 11.872 0 0 0 5.965 1.608c1.834 0 3.549-.364 5.098-1.081a11.258 11.258 0 0 0 3.73-2.795 12.254 12.254 0 0 0 2.284-3.826c.508-1.356.776-2.804.776-4.186v-.066c0-.222.1-.43.276-.573a8.55 8.55 0 0 0 1.72-1.888c.126-.188-.073-.424-.28-.332z"></path></svg>
                                  </span>
                                </div>
                                <div className="share-text-msg float-left">
                                  <span>Share on Twitter </span>
                                </div>
                              </div> */}
                            {/* <TwitterShareButton
                                url={shareUrl}
                                title={getProductMount.title}
                              >
                                <div className="bg-color-media twitter float-left w-100">
                                  <div className="soc-icon float-left twittebg">
                                    <span className="twittericon">
                                      {" "}
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        className="ProductShareDialogstyles__TwitterIcon-sc-188o8rz-15 bMyHsJ sc-jTzLTM fznnpf"
                                      >
                                        <path d="M21.744 6.236a7.945 7.945 0 0 1-1.383.466 4.313 4.313 0 0 0 1.138-1.813.226.226 0 0 0-.33-.263 7.982 7.982 0 0 1-2.116.874.56.56 0 0 1-.502-.125 4.325 4.325 0 0 0-2.862-1.08c-.457 0-.918.07-1.37.211a4.19 4.19 0 0 0-2.825 3.02 4.614 4.614 0 0 0-.102 1.592.16.16 0 0 1-.174.175 11.342 11.342 0 0 1-7.795-4.165.226.226 0 0 0-.37.029 4.322 4.322 0 0 0-.587 2.175 4.32 4.32 0 0 0 1.29 3.083 3.876 3.876 0 0 1-.987-.382.226.226 0 0 0-.336.195 4.33 4.33 0 0 0 2.527 3.99 3.873 3.873 0 0 1-.821-.069.226.226 0 0 0-.258.291 4.335 4.335 0 0 0 3.424 2.949 7.982 7.982 0 0 1-4.47 1.358h-.5c-.155 0-.285.1-.325.249a.343.343 0 0 0 .165.379 11.872 11.872 0 0 0 5.965 1.608c1.834 0 3.549-.364 5.098-1.081a11.258 11.258 0 0 0 3.73-2.795 12.254 12.254 0 0 0 2.284-3.826c.508-1.356.776-2.804.776-4.186v-.066c0-.222.1-.43.276-.573a8.55 8.55 0 0 0 1.72-1.888c.126-.188-.073-.424-.28-.332z"></path>
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="share-text-msg float-left">
                                    <span>Share on Twitter </span>
                                  </div>
                                </div>
                              </TwitterShareButton>
                              <EmailShareButton
                                url={shareUrl}
                                preLoadr
                                subject={getProductMount.title}
                              >
                                <div className="bg-color-media email float-left w-100">
                                  <div className="soc-icon float-left twittebg">
                                    <span className="envelopeicon">
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        className="ProductShareDialogstyles__EmailIcon-sc-188o8rz-16 cTIxuG sc-jTzLTM fznnpf"
                                        color="#DF4A32"
                                      >
                                        <path d="M2 10l9.106 4.553a2 2 0 0 0 1.788 0L22 10v8.75c0 .69-.56 1.25-1.25 1.25H3.25C2.56 20 2 19.44 2 18.75V10zm18.75-5c.69 0 1.25.597 1.25 1.333v1.334l-9.059 4.831a2 2 0 0 1-1.882 0L2 7.667V6.333C2 5.597 2.56 5 3.25 5h17.5z"></path>
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="share-text-msg float-left">
                                    <span>Share on Email </span>
                                  </div>
                                </div>
                              </EmailShareButton> */}
                          </div>
                        </div>
                      </div>
                    </DiscardPopup>
                    <div></div>

                    <div className="nn_related_pro">
                      {produ.length > 0 && (
                        <h5> {t("Productdetails._RelatedProducts")}</h5>
                      )}
                      <div className="product-list nn_product_list">
                        {localStorage.getItem("lang") === "ar" ? (
                          <Slider {...settingsrtl}>{produ}</Slider>
                        ) : (
                          <Slider {...settings}>{produ}</Slider>
                        )}
                      </div>
                    </div>
                  </Grid>
                </div>
              </ProductDetailsMain>

              {showScroll && (
                <ScrollTop>
                <div className="anchor-fixed" onClick={this.scrollToTop}>
                  <a>
                    <span>
                      {" "}
                      <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </span>{" "}
                  </a>
                </div>
                </ScrollTop>
              )}
            </ProviderRefech>
          </div>
        ):<Loader><div className="stage" id="loader"><div className="dot-bricks"></div></div></Loader>}
        {
          this.state.openChatWindow ?
          <ChatWindow
            history={history}
            parentCallback={this.state.currConv}
            client={this.props.client}
            /> : ""
        }

        <Footer />
      </>
    );
  }
}

ProductDetails.defaultProps = {
  center: {
    lat: 9.901305400000002,
    lng: 78.094516
  },
  zoom: 11
};

var ProductDetailexport = compose(
  graphql(ROSTER_GROUPID, { name: "getRosterGroupId" }),
  graphql(GET_ROSTER_GROUPID_DETAILS, {
    name: "getCacheRosterId",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(GET_CATEGORY_ID, { name: "getCacheCategoryData", options: () => ({ fetchPolicy: "cache-only" }) }),
  graphql(LIKES_UPDATE, { name: "likesUpdate" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(UPDATE_PRODUCT_REPORTS, { name: "updateProductReports" }),
  graphql(UPDATE_SELLING_STATUS, { name: "updateSellingStatus" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_ROSTER,{
    name: "getRoster"
  }),
  graphql(GET_PRODUCT_ID, {
    name: "getCacheProductId"
  }),
  graphql(USER_PRODUCT_DELETE, { name: "deleteProduct" }),
  graphql(SEND_MESSAGE, { name: "sendMessage" }),
  graphql(CREATE_ROOM, { name: "createRoom" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(PRODUCT_ID, { name: "getProductId" }),
  graphql(IS_CATEGORY_REFETCH, { name: "categoryRefetch" }),
  graphql(IS_MODEL_CLOSE, { name: "getModelClose" }),
  graphql(CLOSE_MODEL, { name: "isModelClose" }),
  graphql(GET_REVIEW, { name: "getReview" }),
  graphql(UPDATE_REVIEW, { name: "updateReview" }),
  graphql(GET_PRODUCT, {
    name: "getProduct",
    options: props => ({
      variables: { id: Number(props.match.params.id) },
      fetchPolicy: "network-only"
    })
  }),
  graphql(UPDATE_CHATNOW_STATUS, {name: 'updateChatNowStatus'}),
  graphql(GET_CHATNOW_STATUS, {
    name: "getCacheChatNowButton",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(LOCATION_NAME, {name: 'getLocationName'}),
  graphql(GET_LOCATION_NAME, {
  name: "getLoactionNameData",
  options: () => ({
      fetchPolicy: 'cache-only'
      })
  }),
  graphql(RADIUS, {name: 'getRadius'}),
  graphql(GET_RADIUS, {
    name: "getCacheRadiusData",
    options: () => ({
        fetchPolicy: 'cache-only'
      })
  }),
  graphql(LOCATION, {name: 'getLocation'}),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
        fetchPolicy: 'cache-only'
      })
  }),
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
    fetchPolicy: "cache-only"
    })
  }),
    graphql(SORTBY, { name: "getSortBy" }),
    graphql(GET_SORTBY_DETAILS, {
    name: "getSortByData",
      options: () => ({
      fetchPolicy: "cache-only"
      })
    }),
    graphql(SEARCH_INPUT, { name: "searchResult" }),
    graphql(GET_SEARCH_INPUT, {
        name: "getCacheSearchInput",
        options: () => ({
          fetchPolicy: "cache-only"
        })
      }),
    graphql(CATE_LANG_REFETCH, { name: "getRefetch" }),
    graphql(GET_FEATURELIST_DETAILS, {
      name: "getFeatureddetails",
    }),
)(ProductDetails);

export default withTranslation("common")(
  withStyles(pagesStyle)(ProductDetailexport)
);

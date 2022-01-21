import React from "react";
import { compose, graphql, Mutation } from "react-apollo";
import {
  EDIT_USER,
  GET_CURRENT_USER,
  GET_USER,
  LOG_OUT,
  ISOPEN,
  INACTIVE,
  GET_REVIEW,
  UPDATE_REVIEW,
  GET_SITE_INFO,
  UPDATE_ORDER_STATUS,
  UPDATE_SHIPPING_DETAILS,
  GET_COUNTRIES,
  ADD_PAYOUT,
  DELETE_PAYOUT,
  RESENT_EMAIL_VERIFICATION,
  ADD_DEFAULT_PAYOUT
} from "../../../queries";
import PictureUpload from "../../../components/CustomUpload/ImageUpload.jsx";
import { dateAdd,dateSet1,dateSet,getSymbol,getPayoutCountries,getUnderScoreRemovedString } from "../../../helper.js";
import TextField from "@material-ui/core/TextField";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import prgd1 from "../../../assets/img/prgd1.gif";
import { Link } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import { animateScroll as scroll } from "react-scroll";
import Modal from "react-modal";
import * as Toastr from "../Toast.jsx";
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import EmptyTab from '../../../assets/img/empty-tap.jpg';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { get } from "mongoose";
import { CLIEngine } from "eslint";
import { Input } from "@material-ui/core";
import googleAdImg from '../../../assets/img/ad.png';
import CloseIcon from '@material-ui/icons/Close';
import LockIcon from '@material-ui/icons/Lock';
import DeleteIcon from '@material-ui/icons/Delete';
import { ScrollTop,EditProfileMain,EditProfileModal,DiscardPopup,ShipmentPopup,Loader } from '../css/styledcomponents';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUpload from "../../../components/CustomUpload2/ImageUpload.jsx";
import AdSense from 'react-adsense';

const initialState = {
  userName: "",
  email: "",
  password: "",
  newPassword: "",
  oldPassword: "",
  profileImage: "",
  id: [],
  foundUser: {},
  ForSale: [],
  SoldOut: [],
  favourites: [],
  reviews: [],
  orders: [],
  sales: [],
  reviewExpInfo: [],
  rating: "",
  primaryButton: [],
  secondaryButton: [],
  buttonResponse: "",
  ratingResponse: "",
  getFeedBack: false,
  feedBackTextResponse: "",
  changeRating: false,
  data: {},
  cUser: {},
  imagePreviewUrl: "",
  openHandler: false,
  showScroll: false,
  sellingVisible: 10,
  soldVisible: 10,
  favVisible: 10,
  reviewVisible: 10,
  orderVisible: 10,
  saleVisible: 10,
  modalIsOpen: false,
  HQimageError: false,
  userNameError: false,
  ImageFile: "",
  errors: {},
  popUpDetails: [],
  popUpDetailsPassWord: [],
  inputValue: "",
  passwordError: {
    password: "",
    newPassword: "",
    oldPassword: ""
  },
  profileEditData: {},
  UserReviewPop: false,
  ratings: "",
  feedBack: "",
  comment: "",
  reviewUser: true,
  editId: "",
  puplishReview: false,
  orderdetails: {},
  saledetails: {},
  value: "",
  markprocess: false,
  cancelIsOpen: false,
  cancelledId: "",
  orderStatus: "",
  shipPopupIsOpen: false,
  payoutIsOpen: false,
  accountCreationDisable: false,
  choosepayIsOpen:false,
  paypalIsOpen:false,
  stripeIsOpen:false,
  shippmentDate: "",
  shippmentMethod: "",
  shippementService: "",
  trackingId: "",
  country:"",
  address1:"",
  addresszone:"",
  city:"",
  state:"",
  gender:"",
  postal_code:"",
  phone_number:"",
  DOB: "",
  selectedDate: "",
  selectedShippmentDate: "",
  //startDate: new Date(),
  teste: false,
  stripeCountry:"",
  currency_code:"",
  countryData:[],
  AddressData:{},
  addressObject:{},
  values:{},
  kanji_address:"",
  kanji_address2:"",
  kanji_city:"",
  kanji_postal_code:"",
  kanji_state:"",
  documentImage:"",
  documentAdditionalImage: "",
  cancelReasonValue:"",
  googleAd: false,
  googleAdSenseId: "",
  editProfilePageSlotId: "",
  cancelStatus:"",
  preLoadr: false
};

var styles = {
  ...loginStyles,
  ...headerStyles(),
  customBtn: {
    borderColor: "white !important",
    "&:hover": {
      borderColor: "white !important"
    }
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
    padding: "0px"
  }
};
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "calc(100% - 20px)"
  }
};
const customStyles11 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "auto"
  }
};

const customStyles123 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxwidth:"800px"
   }
};
const customStyles1 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "500px"
  }
};

const customStyles_new = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "calc(100% - 20px)",
    background:"unset"
  }
}

const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    console.log(GET_USER);
    this.state = {
      ...initialState,
      activeItem: -1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.change = this.change.bind(this);
    this.redirect = this.redirect.bind(this);
    this.fileInput = React.createRef();
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.openModal = this.openModal.bind(this);
    //this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editreviewClosemodal = this.editreviewClosemodal.bind(this);
  }

  editreviewClosemodal() {
    this.setState({
      UserReviewPop: false,
      buttonResponse: [],
      ratingResponse: "",
      feedBackTextResponse: "",
      activeItem: "",
      rating: "",
      changeRating: false,
      puplishReview: false
    });
  }

  onStarClickHalfStar(nextValue, prevValue, name, e) {
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;

    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }
    this.setState({ rating: nextValue, changeRating: true });
  }

  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }

 async componentDidMount() {
   console.log('COmoinoe')
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
    Modal.setAppElement(this.el);
    setTimeout(()=>{
      this.setState({preLoadr : true}) },0)
    const { match } = this.props;
    const id = match.params.id;
    await this.props.client
      .query({
        query: GET_USER,
        variables: { id: Number(id) }
      })
      .then(({ data, loading, error }) => {
        console.log(data);
        if (loading){
          console.log(loading,"test");                                                                  
          return <div>trtertetert</div>;
        }
        if (error){
          return <div>error...</div>;
        }
        if (data) {
          let ResponseData = data.getUserDetails;
          this.setState({
            foundUser: ResponseData.foundUser,
            ForSale: ResponseData.ForSale,
            SoldOut: ResponseData.SoldOut,
            favourites: ResponseData.favourites,
            reviews: ResponseData.review,
            orders: ResponseData.myOrders,
            sales: ResponseData.mySales,
            preLoadr : false
          });
        }
      });

    setTimeout(()=>{
      const {siteInfo}=this.props;
      // const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
      this.setState({
          cancelStatus : siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.hideOrderCancelStatus
      })
      // const r = document.querySelector(':root').style;
      // r.setProperty('--theme-color',color1);
      // r.setProperty("--theme-color-hvr",(color1 + "bf"));
    },2000);
      const {data} = await this.props.client.query({query: GET_COUNTRIES})
            this.setState({
              countryData :  data && data.getCountries
            })
      }

  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
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

  scrollToTop() {
    scroll.scrollToTop();
  }

  componentWillMount() {
    var root = document.getElementsByTagName('html')[0];
    root.style.backgroundColor = "#f6f5f7";
    let { currentUser, getUser, match, siteInfo } = this.props;
    let id = match.params.id;
    if (!currentUser.getCurrentUser){
      currentUser.refetch();
      this.setState({
        cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
      });
    }
    if (id) {
      this.setState({preLoadr : true})
      getUser.refetch({ id: Number(id) }).then(({ data }) => {
        if (data && data.getUserDetails) {
          this.setState({
            foundUser: data.getUserDetails.foundUser,
            ForSale: data.getUserDetails.ForSale,
            SoldOut: data.getUserDetails.SoldOut,
            favourites: data.getUserDetails.favourites,
            reviews: data.getUserDetails.review,
            orders: data.getUserDetails.myOrders,
            sales: data.getUserDetails.mySales,
            preLoadr : false
          });
        }
      });
      siteInfo.refetch();
      if(siteInfo.getSiteInfo){
        let info = siteInfo.getSiteInfo
        this.setState({
          googleAd: info.googleAdsence,
          googleAdSenseId: info.googleAdSenseId,
          editProfilePageSlotId: info.editProfilePageSlotId,
          cancelStatus: info.hideOrderCancelStatus
        })
      }
    }


  }

  redirect = (event) => {
    event.preventDefault();
    this.props.logOut({ variables: { type: "user" } }).then(({ data }) => {
      if (data.logOut) {
        sessionStorage.clear();
        this.props.history.push("/");
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    let { currentUser, getUser, match,siteInfo } = nextProps;
    currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    if (nextProps.getUser && nextProps.getUser.getUserDetails) {
      let {
        email,
        userName,
        password,
        status,
        profileImage
      } = nextProps.getUser.getUserDetails.foundUser;
      this.setState({
        email,
        userName,
        password,
        status,
        profileImage
      });
    }
    let id = match.params.id;
    if (id) {
      getUser.refetch({ id: Number(id) }).then(({ data }) => {
        if (data && data.getUserDetails) {
          this.setState({
            foundUser: data.getUserDetails.foundUser,
            ForSale: data.getUserDetails.ForSale,
            SoldOut: data.getUserDetails.SoldOut,
            favourites: data.getUserDetails.favourites,
            reviews: data.getUserDetails.review,
            orders: data.getUserDetails.myOrders,
            sales: data.getUserDetails.mySales            
          });
        }
      });
      if(nextProps.siteInfo && nextProps.siteInfo.getSiteInfo){
        let info = nextProps.siteInfo.getSiteInfo
        this.setState({
          googleAd: info.googleAdsence,
          googleAdSenseId: info.googleAdSenseId,
          editProfilePageSlotId: info.editProfilePageSlotId,
          cancelStatus: info.hideOrderCancelStatus
        })
      }
    }

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
  change(id, event, stateName) {
    if (stateName === "profileImage") {
      this.setState({ HQimageError: false });
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (id) {
          this.setState({
            editData: Object.assign(
              {},
              { id: Number(id) },
              this.state.editData,
              { [stateName]: reader.result }
            ),
            imagePreviewUrl: reader.result,
            ImageFile: files[0]
          });
        }
      };
    }
    this.setState({ [stateName]: (event.target.value).trimLeft(" ") });
    if (id) {
      this.setState({
        editData: Object.assign({}, { id: Number(id) }, this.state.editData, {
          [stateName]: (event.target.value).trimLeft(" ")
        })
      });
    }
  }
  handleSubmit(event, userAction, history) {
    let { match } = this.props;
    let id = match.params.id;
    event.preventDefault();
    if (!this.validateInput()) {
        userAction()
          .then(async ({ data }) => {
            this.setState({ modalIsOpen: false });
            this.setState({ HQimageError: false, popUpDetails: [] });
            history.push(`/EditProfile/${id}`);
          })
          .catch((error) => {
            var popUpDetails = error.graphQLErrors.map((x) => x.message);
            if (popUpDetails[0] === "Invalid password") {
              this.setState({ modalIsOpen: false });
            }
            if (popUpDetails[0] !== "Invalid password") {
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
                  <div>{popUpDetails[0]}</div>
                </div>
              );
            }
          });
      } else {
        this.setState({
          HQimageError: true
        });
      }
  }

  preventSpace = (event,type) => {
    if(type==="userName"){
      if ((event.keyCode >= 47 && event.keyCode <= 64) 
      || (event.keyCode >= 91 && event.keyCode <= 111) || (event.keyCode >= 219 && event.keyCode <= 222) || (event.keyCode >= 190 && event.keyCode <= 192) || (event.keyCode >= 186 && event.keyCode <= 189)) {
        event.preventDefault();
      }
    } else if(type === "email" || type === "password"){
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    }
  };

  onSubmit(event, userAction, history) {
    this.setState({ popUpDetailsPassWord: "" });
    let { match } = this.props;
    let id = match.params.id;
    //const { password, newPassword, oldPassword } = this.state;
    event.preventDefault();
    if (this.passwordValidate()) {
      userAction()
        .then(async ({ data }) => {
          this.setState({
            modalIsOpen: false,
            newPassword: "",
            password: "",
            oldPassword: "",
            popUpDetailsPassWord: []
          });
          history.push(`/EditProfile/${id}`);
        })
        .catch((error) => {
          this.setState({
            popUpDetailsPassWord: error.graphQLErrors.map((x) => x.message)
          });
        });
    }
  }

  passwordValidate = () => {
    const { oldPassword, password, newPassword, passwordError } = this.state;
    let errors = { ...passwordError };
    let validate = false;

    if (oldPassword.length < 4) {
      errors.oldPassword = this.props.t("Editprofile._minimum4char");
      validate = false;
    } else {
      errors.oldPassword = "";
      validate = true;
    }

    if (newPassword.length < 4) {
      errors.newPassword = this.props.t("Editprofile._minimum4char");
      validate = false;
    } else {
      errors.newPassword = "";
      validate = true;
    }

    if (password !== null && password !== newPassword) {
      errors.password = this.props.t("Editprofile._passwordnotMatch");
      validate = false;
    } else {
      errors.password = "";
    }

    if (newPassword.length >= 4 && newPassword === oldPassword) {
      errors.newPassword = this.props.t("Editprofile._sameoldandnewpswd");
      validate = false;
    }

    this.setState({ passwordError: errors });
    return validate;
  };

  validateInput() {
    var self = this;
    let required = ["userName", "email"];
    let error = {},
      flag = false;
    required.forEach((data) => {
      // if (
      //   id &&
      //   data == "oldPassword" &&
      //   self.state.editData.oldPassword == undefined
      // )
      //   error[data] = "";
      // else if (
      //   data == "oldPassword" &&
      //   id &&
      //   (self.state.editData.oldPassword == "" ||
      //     self.state.editData.oldPassword.trim() == "")
      // ) {
      //   error[data] = `The ${data} field is required.`;
      // }else
      if (!self.state[data] && !self.state[data].length) {
        error[data] = `${this.props.t("Editprofile._The")} ${
          data === "userName"
            ? this.props.t("Editprofile._userName")
            : this.props.t("Editprofile._email")
        } ${this.props.t("Editprofile._fieldrequired")}`;
      } else if (data === "email" && !!this.state.email) {
        //eslint-disable-next-line
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRex.test(this.state.email)) {
          error.email = this.props.t("Editprofile._emailValid");
        } else {
          error.email = undefined;
        }
      } else {
        error[data] = undefined;
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
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
      passwordError: { password: "", newPassword: "", oldPassword: "" },
      password: "",
      newPassword: "",
      oldPassword: "",
      popUpDetailsPassWord: []
    });
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   this.subtitle.style.color = '#f00';
  // }

  productPage = () => {
    this.props.history.goBack();
  };

  closeModal() {
    this.setState({ cancelReasonValue: "",cancelReasonError: false ,modalIsOpen: false,
     cancelIsOpen: false, shipPopupIsOpen: false , payoutIsOpen: false ,
     choosepayIsOpen:false , paypalIsOpen:false , stripeIsOpen:false , accountCreationDisable: false
    });
  }

  loadMore = (name) => {
    switch (name) {
      case "sell":
        this.setState(prev => {
          return { sellingVisible: prev.sellingVisible + 10 };
        });
        break;
      case "sold":
        this.setState((prev) => {
          return { soldVisible: prev.soldVisible + 10 };
        });
        break;
      case "fav":
        this.setState((prev) => {
          return { favVisible: prev.favVisible + 10 };
        });
        break;
      case "review":
        this.setState((prev) => {
          return { reviewVisible: prev.reviewVisible + 10 };
        });
        break;
      case "order":
        this.setState((prev) => {
          return { orderVisible: prev.orderVisible + 10 };
        });
        break;
      case "sale":
        this.setState((prev) => {
          return { saleVisible: prev.saleVisible + 10 };
        });
        break;
      default:
        break;
    }
  };

  handleData = (editData) => {
    if (editData !== undefined) {
      let profileEditData = editData;
      delete profileEditData.password;
      delete profileEditData.newPassword;
      delete profileEditData.oldPassword;
      this.setState({
        profileEditData: profileEditData
      });
    }
  };

  // onStarClick(nextValue, prevValue, name) {
  //   this.setState({ rating: nextValue });
  // }

  handleUserRating = (reviewData) => {
    this.setState({
      ratings: reviewData.ratings,
      feedBack: reviewData.feedBack,
      comment: reviewData.comment,
      UserReviewPop: true,
      reviewExpInfo: reviewData
    });
    this.props.getReview
      .refetch({ userId: reviewData.userFrom })
      .then(({ data }) => {
        if (data) {
          const pButton = data.getReview.feedBack.primaryLevel;
          const sButton = data.getReview.feedBack.secondaryLevel;
          this.setState({
            primaryButton: pButton,
            secondaryButton: sButton
          });
        }
      });
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue, changeRating: true });
  }

  reviewSubmit = (e, index, cbk, rate) => {
    this.setState({
      buttonResponse: cbk,
      ratingResponse: rate,
      activeItem: index,
      puplishReview: true
    });
  };

  handleUpdateReview = () => {
    this.setState({
      getFeedBack: true,
      UserReviewPop: false
    });
  };

  updateInputValue = (e) => {
    this.setState({
      feedBackTextResponse: e.target.value,
      inputValue: e.target.value
    });
  };

  updatedReview = (txt, rate, feedBack, userTo) => {
    let {match} = this.props;
    var result = {
      ratings: rate,
      feedBack: txt,
      comment: feedBack,
      userTo: userTo,
      reviewId: match.params.id+"_"+userTo
    };

    let sendVariables = { data: result };

    this.props
      .updateReview({
        variables: sendVariables
      })
      .then(async ({ data }) => {
        this.setState({
          getFeedBack: false,
          buttonResponse: [],
          ratingResponse: "",
          feedBackTextResponse: "",
          activeItem: "",
          rating: "",
          inputValue: "",
          changeRating: false,
          puplishReview: false
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
            UserReviewPop: false
          });
        }
      })
      .catch((error) => {
        this.setState({
          getFeedBack: false,
          buttonResponse: [],
          ratingResponse: "",
          feedBackTextResponse: "",
          activeItem: "",
          rating: "",
          inputValue: ""
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
            <div>{this.props.t("Productdetails._ErrorAdding")}</div>
          </div>
        );
      });
  };
  moreInfoView = (data) => {
    this.state.orders.filter(x => (x._id == data._id)).map(z => {
      if (z._id == data._id) {
        let orderdetails = {};
        orderdetails[data._id] = !this.state.orderdetails[data._id];
        this.setState({
          orderdetails,
          moreViewid: data._id,
        })
      }
    })
  }
  moreSaleInfoView = (data) => {
    this.state.sales.filter(x => (x._id == data._id)).map(z => {
      if (z._id == data._id) {
        let saledetails = {};
        saledetails[data._id] = !this.state.saledetails[data._id];
        this.setState({
          saledetails,
          moreSaleViewid: data._id,
        })
      }
    })
  }

  shipPopup = (id) => {
    const { shipPopupIsOpen } = this.state;
    this.setState({
      shipPopupIsOpen: !shipPopupIsOpen,
      orderId: id
    })
  }
  payout = () => {
    const { payoutIsOpen } = this.state;
    this.setState({
      payoutIsOpen: !payoutIsOpen,
      documentImage:"",
      documentAdditionalImage: "",
    })
  }
  isValidated_paypal() {
    let self = this;
    var error = {}, flag;
    if ((this.state.paypal_email === '')) {
      error.paypal_email =  this.props.t("Productdetails._getEmail")
    }else if(!(REGEX.test(this.state.paypal_email))){
      error.paypal_email = this.props.t("Editprofile._emailValid")
    }else {
      error.paypal_email = ''
    }
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find((obj) => {
      if (error[obj]) return true;
      return false;
    });
    if (flag) {
      return false;
    }
    return true;
  }


   isValidated_payout() {
     var error = {}, flag;
      if ((this.state.country === '' || this.state.country === "empty")) {
          error.country = this.props.t("Editprofile._countryCtn")
        }else {
          error.country = ""
        }

        if (this.state.address1 === '') {
          error.address1 = this.props.t("Editprofile._addressCtn")
        } else {
          error.address1 = ""
        }

        if (this.state.city === '') {
          error.city = this.props.t("Editprofile._cityCtn")
        }else {
          error.city = ""
        }

         if (this.state.postal_code === '') {
          error.postal_code = this.props.t("Editprofile._postalcodeCtn")
        }else {
          error.postal_code = ""
        }

        if (this.state.phone_number === '') {
          error.phone_number = this.props.t("orderViewPage._PhoneNumberErrorCtn")
        }else {
          error.phone_number = ""
        }

        if (this.state.state === '') {
          error.state = this.props.t("Editprofile._stateAddress")
        }else {
          error.state = ""
        }

        if (this.state.DOB === '') {
          error.DOB = this.props.t("Editprofile._dobRequired")
        }else {
          error.DOB = ""
        }

        this.setState({
          errors: error
        });
        flag = Object.keys(error).find((obj) => {
          if (error[obj]) return true;
          return false;
        });
        if (flag) {
          return false;
        }
        return true;
      }

  isValidated() {
    let self = this;
    var error = {}, flag;
    if (this.state.shippmentDate === '') {
      error.shippmentDate = this.props.t("Editprofile._ShippingDateCtn")
    }else {
      error.shippmentDate = ''
    }

    if (this.state.shippmentMethod === '') {
      error.shippmentMethod = this.props.t("Editprofile._ShipmentMethodCtn")

    }else {
      error.shippmentMethod = ''

    }

    if (this.state.shippementService === '') {
      error.shippementService = this.props.t("Editprofile._ShippingServiceCtn")

    }else {
      error.shippementService = ''

    }

    if (this.state.trackingId === '') {
      error.trackingId = this.props.t("Editprofile._TrackingIdCtn")

    }else {
      error.trackingId = ''
    }

    this.setState({
      errors: error
    });
    flag = Object.keys(error).find((obj) => {
      if (error[obj]) return true;
      return false;
    });
    if (flag) {
      return false;
    }
    return true;
  }

  isValidate_Stripe(){
    let {t} = this.props;
    let self = this;
    var error = {}, flag;
    let {AddressData} = this.state

    if (this.state.stripeCountry === '' || this.state.stripeCountry === "empty") {
      error.stripeCountry = this.props.t("Editprofile._countryCtn")
    }else {
      error.stripeCountry = ''
    }

    if (this.state.currency_code === '' || this.state.currency_code === "empty") {
      error.currency_code = this.props.t("Editprofile._currencyReq")
    }else {
      error.currency_code = ''
    }
    if (!this.state.documentImage) {
      error.documentImage = this.props.t("Editprofile._docRequired")
    } else {
      error.documentImage = "";
    }
    if(!this.state.documentAdditionalImage){
      error.documentAdditionalImage = this.props.t("Editprofile._docRequired")
    }else {
      error.documentAdditionalImage = "";
    }
    if(this.state.shortCode == "JP"){
      if (this.state.kanji_address === '' || this.state.kanji_address === "empty") {
        error.kanji_address = this.props.t("Editprofile._addressCtn")
      }else {
        error.kanji_address = ''
      }


      if (this.state.kanji_city === '' || this.state.kanji_city === "empty") {
        error.kanji_city = this.props.t("Editprofile._cityCtn")
      }else {
        error.kanji_city = ''
      }

      if (this.state.kanji_state === '' || this.state.kanji_state === "empty") {
        error.kanji_state =  this.props.t("Editprofile._stateAddress")
      }else {
        error.kanji_state = ''
      }

      if (this.state.kanji_postal_code === '' || this.state.kanji_postal_code === "empty") {
        error.kanji_postal_code = this.props.t("Editprofile._postalcodeCtn")
      }else {
        error.kanji_postal_code = ''
      }

      if(this.state.gender === "" || this.state.gender === "empty"){
        error.gender =  this.props.t("Editprofile._genderRequired")
      }else{
        error.gender = ''
      }
    }

    if(AddressData){
          for(var key in AddressData) {
               if(!AddressData[key]){
                  error[key] = t("Homepageheader._FieldIsRequired")
                 }else{
                   error[key] = ""
                 }
            }
      }

      this.setState({
        errors: error
      });
      flag = Object.keys(error).find((obj) => {
        if (error[obj]) return true;
        return false;
      });
      if (flag) {
        return false;
      }
      return true;
  }
  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.isValidated()) {
      this.submitShippedDetails();
    }
  };
  payoutFormSubmit = (e) => {
    e.preventDefault();
    if (this.isValidated_payout()) {
      this.payoutAddDetails();
    }
  };
  paypalSubmit = (e) => {
    e.preventDefault();
    if (this.isValidated_paypal()) {
      this.stripePaymentMethodSubmit();
    }
  };
  // paypalAddDetails  = () => {
  //   var paypal = {
  //     paypal_email: this.state.paypal_email
  //   }

  // }
  payoutAddDetails  = () => {
    const { choosepayIsOpen , payoutIsOpen} = this.state;
    this.setState({
      payoutIsOpen: !payoutIsOpen,
      choosepayIsOpen: !choosepayIsOpen      
      // addressObject: {},
      // AddressData: {}
    })
  }
  submitShippedDetails = async () => {
    let { getUser } = this.props;
    var data = {
      shippmentDate: this.state.shippmentDate,
      shippmentMethod: this.state.shippmentMethod,
      shippementService: this.state.shippementService,
      trackingId: this.state.trackingId,
      notes: this.state.notes
    }
    if (this.state.orderId) {
      this.props.updateShippingDetails({
        variables: {
          id: this.state.orderId,
          data: data
        },
      }).then(({data}) => {
        if(data){
        this.props.updateOrderStatus({
          variables: {
            status: "SHIPPED",
            id: this.state.orderId
          }
        })
          .then(({ data }) => {
            this.closeModal();
            if (data && data.updateOrderStatus) {
              getUser.refetch({ id: Number(this.state.cUser.id) }).then(({ data }) => {
                if (data && data.getUserDetails) {
                  this.setState({
                    foundUser: data.getUserDetails.foundUser,
                    ForSale: data.getUserDetails.ForSale,
                    SoldOut: data.getUserDetails.SoldOut,
                    favourites: data.getUserDetails.favourites,
                    reviews: data.getUserDetails.review,
                    orders: data.getUserDetails.myOrders,
                    sales: data.getUserDetails.mySales
                  });
                }
              });
    
            }
          }).catch(error =>{
           let errorMessage =  error.graphQLErrors.map((x) => x.message)
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
              <div>{errorMessage[0]}</div>
            </div>
          );
          this.closeModal();
        })
        }
      }).catch(error => {
        let errorMessage =  error.graphQLErrors.map((x) => x.message)
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
              <div>{errorMessage[0]}</div>
            </div>
          );
          this.closeModal();
      })
    }
  }

  handleChange = (event) => {
    let name = event.target.name;
    if (name === "shippmentDate" || name === "shippmentMethod" || name === "shippementService" ||  name === "notes")  {
      this.setState({
        // ...this.state.addressData,
        [name]: event.target.value,
      });
    }
    if(name === "trackingId"){
      // event.target.value.replace(/[^0-9]/g, "")
      this.setState({
        [name]: (event.target.value).trim(" ")
      })
    }
  };
  handleChangePayout = (event,name) => {
      this.setState({
        addressObject:{
          ...this.state.addressObject,
          [name]: event.target.value,
        },
        [name]: event.target.value,
      });
  };

  paypalhandleChange = (event) => {
    let name = event.target.name;
      this.setState({
        AddressData:{
          ...this.state.AddressData,
          [name] : event.target.value
        },
        [name]: event.target.value,
        accountCreationDisable: false
      });

  };

  cancelModal = (id, status) => {
    const { cancelIsOpen } = this.state;
    this.setState({ cancelIsOpen: !cancelIsOpen, cancelledId: id, orderStatus: status })
  }
  showPopup = (id, status) => {
    let { getUser } = this.props;
    this.props.updateOrderStatus({
      variables: {
        status: status,
        id: id
      }
    })
      .then(({ data }) => {
        if (data && data.updateOrderStatus) {
          getUser.refetch({ id: Number(this.state.cUser.id) }).then(({ data }) => {
            if (data && data.getUserDetails) {
              this.setState({
                foundUser: data.getUserDetails.foundUser,
                ForSale: data.getUserDetails.ForSale,
                SoldOut: data.getUserDetails.SoldOut,
                favourites: data.getUserDetails.favourites,
                reviews: data.getUserDetails.review,
                orders: data.getUserDetails.myOrders,
                sales: data.getUserDetails.mySales,
              });
            }
          })

        }
      }).catch(error =>{
        let errorMessage =  error.graphQLErrors.map((x) => x.message)
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
           <div>{errorMessage[0]}</div>
         </div>
       );
      })
  }
  cancelPopup = (id, status, cancelReason) => {
    let { getUser } = this.props;
   // if(cancelReason.length > 0 && cancelReason.replace(/\s/g,"") !== "") {
      this.props.updateOrderStatus({
        variables: {
          status: status,
          id: id,
          cancelReason: cancelReason
        }
      })
      .then(({ data }) => {
          if (data && data.updateOrderStatus) {
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
                <div>{this.props.t("Productdetails._cancelledSuccess")}</div>
              </div>
            );
            getUser.refetch({ id: Number(this.state.cUser.id) }).then(({ data }) => {
              if (data && data.getUserDetails) {
                this.setState({
                  foundUser: data.getUserDetails.foundUser,
                  ForSale: data.getUserDetails.ForSale,
                  SoldOut: data.getUserDetails.SoldOut,
                  favourites: data.getUserDetails.favourites,
                  reviews: data.getUserDetails.review,
                  orders: data.getUserDetails.myOrders,
                  sales: data.getUserDetails.mySales,
                  cancelIsOpen: false,
                  cancelReasonError : false,
                  cancelReasonValue: "",
                  cancelReason:""
                });
              }
            });
          }
      }).catch(error => {
        let errorMessage =  error.graphQLErrors.map((x) => x.message)
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
           <div>{errorMessage[0]}</div>
         </div>
       );
        this.setState({
          cancelIsOpen: false,
          cancelReasonError : false,
          cancelReasonValue: "",
          cancelReason:""
        });
      })
  }
  popClick = (data) => {
    this.setState({
      clickedButton : data
    })
  }

  popOpen  = (data) => {
    const { paypalIsOpen , stripeIsOpen,choosepayIsOpen } = this.state;
    if (data == "Paypal") {
       this.setState({ paypalIsOpen: !paypalIsOpen , choosepayIsOpen: !choosepayIsOpen})
    }else if(data == "Stripe"){
      this.setState({ stripeIsOpen: !stripeIsOpen , choosepayIsOpen: !choosepayIsOpen})
    }
  }

  countryChange = (e) => {
    if(e.target.value !== "empty"){
      let countryData = getPayoutCountries.filter(x => x.shortCode ==  e.target.value).map(z => {
        return z
      })
      const res = countryData[0].InputarrayData.reduce((a,b)=> (a[b]='',a),{});
      let recentData  = {
        ...res,
        currency_code: "",
        stripeCountry : countryData[0].shortCode
      }

      this.setState({
        AddressData: recentData,
        currency_code: "",
        shortCode : e.target.value,
        stripeCountry : countryData[0].shortCode,
        values:res
      })
    }
  }

  currencyChange = (e) => {
    if(e.target.value !== "empty"){
      // let countryData = getPayoutCountries.filter(x => x.shortCode ==  e.target.value).map(z => {
      //   return z
      // })
      this.setState({
        AddressData:{
          ...this.state.AddressData,
          currency_code: e.target.value
        },
        currency_code : e.target.value,
        shortCode:this.state.shortCode
      })
    }
  }
  stripeAddressChanges = (e,z) => {
    this.setState({
      AddressData:{
        ...this.state.AddressData,
        [z] : e.target.value
      }
    })
  }

  stripeSubmit = () => {
    if (this.isValidate_Stripe()) {
      this.stripePaymentMethodSubmit();
    }
  }

  stripePaymentMethodSubmit = () => {
    let {addPayOutMethod,match,getUser} = this.props;
    let userId = match.params.id;
    var sendVariables;
    this.setState({
        accountCreationDisable : true,
        preLoadr: true
    })
    if(this.state.clickedButton === "Stripe"){
      if(this.state.shortCode == "JP"){
        sendVariables = {
          data:{
            ...this.state.addressObject,
            ...this.state.AddressData,
            type: this.state.clickedButton,
            gender: this.state.gender,
            DOB: this.state.DOB,
            documentImage: this.state.documentImage,
            documentAdditionalImage: this.state.documentAdditionalImage,
            kanji:{
              address1: this.state.kanji_address,
              address2: this.state.kanji_address2,
              city: this.state.kanji_city,
              state: this.state.kanji_state,
              postal_code: this.state.kanji_postal_code,
              country: this.state.country
            }
          }
        }
      }else{
        sendVariables = {
          data:{
            ...this.state.addressObject,
            ...this.state.AddressData,          
            type: this.state.clickedButton,
            DOB: this.state.DOB,
            documentImage: this.state.documentImage,
            documentAdditionalImage: this.state.documentAdditionalImage
          }
        }
      }
    }else if(this.state.clickedButton === "Paypal"){
      sendVariables = {
        data:{
          ...this.state.addressObject,
          ...this.state.AddressData,
          type: this.state.clickedButton,
          DOB: this.state.DOB
        }
      }
    }

    addPayOutMethod({
      variables: sendVariables
    })
    .then(async ({ data }) => {
        if(data && data.addPayOutMethod === "true"){
          getUser.refetch({ id: Number(userId) }).then(({ data }) => {
          if (data && data.getUserDetails) {
            this.setState({
              foundUser: data.getUserDetails.foundUser,
              ForSale: data.getUserDetails.ForSale,
              SoldOut: data.getUserDetails.SoldOut,
              favourites: data.getUserDetails.favourites,
              reviews: data.getUserDetails.review,
              orders: data.getUserDetails.myOrders,
              sales: data.getUserDetails.mySales,
              paypalIsOpen: false,
              stripeIsOpen: false,
              accountCreationDisable: false,
              preLoadr: true
            });
          }
      });
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
              <div>{this.props.t("Productdetails._payOutMethodSuccess")}</div>
            </div>
          );
          console.log(this.state.AddressData,this.state.accountCreationDisable,"succuss")

          this.setState({ 
            addressObject: {},AddressData: {},  country:"",address1:"",address2:"",addresszone:"",city:"",state:"",gender:"",postal_code:"",
            phone_number:"",DOB: "",selectedDate: "",currency_code: "", accountCreationDisable : false
          });
        }else{
          // this.setState({
          //   paypalIsOpen: false,
          //   //stripeIsOpen: false
          // })
          var message = data && data.addPayOutMethod
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
              <div>{message}</div>
            </div>
          );
          console.log(this.state.AddressData,this.state.accountCreationDisable,"failure")
          this.setState({ 
            preLoadr: false,accountCreationDisable : false
          })
        }
      });      
  }

  payoutMethodDelete = (e,id) => {
      let {deletePayOutMethod,match,getUser} = this.props;
      let userId = match.params.id;
      deletePayOutMethod({
        variables: { id : id },
        //refetchQueries: [{ query: GET_USER, variables: { id: Number(userId)}}]
      })
      .then(async ({ data }) => {
          if(data && data.deletePayOutMethod === true){
            getUser.refetch({ id: Number(userId) }).then(({ data }) => {
              if (data && data.getUserDetails) {
                this.setState({
                  foundUser: data.getUserDetails.foundUser,
                  ForSale: data.getUserDetails.ForSale,
                  SoldOut: data.getUserDetails.SoldOut,
                  favourites: data.getUserDetails.favourites,
                  reviews: data.getUserDetails.review,
                  orders: data.getUserDetails.myOrders,
                  sales: data.getUserDetails.mySales,
                  paypalIsOpen: false,
                  stripeIsOpen: false
                });
              }
            });
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
                <div>{this.props.t("Productdetails._payOutMethodDeleteSuccess")}</div>
              </div>
            );
          }else{
            this.setState({
              paypalIsOpen: false,
              stripeIsOpen: false
            })
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
                <div>{this.props.t("Productdetails._payOutMethodFailed")}</div>
              </div>
            );
          }
        });

  }

  payoutDefault = (e,id) => {
    let {setDefaultPayout,match,getUser} = this.props;
    let userId = match.params.id;
    setDefaultPayout({
      variables: { id : id }
    })
    .then(async ({ data }) => {
        if(data && data.setDefaultPayout === true){
          getUser.refetch({ id: Number(userId) }).then(({ data }) => {
            if (data && data.getUserDetails) {
              this.setState({
                foundUser: data.getUserDetails.foundUser,
                ForSale: data.getUserDetails.ForSale,
                SoldOut: data.getUserDetails.SoldOut,
                favourites: data.getUserDetails.favourites,
                reviews: data.getUserDetails.review,
                orders: data.getUserDetails.myOrders,
                sales: data.getUserDetails.mySales
              });
            }
          });
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
            <div>{this.props.t("Productdetails._DefaultPayout")}</div>
            </div>
          );
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
              <div>{this.props.t("Productdetails._payOutMethodFailed")}</div>
            </div>
          );
        }
      });

  }

  handleKanjiData = (event,name) => {
      this.setState({
          [name]: event.target.value
      });
  }

  handleDateChange = (date,d) => {
    this.setState({selectedDate: date , DOB:d});
  }

  handleShippmentDateChange = (date,d) => {
    this.setState({selectedShippmentDate: date , shippmentDate:d});
  }

  genderChange = (event) => {
    this.setState({
      gender: event.target.value
    })
  }

  handleUpload(type, file, err) {
    if(type === "documentImage"){
      if (err === "invalid") {
        this.setState({
          documentImage: file,
          errors: Object.assign({}, this.state.errors, {
            "documentImage" : this.props.t("Editprofile._validDocument")
          })
        });
      } else {
        this.setState({
          documentImage: file,
          errors: Object.assign({}, this.state.errors, { "documentImage": "" }),
        });
      }
    }else if(type === "documentAdditionalImage"){
      if (err === "invalid") {
        this.setState({
          documentAdditionalImage: file,
          errors: Object.assign({}, this.state.errors, {
            "documentAdditionalImage": this.props.t("Editprofile._validDocument")
          })
        });
      } else {
        this.setState({
          documentAdditionalImage: file,
          errors: Object.assign({}, this.state.errors, { "documentAdditionalImage": "" }),
        });
      }
    }
  
   }


   resendEmail = () => {
     let {ResendverifyEmailLink} = this.props;
     ResendverifyEmailLink({}).then(({data}) => {
            if(data.ResendverifyEmailLink){
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
                  <div>{this.props.t("Productdetails._ResendEmail")}</div>
                </div>
              );
            }
      }).catch(e => {
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
            <div>{this.props.t("Productdetails._ErrorSomething")}</div>
          </div>
        );
      })
   }

   buyNowReview = (reviewData) => {
      this.setState({
          UserReviewPop : true,
          reviewExpInfo : reviewData
      })

      this.props.getReview
      .refetch({})
      .then(({ data }) => {
        if (data) {
          const pButton = data.getReview.feedBack.primaryLevel;
          const sButton = data.getReview.feedBack.secondaryLevel;
          this.setState({
            primaryButton: pButton,
            secondaryButton: sButton
          });
        }
      });
   }


   handleImageFile = async (type, file, err) => {
    let { values, errors } = this.state;
    let id = this.props.match.params.id;
    if (type === "profileImage") {
      if (err === "invalid") {
        errors.profileImage = "Please upload the images like JPG,JPEG,PNG File Only and Image Must be less than 5mb";
        this.setState({
          profileImage: "",
          errors
        })
      } else {
        if (file && file.name) {
          values.profileImage = file;
          if(id){
            this.setState({
              editData: Object.assign({}, { id: Number(id) }, this.state.editData, {
                profileImage : file
              }),
              values
            });
          }

        }

        // let fieldName = "image";
        // this.validate({ values, fieldName });
      }
    }

  }

   render() {
    const { classes, match, history, t } = this.props;
    const id = match.params.id;
    const timestamp = Date.now();
    const {
      showScroll,
      email,
      userName,
      foundUser,
      ForSale,
      SoldOut,
      favourites,
      reviews,
      orders,
      sales,
      imagePreviewUrl,
      editData,
      newPassword,
      password,
      oldPassword,
      profileImage,
      HQimageError,
      errors,
      passwordError,
      popUpDetailsPassWord,
      profileEditData,
      rating,
      orderdetails,
      saledetails,
      value,
      markprocess,
      cancelIsOpen,
      shipPopupIsOpen,
      payoutIsOpen,
      choosepayIsOpen,
      paypalIsOpen,
      stripeIsOpen,
      cancelledId,
      orderStatus,
      countryData,
      AddressData,
      stripeCountry,
      values,
      selectedDate,
      selectedShippmentDate,
      DOB,
      cancelStatus,
      documentImage,
      googleAd,
      googleAdSenseId,
      editProfilePageSlotId,
      accountCreationDisable,
      documentAdditionalImage,
      preLoadr
    } = this.state;


    const variables = id
      ? profileEditData
      : {
           email,
           userName,
           profileImage: values.profileImage
        };

    const variables1 = id
      ? editData
      : {
            password,
            newPassword
        };
    // let $imagePreview = null;
    // if (imagePreviewUrl) {
    //   $imagePreview = imagePreviewUrl;
    // } else {
    //   $imagePreview = foundUser.profileImage;
    // }

    const findTimeStamp = (d, t, lang) => {
      return dateAdd(d, t, lang);
    };
    var buttonName;
    const today = new Date().toISOString().split("T")[0];
    return (
      <div id="content">
        <EditProfileMain>
          <div className="nn_edit_profile">
            <div className="container-fluid">
              <div className="wrapper-edit nn_wrapperedit">
                <div>
                  {/* <Query query={GET_USER} variables={{ id: Number(id) }}>
                    {({ data, loading, error }) => {
                      if (loading) return <div></div>;
                      if (error) return <div>error...</div>;
                      const userUnique = data.getUserDetails.foundUser;

                      const productUnique = data.getUserDetails.ForSale;

                      const soldUnique = data.getUserDetails.SoldOut;

                      const favUnique = data.getUserDetails.Favourites;
                      return ( */}

                  <div>
                    {/* <div className="googleadpr 123">
                      <img src={prgd1} className="img-fluid" />
                    </div> */}
                    <div className="float-left rightPart">
                      <EditProfileModal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Example Modal"
                      >
                        <div className="rm-space">
                          <div className="nn_modal_header1">
                            <div className="nn_share_ctn">
                              <button
                                onClick={this.closeModal}
                                type="button"
                                className="nn_close_btn"
                                data-dismiss="modal"
                              >
                                <CloseIcon className="nn_close_icon"/>
                              </button>
                            </div>
                          </div>

                          <div className="modal-body">
                            <div className="row">
                              <div className="col-sm-12 ">
                                <nav>
                                  <div
                                    className="nav nav-tabs nav-fill"
                                    id="nav-tab"
                                    role="tablist"
                                  >
                                    <a
                                      className="nav-item nav-link active"
                                      id="nav-home-tab"
                                      data-toggle="tab"
                                      href="#nav-home1"
                                      role="tab"
                                      aria-controls="nav-home"
                                      aria-selected="true"
                                    >
                                      {t("Editprofile._Profile")}
                                    </a>
                                    <a
                                      className="nav-item nav-link"
                                      id="nav-profile-tab"
                                      data-toggle="tab"
                                      href="#nav-profile1"
                                      role="tab"
                                      aria-controls="nav-profile"
                                      aria-selected="false"
                                    >
                                      {t("Editprofile._Password")}
                                    </a>
                                  </div>
                                </nav>
                                <div
                                  className="tab-content overall-mg"
                                  id="nav-tabContent"
                                >
                                  <div
                                    className="tab-pane fade show active"
                                    id="nav-home1"
                                    role="tabpanel"
                                    aria-labelledby="nav-home-tab"
                                  >
                                    <div className="rtlrvw">
                                      <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                          <Mutation
                                            mutation={id ? EDIT_USER : ""}
                                            variables={variables}
                                          >
                                            {(
                                              userAction,
                                              { data, loading, error }
                                            ) => {
                                              return (
                                                <form
                                                  onSubmit={(event) =>
                                                    this.handleSubmit(
                                                      event,
                                                      userAction,
                                                      history
                                                    )
                                                  }
                                                >
                                                  <GridContainer>
                                                    <div className="imageUpload">
                                                      <div className="jqNCys ">
                                                        {/* <div
                                                          className="avatar"
                                                          style={{
                                                            backgroundImage: `url(${$imagePreview})`
                                                          }}
                                                        >
                                                          {" "}
                                                        </div> */}
                                                        <ImageUpload
                                                          mode={"edit"}
                                                          name="profileImage"
                                                          imageUrl={(profileImage)}
                                                          handleSubmit={(f, e) => this.handleImageFile("profileImage", f, e)}
                                                        />

                                                      </div>
                                                      <div className="kVtcKR ">
                                                        <span>
                                                          {t(
                                                            "Editprofile._TabPhoto"
                                                          )}
                                                        </span>
                                                        <span>
                                                          {" "}
                                                          {t(
                                                            "Editprofile._imagesPNG"
                                                          )}
                                                        </span>
                                                      </div>
                                                      {/* <input
                                                        accept=".png, .jpg, .jpeg"
                                                        className="fileInput"
                                                        id="filetype"
                                                        type="file"
                                                        ref={this.fileInput}
                                                        onChange={(event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "profileImage"
                                                          )
                                                        }
                                                      /> */}

                                                    </div>
                                                    {HQimageError ? (
                                                      <small
                                                        style={{ color: "red" }}
                                                      >
                                                        {t(
                                                          "Editprofile._invalidImages"
                                                        )}
                                                      </small>
                                                    ) : (
                                                        ""
                                                      )}
                                                    <div className="nn_fullname">
                                                    <CustomInput
                                                      error={!!errors.userName}
                                                      success={
                                                        !!errors.userName
                                                      }
                                                      helpText={errors.userName}
                                                      labelText={t(
                                                        "Editprofile._FullName"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment
                                                            position="start"
                                                            className={
                                                              classes.inputAdornmentIcon +
                                                              " " +
                                                              "sdasdasd"
                                                            }
                                                          >
                                                            <Face
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            />
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "userName"
                                                          ),
                                                        onKeyDown: event =>
                                                          this.preventSpace(
                                                            event,"userName"
                                                          ),       
                                                        autoComplete: "off",
                                                        value: userName
                                                      }}
                                                    />
                                                    </div>
                                                    <div className="nn_password">
                                                    <CustomInput
                                                      error={!!errors.email}
                                                      success={!!errors.email}
                                                      helpText={errors.email}
                                                      labelText={t(
                                                        "Editprofile._Email"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment
                                                            position="start"
                                                            className={
                                                              classes.inputAdornmentIcon +
                                                              " " +
                                                              "sdasdasd"
                                                            }
                                                          >
                                                            <Email
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Email>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "email"
                                                          ),
                                                        onKeyDown: event =>
                                                          this.preventSpace(
                                                            event,"email"
                                                          ),
                                                        autoComplete: "email",
                                                        value: email
                                                      }}
                                                    />
                                                    </div>
                                                  </GridContainer>
                                                  <div className="sav_chang">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-danger btn-block"
                                                      onClick={e =>
                                                        this.handleData(
                                                          editData
                                                        )
                                                      }
                                                    >
                                                      {t(
                                                        "Editprofile._SaveChanges"
                                                      )}
                                                    </button>
                                                  </div>
                                                  <div className="log_out">
                                                    <span
                                                      className="curpnt"
                                                      data-dismiss="modal"
                                                      onClick={e =>
                                                        this.redirect(e)
                                                      }
                                                    >
                                                      {" "}
                                                      {t("Editprofile._Logout")}
                                                    </span>
                                                  </div>
                                                </form>
                                              );
                                            }}
                                          </Mutation>
                                        </GridItem>
                                      </GridContainer>
                                    </div>
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id="nav-profile1"
                                    role="tabpanel"
                                    aria-labelledby="nav-profile-tab"
                                  >
                                    <div className="rtlrvw passwordtab">
                                      <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                          <Mutation
                                            mutation={id ? EDIT_USER : ""}
                                            variables={variables1}
                                          >
                                            {(
                                              userAction,
                                              { data, loading, error }
                                            ) => {
                                              return (
                                                <form
                                                  onSubmit={(event) =>
                                                    this.onSubmit(
                                                      event,
                                                      userAction,
                                                      history
                                                    )
                                                  }
                                                >
                                                  <GridContainer>
                                                    {/* { popUpDetailsPassWord.length ? <small style={{ color: "red" }}>{popUpDetailsPassWord[0]}</small> : ""} */}
                                                    <div  className="nn_password">
                                                    <CustomInput
                                                      error={
                                                        passwordError.oldPassword ||
                                                        popUpDetailsPassWord[0] ===
                                                        "Invalid password"
                                                      }
                                                      success={
                                                        !!errors.password
                                                      }
                                                      helpText={` ${passwordError.oldPassword
                                                        } ${popUpDetailsPassWord[0] ===
                                                          "Invalid password"
                                                          ? "Current password is Wrong"
                                                          : ""
                                                        }`}
                                                      labelText={t(
                                                        "Editprofile._Currentpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "oldPassword"
                                                          ),
                                                        onKeyDown: event =>
                                                          this.preventSpace(
                                                            event,"password"
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: oldPassword
                                                      }}
                                                    />
                                                    </div>
                                                    {/* {id ?<FormHelperText>
                                                  please fill your current Password for verification
                                                         </FormHelperText> : ''} */}
                                                    <div  className="nn_password">
                                                    <CustomInput
                                                      error={
                                                        passwordError.newPassword
                                                      }
                                                      helpText={
                                                        passwordError.newPassword
                                                      }
                                                      labelText={t(
                                                        "Editprofile._Newpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "newPassword"
                                                          ),
                                                        onKeyDown: (event) =>
                                                          this.preventSpace(
                                                            event,"password"
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: newPassword
                                                      }}
                                                    />
                                                    </div>
                                                    <div  className="nn_password">
                                                    <CustomInput
                                                      error={
                                                        passwordError.password
                                                      }
                                                      helpText={
                                                        passwordError.password
                                                      }
                                                      labelText={t(
                                                        "Editprofile._Confirmpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "password"
                                                          ),
                                                        onKeyDown: (event) =>
                                                          this.preventSpace(
                                                            event,"password"
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: password
                                                      }}
                                                    />
                                                    </div>
                                                  </GridContainer>

                                                  <div className="sav_chang">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-danger btn-block"
                                                    // onClick={
                                                    //   this.passwordValidate
                                                    // }
                                                    >
                                                      {t(
                                                        "Editprofile._SaveChanges"
                                                      )}
                                                    </button>
                                                  </div>
                                                  <div className="log_out">
                                                    <span
                                                      className="curpnt"
                                                      data-dismiss="modal"
                                                      onClick={e =>
                                                        this.redirect(e)
                                                      }
                                                    >
                                                      {" "}
                                                      {t("Editprofile._Logout")}
                                                    </span>
                                                  </div>
                                                </form>
                                              );
                                            }}
                                          </Mutation>
                                        </GridItem>
                                      </GridContainer>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </EditProfileModal>
                    </div>
                    <div className="float-left rightPart">
                      <DiscardPopup
                        isOpen={cancelIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        style={customStyles1}
                      >
                        <div className="rm-space">
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._Confirm")}</p>
                          </div>
                          <div className="modal-body">
                            <div className="nn_cancel_order">
                              <p>{t("Editprofile._CancelContent")}</p>
                            </div>
                            <div>
                            <TextField
                              id="description"
                              multiline
                              rows="2"
                              //defaultValue="Default Value"
                              color="secondary"
                              className={classes.textField + " textArea1"}
                              inputProps={{
                                name: "description",
                                placeholder:this.props.t("Productdetails._reasonForCancel"),
                                onChange: e =>
                                  this.setState({
                                    cancelReasonValue : e.target.value
                                  }),
                                value: this.state.cancelReasonValue,
                                autoComplete: "off",
                                className: "nn_close_input"
                              }}
                            />
                            {/* <Input
                              defaultValue={this.state.cancelReasonValue}

                              fullWidth
                              inputProps={{

                              }}
                            /> */}
                            </div>
                            {/* {this.state.cancelReasonError && <span style={{color:"red"}}>{t("Productdetails._reasonRequired")}</span>} */}
                            <div className="nn_discard_btn">
                              <button className="btn1" onClick={() => this.cancelPopup(cancelledId, orderStatus , this.state.cancelReasonValue)}> {t("Editprofile._Ok")}</button>
                              <button
                                onClick={this.closeModal}
                                type="button"
                                className="btn2"
                                data-dismiss="modal"
                              > {t("Editprofile._Cancel")}</button>
                            </div>
                          </div>
                        </div>
                      </DiscardPopup>
                    </div>
                    <div className="float-left rightPart">
                      <ShipmentPopup
                        isOpen={shipPopupIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        style={customStyles}
                      >
                        <div className="rm-space">
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._ShippingDetails")}</p>
                            <button
                              onClick={this.closeModal}
                              type="button"
                              className="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={this.handleFormSubmit}>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._ShippingDate")}:<span className="validatcolor">*</span></label>
                                <DatePicker
                                 placeholderText={t("Editprofile._shipdate_placeHolder")}
                                  selected={selectedShippmentDate}
                                  minDate={new Date()}
                                  onChange={date => this.handleShippmentDateChange(date,date.toLocaleDateString("en","MM/DD/YYYY"))}
                                  className="nn_input"
                                />
                                {/* <input type="date"
                                  onChange={(e) => this.handleChange(e)}
                                  value={this.state.shippmentDate}
                                  //error={this.state.shippmentDateError}
                                  name="shippmentDate"
                                  className="nn_input"
                                  id="hidecurrentdate"
                                  min={today}
                                /> */}
                              </div>
                              <div className="nn_error_text">{this.state.shippmentDate === "" ? (<small style={{ color: "red" }}>
                                {errors.shippmentDate}
                              </small>) : ("")}</div>

                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._ShipmentMethod")}:<span className="validatcolor">*</span></label>
                                <input
                                  type="text"
                                  value={this.state.shippmentMethod}
                                  onChange={(e) => this.handleChange(e)}
                                  //error={this.state.shippmentMethodError}
                                  name="shippmentMethod"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{this.state.shippmentMethod === "" ? (<small style={{ color: "red" }}>
                                {errors.shippmentMethod}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._ShippingService")}:<span className="validatcolor">*</span></label>
                                <input type="text"
                                  onChange={(e) => this.handleChange(e)}
                                  //error={this.state.shippementServiceError}
                                  name="shippementService"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{this.state.shippementService === "" ? (<small style={{ color: "red" }}>
                                {errors.shippementService}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._TrackingID")}:<span className="validatcolor">*</span></label>
                                <input
                                  value={this.state.trackingId}
                                  onChange={(e) => this.handleChange(e)}
                                  //error={this.  value={this.state.trackingId}state.trackingIdError}
                                  name="trackingId"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{this.state.trackingId === "" ? (<small style={{ color: "red" }}>
                                {errors.trackingId}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._AdditionalNotes")}:</label>
                                <textarea
                                  onChange={(e) => this.handleChange(e)}
                                  name="notes" rows="10" cols="5" className="nn_input" />
                                {/* <textarea name="shippingdate"/>                                                                 */}
                              </div>
                              <div class="my-3 text-center">
                                <button type="submit" class="btn btn_theme">{t("Editprofile._MarkShippedbtn")}</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </ShipmentPopup>
                     </div>
                     <div className="float-left rightPart">
                        <ShipmentPopup
                        isOpen={payoutIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        style={customStyles}
                      >
                        <div className="rm-space">
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._payoutMethod")}</p>
                            <button
                              onClick={this.closeModal}
                              type="button"
                              class="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={this.payoutFormSubmit}>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._country")}<span className="validatcolor">*</span>:</label>
                                <select
                                  value={this.state.country}
                                  onChange={(e) => this.handleChangePayout(e, "country")}
                                  className="nn_input"
                                >
                                <option value="empty">{t("orderViewPage._anycountry")}</option>
                                    {countryData &&
                                        countryData.map((item, index) => {
                                          return (
                                              <option
                                                key={index}
                                                value={item.shortName}
                                                name={"country"}
                                              >
                                                {item.longName}
                                              </option>
                                            );
                                        })}
                                </select>
                              </div>

                              <div className="nn_error_text">{ (this.state.country === "" || this.state.country === "empty") ? (<small style={{ color: "red" }}>
                                {errors.country}
                              </small>) : ("")}</div>

                              <div class="form-group nn_form_group">
                                {
                                this.state.country === "JP" ?
                                <label><b>{t("Editprofile._addressKana")}:</b></label> : ""
                                }
                              </div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._address")}<span className="validatcolor">*</span>:</label>
                                <input
                                  type="text"
                                  value={this.state.address1}
                                  onChange={(e) => this.handleChangePayout(e,"address1")}
                                  name="address1"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{ this.state.address1 === "" ? (<small style={{ color: "red" }}>
                                {errors.address1}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._address2")}:</label>
                                <input type="text"
                                  name="address2"
                                  className="nn_input"
                                  value={this.state.address2}
                                  onChange={(e) => this.handleChangePayout(e,"address2")}
                                />
                              </div>

                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._city")} <span className="validatcolor">*</span>:</label>
                                <input type="text"
                                  name="city"
                                  value={this.state.city}
                                 onChange={(e) => this.handleChangePayout(e,"city")}
                                 //error={this.state.cityError}
                                  className="nn_input"
                                />
                              </div>
                               <div className="nn_error_text">{ this.state.city === "" ? (<small style={{ color: "red" }}>
                                {errors.city}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._stateprovince")}<span className="validatcolor">*</span>:</label>
                                <input type="text"
                                  name="state"
                                  value={this.state.state}
                                 onChange={(e) => this.handleChangePayout(e,"state")}
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{ this.state.state === "" ? (<small style={{ color: "red" }}>
                                {errors.state}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._postalcode")}<span className="validatcolor">*</span>:</label>
                                <input type="text"
                                  value={this.state.postal_code}
                                  onChange={(e) => this.handleChangePayout(e,"postal_code")}
                                  //error={this.state.postalcodeError}
                                  name="postal_code"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{ this.state.postal_code === "" ? (<small style={{ color: "red" }}>
                                {errors.postal_code}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                <label>{t("orderViewPage._phone")}<span className="validatcolor">*</span>:</label>
                                <input type="text"
                                  value={this.state.phone_number}
                                  onChange={(e) => this.handleChangePayout(e,"phone_number")}
                                  //error={this.state.postalcodeError}
                                  name="phone_number"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{ this.state.phone_number === "" ? (<small style={{ color: "red" }}>
                                {errors.phone_number}
                              </small>) : ("")}</div>

                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._DateOfBirth")}<span className="validatcolor">*</span>:</label>
                                {/* <input type="date"
                                  onChange={(e) => this.handleChangePayout(e,"DOB")}
                                  value={this.state.DOB}
                                  //error={this.state.shippmentDateError}
                                  name="DOB"
                                  className="nn_input"
                                  id="hidecurrentdate"
                                  max={today}
                                /> */}
                                <DatePicker
                                  selected={selectedDate}
                                  placeholderText={t("Editprofile._DOB_placeHolder")}
                                  maxDate={new Date()}
                                  onChange={date => this.handleDateChange(date,date.toLocaleDateString("en","MM/DD/YYYY"))}
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{this.state.DOB === "" ? (<small style={{ color: "red" }}>
                                {errors.DOB}
                              </small>) : ("")}</div>


                              <div class="my-3 text-center">
                                <button   type="submit" class="btn btn_theme">{t("Editprofile._next")}</button>
                              </div>
                            </form>
                          </div>
                        </div>
                        </ShipmentPopup>

                      <div className="float-left rightPart">
                        <ShipmentPopup
                        isOpen={choosepayIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        className="cls_addpayout_table"
                      >

                        <div className="rm-space">
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._payoutMethod")}</p>
                            <button
                              onClick={this.closeModal}
                              type="button"
                              class="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <div>
                              <p>{t("Editprofile._payouttext1")}</p>
                              <p>{t("Editprofile._payouttext2")}</p>
                            </div>
                            <div className="table-responsive">
                            <table id="payout_method_descriptions" className="table table-striped">
                              <thead>
                                  <tr>
                                      <th></th>
                                      <th>{t("Editprofile._PayoutTab")}</th>
                                      <th>{t("Editprofile._processingtime")}</th>
                                      <th>{t("Editprofile._additionalfees")}</th>
                                      <th>{t("Editprofile._currency")}</th>
                                      <th>{t("Editprofile._details")}</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td>
                                          <input type="radio" value="PayPal" name="payout_method" className=""  onClick={() => this.popClick("Paypal")} />
                                      </td>
                                      <td className="type">
                                          <label for="payout_method">{t("Productdetails.Paypal")}</label>
                                      </td>
                                      <td>{t("Editprofile._businessday")}</td>
                                      <td>{t("Editprofile._none")}</td>
                                      <td>USD</td>
                                      <td>{t("Editprofile._payouttext3")}</td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <input type="radio" value="Stripe" name="payout_method" onClick={() => this.popClick("Stripe")}/>
                                      </td>
                                      <td className="type">
                                          <label for="payout_method">{t("Productdetails.Stripe")}</label>
                                      </td>
                                      <td>{t("Editprofile._businessday1")}</td>
                                      <td>{t("Editprofile._none")}</td>
                                      <td>USD</td>
                                      <td>{t("Editprofile._payouttext3")}</td>
                                  </tr>
                              </tbody>
                            </table>
                            </div>
                          </div>
                          <div className="modal-footer">
                              <button className="btn btn_theme" onClick={() => this.popOpen(this.state.clickedButton)}>{t("Editprofile._next")}</button>
                          </div>
                        </div>
                      </ShipmentPopup>
                                </div>
                      <div className="float-left rightPart">
                        <ShipmentPopup
                        isOpen={paypalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        style={customStyles11}
                      >

                        <div className="rm-space">
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._payoutMethod")}</p>
                            <button
                              onClick={this.closeModal}
                              type="button"
                              class="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <div>
                            <form onSubmit={(e) => this.paypalSubmit(e)}>
                              <div class="form-group nn_form_group">
                              <label>{t("Editprofile._enterPayoutEmail")}<span className="validatcolor"></span>:</label>
                                <input type="text"
                                  onChange={(e) => this.paypalhandleChange(e)}
                                  value={this.state.paypal_email}
                                  error={this.state.paypalError}
                                  name="paypal_email"
                                  className="nn_input"
                                />
                              </div>
                              <div className="nn_error_text">{((this.state.paypal_email == "") || !(REGEX.test(this.state.paypal_email))) ? (<small style={{ color: "red" }}>
                                {errors.paypal_email}
                              </small>) : ("")}</div>
                          <div className="modal-footer">
                              <button disabled={accountCreationDisable}  className="btn btn_theme">{t("Editprofile._SUBMIT")}</button>
                          </div>
                          </form>
                            </div>
                            </div>
                        </div>
                      </ShipmentPopup>
                      </div>
                      <div className="float-left rightPart">
                      <ShipmentPopup
                        isOpen={stripeIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Minimal Modal Example"
                        style={customStyles_new}
                      >


                        <div className="rm-space" style={{backgroundColor:'#fff'}}>
                          <div className="modal-header nn_modal_header">
                            <p>{t("Editprofile._payoutMethod")}</p>
                            <button
                              onClick={this.closeModal}
                              type="button"
                              class="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div className="modal-body">
                            <div>
                            <form>
                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._country")}<span className="validatcolor">*</span></label>
                                <select className="nn_input" onChange={(e) => this.countryChange(e)}>
                                <option value="empty">{t("orderViewPage._anycountry")}</option>
                                     {getPayoutCountries && getPayoutCountries.map((item, index) => {
                                          return (
                                              <option
                                                key={index}
                                                value={item.shortCode}
                                                name={item.name}
                                              >
                                                {item.name}
                                              </option>
                                            );
                                        })}
                                </select>
                              </div>
                              <div className="nn_error_text">{ ((this.state.stripeCountry === "") || (this.state.stripeCountry === "empty")) ? (<small style={{ color: "red" }}>
                                {errors.stripeCountry}
                              </small>) : ("")}</div>

                              <div class="form-group nn_form_group">
                                <label>{t("Editprofile._currency")}<span className="validatcolor">*</span></label>
                                <select className="nn_input" value={this.state.currency_code} onChange={(e) =>this.currencyChange(e)} >
                                      <option value="empty">{t("orderViewPage._anyCurrency")}</option>
                                      {
                                        getPayoutCountries && ( (getPayoutCountries.find((v) => {
                                          return v.shortCode == this.state.shortCode
                                        }) || {}).currency_code || []).map((z,i) =>{
                                          return  <option
                                                  key={i}
                                                  value={z}
                                                  name={"country"}
                                                  >
                                                  {z}
                                            </option>
                                          })
                                       }

                                </select>
                              </div>

                              <div className="nn_error_text">{ ((this.state.currency_code === "") || (this.state.currency_code === "empty")) ? (<small style={{ color: "red" }}>
                                {errors.currency_code}
                              </small>) : ("")}</div>

                              {
                                this.state.shortCode == "JP" ?
                                <>
                                <div class="form-group nn_form_group">
                                <label>{t("Editprofile._gender")}<span className="validatcolor">*</span></label>
                                <select className="nn_input" value={this.state.gender} onChange={(e) =>this.genderChange(e)} >
                                          <option name="empty">{t("Editprofile._selectGender")}</option>
                                          <option name="male" value="male"> {t("Editprofile._male")}</option>
                                          <option name="female" value="female">{t("Editprofile._female")}</option>
                                </select>
                              </div>

                              <div className="nn_error_text">{ ((this.state.gender === "") || (this.state.gender === "empty")) ? (<small style={{ color: "red" }}>
                                {errors.gender}
                              </small>) : ("")}</div>
                              <div class="form-group nn_form_group">
                                {
                                this.state.shortCode === "JP" ?
                                <label><b>{t("Editprofile._addressKanji")}:</b></label> : ""
                                }
                              </div>

                                <div class="form-group nn_form_group">
                                  <label>{t("Editprofile._address")}<span className="validatcolor">*</span>:</label>
                                  <input
                                    type="text"
                                    value={this.state.kanji_address}
                                    onChange={(e) => this.handleKanjiData(e,"kanji_address")}
                                    name="kanji_address"
                                    className="nn_input"
                                  />
                                </div>
                                <div className="nn_error_text">{ this.state.kanji_address === "" ? (<small style={{ color: "red" }}>
                                  {errors.kanji_address}
                                </small>) : ("")}</div>
                                <div class="form-group nn_form_group">
                                  <label>{t("Editprofile._address2")}:</label>
                                  <input type="text"
                                    name="kanji_address2"
                                    className="nn_input"
                                    value={this.state.kanji_address2}
                                    onChange={(e) => this.handleKanjiData(e,"kanji_address2")}
                                  />
                                </div>

                                <div class="form-group nn_form_group">
                                  <label>{t("Editprofile._city")}<span className="validatcolor">*</span>:</label>
                                  <input type="text"
                                    name="kanji_city"
                                    value={this.state.kanji_city}
                                   onChange={(e) => this.handleKanjiData(e,"kanji_city")}
                                   //error={this.state.cityError}
                                    className="nn_input"
                                  />
                                </div>
                                 <div className="nn_error_text">{ this.state.kanji_city === "" ? (<small style={{ color: "red" }}>
                                  {errors.kanji_city}
                                </small>) : ("")}</div>
                                <div class="form-group nn_form_group">
                                  <label>{t("Editprofile._stateprovince")}<span className="validatcolor">*</span>:</label>
                                  <input type="text"
                                    name="kanji_state"
                                    value={this.state.kanji_state}
                                   onChange={(e) => this.handleKanjiData(e,"kanji_state")}
                                    className="nn_input"
                                  />
                                </div>
                                <div className="nn_error_text">{ this.state.kanji_state === "" ? (<small style={{ color: "red" }}>
                                  {errors.kanji_state}
                                </small>) : ("")}</div>
                                <div class="form-group nn_form_group">
                                  <label>{t("Editprofile._postalcode")}<span className="validatcolor">*</span>:</label>
                                  <input type="text"
                                    value={this.state.kanji_postal_code}
                                    onChange={(e) => this.handleKanjiData(e,"kanji_postal_code")}
                                    //error={this.state.postalcodeError}
                                    name="kanji_postal_code"
                                    className="nn_input"
                                  />
                                </div>
                                <div className="nn_error_text">{ this.state.kanji_postal_code === "" ? (<small style={{ color: "red" }}>
                                  {errors.kanji_postal_code}
                                </small>) : ("")}</div>
                                </> : ""
                              }

                            <div class="form-group nn_form_group">
                            {getPayoutCountries && getPayoutCountries.filter(x => x.shortCode == this.state.shortCode).map((item, index) => {
                                 return item.InputarrayData && item.InputarrayData.map(z => {
                                      return  <div class="form-group nn_form_group">
                                                <label>{getUnderScoreRemovedString(z,t)}<span className="validatcolor">*</span></label>
                                                  <input
                                                      type="text"
                                                      onChange={(e) => this.stripeAddressChanges(e,z)}
                                                      value={this.state.AddressData[z]}
                                                      name={z}
                                                      className="nn_input"
                                                  />

                                                   <div>
                                                     {!!errors[z] ? (<small style={{ color: "red" }}>
                                                      {errors[z]}
                                                    </small>) : ("") }
                                                    </div>

                                                    {/* {(!!errors[x.filterId] && !(values && values[x.filterId] && values[x.filterId].fieldParent)) ? (
                                                      <FormHelperText error={!!errors[x.filterId]}>
                                                        {errors[x.filterId]}
                                                      </FormHelperText>
                                                    ) : (
                                                      ""
                                                    )} */}

                                            </div>

                                        })
                                        })}
                                </div>
                                <div class="form-group nn_form_group">
                                  <label>{t("Payout.legalDocument")}<span className="validatcolor">*</span></label>
                                      <PictureUpload
                                        mode={"edit"}
                                        imageUrl={typeof documentImage === "string" && documentImage}
                                        handleSubmit={(f, e) =>
                                          this.handleUpload("documentImage", f, e)
                                        }
                                      />
                                     {!!errors["documentImage"] ?
                                     (<small style={{ color: "red" }}> {errors["documentImage"]} </small>) : ("")}
                                  </div>

                                  <div class="form-group nn_form_group">
                                  <label>{t("Payout.additionalDocument")}<span className="validatcolor">*</span></label>
                                      <PictureUpload
                                        mode={"edit"}
                                        imageUrl={typeof documentAdditionalImage === "string" && documentAdditionalImage}
                                        handleSubmit={(f, e) =>
                                          this.handleUpload("documentAdditionalImage", f, e)
                                        }
                                      />
                                     {!!errors["documentAdditionalImage"] ?
                                     (<small style={{ color: "red" }}> {errors["documentAdditionalImage"]} </small>) : ("")}
                                  </div>
                              </form>
                            </div>

                          </div>
                          <div className="modal-footer">
                              <button disabled={accountCreationDisable} className="btn btn_theme" onClick={() => this.stripeSubmit()}>
                                {preLoadr ? 
                                    <>
                                      <div>Loading...</div>
                                    </>
                                    : t("Editprofile._SUBMIT")
                                 }
                              </button>
                          </div>
                        </div>
                      </ShipmentPopup>
                      </div>
                    </div>
                    <div className="nn_edit_promain">
                      <Grid container>
                        <Grid item xs={12} sm={12} md={3}>
                          <nav className="nn_tabs_nav">
                            <div className="wrappperclass nn_edit_pro_main">
                              <div className="nn_edit_pro">
                                <div className="nn_edit_pro_img">
                                  <img src={foundUser.profileImage} />
                                  <div className="nn_edit_profileicon">
                                    <p className="setting">
                                      <span onClick={this.openModal}>
                                        {/* <i className="fa fa-cog" aria-hidden="true"></i> */}
                                        <EditIcon className="nn_editpro_icon" />
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="nn_edit_pro_ctn">
                                  <h4 className="text-truncate" title={foundUser.userName}> {foundUser.userName}</h4>
                                  {foundUser.userRating >= 1 ? (
                                    // <StarRatingComponent
                                    //   name="rate1"
                                    //   value={foundUser.userRating}
                                    // />

                                    <StarRatingComponent
                                      name="app6"
                                      //starColor="#ffb400"
                                      // emptyStarColor="#ffb400"
                                      value={foundUser.userRating}
                                      onStarClick={this.onStarClickHalfStar.bind(
                                        this
                                      )}
                                      renderStarIcon={(index, value) => {
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
                                            <span style={{ position: "absolute" }}>
                                              <i className="far fa-star" />
                                            </span>
                                            <span>
                                              <i className="fas fa-star-half" />
                                            </span>
                                          </span>
                                        );
                                      }}
                                    />
                                  ) : (
                                      <>
                                        {" "}
                                        <h6> {t("Editprofile._NoRatings")} </h6>{" "}
                                      </>
                                    )}
                                </div>
                                <ul className="text-center">
                                {(foundUser && foundUser.verifications && foundUser.verifications.email === true) ?
                                 <li title={t("Editprofile._EmailVerifyCtn")}><i className="fa fa-envelope"></i>
                                 <span className="mx-2">{t("Editprofile._EmailVerifyCtn")}</span></li> : ""}
                                 {(foundUser && foundUser.verifications && foundUser.verifications.google === true) ?
                                 <li title={t("Editprofile._GoogleVerifyCtn")}><i className="fa fa-google"></i>
                                 <span className="mx-2">{t("Editprofile._GoogleVerifyCtn")}</span></li> : "" }
                                 {(foundUser && foundUser.verifications && foundUser.verifications.faceBook === true) ?
                                 <li title={t("Editprofile._FaceBookVerifyCtn")}><i class="fab fa-facebook-f"></i>
                                 <span className="mx-2">{t("Editprofile._FaceBookVerifyCtn")}</span></li> : ""}
                                 {(foundUser && foundUser.verifications && foundUser.verifications.apple === true) ?
                                <li title={t("Editprofile._AppleVerifyCtn")}><i className="fa fa-apple"></i>
                                <span className="mx-2">{t("Editprofile._AppleVerifyCtn")}</span></li>
                                : ""}
                                </ul>

                               { ((foundUser && foundUser.verifications && foundUser.verifications.email) || (foundUser && foundUser.verifications && foundUser.verifications.faceBook) || (foundUser && foundUser.verifications && foundUser.verifications.google) || (foundUser && foundUser.verifications && foundUser.verifications.apple)) ? <> </> : <button className={classes.jqJLdD + " nn_btn"} onClick={this.resendEmail}>{t("Editprofile._resendemail1")}</button>}
                              </div>
                              <div
                                className="nn_edit_backarrow"
                                onClick={this.productPage}
                              >
                                <button
                                  type="button"
                                  //role="button"
                                  className="sc-iwsKbI sc-gqjmRU jxllvb sellres"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    className="sc-jTzLTM fznnpf"
                                  >
                                    <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div
                              className="nav nav-tabs nav-fill"
                              id="nav-tab"
                              role="tablist"
                            >
                              <a
                                className="nav-item nav-link active"
                                id="nav-home-tab"
                                data-toggle="tab"
                                href="#nav-home"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                              >
                                {t("Sellerdetails._Selling")}
                              </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-contact-tab"
                                data-toggle="tab"
                                href="#nav-contact"
                                role="tab"
                                aria-controls="nav-contact"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Sold")}
                              </a>

                              <a
                                className="nav-item nav-link"
                                id="nav-about-tab"
                                data-toggle="tab"
                                href="#nav-about"
                                role="tab"
                                aria-controls="nav-about"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Favorites")}
                              </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-about-tab"
                                data-toggle="tab"
                                href="#nav-review"
                                role="tab"
                                aria-controls="nav-about"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Reviews")}
                              </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-payout-tab"
                                data-toggle="tab"
                                href="#nav-payout"
                                role="tab"
                                aria-controls="nav-payout"
                                aria-selected="false"
                              >
                                {t("Editprofile._PayoutTab")}
                              </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-order-tab"
                                data-toggle="tab"
                                href="#nav-order"
                                role="tab"
                                aria-controls="nav-order"
                                aria-selected="false"
                              >
                                 {t("Editprofile._orders")}
                                </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-sale-tab"
                                data-toggle="tab"
                                href="#nav-sale"
                                role="tab"
                                aria-controls="nav-sale"
                                aria-selected="false"
                              >
                               {t("Editprofile._Sales")}
                                </a>
                            </div>
                            { googleAd ?
                                <AdSense.Google
                                    client={googleAdSenseId} // {googleAnalyticsKey}
                                    slot={editProfilePageSlotId} // {productPageSlotId}
                                    style={{ display: 'block' }}
                                    layout='in-article'
                                    format='fluid'
                                    className="adminadd1"
                                />
                              :
                              <div className="adminadd">
                                <img src={googleAdImg} className="img-fluid" />
                              </div>
                            }

                          </nav>
                          </Grid>
                        <Grid item xs={12} sm={12} md={9}>
                          <div
                            className="tab-content nn_tab_ctn"
                            id="nav-tabContent"
                          >
                            <div
                              className="tab-pane fade show active nn_edit_sellpromain"
                              id="nav-home"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab"
                            >
                              <div className="nn_edit_proname">
                                {t("Sellerdetails._Selling")}
                              </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="nn_edit_allproducts">
                                  { preLoadr ?   
                                        <Loader>                                    
                                          <div class="stage1"><div class="dot-bricks"></div></div>
                                        </Loader>
                                    : ForSale != null &&
                                    ForSale.length < 1 ? (
                                      <div className="nn_empty_tab">
                                        {" "}
                                        <img src={EmptyTab} />
                                        <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._ForSaleCtn")}</p>
                                      </div>
                                    ) : (ForSale && ForSale.slice(
                                        0,
                                        this.state.sellingVisible
                                      ).map((item) => (
                                        <div className="nn_edit_proctn">
                                          <div
                                            className={
                                              item.featured != null
                                                ? 'classes.iOHpjI + "aasd'
                                                : ""
                                            }
                                          >
                                            <section
                                              className={
                                                item.featured != null
                                                  ? "bgcolor"
                                                  : "nn_edit_prosection"
                                              }
                                            >
                                              <Link
                                                to={`/products/${item.id}/`}
                                              >
                                                <div
                                                  className={"inner"}
                                                  id="myId"
                                                >
                                                  <img
                                                    src={
                                                      item.images[0]
                                                    }
                                                  />

                                                  {item.isFree && (
                                                    <div className="freeproduct">
                                                      <div>
                                                        {" "}
                                                        {t(
                                                          "Editprofile._Free"
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                  {item.featured && (
                                                    <div className="featured">
                                                      <div>
                                                        {t(
                                                          "Editprofile._Featured"
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                                <div
                                                  className={"footer"}
                                                >
                                                  <div className="foot-produ">
                                                    <h6>
                                                      {" "}
                                                      {
                                                        item.title
                                                      }{" "}
                                                    </h6>
                                                    <p>
                                                      {" "}
                                                      {
                                                        item.description
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </Link>
                                            </section>
                                          </div>
                                        </div>
                                      )) 
                                    )}
                                </div>
                                {preLoadr ? "" :                                         
                                  <div className="nn_loadmore">
                                  {this.state.sellingVisible <
                                    ForSale.length && (
                                      <button
                                        onClick={() => this.loadMore("sell")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}
                              </div>
                            </div>

                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-contact"
                              role="tabpanel"
                              aria-labelledby="nav-contact-tab"
                            >
                              <div className="nn_edit_proname">
                                {t("Sellerdetails._Sold")}
                              </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="nn_edit_allproducts">
                                  {preLoadr ?   
                                      <Loader>                                    
                                        <div class="stage1"><div class="dot-bricks"></div></div>
                                      </Loader>
                                    : SoldOut != null &&
                                    SoldOut.length < 1 ? (
                                      <div className="nn_empty_tab">
                                        <img src={EmptyTab} />
                                        <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._SoldCtn")}</p>
                                      </div>
                                    ) : (SoldOut && SoldOut.slice(
                                        0,
                                        this.state.soldVisible
                                      ).map((item) => (
                                        <div className="nn_edit_proctn">
                                          <div
                                            className={
                                              item.featured != null
                                                ? 'classes.iOHpjI + "aasd'
                                                : ""
                                            }
                                          >
                                            <section
                                              className={
                                                item.featured != null
                                                  ? "bgcolor"
                                                  : "nn_edit_prosection"
                                              }
                                            >
                                              <Link
                                                to={`/products/${item.id}/`}
                                              >
                                                <div
                                                  className={"inner"}
                                                  id="myId"
                                                >
                                                  <img
                                                    src={
                                                      item.images[0]
                                                    }
                                                  />

                                                  {item.isFree && (
                                                    <div className="freeproduct">
                                                      <div>
                                                        {t(
                                                          "Editprofile._Free"
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                  {item.featured && (
                                                    <div className="featured">
                                                      <div>
                                                        {t(
                                                          "Editprofile._Featured"
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                                <div
                                                  className={"footer"}
                                                >
                                                  <div className="foot-produ">
                                                    <h6>
                                                      {" "}
                                                      {
                                                        item.title
                                                      }{" "}
                                                    </h6>
                                                    <p>
                                                      {" "}
                                                      {
                                                        item.description
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </Link>
                                            </section>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                </div>
                                {preLoadr ? "" :
                                <div className="nn_loadmore">
                                  {this.state.soldVisible <
                                    SoldOut.length && (
                                      <button
                                        onClick={() => this.loadMore("sold")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}
                              </div>
                            </div>

                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-about"
                              role="tabpanel"
                              aria-labelledby="nav-about-tab"
                            >
                              <div className="nn_edit_proname">
                                {t("Sellerdetails._Favorites")}
                              </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="nn_edit_allproducts">
                                  {preLoadr ?   
                                      <Loader>                                    
                                        <div class="stage1"><div class="dot-bricks"></div></div>
                                      </Loader>
                                    : favourites != null &&
                                    favourites.length < 1 ? (
                                      <div className="nn_empty_tab">
                                        <img src={EmptyTab} />
                                        <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._FavoritesCtn")}</p>
                                      </div>
                                    ) :  ( favourites && favourites
                                        .slice(0, this.state.favVisible)
                                        .map((item) => (
                                          <div className="nn_edit_proctn">
                                            <div
                                              className={
                                                item.featured != null
                                                  ? 'classes.iOHpjI + "aasd'
                                                  : ""
                                              }
                                            >
                                              <section
                                                className={
                                                  item.featured !=
                                                    null
                                                    ? "bgcolor"
                                                    : "nn_edit_prosection"
                                                }
                                              >
                                                <Link
                                                  to={`/products/${item.id}/`}
                                                >
                                                  <div
                                                    className={
                                                      "inner"
                                                    }
                                                    id="myId"
                                                  >
                                                    <img
                                                      src={
                                                        item.images[0]
                                                      }
                                                    />

                                                    {item.isFree && (
                                                      <div className="freeproduct">
                                                        <div>
                                                          {t(
                                                            "Editprofile._Free"
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                    {item.featured && (
                                                      <div className="featured">
                                                        <div>
                                                          {t(
                                                            "Editprofile._Featured"
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div
                                                    className={
                                                      "footer"
                                                    }
                                                  >
                                                    <div className="foot-produ">
                                                      <h6>
                                                        {" "}
                                                        {
                                                          item.title
                                                        }{" "}
                                                      </h6>
                                                      <p>
                                                        {" "}
                                                        {
                                                          item.description
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                </Link>
                                              </section>
                                            </div>
                                          </div>
                                        ))
                                    )}
                                </div>
                                {preLoadr ? "" :
                                <div className="nn_loadmore">
                                  {this.state.favVisible <
                                    favourites.length && (
                                      <button
                                        onClick={() => this.loadMore("fav")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}

                              </div>
                            </div>
                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-review"
                              role="tabpanel"
                              aria-labelledby="nav-about-tab"
                            >
                              <div className="nn_edit_proname">
                                {t("Sellerdetails._Reviews")}
                              </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="reviwuser nn_edit_allproducts">
                                  {preLoadr ?   
                                    <Loader>                                    
                                      <div class="stage1"><div class="dot-bricks"></div></div>
                                    </Loader>
                                  : reviews != null && reviews.length < 1 ? (
                                    <div className="nn_empty_tab">
                                      <img src={EmptyTab} />
                                      <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._ReviewsCtn")}</p>
                                    </div>
                                  ) :  (reviews && reviews
                                        .slice(0, this.state.reviewVisible)
                                        .map((item) => (
                                          <div className="reusewraye ">
                                            <div className="border-bottomline">
                                              {/* <Link to={`/SellerDetails/${item.userFrom}`} > */}
                                              <div className="wholereviewwr rvwrtl">
                                                <img src={item.imageUrl} />
                                              </div>

                                              <div className="leftimgrev rvwrtl">
                                                <h6> {item.fromName}</h6>
                                                <div className="desrev editprf">
                                                  {/* <StarRatingComponent
                                                    name="rate1"
                                                    starCount={5}
                                                    value={item.ratings}
                                                  // direction = rtl
                                                    onStarClick={this.onStarClick.bind(
                                                      this
                                                    )}
                                                  /> */}

                                                  <StarRatingComponent
                                                    name="app6"
                                                    //starColor="#ffb400"
                                                    // emptyStarColor="#ffb400"
                                                    value={item.ratings}
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

                                                  {/* <p><span className="highrwbf"> {item.toName} sold Something</span></p> */}

                                                  <p className="maghbtm">
                                                    {" "}
                                                    {item.feedBack[0]}{" "}
                                                  </p>

                                                  <p>{item.comment}</p>
                                                  <p className="timelinerew">
                                                    {" "}
                                                    {findTimeStamp(
                                                      item.createdAt,
                                                      timestamp,
                                                      t
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                              {/* </Link> */}
                                              <div className="reporreve rvwrtl">
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

                                                <div
                                                  className="dropdown-menu"
                                                  onClick={() =>
                                                    this.handleUserRating(item)
                                                  }
                                                >
                                                  {t("Editprofile._ReviewUser")}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                    )}
                                </div>
                                {preLoadr ? "" :
                                <div className="nn_loadmore">
                                  {this.state.reviewVisible <
                                    reviews.length && (
                                      <button
                                        onClick={() => this.loadMore("review")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}
                              </div>
                              <div>
                                {this.state.UserReviewPop && (
                                  <DiscardPopup
                                    isOpen={this.state.UserReviewPop}
                                    contentLabel="Minimal Modal Example"
                                    style={customStylesReview}
                                  >
                                    <section className="iHQQug">
                                      <>
                                        {this.state.reviewExpInfo && (
                                          <div className="ratingpageki">
                                            <div className="nn_share_ctn">
                                              <button
                                                type="button"
                                                onClick={
                                                  this.editreviewClosemodal
                                                }
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
                                                    .imageUrl
                                                }
                                              />
                                            </div>
                                            <div className="profilerayingname">
                                              {" "}
                                              {
                                                this.state.reviewExpInfo
                                                  .fromName
                                              }
                                            </div>
                                            <div className="ratingdescription">
                                              <p>
                                                {" "}
                                                {t(
                                                  "Editprofile._experiencewith"
                                                )}{" "}
                                                {
                                                  this.state.reviewExpInfo
                                                    .fromName
                                                }{" "}
                                                {t("Editprofile._fivestars")}
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
                                                <div className="inlienbtnvalue">
                                                  {/* <button className="iDhWYa active" > {feedBack}</button> */}
                                                </div>
                                                {this.state.rating <= 2
                                                  ? this.state
                                                    .secondaryButton &&
                                                  this.state.secondaryButton.map(
                                                    (cbk, index) => (
                                                      <div
                                                        key={index}
                                                        className="inlienbtnvalue"
                                                      >
                                                        <button
                                                          //className={cbk === feedBack[0] ? 'active iDhWYa' : 'iDhWYa' }
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
                                                              this.state
                                                                .rating
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
                                                          // className={cbk === feedBack[0]  ? 'active iDhWYa ' : 'iDhWYa' }
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
                                                              this.state
                                                                .rating
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
                                                  id="standard-bare"
                                                  multiline
                                                  rows="3"
                                                  fullWidth
                                                  placeholder={t(
                                                    "Editprofile._Writeexperience"
                                                  )}
                                                  className={classes.textField + " nn_reviewtext"}
                                                  defaultValue={
                                                    this.state.inputValue
                                                  }
                                                  margin="normal"
                                                  inputProps={{
                                                    onChange: (e) =>
                                                      this.updateInputValue(e)
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div
                                              className={
                                                this.state.puplishReview ===
                                                  true
                                                  ? "beforedisabled"
                                                  : "afterdisbaled"
                                              }
                                            >
                                              <div className="sav_chang">
                                                <button
                                                  className="btn btn-danger btn-block"
                                                  onClick={() =>
                                                    this.updatedReview(
                                                      this.state.buttonResponse,
                                                      this.state.ratingResponse,
                                                      this.state
                                                        .feedBackTextResponse,
                                                      this.state.reviewExpInfo
                                                        .userFrom
                                                    )
                                                  }
                                                >
                                                  {t(
                                                    "Editprofile._PublishReview"
                                                  )}
                                                </button>
                                              </div>
                                            </div>

                                            {/* <div className="sav_chang">
                                          <button className="btn btn-danger btn-block" onClick={()=>this.handleUpdateReview()}>Publish Review</button>

                                          </div> */}
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
                                            <img src={this.state.reviewExpInfo.imageUrl} />
                                        </div>
                                        <div className="profilerayingname"> {this.state.reviewExpInfo.fromName
                                    }</div>
                                        <div  className="ratingdescription"><p> Does your experience with {this.state.reviewExpInfo.fromName } get five stars ? Tell us how it went </p></div>

                                  <div className="textareafiled">
                             <TextField
                            id="standard-bare"
                            multiline
                            rows="3"
                            fullWidth
                            placeholder="Write about your experience(optional)"
                            className={classes.textField}
                            defaultValue={this.state.inputValue}
                            margin="normal"
                            inputProps={{
                              onChange: e =>
                                this.updateInputValue(e)
                            }}
                          />

                            </div>
                            <div className="sav_chang">
                                <button className="btn btn-danger btn-block"  onClick={()=>this.updatedReview(this.state.buttonResponse,this.state.ratingResponse,this.state.feedBackTextResponse,
                                  this.state.reviewExpInfo.userFrom)}>Update comment</button>
                                  </div>
                              </div>

                              }

                          </>

                              </section>
                          </Modal>

                          }  */}
                              </div>
                            </div>


                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-payout"
                              role="tabpanel"
                              aria-labelledby="nav-payout-tab"
                            >
                              <div className="cls_product-list">
                              <div class="nn_edit_proname">{t("Editprofile._payoutMethod")}</div>
                                <div className="product-list nn_edit_sellpro">
                                  <div className="cls_card-body">
                                  <p>{t("Editprofile._payouttext")}</p>
                                  <div className="table-responsive">
                                     <table className="table table-striped" id="payout_methods">
                                        <thead>
                                          <tr className="text-truncate">
                                            <th>{t("Editprofile._method")}</th>
                                            <th>{t("Editprofile._details")}</th>
                                            <th>{t("Editprofile._status")}</th>
                                            <th>&nbsp;</th>
                                          </tr>
                                        </thead>
                                      <tbody>

                                    {
                                      foundUser &&  foundUser.payOutMethod && foundUser.payOutMethod.length > 0 && foundUser.payOutMethod.map(z => {
                                        return  <tr>
                                          <td>{z.type}<span className="label label-info">{z.default === true ? ` (${t("Editprofile._default")})` : ""}</span></td>
                                      <td>{z.paypal_email !== null ? `${z.paypal_email} ${"(USD)"}` : z.stripeAccountCreatedNumber !== null ? `${z.stripeAccountCreatedNumber} (${z.currency_code})` : ""}
                                      {/* <span>{z.currency_code ? z.currency_code : "-" }</span> */}
                                      </td>  <td> {t("Editprofile._ready")} </td>
                                       { z.default !== true ? <td className="cls_payout_options">
                                            <button style={{color:'#000'}} onClick={(e)=>this.payoutMethodDelete(e,z._id)}><DeleteIcon /></button>
                                            <button style={{color:'#f53956'}} onClick={(e)=>this.payoutDefault(e,z._id)}><LockIcon /></button>
                                          </td> : <td> </td>  }
                                      </tr>

                                      })
                                    }


                                        </tbody>
                                        </table>
                                        <div style={{width:'100%'}}>
                                          <button onClick={() => this.payout()} className="cls_addpayout">  {t("Editprofile._payoutMethod")}</button>
                                            <span style={{paddingLeft:"5px;"}}> {t("Editprofile._directdeposit")}</span>
                                        </div>
                                        </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-order"
                              role="tabpanel"
                              aria-labelledby="nav-order-tab"
                            >
                              <div className="nn_edit_proname">
                              {t("Editprofile._orders")}
                                </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="nn_edit_allproducts">
                                  {preLoadr ?   
                                      <Loader>                                    
                                        <div class="stage1"><div class="dot-bricks"></div></div>
                                      </Loader>
                                    : orders != null &&
                                    orders.length < 1 ? (
                                      <div className="nn_empty_tab">
                                        {" "}
                                        <img src={EmptyTab} />
                                        <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._OrderCtn")}</p>
                                      </div>
                                    ) : (orders && orders.slice(
                                        0,
                                        this.state.orderVisible
                                      ).map((item) => (
                                        <div className="nn_edit_orderproctn">
                                          <div
                                            className={
                                              item.featured != null
                                                ? 'classes.iOHpjI + "aasd'
                                                : ""
                                            }
                                          >
                                            <div className="nn_order_status d-flex align-items-center justify-content-between flex-wrap">
                                              <div className="nn_orderstsctn">
                                                <p>{t("Editprofile._Status")}:
                                                              <span className="">
                                                    {t(`Editprofile.${item.status}`)}</span>
                                                </p>
                                              </div>
                                              <div className="nn_order_moreinfo">
                                              {localStorage.getItem("lang") === "ar" ?
                                                (<div className="nn_order_moreinfoctn" onClick={() => this.moreInfoView(item)}>{t("Editprofile._MoreInfo")}
                                                <NavigateBeforeIcon className="nn_previousarrow"/></div>) :
                                                 (<div className="nn_order_moreinfoctn" onClick={() => this.moreInfoView(item)}>{t("Editprofile._MoreInfo")} <NavigateNextIcon className="nn_nextarrow" />
                                                 </div>)}
                                              </div>
                                            </div>
                                            <section
                                              className={
                                                item.featured != null
                                                  ? "bgcolor"
                                                  : "nn_edit_prosection"
                                              }
                                            >
                                              <Grid container>
                                                <Grid item xs={12} sm={9} md={9}>
                                                  <Grid container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                      <div className="text-center">
                                                        <Link
                                                          to={`/products/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div
                                                            className={"inner"}
                                                            id="myId"
                                                          >
                                                            <img
                                                              src={
                                                                item.orderDetails.productImage
                                                              }
                                                            />
                                                            {item.isFree && (
                                                              <div className="freeproduct">
                                                                <div>
                                                                  {" "}
                                                                  {t(
                                                                    "Editprofile._Free"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {item.featured && (
                                                              <div className="featured">
                                                                <div>
                                                                  {t(
                                                                    "Editprofile._Featured"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        </Link>
                                                        <Link
                                                          to={`/SellerDetails/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div className="nn_order_title">
                                                            <h6> {t("Editprofile._Seller")}:
                                                                    {" "}
                                                              <span>{
                                                                item.orderDetails.sellerName
                                                              }</span>{" "}
                                                            </h6>
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={9} md={9}>
                                                      <div>
                                                        <Link
                                                          to={`/products/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div className="nn_order_produ1">
                                                            <h6>
                                                              {" "}
                                                              {
                                                                item.orderDetails.productName
                                                              }{" "}
                                                            </h6>
                                                            <p><span>{getSymbol(item.orderDetails.currencySymbol)} </span>
                                                             {item.orderDetails.productFee}</p>
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={3} md={3}>
                                                  <div className="text-center nn_order_derails">
                                                    <div className="nn_order_on"><p>{t("Editprofile._OrderOn")}:<span>
                                                      {dateSet1(item.createdAt).split(' ')[0]}
                                                    </span></p></div>
                                                    <div className="nn_order_id"><p>{t("Editprofile._OrderId")}: {item._id}</p></div>

                                                  { cancelStatus !== "" && cancelStatus === "PROCESSING" ? <>
                                                   { item.status === "PENDING" && <div className="nn_order_cancel"><button onClick={() => this.cancelModal(item._id, "CANCELLED")}
                                                    > {t("Editprofile._Cancel")} </button> </div>} </> : cancelStatus !== "" && cancelStatus === "SHIPPED" && <>
                                                    { (item.status === "PENDING" || item.status === "PROCESSING") && <div className="nn_order_cancel"><button onClick={() => this.cancelModal(item._id, "CANCELLED")}
                                                     > {t("Editprofile._Cancel")} </button> </div>} </>  }
                                                    { ((item.status == "DELIVERED" )|| (item.status == "COMPLETED")) ? <div className="nn_order_cancel">  <button onClick={() =>  this.buyNowReview(item)}> {t("orderViewPage._review")} </button></div> : "" }
                                                    { item.status == "CLAIMED" ? <div className="nn_order_cancel"> <button onClick={() => this.showPopup(item._id, "RECEIVED")}
                                                    > {t("Editprofile._Received")} </button></div> : ""       }
                                                  </div>
                                                </Grid>
                                              </Grid>
                                            </section>
                                            {orderdetails[item._id] && item._id === this.state.moreViewid &&
                                              <div className="nn_order_details table-responsive">
                                                <table width="100%" cellpadding="1" cellspacing="1">
                                                <tr>
                                                    <th>{t("Editprofile._SellerName")}:</th>
                                                    <th>{t("Editprofile._Status")}:</th>
                                                    <th>{t("Editprofile._PaymentType")}:</th>
                                                    <th colSpan="2">{t("Editprofile._TransactionId")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{item.orderDetails.sellerName}</td>
                                                    <td className="nn_status">{t(`Editprofile.${item.status}`)}</td>
                                                    <td>{item.orderDetails.paymentType}</td>
                                                    <td colSpan="2">{item.orderDetails.transactionId}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>{t("Editprofile._OrderId")}:</th>
                                                    <th>{t("Editprofile._OrderDate")}:</th>
                                                    {(item.status == "CANCELLED") ? <th>{t("Editprofile._CancelDate")}:</th> : <th>{t("Editprofile._shippmentDate")}:</th> }
                                                    <th colSpan="2">{t("Editprofile._DeliveryConfirmedDate")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{item._id}</td>
                                                    <td>{dateSet1(item.createdAt).split(' ')[0]}</td>
                                                    {(item.status == "CANCELLED") ?  <td> {dateSet1(item.updatedAt).split(' ')[0]}</td> :
                                                    ((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                    <td> {dateSet1(item.shippingDetails.shippmentDate).split(' ')[0]}</td>
                                                    : ""}
                                                    {((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                    <td colSpan="2"> {dateSet1(item.updatedAt).split(' ')[0]}</td> : ""}
                                                  </tr>
                                                  <tr>
                                                    <th>{t("Editprofile._ItemAmount")}:</th>
                                                    {(item.orderDetails.serviceFeeBuyerRate) != 0 ? <th>{t("Editprofile._buyerServiceFee")}:</th> : ""}
                                                    <th>{t("Editprofile._ShippingCost")}:</th>
                                                    <th>{t("Editprofile._ShippingAddress")}:</th>
                                                    <th>{t("Editprofile._TrackingDetails")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td> <span>{getSymbol(item.orderDetails.currencySymbol)} </span>{item.orderDetails.productFee}</td>
                                                    {(item.orderDetails.serviceFeeBuyerRate != 0) ? <td> <span>{getSymbol(item.orderDetails.currencySymbol)} </span>{item.orderDetails.serviceFeeBuyerRate}</td> : "" }
                                                    <td> <span>{getSymbol(item.orderDetails.currencySymbol)} </span>{item.orderDetails.shippingRate}</td>

                                                    <td className="nn_shipping_address">
                                                      <span>{item.buyerShippingAddress.Name},</span>
                                                      <span>{item.buyerShippingAddress.address1},</span>
                                                      <span>{item.buyerShippingAddress.address2}{item.buyerShippingAddress.address2 == "" ? "" : ","}</span>
                                                      <span>{item.buyerShippingAddress.city} - {item.buyerShippingAddress.zipCode},</span>
                                                      <span>{item.buyerShippingAddress.state},</span>
                                                      <span>{item.buyerShippingAddress.country},</span>
                                                      <span>{t("Editprofile._PhoneNo")}:{item.buyerShippingAddress.phoneNumber},</span>
                                                    </td>
                                                    {((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                      <td  className="nn_shipping_address">
                                                      <span><strong>{t("Editprofile._shippmentDate")}: </strong>{dateSet1(item.shippingDetails.shippmentDate).split(' ')[0]},</span>
                                                      <span><strong>{t("Editprofile._shippmentMethod")}:</strong> {item.shippingDetails.shippmentMethod},</span>
                                                      <span><strong>{t("Editprofile._shippementService")}: </strong>{item.shippingDetails.shippementService},</span>
                                                      <span><strong>{t("Editprofile._trackingId")}:</strong> {item.shippingDetails.trackingId},</span>
                                                      <span><strong>{t("Editprofile._notes")}:</strong> {item.shippingDetails.notes}</span>
                                                    </td>
                                                      : ""}
                                                  </tr>
                                                </table>
                                              </div>}
                                            <div className="nn_order_total">
                                              <p>{t("Editprofile._OrderTotal")}: <span>{getSymbol(item.orderDetails.currencySymbol)} {(item.orderDetails && item.orderDetails.totalFee).toFixed(2)}</span></p>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                </div>
                                {preLoadr ? "" :
                                <div className="nn_loadmore">
                                  {this.state.orderVisible <
                                    orders.length && (
                                      <button
                                        onClick={() => this.loadMore("order")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}
                              </div>
                            </div>

                            <div
                              className="tab-pane fade nn_edit_sellpromain"
                              id="nav-sale"
                              role="tabpanel"
                              aria-labelledby="nav-sale-tab"
                            >
                              <div className="nn_edit_proname">
                              {t("Editprofile._Sales")}
                                </div>
                              <div className="product-list nn_edit_sellpro">
                                <div className="nn_edit_allproducts">
                                  {preLoadr ?   
                                      <Loader>                                    
                                        <div class="stage1"><div class="dot-bricks"></div></div>
                                      </Loader>
                                    : sales != null &&
                                    sales.length < 1 ? (
                                      <div className="nn_empty_tab">
                                        {" "}
                                        <img src={EmptyTab} />
                                        <p><span>{t("Editprofile._Sorry")}</span>{t("Editprofile._SaleCtn")}</p>
                                      </div>
                                    ) : (sales && sales.slice(
                                        0,
                                        this.state.saleVisible
                                      ).map((item) => (
                                        <div className="nn_edit_orderproctn">
                                          <div
                                            className={
                                              item.featured != null
                                                ? 'classes.iOHpjI + "aasd'
                                                : ""
                                            }
                                          >
                                            <div className="nn_order_status d-flex align-items-center justify-content-between flex-wrap">
                                              <div className="nn_orderstsctn">
                                                <p>{t("Editprofile._Status")}:
                                                              <span className="">
                                                              {t(`Editprofile.${item.status}`)}</span>
                                                </p>
                                              </div>
                                              <div className="nn_order_moreinfo">
                                                {localStorage.getItem("lang") === "ar" ?
                                                (<div className="nn_order_moreinfoctn" onClick={() => this.moreSaleInfoView(item)}>{t("Editprofile._MoreInfo")}
                                                <NavigateBeforeIcon className="nn_previousarrow"/></div>) :
                                                 (<div className="nn_order_moreinfoctn" onClick={() => this.moreSaleInfoView(item)}>{t("Editprofile._MoreInfo")} <NavigateNextIcon className="nn_nextarrow" />
                                                 </div>)}
                                              </div>
                                            </div>
                                            <section
                                              className={
                                                item.featured != null
                                                  ? "bgcolor"
                                                  : "nn_edit_prosection"
                                              }
                                            >
                                              <Grid container>
                                                <Grid item xs={12} sm={9} md={9}>
                                                  <Grid container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                      <div className="text-center">
                                                        <Link
                                                          to={`/products/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div
                                                            className={"inner"}
                                                            id="myId"
                                                          >
                                                            <img
                                                              src={
                                                                item.orderDetails.productImage
                                                              }
                                                            />
                                                            {item.isFree && (
                                                              <div className="freeproduct">
                                                                <div>
                                                                  {" "}
                                                                  {t(
                                                                    "Editprofile._Free"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {item.featured && (
                                                              <div className="featured">
                                                                <div>
                                                                  {t(
                                                                    "Editprofile._Featured"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        </Link>
                                                        <Link
                                                          to={`/products/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div className="nn_order_title">
                                                            <h6> {t("Editprofile._Buyer")}:
                                                                    {" "}
                                                              <span>{
                                                                item.orderDetails.buyerName
                                                              }</span>{" "}
                                                            </h6>
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={9} md={9}>
                                                      <div>
                                                        <Link
                                                          to={`/products/${item.productId}/`}
                                                          className=""
                                                        >
                                                          <div className="nn_order_produ1">
                                                            <h6>
                                                              {" "}
                                                              {
                                                                item.orderDetails.productName
                                                              }{" "}
                                                            </h6>
                                                            <p><span>{getSymbol(item.orderDetails.currencySymbol)} </span>
                                                               {item.orderDetails.productFee}
                                                            </p>
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={3} md={3}>
                                                  <div className="text-center nn_order_derails">
                                                    <div className="nn_order_on"><p>{t("Editprofile._OrderOn")}: <span>{dateSet1(item.createdAt).split(' ')[0]}</span></p></div>
                                                    <div className="nn_order_id"><p>{t("Editprofile._OrderId")}: {item._id}</p></div>
                                                    <div>
                                                      {/* {!markprocess && <button onClick={this.showPopup}
                                                    >Mark Process</button>}
                                                    {markprocess && <button>Mark as shipped</button>} */}
                                                      {item.status == "PENDING" ? <button onClick={() => this.showPopup(item._id, "PROCESSING")}
                                                      > {t("Editprofile._MarkProcess")} </button> : (item.status == "PROCESSING") ? <button onClick={() => this.shipPopup(item._id)}
                                                      > {t("Editprofile._MarkShipped")} </button> : (item.status == "SHIPPED") ? <button onClick={() => this.showPopup(item._id, "CLAIMED")}
                                                      > {t("Editprofile._MarkClaimed")}</button> : (item.status == "CLAIMED") ? "" : ""}

                                                      { ((item.status == "DELIVERED" )|| (item.status == "COMPLETED")) ? <div className="nn_order_cancel"><button onClick={() =>  this.buyNowReview(item)}> {t("orderViewPage._review")} </button></div> : "" }

                                                    </div>
                                                  </div>
                                                </Grid>
                                              </Grid>
                                            </section>
                                            {saledetails[item._id] && item._id === this.state.moreSaleViewid &&
                                              <div className="nn_order_details table-responsive">
                                                <table width="100%" cellpadding="1" cellspacing="1">
                                                  <tr>
                                                    <th>{t("Editprofile._BuyerName")}:</th>
                                                    <th>{t("Editprofile._Status")}:</th>
                                                    <th>{t("Editprofile._PaymentType")}:</th>
                                                    <th>{t("Editprofile._TransactionId")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{item.orderDetails.buyerName}</td>
                                                    <td className="nn_status">{t(`Editprofile.${item.status}`)}</td>
                                                    <td>{item.orderDetails.paymentType}</td>
                                                    <td>{item.orderDetails.transactionId}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>{t("Editprofile._OrderId")}:</th>
                                                    <th>{t("Editprofile._OrderDate")}:</th>
                                                    {(item.status == "CANCELLED") ? <th>{t("Editprofile._CancelDate")}:</th> : <th>{t("Editprofile._shippmentDate")}:</th> }
                                                    <th>{t("Editprofile._DeliveryConfirmedDate")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{item._id}</td>
                                                    <td>{dateSet1(item.createdAt).split(' ')[0]}</td>
                                                    {(item.status == "CANCELLED") ?  <td>{dateSet1(item.updatedAt).split(' ')[0]}</td> :
                                                    ((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                    <td> {dateSet1(item.shippingDetails.shippmentDate).split(' ')[0]}</td>
                                                    : ""}
                                                    {((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                    <td> {dateSet1(item.updatedAt).split(' ')[0]}</td> : ""}
                                                  </tr>
                                                  <tr>
                                                    <th>{t("Editprofile._ItemAmount")}:</th>
                                                    { (item.orderDetails.serviceFeeSellerRate) != 0 ? <th>{t("Editprofile._buyerServiceFee")}:</th> : ""}
                                                    <th>{t("Editprofile._ShippingCost")}:</th>
                                                    <th>{t("Editprofile._ShippingAddress")}:</th>
                                                    <th>{t("Editprofile._TrackingDetails")}:</th>
                                                  </tr>
                                                  <tr>
                                                    <td><span>{getSymbol(item.orderDetails.currencySymbol)} </span>{item.orderDetails.productFee}</td>
                                                    {(item.orderDetails.serviceFeeBuyerRate != 0) ? 
                                                    <td> <span>{getSymbol(item.orderDetails.currencySymbol)} </span>
                                                    {(item.orderDetails && item.orderDetails.serviceFeeBuyerRate).toFixed(2)}</td> : "" }
                                                    <td><span>{getSymbol(item.orderDetails.currencySymbol)} </span>{item.orderDetails.shippingRate}</td>
                                                    <td className="nn_shipping_address">
                                                      <span>{item.buyerShippingAddress.Name},</span>
                                                      <span>{item.buyerShippingAddress.address1},</span>
                                                      <span>{item.buyerShippingAddress.address2},</span>
                                                      <span>{item.buyerShippingAddress.city} - {item.buyerShippingAddress.zipCode},</span>
                                                      <span>{item.buyerShippingAddress.state},</span>
                                                      <span>{item.buyerShippingAddress.country},</span>
                                                      <span>{t("Editprofile._PhoneNo")}:{item.buyerShippingAddress.phoneNumber},</span>
                                                    </td>
                                                    {((item.status == "PENDING") || (item.status == "PROCESSING") || (item.status == "CANCELLED")) ? <td> ---------- </td> : ((item.status == "SHIPPED") || (item.status == "CLAIMED") || (item.status == "RECEIVED") || (item.status == "DELIVERED") || (item.status == "COMPLETED")) ?
                                                      <td  className="nn_shipping_address">
                                                      <span><strong>{t("Editprofile._shippmentDate")}:</strong> {dateSet1(item.shippingDetails.shippmentDate).split(' ')[0]},</span>
                                                      <span><strong>{t("Editprofile._shippmentMethod")}:</strong> {item.shippingDetails.shippmentMethod},</span>
                                                      <span><strong>{t("Editprofile._shippementService")}:</strong> {item.shippingDetails.shippementService},</span>
                                                      <span><strong>{t("Editprofile._trackingId")}:</strong> {item.shippingDetails.trackingId},</span>
                                                      <span><strong>{t("Editprofile._notes")}:</strong> {item.shippingDetails.notes}</span>
                                                    </td>
                                                      : ""}
                                                  </tr>
                                                </table>
                                              </div>}
                                            <div className={`${((item.status == "DELIVERED") || (item.status == "COMPLETED")) ? "nn_order_total1" : 'nn_order_total'}`}>
                                            { (item.status == "DELIVERED") || (item.status == "COMPLETED") ? <p> {t("Editprofile._payoutStatus")}:
                                            <span> {(item.status == "DELIVERED") ? <> {t("Editprofile._yetToPay")} </> : (item.status == "COMPLETED" ? <> {t("Editprofile._paid")}</> : "")}</span> </p> : ""}
                                              <p>{t("Editprofile._OrderTotal")}: <span>{getSymbol(item.orderDetails.currencySymbol)} {(item.orderDetails && item.orderDetails.totalFee).toFixed(2)}</span></p>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                </div>
                                {preLoadr ? "" :
                                <div className="nn_loadmore">
                                  {this.state.saleVisible <
                                    sales.length && (
                                      <button
                                        onClick={() => this.loadMore("sale")}
                                        type="button"
                                        className="nn_loadbtn"
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                </div>}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                  {/* );
                     }}
                  </Query>  */}
                </div>
              </div>
            </div>
          </div>
          <div className="modal" id="editprofile"></div>
        </EditProfileMain>

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
      </div>
    );
  }
}

var userAction = compose(
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_USER, { name: "getUser" }),
  graphql(RESENT_EMAIL_VERIFICATION, { name: "ResendverifyEmailLink" }),
  graphql(EDIT_USER, { name: "editUser" }),
  graphql(LOG_OUT, { name: "logOut" }),
  graphql(ADD_DEFAULT_PAYOUT, { name: "setDefaultPayout" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_REVIEW, { name: "getReview" }),
  graphql(ADD_PAYOUT, { name: "addPayOutMethod" }),
  graphql(DELETE_PAYOUT, { name: "deletePayOutMethod" }),
  graphql(UPDATE_REVIEW, { name: "updateReview" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(UPDATE_ORDER_STATUS, { name: "updateOrderStatus" }),
  graphql(UPDATE_SHIPPING_DETAILS, { name: "updateShippingDetails" })
)(EditProfile);

export default withTranslation("common")(withStyles(styles)(userAction));

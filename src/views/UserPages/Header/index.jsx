import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import defaultImg from "../../../assets/img/default.png";
import Button from "../../../components/CustomButtons/Button.jsx";
import Magnify from "@material-ui/icons/Search";
import ChatBubble from "@material-ui/icons/ChatOutlined";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import Dehaze from "@material-ui/icons/Dehaze";
import Camera from "@material-ui/icons/CameraAlt";
import { compose, graphql, Query } from "react-apollo";
import {
  GET_SITE_INFO,
  POPUP_STATE_UPDATE,
  GET_LOGIN_POPUP_STATE,
  INACTIVE,
  UPDATE_PRODUCT,
  GET_CATEGORIES,
  GET_CURRENT_USER,
  GET_CACHE_STATE,
  LOG_OUT,
  CATEGORY_ID,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE,
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
  VERIFY_EMAIL
} from "../../../queries";
import LoginComponent from "../Login/index.jsx";
// import "../css/style.css";
import Modal from "react-modal";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Category from "./Category.jsx";
import { Link } from "react-router-dom";
import { ProductConsumer } from "../ProductContext.js";
import { withTranslation } from "react-i18next";
import HomeFilter from "../home_filter.js";
import CategoryFilter from "../Dashboard/Filters/Category.jsx";
import DynamicFilter from "../Dashboard/DynamicFilter.jsx";
import history from "../../../history";
import { Headermain, ChatPageIcon, FilterModal, DiscardPopup, MenuPopup } from '../css/styledcomponents';
import { mapLocation1 } from "../../../helper.js"
import * as Toastr from "../../UserPages/Toast";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';

const initialState = {
  image: "",
  openPopup: false,
  currentUser: {},
  resultData: [],
  isPaneOpen: false,
  srch: "",
  city: "",
  filterData: [],
  locationSearch: "",
  value: "",
  location: {},
  googleApi: ""
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "9999"
  }
};

const customStyles1 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "600px"
  }
};

const customStyles3 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px"
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      modalIsOpen: false,
      discardStuff: Math.floor(Math.random() * 10000),
      showDiscard: false,
      headerStuffClicked: true,
      aboutModal: false,
      sellingTitle: this.props.t("Homepageheader._Whatselling"),
      clearFilter: true,
      showModal: false,
      modalIsOpencategory: false,
      responsiveCategory: "All",
      responsiveCategoryimage: "",
      locModalisOpen: false
    };
    this.handleChat = this.handleChat.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    //this.closeActiveScreen=this.closeActiveScreen.bind(this);
    this.redirect = this.redirect.bind(this);

    this.aboutPage = this.aboutPage.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModalcategory = this.openModalcategory.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
  }

  openModalcategory() {
    this.setState({ modalIsOpencategory: true });
  }

  handleCloseModal2() {
    this.setState({ modalIsOpencategory: false });
  }

  handleOpenModal() {
    document.body.classList.toggle("scrollDisable");
    document.body.classList.remove("highlight");
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    document.body.classList.remove("scrollDisable");
    document.body.classList.toggle("highlight");
    this.setState({ showModal: false, locModalisOpen: false });
  }

  componentDidMount() {
    let { getCacheSearchInput, getLoactionNameData, verifyEmail } = this.props;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const encryptVerify = params.get("id");
    if (encryptVerify != null && (Object.keys(this.state.currentUser).length === 0)) {
      var verifyCode = encryptVerify
      this.handleLogin(true)
    } else if (encryptVerify != null && (Object.keys(this.state.currentUser).length > 0)) {
      verifyEmail({
        variables: {
          code: encryptVerify
        }
      })
        .then(async ({ data, error }) => {
          if (data.verifyEmail === true) {
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
                <div>
                  {this.props.t("login._verifySuccess")}
                </div>
              </div>
            );
          }
        })
        .catch(error => {
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
              <div> {message[0]}</div>
            </div>
          );
          history.push("/")
        });
    }
    //this.getGeoInfo();
    Modal.setAppElement(this.el);
    if (getCacheSearchInput && getCacheSearchInput.searchInput !== undefined && getCacheSearchInput.searchInput) {
      this.setState({
        srch: getCacheSearchInput.searchInput
      })
    }
    if (getLoactionNameData && getLoactionNameData.locationName !== undefined && getLoactionNameData.locationName) {
      this.setState({
        value: getLoactionNameData.locationName
      })
    }
    var cls_header_height = document.getElementById("hdrFx")
    var cls_he = cls_header_height.clientHeight
    document.getElementById("root").style.marginTop = cls_he + "px";

  }
  handleChange = event => {
    let resultData = event.target.value;
    this.setState({ srch: resultData });
  };
  goHome = e => {
    var url = new URL(window.location);
    if (e.keyCode === 32 && e.target.value.length <= 1) {
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (window.location.pathname !== "/") {
        //this.props.searchResult({ variables: { searchInput: ""}});
        this.props.history.push("/");
      }
      setTimeout(
        () =>
          this.props.searchResult({
            variables: { searchInput: this.state.srch.trim() }
          }),

        url.searchParams.set("searchText", this.state.srch.trim()),
        history.push(`?${url.searchParams.toString()}`),
        1000
      );
    }
  };
  clr = (type) => {
    var url = new URL(window.location);
    //clear search
    if (type === "search") {
      this.setState({ srch: "" });
      this.props.searchResult({ variables: { searchInput: "" } });
      if (url.searchParams.get("searchText")) {
        url.searchParams.delete("searchText")
        history.push(`?${url.searchParams.toString()}`)
      }
    } else if (type === "locationSearch") {
      this.setState({ value: "" });
      this.props.getLocation({ variables: { lat_lon: null } });
      this.props.getLocationName({ variables: { locationName: "" } })
      if (url.searchParams.get("location") && url.searchParams.get("locationName")) {
        url.searchParams.delete("location")
        url.searchParams.delete("locationName")
        history.push(`?${url.searchParams.toString()}`)
      }
    }
  };
  componentWillMount() {
    let { siteInfo, currentUser } = this.props;
    if (currentUser !== null) {
      this.setState({
        currentUser
      })
    }
    let image;
    siteInfo
      .refetch()
      .then(({ data }) => {
        if (data) {
          image = data.getSiteInfo && data.getSiteInfo.image;
          this.setState({
            image: image
          });
        }
      })
      .catch(e => console.log(e));
  }

  async componentWillReceiveProps(nxt) {
    let { getCacheCategoryData, categoryInfo, siteInfo, currentUser } = nxt
    if (nxt.getCacheData && nxt.getCacheData.inActive !== undefined) {
      this.setState({
        inActive: nxt.getCacheData.inActive
      });
    }

    if (currentUser !== null) {
      this.setState({
        currentUser
      })
    }

    if (nxt.discardStuffStatus !== this.props.discardStuffStatus) {
      this.setState({ isPaneOpen: false });
    }

    if (nxt.stuffImage !== this.props.stuffImage) {
      this.setState({
        showDiscard: true
      });
    }

    if (nxt.categorySubmitted !== this.props.categorySubmitted) {
      this.setState({
        showDiscard: false,
        sellingTitle: ""
      });
    }
    if (
      nxt.contextConsumerInner.stuffImage !==
      this.props.contextConsumerInner.stuffImage
    ) {
      this.setState({
        showDiscard: true
      });
    }

    if (nxt.clearValue !== this.props.clearValue) {
      this.setState({
        sellingTitle: ""
      });
    }

    if (nxt.postDone !== this.props.postDone) {
      this.setState({
        sellingTitle: this.props.t("Homepageheader._Whatselling")
      });
    }

    // if(nxt.postAnotherListing === this.props.postAnotherListing) {
    //   this.setState({
    //     sellingTitle: "What are you selling?"
    //   })
    // }

    if (
      nxt.getCacheSearchInput.searchInput !==
      this.props.getCacheSearchInput.searchInput
    ) {
      this.setState({
        srch: nxt.getCacheSearchInput.searchInput
      });
    }
    if (nxt.getLoactionNameData.locationName !== this.props.getLoactionNameData.locationName) {
      this.setState({
        value: nxt.getLoactionNameData.locationName
      })
    }
    if (getCacheCategoryData !== undefined && getCacheCategoryData !== "") {
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == getCacheCategoryData).map(v => {
        this.setState({
          filterData: v.fields
        })
      })
    }

    if (siteInfo.getSiteInfo) {
      let { googleApi } = siteInfo.getSiteInfo;
      this.setState({
        googleApi
      });
    }
  }

  handleChat() {
    this.props.history.push("/chat/conversation");
  }
  redirect(e, val) {
    e.preventDefault();
    //e.stopPropagation();
    //this.props.inActiveScreen({variables: { inActive: false }});
    switch (val.key) {
      case "logout":
        this.props.logOut({ variables: { type: "user" } }).then(({ data }) => {
          if (data.logOut) {
            //this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            this.props.getCategoryId({ variables: { categoryId: "" } });
            this.props.getPrice({ variables: { max: null, min: null } });
            this.props.getSortBy({ variables: { sort: "Most Recent" } });
            this.props.getLocation({ variables: { lat_lon: null } });
            this.props.getLocationName({ variables: { locationName: "" } });
            this.props.searchResult({ variables: { searchInput: "" } });
            this.props.getRadius({ variables: { radius: "" } })
            this.props.AdvancedFiltersubmit({
              fieldChild: [],
              rangeFilter: []
            });
            sessionStorage.clear();
          }
        });
        break;
      default:
        break;
    }
  }

  //   componentWillUpdate(nextProps, nextState) {
  //     let { loggedUser } = this.props
  //     if(nextProps.location.pathname == "/chat"){
  //       loggedUser.refetch();
  //     }
  //  }

  aboutPage = () => {
    this.setState({
      aboutModal: true
    });
  };
  // closeModal() {
  //   this.setState({ aboutModal: false });
  // }

  handleLogin(open, isLogged) {
    let { updateLoginPopupStatus, loggedUser } = this.props;
    updateLoginPopupStatus({ variables: { isOpen: open } });
    if (isLogged) {
      loggedUser.refetch();
      this.setState({
        currentUser: loggedUser.getCurrentUser && loggedUser.getCurrentUser
      });

      //console.log("currentUser", currentUser);
    }
    // this.handleActiveScreen()
  }
  handleActiveScreen() {
    document.body.classList.toggle("scrollDisable");
    this.state.inActive
      ? this.props.inActiveScreen({ variables: { inActive: false } })
      : this.props.inActiveScreen({ variables: { inActive: true } });
  }

  /* afterOpenModal = () => {
    // references are now sync"d and can be accessed.
    this.subtitle.style.color = "#f00";
  } */

  closeModalSlide = async type => {
    if (type === "Discard") {
      document.body.classList.remove("scrollDisable");
      await this.setState({
        modalIsOpen: false,
        showDiscard: false,
        isPaneOpen: false
      });
    } else {
      this.setState({ modalIsOpen: false, showDiscard: true });
    }
  };

  closeSlidingPanel = discardType => {
    if (discardType === true) {
      this.setState({ modalIsOpen: true, isPaneOpen: true, showDiscard: false });
    } else {
      document.body.classList.remove("scrollDisable");
      this.setState({ isPaneOpen: false });
      // document.body.style = "overflow-y:auto !important";
    }
  };

  redirectURl = () => {
    window.scrollTo(0, 0)
    if (window.location.pathname === "/") {
      const clear = this.state.clearFilter;
      this.setState({
        clearFilter: !clear,
        srch: "",
        value: "",
        locationSearch: ""
      });
      this.props.clearFilter(this.state.clearFilter);
      this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
    }
    else {
      this.setState({
        srch: "",
        value: "",
        locationSearch: ""
      })
      this.props.getCategoryId({ variables: { categoryId: "" } });
      this.props.getPrice({ variables: { max: 0, min: 0 } });
      this.props.getSortBy({ variables: { sort: "Most Recent" } });
      this.props.getLocation({ variables: { lat_lon: null } });
      this.props.getLocationName({ variables: { locationName: "" } });
      this.props.searchResult({ variables: { searchInput: "" } });
      this.props.getRadius({ variables: { radius: "" } })
      history.push("/");
    }
  };

  openHeaderModel = () => {
    document.body.classList.toggle("scrollDisable");
    this.setState({ isPaneOpen: true });
  };

  // getGeoInfo = () => {
  //   axios
  //     .get("https://ipapi.co/json/")
  //     .then(response => {
  //       let data = response.data;
  //       this.setState({
  //         city: data.city
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  openProfile = () => {
    this.props.history.push(`/EditProfile/${this.state.currentUser.id}`);
    this.handleActiveScreen();
  };
  closePanle = () => {
    this.handleActiveScreen();
  };

  afterOpenModal() {
    // this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false, aboutModal: false });
  }

  categortResponsiveFilter = (type, image) => {
    //console.log("object", type, image)
    this.setState({
      responsiveCategory: type,
      responsiveCategoryimage: image
    });
  };

  saveFilter = () => {
    this.setState({
      showModal: false
    });
  };
  handleInputChange(e) {
    this.setState({ locationSearch: e.target.value, value: e.target.value });
  }

  handleSelectSuggest(suggest) {
    var url = new URL(window.location);
    if (suggest !== undefined && suggest !== null) {
      let { match } = this.props;
      let id = match.params.id;
      const lat_lon = suggest.geometry.location
      let responseData = mapLocation1(suggest)
      var location = {
        address: suggest.formatted_address,
        city: responseData.locality || responseData.administrative_area_level_2,
        state: responseData.administrative_area_level_1,
        country: responseData.country,
        pincode: responseData.postal_code,
        lat_lon: [lat_lon.lat(), lat_lon.lng()],
      };
      this.props.getLocation({ variables: { lat_lon: location && location.lat_lon } });
      this.props.getLocationName({ variables: { locationName: location.address } })
      this.setState({
        location: location,
        locationSearch: "Sheikhupura",
        value: suggest.formatted_address
      })
    }
    if (Object.keys(location).length > 0) {
      url.searchParams.set("location", location && location.lat_lon.join("_"));
      url.searchParams.set("locationName", location.address)
    }
    history.push(`?${url.searchParams.toString()}`)
  }
  handleSearch = () => {
    document.body.classList.toggle("scrollDisable");
    this.setState({
      locModalisOpen: true
    })
  }
  render() {
    let {
      inActive,
      srch,
      discardStuff,
      showDiscard,
      headerStuffClicked,
      sellingTitle,
      filterData,
      googleApi,
      location,
      value,
      locationSearch
    } = this.state;
    let { contextConsumerInner } = this.props;


    const profileList = [
      {
        key: "discover",
        name: this.props.t("Homepageheader.Discover"),
        icon: "fa fa-home",
        needLogin: false,
        path: "/"
      },
      {
        key: "chat",
        name: this.props.t("Homepageheader.Chat"),
        icon: "fa fa-commenting",
        needLogin: true,
        path: "/chat/conversation"
      },
      {
        key: "profile",
        name: this.props.t("Homepageheader.MyProfile"),
        icon: "fa fa-user",
        needLogin: true,
        path: "/EditProfile"
      },
      {
        key: "logout",
        name: this.props.t("Editprofile._Logout"),
        icon: "fa fa-sign-out",
        needLogin: true,
        path: "/"
      },
      //{key: "about", name:"About Passup", icon:"fa fa-info", needLogin: false, path: "about"},
      {
        key: "terms",
        name: this.props.t("footer._termsandConditions"),
        icon: "fa fa-bookmark",
        needLogin: false,
        path: "/pages/terms_and_conditions"
      },
      {
        key: "policy",
        name: this.props.t("footer._privacypolicy"),
        icon: "fa fa-building",
        needLogin: false,
        path: "/pages/privacy_policy"
      }
    ];

    let { classes, currentUser, t } = this.props;
    let currenList =
      currentUser && currentUser.id
        ? profileList
        : profileList.filter(f => !f.needLogin);

    return (
      <div className="inner_page">
        <ProductConsumer>
          {ContextValue => (
            <>
              <Modal
                isOpen={this.state.aboutModal}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                contentLabel="Minimal Modal Example"
                style={customStyles1}
              >
                <section className="iHQQug">
                  <div className="closeabou">
                    <button
                      type="button"
                      onClick={this.closeModal}
                      className=" float-left location-close ltn"
                    >
                      <span className="clsbtn" data-dismiss="modal">
                        {" "}
                        ×{" "}
                      </span>
                    </button>
                  </div>
                  <div className="listitempas">
                    <ul>
                      <li> About Passup</li>
                      <li> Help</li>
                      <li> Jobs</li>
                      <li> Safety Tips</li>
                      <li> Passup Community details </li>
                      <li> Terms and Condition</li>
                      <li> Best Practices</li>
                    </ul>
                  </div>
                </section>
              </Modal>
              <DiscardPopup
                isOpen={this.state.modalIsOpen}
                //onAfterOpen={this.afterOpenModal}
                //onRequestClose={this.closeModalSlide}
                style={customStyles}
                contentLabel="Example Modal"
                id="modal1"
              >
                <div className="discardPopup">
                  <h3>{t("Homepageheader._notposted")}</h3>
                  <hr />
                  <section>
                    <article>
                      <p className="nn_popup_title1">{t("Homepageheader._postit")}</p>
                    </article>
                  </section>
                  <footer>
                    <div className="nn_discard_btn">
                      <button
                        className="btn1"
                        onClick={() => this.closeModalSlide("PostList")}
                      >
                        {" "}
                        {t("Homepageheader._Continue")}
                      </button>
                      <button
                        className="btn2"
                        onClick={() => this.closeModalSlide("Discard")}
                      >
                        {" "}
                        {t("Homepageheader._Discard")}
                      </button>
                    </div>
                  </footer>
                </div>
              </DiscardPopup>
              <DiscardPopup
                isOpen={this.state.locModalisOpen}
                style={customStyles}
                contentLabel="Example Modal"
                id="modal1"
              >
                <div className="LocationPopup">
                  <div onClick={this.handleCloseModal} className="nn_modal">
                    <span>{this.props.t("Homepageheader._locationCtn")}</span> <CloseIcon className="nn_close_icon" />
                  </div>
                  <div className="searchfield nn_search">
                    <div className="searchctn">
                      <LocationOnIcon className="nn_locIcon" />

                      {(this.state.googleApi !== undefined && this.state.googleApi !== null) &&

                        <ReactGoogleMapLoader
                          params={{
                            key: this.state.googleApi,
                            libraries: "places,geocode",
                          }}
                          render={(googleMaps) =>
                            googleMaps && (
                              <ReactGooglePlacesSuggest
                                autocompletionRequest={{ input: locationSearch }}
                                googleMaps={googleMaps}
                                onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                customRender={prediction => (
                                  <div className="nn_locationDropdown">
                                    {prediction
                                      ? prediction.description
                                      : "No results"}
                                  </div>
                                )}
                              >
                                <input
                                  type="text"
                                  value={value}
                                  placeholder={this.props.t("Homepageheader._searchLocation")}
                                  onChange={this.handleInputChange.bind(this)}
                                  className="searchinput"
                                />
                              </ReactGooglePlacesSuggest>
                            )
                          }
                        />
                      }
                    </div>
                    {value.length > 0 && (
                      <button onClick={() => this.clr("locationSearch")} className="closeicon">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </DiscardPopup>
              <Headermain id="cls_header">
                <div className="headermain" id="hdrFx" ref={(header) => { this.header = header }}>
                  <div className="headerleft">
                    <div className="logo">
                      <a onClick={this.redirectURl}><img className="logoimg" src={this.state.image} alt="logo" /></a>
                    </div>
                    <div className="searchfield">
                      <div className="searchctn">
                        <svg className="MuiSvgIcon-root-78 searchicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                        </path><path fill="none" d="M0 0h24v24H0z"></path></svg>
                        <input
                          className="searchinput"
                          type="text"
                          name=""
                          placeholder={this.props.t(
                            "Homepageheader._Whatlooking"
                          )}
                          onChange={this.handleChange}
                          value={this.state.srch}
                          onKeyDown={this.goHome}
                        />
                      </div>
                      {srch.length > 0 && (
                        <button onClick={() => this.clr("search")} className="closeicon">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="searchfield nn_search">
                      <div className="searchctn">
                        <svg className="MuiSvgIcon-root searchicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" tabIndex="-1" title="Room" data-ga-event-category="material-icons" data-ga-event-action="click" data-ga-event-label="Room"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                        {(this.state.googleApi !== undefined && this.state.googleApi !== null) &&
                          <ReactGoogleMapLoader
                            params={{
                              key: this.state.googleApi,
                              libraries: "places,geocode",
                            }}
                            render={(googleMaps) =>
                              googleMaps && (
                                <ReactGooglePlacesSuggest
                                  autocompletionRequest={{ input: locationSearch }}
                                  googleMaps={googleMaps}
                                  onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                  customRender={prediction => (
                                    <div className="nn_locationDropdown">
                                      {prediction
                                        ? prediction.description
                                        : "No results"}
                                    </div>
                                  )}
                                >
                                  <input
                                    type="text"
                                    value={value}
                                    placeholder={this.props.t("Homepageheader._searchLocation")}
                                    onChange={this.handleInputChange.bind(this)}
                                    className="searchinput"
                                  />
                                </ReactGooglePlacesSuggest>
                              )
                            }
                          />
                        }
                      </div>
                      {value.length > 0 && (
                        <button onClick={() => this.clr("locationSearch")} className="closeicon">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="nn_mob_searchbox" onClick={this.handleSearch}>
                      <LocationOnIcon className="nn_locIcon" />
                    </div>
                  </div>
                  <div className="headerright">

                    {currentUser && currentUser.id ? (
                      ""
                    ) : (
                      <div className="login">
                        <Button
                          onClick={e => this.handleLogin(true)}
                          className="loginbtn"
                        >
                          {this.props.t("Homepageheader._login")}
                        </Button>
                      </div>
                    )}
                    <Query query={GET_LOGIN_POPUP_STATE}>
                      {({ loading, data }) => (
                        <div className="reslogin">
                          {!loading && data && data.isOpen ? (
                            <LoginComponent
                              onClick={this.handleLogin}
                              open={data.isOpen}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </Query>
                    <div className="ressell" ref={ref => (this.el = ref)}>
                      <Button
                        onClick={() => this.openHeaderModel()}
                        className="sellstuffbtn"
                      >
                        {this.props.t("Homepageheader._Sellstuff")}
                        <Camera
                          className="cameraicon"
                        />
                      </Button>
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
                        isOpen={this.state.isPaneOpen}
                        title={sellingTitle}
                        onRequestClose={() => {
                          //console.log("test")
                          //this.setState({ isPaneOpen: false });
                        }}
                      >
                        <div>
                          {
                            <Category
                              headerStuffClicked={headerStuffClicked}
                              discardStuffValue={discardStuff}
                              manageBeforeLogin={ContextValue.stuffValue}
                              refetchValue={ContextValue}
                              clickPosting={this.props.clickPosting}
                              clearValue={this.props.clearValue}
                              showValue={this.props.showValue}
                              postDone={this.props.postDone}
                              closeSlidingPanel={this.closeSlidingPanel}
                            />
                          }
                        </div>
                      </SlidingPane>
                    </div>
                    <div className="resfilte">
                      <button
                        type="button"
                        //role="button"
                        onClick={this.handleOpenModal}
                        className="sc-iwsKbI sc-gqjmRU cDiii"
                        data-test="filter"
                        data-testid="filter"
                      >
                        {/* <svg viewBox="0 0 24 24" width="24" height="24">
                          <path                            
                            d="M17.724 18.5c-.577 1.515-2.03 2.59-3.729 2.59-1.7 0-3.152-1.075-3.729-2.59h-6.85c-.755 0-1.369-.672-1.369-1.5s.614-1.5 1.37-1.5h6.885c.6-1.467 2.027-2.5 3.693-2.5s3.094 1.033 3.693 2.5h2.99c.756 0 1.37.672 1.37 1.5s-.614 1.5-1.37 1.5h-2.954zM5.312 5.5C5.912 4.033 7.34 3 9.006 3s3.094 1.033 3.693 2.5h7.885c.756 0 1.37.672 1.37 1.5s-.614 1.5-1.37 1.5h-7.85c-.577 1.515-2.028 2.59-3.728 2.59-1.7 0-3.152-1.075-3.73-2.59H3.324c-.756 0-1.37-.672-1.37-1.5s.614-1.5 1.37-1.5h1.99zm3.694 3.307c.939 0 1.712-.783 1.712-1.762 0-.98-.773-1.762-1.712-1.762-.94 0-1.712.783-1.712 1.762 0 .98.773 1.762 1.712 1.762zm4.99 10c.938 0 1.711-.783 1.711-1.762 0-.98-.773-1.762-1.712-1.762-.94 0-1.712.783-1.712 1.762 0 .98.773 1.762 1.712 1.762z"
                          ></path>
                        </svg> */}
                        Filter
                      </button>
                      <div className="clsoeres">
                        <FilterModal
                          isOpen={this.state.showModal}
                          onAfterOpen={this.afterOpenModal}
                          onRequestClose={this.closeModal}
                          className="Modal11 cls_filmodal"
                          style={customStyles3}
                          contentLabel="Example Modal"
                        >
                          <div className="popfilltegh">
                            <div className="border-btm">
                              <div className="jsvhtV">
                                <button
                                  type="button"
                                  //role="button"
                                  onClick={this.handleCloseModal}
                                  className="sc-iwsKbI sc-gqjmRU jxllvb"
                                  data-test="filters.cancel"
                                  data-testid="filters.cancel"
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
                              <div className="fXFqhW">
                                <h2 className="iVJeIQ">
                                  {" "}
                                  {this.props.t(
                                    "Homepageheader._Filters"
                                  )}{" "}
                                </h2>
                              </div>
                            </div>
                            <div className="overallpaddpp">
                              <div className="fcxopb">
                                <h1>
                                  {" "}
                                  <span>
                                    {" "}
                                    {this.props.t("Homepageheader._Categories")}
                                  </span>{" "}
                                </h1>
                              </div>
                              <div className="nn_category">
                                <ProductConsumer>
                                  {value => (
                                    <CategoryFilter
                                      getCacheCategoryData={this.props.getCacheCategoryData}
                                      AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                                    />
                                  )}
                                </ProductConsumer>
                              </div>
                              {((this.props.getCacheCategoryData !== undefined) && (this.props.getCacheCategoryData !== "")) ? (
                                <div className={(filterData && filterData.length == 0 ? "cls_overvisi" : "") + " " + "nn_adfilter"}>
                                  <HomeFilter />
                                  {((this.props.getCacheCategoryData) && filterData.length > 0) ? (
                                    <ProductConsumer>
                                      {value => (
                                        <DynamicFilter
                                          categoryId={this.props.getCacheCategoryData}
                                          AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                                          handleCloseModal={this.handleCloseModal}
                                          filterValue={contextConsumerInner.AdvancedFilter}
                                          filterData={filterData}
                                        />
                                      )}
                                    </ProductConsumer>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ) : ""}
                            </div>
                          </div>
                        </FilterModal>
                      </div>
                    </div>
                    {currentUser && currentUser.id ? (
                      <div
                        onClick={this.handleChat}
                        className={
                          classes.icon +
                          " " +
                          classes.iconChatBubbles +
                          " " +
                          classes.msgIcon +
                          " " +
                          classes.dMdBlock +
                          " " +
                          classes.dNone
                        }
                      >
                        <div className="pos_rel">
                          {currentUser.unreadMessage > 0 &&
                            <div className="notification homepgheade">
                            </div>}

                        </div>
                        <div className="chat-bu">
                          <ChatBubble
                            className={
                              classes.chatBubble +
                              " " +
                              classes.ml2 +
                              " " +
                              classes.icon
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="menumain">
                      <div className={classes.navOverlay} />
                      <Button
                        onClick={this.handleActiveScreen}
                        className="menubtn">
                        {currentUser && currentUser.id ? (
                          <img
                            src={currentUser.profileImage}
                            width={"40px"}
                            height={"40px"}
                            className="circleover"
                          />
                        ) : (
                          <Dehaze className="nn_menu" />
                        )}
                      </Button>
                      {inActive ? (
                        <MenuPopup>
                          <div
                            className={classes.headerProfileList + " homePopup"}
                            ref={this.props.setRef}
                          >
                            <div>
                              {currentUser && currentUser.id ? (
                                <div
                                  className={
                                    classes.profileSet + " rtlprofileset "
                                  }
                                >
                                  <div
                                    onClick={this.openProfile}
                                  >
                                    <img
                                      className="sidebarprofile"
                                      src={currentUser.profileImage}
                                    />
                                  </div>
                                  <div
                                    className={
                                      classes.profileName + " rtlprofilename "
                                    }
                                    onClick={this.openProfile}
                                  >
                                    {currentUser.userName}
                                  </div>
                                  <div
                                    className={classes.profilePlace + " nn_textClr"}
                                    onClick={this.openProfile}
                                  >
                                    {/* {city} */}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={
                                    classes.profileSet + " rtlprofileset "
                                  }
                                >
                                  <div
                                    onClick={e => this.handleLogin(true)}
                                  >
                                    <img
                                      src={defaultImg}
                                      width={"40px"}
                                      height={"40px"}
                                    />
                                  </div>
                                  <div
                                    className={classes.profileName}
                                    onClick={e => this.handleLogin(true)}
                                  >
                                    {this.props.t("Homepageheader._Logininnow")}
                                  </div>
                                  <div
                                    className={classes.profilePlace + " nn_textClr"}
                                    onClick={e => this.handleLogin(true)}
                                  >
                                    {this.props.t(
                                      "Homepageheader._yourenotlogged"
                                    )}
                                  </div>
                                </div>
                              )}

                              <nav className="bgresclg">
                                {currenList.map((m, i) => {
                                  return (
                                    <div
                                      onClick={e => this.redirect(e, m)}
                                      key={i}
                                    >
                                      <span className="menu-icon">
                                        <div>
                                          {" "}
                                          {m.path === "/EditProfile" ? (
                                            <Link
                                              className="sideMenu"
                                              onClick={this.handleActiveScreen}
                                              to={`${m.path}/${currentUser.id}`}
                                            >
                                              <span className="menu-subicon">
                                                <i className={m.icon}></i>
                                              </span>{" "}
                                              <span>{m.name}</span>
                                            </Link>
                                          ) : (
                                            <>
                                              {m.path === "about" ? (
                                                <div
                                                  className="sideMenu"
                                                  onClick={this.aboutPage}
                                                  data-toggle="modal"
                                                >
                                                  <span className="menu-subicon">
                                                    <i className={m.icon}></i>
                                                  </span>
                                                  <span className="aboupop">
                                                    {m.name}
                                                  </span>
                                                </div>
                                              ) : (
                                                <Link
                                                  className="sideMenu"
                                                  onClick={
                                                    this.handleActiveScreen
                                                  }
                                                  to={m.path}
                                                >
                                                  <span className="menu-subicon">
                                                    <i className={m.icon}></i>
                                                  </span>
                                                  <span>{m.name}</span>
                                                </Link>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </span>
                                    </div>
                                  );
                                })}
                              </nav>
                            </div>
                            <div onClick={this.closePanle} className="bg_layer" />
                          </div>
                        </MenuPopup>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </Headermain>
              {currentUser && currentUser.id && (history.location.pathname !== "/chat/conversation") ?
                <ChatPageIcon>
                  <div className="mesg_conver">
                    <Link to={`/chat/conversation`}>
                      <div className="pos_rel">
                        {currentUser && currentUser.unreadMessage > 0 &&
                          <div className="notification homepgheade">
                          </div>}
                      </div>
                      <ChatBubble
                        className={
                          classes.chatBubble +
                          " " +
                          classes.ml2 +
                          " " +
                          classes.icon
                        }
                      />
                    </Link>
                  </div>
                </ChatPageIcon> : ""
              }
            </>
          )}
        </ProductConsumer>
      </div>
    );
  }
}

Header.propTypes = {
  onClick: PropTypes.func
};

var HeaderComponent = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(LOG_OUT, { name: "logOut" }),
  graphql(VERIFY_EMAIL, { name: "verifyEmail" }),
  graphql(GET_CURRENT_USER, { name: "loggedUser" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(SEARCH_INPUT, { name: "searchResult" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
    name: "pageCountFilter",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(GET_CACHE_STATE, {
    name: "getCacheData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_SEARCH_INPUT, {
    name: "getCacheSearchInput",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),

  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(LOCATION_NAME, { name: 'getLocationName' }),
  graphql(GET_LOCATION_NAME, {
    name: "getLoactionNameData",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(RADIUS, { name: 'getRadius' }),
  graphql(GET_RADIUS, {
    name: "getCacheRadiusData",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(LOCATION, { name: 'getLocation' }),
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
)(Header);

export default withTranslation("common")(withStyles(styles)(HeaderComponent));

// 406856446609936
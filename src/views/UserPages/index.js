import React from "react";
import { compose, graphql,ApolloConsumer } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  GET_CATEGORIES,
  UPDATE_CHAT_GROUP,
  GET_CURRENT_USER,
  GET_CACHE_STATE,
  ISOPEN,
  INACTIVE,
  GET_CATEGORY_ID,
  CATEGORY_ID,
  GET_SEARCH_INPUT,
  SEARCH_INPUT,
  GET_LOCATION,
  GET_SITE_INFO,
  LOCATION,
  PRICE,
  GET_PRICE_DETAILS,
  SORTBY,
  GET_SORTBY_DETAILS,
  DATEBY,
  GET_DATEBY_DETAILS,
  GET_REDIRECT_STATE,
  GET_REDIRECTFILTER_STATE,
  GET_CURRENCIES,
  RADIUS,
  GET_RADIUS,
  LOCATION_NAME,
  GET_LOCATION_NAME
} from "../../queries";
import {Helmet}  from "react-helmet";
import Products from "./Dashboard/Products.jsx";
import CategoryFilter from "./Dashboard/Filters/Category.jsx";
import Chat from "./Chat/index.jsx";
import Header from "./Header/index.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import pagesStyle from "../../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import HomeFilter from "./home_filter.js";
import Footer from "./Footer/Footer.jsx";
import { animateScroll as scroll } from "react-scroll";
import Slider from "react-slick";
import history from "../../history";

import smart_banner2 from "../../assets/img/smart_banner_shape_2.svg";
import smart_banner1 from "../../assets/img/smart_banner_shape_1.svg";


import "react-sliding-pane/dist/react-sliding-pane.css";
import { ProviderRefech, ProductConsumer } from "./ProductContext.js";
import googleplay from "../../assets/img/badge_googleplay.svg";
import appstroe from "../../assets/img/badge_appstore.svg";
//import './css/stylenew.css';
import './css/orderview.css';
import './css/script.js';
import { Main,Banner,HomeProduct,ScrollTop } from './css/styledcomponents';
import { colors } from "@material-ui/core";

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

// const style = {
//   marginTop: "15px",
//   marginBottom: "20px"
// };

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cUser: {},
      openHandler: false,
      showScroll: false,
      bannerVisible: true,
      bannerVisibleFirst: true,
      title: "",
      favicon: "",
      iosLink: "",
      androidLink: "",
      isPaneOpen: false,
      clearFilter: false,
      bannerImages: [],
      bannerUrl: "",
      categoryList: "",
      currency: "",
      unit:""
    };
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);

    this.bannerLink = this.bannerLink.bind(this);
  }
  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }
  componentWillMount() {
    let { currentUser, siteInfo, categoryInfo } = this.props;
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });

    siteInfo.refetch();

    if (siteInfo.getSiteInfo) {
      let { iosLink, androidLink, favicon, name, defaultUnit } = siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink,
        defaultUnit:defaultUnit
      });
    }
    let bannerImages = [];
    let bannerUrl = "";
    categoryInfo
      .refetch()
      .then(({ data }) => {
        if (data) {
          bannerImages =
            data.getCategoryDetails && data.getCategoryDetails.adBannerDetails;
          this.setState({
            bannerImages: bannerImages,
            bannerUrl: bannerUrl
          });
        }
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    setTimeout(function(){
      window.scrollTo(0, 0)
    }, 2000);
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
    var cls_header_height = document.getElementById("hdrFx")
    var cls_he = cls_header_height.clientHeight
    document.getElementById("categorydesk").style.marginTop = cls_he + "px";
    // document.getElementById("categorydesk1").style.marginTop = 80 + cls_he  + "px";
    const storage = localStorage.getItem("evnt");
    const storageTop = localStorage.getItem("banne");
    if (storage === 1) {
      this.setState({
        bannerVisible: false
      });
    }
    if (storageTop === 2) {
      this.setState({
        bannerVisibleFirst: false
      });
    }
    var url = new URL(window.location);
        //category
        if(url.searchParams.get("categoryId")){
          this.props.getCategoryId({ variables: { categoryId: url.searchParams.get("categoryId") } });
        }
        //sort
        if(url.searchParams.get("sort")){
          this.props.getSortBy({ variables: { sort: url.searchParams.get("sort") } });
        }

        //price min and max
        if(url.searchParams.get("min") && !url.searchParams.get("max") ){
          this.props.getPrice({
            variables: { max: "", min: url.searchParams.get("min") }
          });
        }else if(!url.searchParams.get("min") && url.searchParams.get("max")){
          this.props.getPrice({
            variables: { max: url.searchParams.get("max"), min: "" }
          });
        }else if(url.searchParams.get("min") && url.searchParams.get("max")){
          this.props.getPrice({
            variables: { max: url.searchParams.get("max"), min: url.searchParams.get("min") }
          });
        }

        //location
        if(url.searchParams.get("location")){
          let locationArrayData = url.searchParams.get("location").split("_")
          this.props.getLocation({
            variables: {
              lat_lon: [
                parseFloat(locationArrayData[0]) , parseFloat(locationArrayData[1])
              ],
            },
          });
        }

        //location name
        if(url.searchParams.get("locationName")){
          let placeName = url.searchParams.get("locationName")
          this.props.getLocationName({
            variables: { locationName: placeName },
          })
        }

        //radius
      if(url.searchParams.get("radius")){
          let radiusData = url.searchParams.get("radius")
          this.props.getRadius({variables:{radius:radiusData.toString()}})
        }


        // search text
        if(url.searchParams.get("searchText")){
          let searchKey = url.searchParams.get("searchText")
          this.props.searchResult({
            variables: { searchInput: searchKey }
          })
        }
  }

  // paramsHandling = (props) => {
  //   var url = new URL(window.location);
  //   if(props.getCacheCategoryData.categoryId !== undefined && props.getCacheCategoryData.categoryId !== "" ){
  //       url.searchParams.set("categoryId",props.getCacheCategoryData.categoryId)
  //       //  history.push(`?${url.searchParams.toString()}`)
  //     }

  //   if(props.getCacheSearchInput.searchInput !== undefined && props.getCacheSearchInput.searchInput != ""){
  //     url.searchParams.set("searchText",props.getCacheSearchInput.searchInput.trim())
  //        // history.push(`?${url.searchParams.toString()}`)
  //     }

  //   if(props.getPriceData.min !== undefined && props.getPriceData.min != ""){
  //     url.searchParams.set("min",props.getPriceData.min)
  //        // history.push(`?${url.searchParams.toString()}`)
  //     }

  //   if(props.getPriceData.max !== undefined && props.getPriceData.max != ""){
  //     url.searchParams.set("max",props.getPriceData.max)
  //        // history.push(`?${url.searchParams.toString()}`)
  //     }

  //   if(props.getCacheLocationData.lat_lon !== undefined && props.getCacheLocationData.lat_lon !== []){
  //     let latlon_Array = [props.getCacheLocationData.lat_lon[0] , props.getCacheLocationData.lat_lon[1]]
  //     url.searchParams.set("location",latlon_Array.join("_"))
  //      // history.push(`?${url.searchParams.toString()}`)
  //   }
  //   if(props.getLoactionNameData.locationName !== undefined && props.getLoactionNameData.locationName !== ""){
  //       url.searchParams.set("locationName",props.getLoactionNameData.locationName)
  //      // history.push(`?${url.searchParams.toString()}`)
  //   }

  //   if(props.getSortByData.sort !== undefined && props.getSortByData.sort !== "" ){
  //     url.searchParams.set("sort",props.getSortByData.sort)
  //    // history.push(`?${url.searchParams.toString()}`)
  //   }

  //   history.push(`?${url.searchParams.toString()}`)

  // }

  closeBannerEvent = () => {
    localStorage.setItem("evnt", 1);
    this.setState({
      bannerVisible: false
    });
  };

  closeBannerEventtop = () => {
    localStorage.setItem("banne", 2);
    this.setState({
      bannerVisibleFirst: false
    });
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

  setCategory = data => {
    const categoryData =
      data.getCategoryDetails && data.getCategoryDetails.category
        ? data.getCategoryDetails.category
        : [];
    this.setState({
      categoryList: categoryData
    });
  };

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
    document.documentElement.scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100);
    // console.log(pctScrolled);
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

  componentWillReceiveProps(nextProps) {
    let {
      currentUser,
      getCacheData,
      getCacheCategorytypeData,
      getCacheCategoryData,
      getCacheSearchInput,
      getCacheLocationData,
      getPriceData,
      getSortByData,
      getDateByData,
      getLoadCount,
      getLoadCountFilter,
      getCacheRadiusData
    } = nextProps;
    if (
      nextProps.getCacheData !== this.props.getCacheData ||
      nextProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
      nextProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
      nextProps.getCacheLocationData !== this.props.getCacheLocationData ||
      nextProps.getPriceData !== this.props.getPriceData ||
      nextProps.getDateByData != this.props.getDateByData ||
      nextProps.getSortByData !== this.props.getSortByData ||
      nextProps.getLoadCount !== this.props.getLoadCount ||
      nextProps.getLoadCountFilter !== this.props.getLoadCountFilter ||
      nextProps.getCacheRadiusData !== this.props.getCacheRadiusData
    ) {
      this.setState({
        inActive: getCacheData.inActive,
        categoryId: getCacheCategoryData.categoryId,
        searchInput: getCacheSearchInput.searchInput,
        lat_lon: getCacheLocationData.lat_lon,
        min_max: getPriceData,
        sortDate: getDateByData.sortDate,
        min:getPriceData && getPriceData.min,
        max:getPriceData && getPriceData.max,
        sort: getSortByData.sort,
        pageCount: getLoadCount.pageCount,
        pageCountFilter : getLoadCountFilter.pageCountFilter,
        radius: getCacheRadiusData.radius
      });
    }

    currentUser.refetch();

    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        favicon,
        defaultUnit
      } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink,
        defaultUnit:defaultUnit
      });
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
  handleClick(e, id) {
    e.preventDefault();
    this.props.getCategoryId({ variables: { categoryId: id } });
  }

  handleChange(event) {
    event.preventDefault();
    this.props.searchResult({ variables: { searchInput: event } });
  }
  handlePlacesChanged() {
    // this.props.getLocation({variables:{lat_lon:getCacheLocationData.lat_lon}})
  }

  gooApp = link => {
    window.open(link, "_blank");
  };

  bannerLink(bannerUrl, e) {
    window.open(bannerUrl, "_blank");
  }

  clearFilter = cng => {
    this.setState({
      clearFilter: cng
    });
  };

  head() {
    return (
      <Helmet>
        {/* <title>Home</title> */}
        <link rel="shortcut icon" href={this.state.favicon} />
      </Helmet>
    );
  }

  playStore = link => {
    window.open(link, "_blank");
  };

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    const { showScroll, bannerImages } = this.state;
    let { classes, match, history, location,siteInfo,getCacheCategoryData,categoryInfo } = this.props;
    let {
      inActive,
      cUser,
      categoryId,
      searchInput,
      lat_lon,
      min_max,
      sort,
      sortDate,
      bannerVisibleFirst,
      pageCount,
      pageCountFilter,
      radius,
      androidLink,
      iosLink,
      min,
      max,
      defaultUnit
    } = this.state;
    let inActiveStyle = inActive ? classes.inActive : "";
    // const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
    // const r = document.querySelector(':root').style;
    // r.setProperty('--theme-color',color1);
    // r.setProperty("--theme-color-hvr",(color1 + "bf"));
    return (
      <Main id="content">
        <ProviderRefech>
          {this.head()}
          <div className="dynamcss">
            {bannerVisibleFirst && (
              <div className="AtavF">
                <div className="enEXqW">
                  <div className="hqhhAk" onClick={this.closeBannerEventtop}>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="SmartBannerstyle__CrossStyled-sc-12kihzo-4 joVGli sc-jTzLTM fznnpf"
                    >
                      <path
                        d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"
                        fill="rgb(255, 255, 255)"
                      ></path>
                    </svg>
                  </div>
                  <div className="hRKplV">
                    <div className="hXHgcm">
                      <span>
                        {" "}
                        Download the free app to get the full experience
                      </span>
                    </div>

                      {/* <span> Android </span>{" "} */}
                  {this.state.androidLink !== "" ? ( <img src={googleplay} alt="" className="cfjxVa" onClick={() =>     this.playStore(androidLink)}/>) : "" }
                  {this.state.iosLink !== "" ? (   <img src={appstroe} alt="" className="cfjxVa" onClick={() =>         this.playStore(iosLink)}/> ) : "" }

                  </div>
                  <div className="gSnPVw">
                    <div className="hmzaZs">
                      <img src={smart_banner1} className="gmsWds" alt="" />
                      <img src={smart_banner2} className="dFLsJo" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={classes.wrap + " " + inActiveStyle + "nn_cate"}>
              <ProductConsumer>
                {value => (
                  <>
                    {/* <p>{value.mystate} mystate</p> */}
                    <div
                      className={
                        this.state.bannerVisibleFirst === true
                          ? "topbannev"
                          : "unvisible"
                      }
                    >
                      <Header
                        clearFilter={this.clearFilter}
                        AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                        stuffImage={value.stuffImage}
                        categorySubmitted={value.categorySubmitted}
                        CategoryWithImage={value.CategoryWithImage}
                        discardStuffStatus={value.discardStuff}
                        discardYourStuff={value.discardYourStuff}
                        manageBeforeLogin={value.stuffValue}
                        refetchValue={value}
                        match={match}
                        setRef={this.setRef}
                        location={location}
                        history={history}
                        currentUser={cUser}
                        postAnotherListing={value.postAnotherListing}
                        contextConsumerInner={value}
                        getCacheCategoryData={categoryId}
                        clickPosting={value.clickPosting}
                        clearValue={value.clearValue}
                        showValue={value.showValue}
                        postDone={value.postDone}

                      />
                    </div>
                  </>
                )}
              </ProductConsumer>
              <div className="nn_category" id="categorydesk">
              <ProductConsumer>
                      { value => (
                        <CategoryFilter
                            clearFilter={this.state.clearFilter}
                            getLoadCount={pageCount}
                            categoryList={this.state.categoryList}
                            AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                            FilterValue={value.FilterValue}
                            />
                       )}
              </ProductConsumer>
              </div>
              {location.pathname === "/chat/conversation" ? (
                <Chat
                  setRef={this.bRef}
                  history={history}
                  currentUser={cUser}
                />
              ) : (
                <div>
                  {((getCacheCategoryData.categoryId !== undefined) && (getCacheCategoryData.categoryId !== "")) ? (
                  "") : <Banner className={(categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.length > 0) ? "nn_banner" : "nn_bannnerHide"}>
                  <div
                    className={bannerImages.length > 0 ? "fKpnSY btFx banner" : "dfsdg"}
                  >
                    {/* <button type="button" role="button" className="SGfuc  gnzmKg" onClick={this.closeBannerEvent}>
                          <svg viewBox="0 0 24 24" width="24" height="24" className="sc-iRbamj dvYpcv"><path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path></svg>
                      </button> */}
                    {bannerImages.length > 0 && (
                      <Slider {...settings}>
                        {bannerImages
                          .filter(item => item.status !== "Inactive")
                          .map((item, i) => (
                            <>
                              <div key={i} data-id={item.id}>
                                <p
                                  onClick={this.bannerLink.bind(
                                    this,
                                    item.bannerUrl
                                  )}
                                >
                                  {" "}
                                <img src={item.webBannerImage} alt="" />{" "}
                                  {/* <LazyLoadImage
                                  alt={""}
                                  src={item.webBannerImage}
                                   />*/}
                                </p>
                              </div>
                            </>
                          ))}
                      </Slider>
                    )}
                  </div>
                  </Banner> }

                  <HomeProduct>
                  <div className="home_product" id="categorydesk1" style={{ ...((getCacheCategoryData.categoryId !== undefined) && (getCacheCategoryData.categoryId !== "")) ? {marginTop:"160px"}: {marginTop:"0px"}}}>
                    {/* <div
                      className={
                        bannerImages.length > 0
                          ? "top-add dUMWSw"
                          : "nobannerdyanamic"
                      }
                    >
                      <img src={topad} className="img-fluid" alt="" />
                    </div> */}

                 {/* <ProductConsumer>
                      { value => (
                        <CategoryFilter
                            clearFilter={this.state.clearFilter}
                            getLoadCount={pageCount}
                            categoryList={this.state.categoryList}
                            AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                            FilterValue={value.FilterValue}
                            />
                       )}
                  </ProductConsumer> */}
                    <div className="rermode">
                      <HomeFilter
                        clearFilter={this.state.clearFilter}
                        getCacheCategoryData={categoryId}
                        getLoadCount={pageCount}
                        getPriceData={min_max}
                        getSortByData={sort}
                        getDateByData={sortDate}
                        getCacheLocationData={lat_lon}
                        defaultUnit={this.state.defaultUnit}
                      />
                    </div>
                    <ApolloConsumer>
                    { client => (
                    <ProductConsumer>
                      {value => (
                        <Products
                          clearbyLocation={this.state.clearFilter}
                          currentUser={cUser}
                          client={client}
                          getCacheCategoryData={categoryId}
                          getCacheSearchInput={searchInput}
                          getCacheLocationData={lat_lon}
                          getPriceData={min_max}
                          min={min}
                          max={max}
                          getSortByData={sort}
                          getDateByData={sortDate}
                          getLoadCount={pageCount}
                          getCacheRadiusData={radius}
                          getLoadCountFilter={pageCountFilter}
                          history={history}
                          allproductsValue={value.mystate}
                          userEditClicked={value.userEditClicked}
                          userEditActivated={value.userEditActivated}
                          PostProduct={value.PostProduct}
                          postAnotherListing={value.postAnotherListing}
                          CategorySubmittedinProducts={
                            value.CategorySubmittedinProducts
                          }
                          categorySubmitted={value.categorySubmitted}
                          stuffImage={value.stuffImage}
                          stuffImageEdit={value.stuffImageEdit}
                          AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                          FilterValue={value.FilterValue}
                          AdvancedFilter={value.AdvancedFilter}
                          showValue={value.showValue}
                          postDone={value.postDone}
                          defaultUnit={this.state.defaultUnit}
                        />
                      )}
                    </ProductConsumer>
                      )}
                      </ApolloConsumer>
                  </div>
                  </HomeProduct>
                  <ApolloConsumer>
                    { client => (
                        <ProductConsumer>
                            {value => (
                              <Footer
                                getCategory={this.setCategory}
                                AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                                FilterValue={value.FilterValue}
                                AdvancedFilter={value.AdvancedFilter}
                                client={client}
                              />
                            )}
                          </ProductConsumer>
                    )}
                   </ApolloConsumer>
                  {showScroll && (
                    <ScrollTop>
                    <div className={cUser && cUser.id ? "anchor-fixed cls_loganchor" : "anchor-fixed"} onClick={this.scrollToTop}>
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
              )}
            </div>
          </div>
          {/* <SlidingPane
                          className="some-custom-class"
                          overlayClassName="some-custom-overlay-class"
                          isOpen={ this.state.isPaneOpen }
                          title="What are you selling"
                      onRequestClose={ () => {
                            this.setState({ isPaneOpen: false });
                          } }>
                          <div>{<Category />}</div>
                      </SlidingPane> */}
        </ProviderRefech>
      </Main>
    );
  }
}

var DashboardComponent = compose(
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),

  graphql(UPDATE_CHAT_GROUP, "updateChatGroup"),
  graphql(GET_CURRENT_USER, {
    name: "currentUser"
  }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_CACHE_STATE, {
    name: "getCacheData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(SEARCH_INPUT, { name: "searchResult" }),
  graphql(GET_CATEGORY_ID, {
    name: "getCacheCategoryData",
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
  graphql(GET_REDIRECT_STATE, {
    name: "getLoadCount",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),

  graphql(LOCATION, { name: "getLocation" }),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_CURRENCIES, { name: "currencyInfo" }),
  graphql(SORTBY, { name: "getSortBy" }),
  graphql(GET_SORTBY_DETAILS, {
    name: "getSortByData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
graphql(DATEBY, { name: 'getDateBy' }),
graphql(GET_DATEBY_DETAILS, {
  name: "getDateByData",
  options: () => ({
    fetchPolicy: 'cache-only'
  })
}),
graphql(GET_REDIRECTFILTER_STATE, {
  name: "getLoadCountFilter",
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
  graphql(LOCATION_NAME, { name: "getLocationName" }),
  graphql(GET_LOCATION_NAME, {
    name: "getLoactionNameData",
    options: () => ({
      fetchPolicy: "cache-only",
    }),
  })
)(Dashboard);

export default withStyles(pagesStyle)(DashboardComponent);
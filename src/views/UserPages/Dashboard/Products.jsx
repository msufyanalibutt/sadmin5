import React from "react";
import { compose, graphql, ApolloConsumer } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  LIKES_UPDATE,
  GET_CURRENT_USER,
  POPUP_STATE_UPDATE,
  GET_PRODUCT,
  CATEGORY_ID,
  GET_CATEGORIES,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE,
  GET_PRICE_DETAILS,
  PRICE,SORTBY,
  GET_SITE_INFO,
  CREATE_ROOM,
  IS_MODEL_CLOSE,
  GET_ROSTER,
  ROSTER_GROUPID,
  UPDATE_CHATNOW_STATUS,
  GET_ROSTER_GROUPID_DETAILS,
  IS_CATEGORY_REFETCH
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import ChatInput from "./ChatInput.jsx";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { Link } from "react-router-dom";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Category from "../Header/Category.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import empt from "../../../assets/img/empty.svg";
import skleton from "../../../assets/img/pro_skleton.png"; //preload image
import Ads from "./Ads.js"; //preload image
import tenProduct from "../../../assets/img/posting_card_1.svg";
import { Mutation } from "react-apollo";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Grid from '@material-ui/core/Grid';
import { getRoster, getSymbol } from "../../../helper.js";
import { ProductConsumer } from "../ProductContext.js";
import Modal from "react-modal";
import HomeFilter from "../home_filter";
import { withTranslation } from "react-i18next";
import DynamicFilter from "./DynamicFilter.jsx";
import MailIcon from '@material-ui/icons/Mail';
import Postimg from '../../../assets/img/make_money.png';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import CloseIcon from '@material-ui/icons/Close';
import history from "../../../history";
import sideImage  from '../../../assets/img/sidead.png';
import ChatWindow from "../Chat/ChatWindow";
import {DiscardPopup, Product} from '../css/styledcomponents';
import AdSense from 'react-adsense';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      filterData: [],
      openChatWindow: false,
      isPaneOpen: false,
      productState: [],
      progress: false,
      preLoadr: false,
      modalIsOpen: false,
      showDiscard: false,
      editSellUrStuff: false,
      editProductData: {},
      getProductMount: {},
      currConv : {},
      pageCount: 1,
      filterCount: 1,
      loadOff: false,
      updateAds: false,
      headerStuffClicked: false,
      postListing: this.props.t("Homepageheader._Whatselling"),
      copied: false,
      userEditClicked: "",
      preventScroll: true,
      carfillter: false,
      preventScrollSprt: 0,
      yearsForCar: { min: "1940", max: 2019 },
      milageForCar: { min: 0, max: 300000 },
      seatsForCar: { min: 0, max: 10 },
      selectedOption: null,
      loadCategoryData: "",
      loadSearchInput: "",
      loadLocationData: "",
      loadPriceData: "",
      loadSortByData: "",
      visible: 20,
      clickLoadMore: false,
      bodyType: "",
      transmission: [],
      fuelType: "",
      driveTrain: "",
      make: "",
      model: "",
      bodyTypeId: "",
      years: [],
      handleCarFilter: false,
      preventSpeedClick: true,
      selectedBodyType: [],
      transmissionType: [],
      selectedFuelType: [],
      selectedDriveTrain: [],
      transmissionId: [],
      modelView: false,
      spacing: "0",
      resetBtn: false,
      price: { min: '', max: '' },
      sort: '',
      resetPrice: false,
      resetSort: false,
      priceRange: { min: "", max: "" },
      limitReached: false,
      googleAd: false,
      googleAdSenseId: "",
      productPageSlotId: ""
    };
    this.handleClick = this.handleClick.bind(this);
    // this.handleChat = this.handleChat.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    this.setState({
      preLoadr: true
    })
    let { productsInfo,siteInfo} = this.props;
    siteInfo.refetch();
    productsInfo.refetch({ filter: {} }).then(({ data }) => {
      if (data) {
        this.setState({
          allProducts: data.getAllProducts,
          limitReached : false,
          preLoadr: false
        });
      } else {
        this.setState({
          preLoadr: true,
          limitReached : false
        });
      }
    });
    if(siteInfo.getSiteInfo){
      let info = siteInfo.getSiteInfo
      this.setState({
        googleAd: info.googleAdsence,
        googleAdSenseId: info.googleAdSenseId,
        productPageSlotId: info.productPageSlotId
      })
    }
  }
  
  resetPricebtn = () => {
    var x=window.scrollX;
    var y=window.scrollY;
        window.onscroll=function(){window.scrollTo(x, y);};
        this.props.getPrice({ variables: { max: 0, min: 0 } });
        // this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        this.setState({
          price: { min: '', max: '' },
          resetPrice: !this.state.resetPrice
        });
        window.addEventListener('scroll', this.enableScrolling);

    let searchParams  = new URLSearchParams(window.location.search)
      searchParams.delete("min")
      searchParams.delete("max")
      history.push(`?${searchParams.toString()}`)
    };
    enableScrolling = e => {
      window.onscroll=function(){};
    }
  resetSort = (e) => {
      var x=window.scrollX;
      var y=window.scrollY;
      window.onscroll=function(){window.scrollTo(x, y);};
      const val = "Most Recent";
      const i = 0;
      this.props.getSortBy({ variables: { sort: val } });
      this.props.getSortBy({ variables: { key: i } });
      this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
      this.setState({
          sort: '',
          resetSort: !this.state.resetSort,
          key: 0
      });
      window.addEventListener('scroll', this.enableScrolling);
      let searchParams  = new URLSearchParams(window.location.search)
        searchParams.delete("sort")
        history.push(`?${searchParams.toString()}`)
    };
  handleLogin(e, open, isLogged) {
    e.preventDefault();
    let { updateLoginPopupStatus, loggedUser } = this.props;
    updateLoginPopupStatus({ variables: { isOpen: open } });
    if (isLogged) {
      loggedUser.refetch();
      this.setState({
        currentUser: loggedUser.getCurrentUser && loggedUser.getCurrentUser
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    let {
      productsInfo,
      categoryInfo,
      getCacheCategoryData,
      getCacheSearchInput,
      getCacheLocationData,
      getPriceData,
      getCacheRadiusData,
      getSortByData,
      AdvancedFilter,
      client,
      min,
      max,
      defaultUnit
    } = nextProps;

  
    this.setState({
      loadCategoryData: nextProps.getCacheCategoryData,
      loadSearchInput: nextProps.getCacheSearchInput,
      loadLocationData: nextProps.getCacheLocationData,
      loadPriceData: nextProps.getPriceData,
      loadmin:min,
      loadmax:max,
      loadDateData: nextProps.getDateByData,
      loadSortByData: nextProps.getSortByData,
      loadFieldChild: AdvancedFilter &&  AdvancedFilter.fieldChild,
      loadRangeFilter: AdvancedFilter && AdvancedFilter.rangeFilter
    });

    if(getCacheCategoryData !== undefined && getCacheCategoryData !== ""){
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == getCacheCategoryData).map(v => {
        this.setState({
          filterData: v.fields,
          buyOptionEnable: v.instantBuy
        })
      })
    }
    if (nextProps.categorySubmitted !== this.props.categorySubmitted) {
      this.setState({
        postListing: "",
        showDiscard: false
      });
    }
    if (nextProps.postAnotherListing !== this.props.postAnotherListing) {
      this.setState({
        postListing: this.props.t("Homepageheader._Whatselling")
      });
    }
    /*  if(nextProps.stuffImage !== this.props.stuffImage) {
      this.setState({
        showDiscard: true
      });
    } */
    if (nextProps.stuffImageEdit !== this.props.stuffImageEdit) {
      this.setState({
        showDiscard: true
      });
    }
    if (nextProps.allproductsValue !== this.props.allproductsValue) {
        let key = parseInt(getSortByData);
        let rateFrom = parseInt(min);
        let rateTo = parseInt(max);
        let id = parseInt(getCacheCategoryData);
        let searchKey = getCacheSearchInput;
        let locationKey = getCacheLocationData;
        let fieldChildData = [];
        let rangeFilterData = [];
        if(AdvancedFilter && AdvancedFilter.fieldChild){
          fieldChildData = AdvancedFilter.fieldChild
        }
  
        if(AdvancedFilter && AdvancedFilter.rangeFilter){
          rangeFilterData = AdvancedFilter.rangeFilter
        }
          const { data } = await client.query({
            query: GET_ALL_PRODUCTS,
            variables: { filter: {
              sortBy: key,
              rateFrom: rateFrom,
              rateTo: rateTo,
              categoryId: id,
              title: searchKey,
              location: { lat_lon: locationKey },
              fieldChild: fieldChildData,
              rangeFilter: rangeFilterData 
            }},
             fetchPolicy: "network-only"
          });
            if(data && data.getAllProducts){
              this.setState({
                allProducts : data.getAllProducts,
                progress : false,
                limitReached:false
              })
            }else{
              this.setState({ progress: false ,  limitReached:false});
            }
            if (this.state.preventScroll) {
            window.scrollTo(0, 0);
            } else if (this.state.preventScroll === false) {
            let not = this.state.preventScrollSprt;
            this.setState({ preventScrollSprt: ++not });
            if (this.state.preventScrollSprt === 2) {
              this.setState({ preventScrollSprt: 0, preventScroll: true });
            }
          }
    }
  if (
      nextProps.max !==  this.props.max ||
      nextProps.min !==  this.props.min ||
      nextProps.getSortByData !== this.props.getSortByData ||
      nextProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
      nextProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
      nextProps.getCacheLocationData !== this.props.getCacheLocationData ||
      nextProps.AdvancedFilter !== this.props.AdvancedFilter ||
      nextProps.getCacheRadiusData !== this.props.getCacheRadiusData
    ) {
      let key = parseInt(getSortByData);
      let rateFrom = parseInt(min);
      let rateTo = parseInt(max);
      let id = parseInt(getCacheCategoryData);
      let searchKey = getCacheSearchInput;
      let locationKey = getCacheLocationData;
      let radiusData = getCacheRadiusData;
      let fieldChildData = [];
      let rangeFilterData = [];
      if(AdvancedFilter && AdvancedFilter.fieldChild){
        fieldChildData = AdvancedFilter.fieldChild
      }

      if(AdvancedFilter && AdvancedFilter.rangeFilter){
        rangeFilterData = AdvancedFilter.rangeFilter
      }
        const { data } = await client.query({
          query: GET_ALL_PRODUCTS,
          variables: { filter: {
            sortBy: key,
            rateFrom: rateFrom,
            rateTo: rateTo,
            categoryId: id,
            title: searchKey,
            location: { lat_lon: locationKey },
            fieldChild: fieldChildData,
            rangeFilter: rangeFilterData ,
            radius:radiusData,
            unit: defaultUnit,
          }},
           fetchPolicy: "network-only"
        });
          if(data && data.getAllProducts){
            this.setState({
              allProducts : data.getAllProducts,
              limitReached : false,
              pageCount:1,
              filterCount:1,
              visible:20,
              progress : false
            })
          }else{
            this.setState({ progress: false,pageCount:1,
              filterCount:1,  visible:20, limitReached : false  });
          }
          if (this.state.preventScroll) {
          window.scrollTo(0, 0);
          } else if (this.state.preventScroll === false) {
          let not = this.state.preventScrollSprt;
          this.setState({ preventScrollSprt: ++not });
          if (this.state.preventScrollSprt === 2) {
            this.setState({ preventScrollSprt: 0, preventScroll: true });
          }
        }
    }

 
    if (nextProps.allProducts && nextProps.allProducts) {
      let { images } = nextProps.allProducts;
      this.setState({
        images: images
      });
    }
    if (nextProps.clearFilter !== this.props.clearFilter) {
      const val = "Most Recent";
      const i = 0;
      this.setState({
          sort: '',
          price: { min: '', max: '' },
          resetPrice: !this.state.resetPrice,
          resetSort: !this.state.resetSort,
          key: 0
      });
      this.props.getPrice({ variables: { max: 0, min: 0 } });
      this.props.getSortBy({ variables: { sort: val } });
      this.props.getSortBy({ variables: { key: i } });
  }
    if(nextProps.siteInfo && nextProps.siteInfo.getSiteInfo){
      let info = nextProps.siteInfo.getSiteInfo
      this.setState({
        googleAd: info.googleAdsence,
        googleAdSenseId: info.googleAdSenseId,
        productPageSlotId: info.productPageSlotId
      })
    } 
    // console.log(nextProps,"price",this.props.resetPrice,"props")

    if (nextProps.getPriceData !== this.props.getPriceData) {
      // console.log(nextProps.getPriceData.min,"getPriceData",nextProps.getPrice,"jfkdjf",this.props.getPrice);
      let { getPriceData } = nextProps;
      this.setState({
        min: getPriceData.min,
        max: getPriceData.max
      });
    }
    // if (nextProps.getModelClose.closeModel === true) {     
    //   productsInfo
    //     .refetch({ id: Number(nextProps.getCacheProductId.productId)})
    //     .then(({ data }) => {
    //       this.setState({
    //         getProductMount: data.getProduct[0],
    //         chatRoomId: data.getProduct[0].groupsId
    //       });
    //     })
    //     .catch(err => {
    //       console.log("catch", err);
    //     });
    //     console.log(this.state.chatRoomId,"chatroomid");
    // } 
    if(nextProps != this.props){
      // console.log(nextProps.productsInfo.getAllProducts.groupsId,this.props,"nextprops");
      // createRoom.then(({data}) => {
      //   if(data){
      //   console.log(data.getRoster,"getRoster")
      //     data.getRoster.filter(x => x.groupId).map(z=>{
      //       this.setState({
      //         chatRoomId: z.groupsId
      //       })
      //     })
      //   }        
      // })
      // .catch(err => {
      //   console.log("catch", err);
      // });
    }
  }

  handleClick(e,data,history) {    
    this.setState({
      chatId: data.id
    });
    let { userId, id, groupsId } = data;
    let { currentUser, updateLoginPopupStatus,getRoster } = this.props;
    if(groupsId === null){
      // console.log(groupsId,"dataid2",currentUser)
      if (currentUser.getCurrentUser != null) {
        this.props
          .createRoom({
            variables: {
              userId: Number(currentUser.getCurrentUser.id),
              productId: Number(id),
              productuserId: Number(userId)
            }
          })
          .then(({ data }) => {          
            if (data) {
              var roomId = data.createRoom.id;         
              getRoster.refetch({type:"All"}).then(({data}) => {
                if(data.getRoster){
                  data.getRoster.filter(x => x.groupId ==  roomId).map(z=>{
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
      } 
      else {
        updateLoginPopupStatus({
          variables: {
            isOpen: true
          }
        });
      }
    } else if(groupsId !== undefined && groupsId !== null){
      // console.log(groupsId,"dataid1")
      getRoster.refetch({type:"All"}).then(({data})=>{
        if(data.getRoster){
          data.getRoster.filter(x => x.groupId == groupsId).map(z=>{
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
      if(groupsId === null || groupsId !== null){
        // if(groupsId !== undefined && groupsId !== null){
        // console.log(groupsId,"dataid")
        this.props.getRosterGroupId({
          variables: { rosterGroupId: groupsId }
        });
        history.push("/chat/conversation");
      }
    }  
  }
  // handleChat() {
  //   this.setState({
  //     openChatInput: {}
  //   });
  // }

  loadMore = async client => {
    let {
      loadCategoryData,
      loadSearchInput,
      loadLocationData,
      loadmin,
      loadmax,
      loadDateData,
      loadSortByData,
      loadFieldChild,
      loadRangeFilter
    } = this.state;
    let key = parseInt(loadSortByData);
    let rateFrom = parseInt(loadmin);
    let rateTo = parseInt(loadmax);
    let id = parseInt(loadCategoryData);
    let searchKey = loadSearchInput;
    let locationKey = loadLocationData;
    let fieldChildData = [];
    let rangeFilterData = [];
    if(loadFieldChild && loadFieldChild){
      fieldChildData = loadFieldChild
    }

    if(loadRangeFilter && loadRangeFilter){
      rangeFilterData =loadRangeFilter
    }


    if((loadSortByData !== "Most Recent" && loadSortByData !== undefined ) || (loadCategoryData !== undefined && loadCategoryData !== "") || (searchKey !== null && searchKey !== "" && searchKey !== undefined)  || (locationKey !== null && locationKey !== [] && locationKey !== undefined) || (fieldChildData && fieldChildData.length > 0) || (rangeFilterData && rangeFilterData.length > 0)) {
      this.setState({
        progress: true
      });

      this.setState(prev => {
        return { visible: prev.visible + 20 };
      });
      let cnt = this.state.filterCount;
      ++cnt;
      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: {
          filter: {
            sortBy: key,
            rateFrom: rateFrom,
            rateTo: rateTo,
            categoryId: id,
            title: searchKey,
            location: { lat_lon: locationKey },
            fieldChild: fieldChildData,
            rangeFilter: rangeFilterData

          },
          pageNumber: cnt.toString()
        }
      });
      if (data) {
        if(data.getAllProducts.length > 0){
          this.setState({
            allProducts: [...this.state.allProducts, ...data.getAllProducts],
            filterCount: cnt
          });
          this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
        }
        else {
          this.setState({
            allProducts: [...this.state.allProducts],
            limitReached : true,
            pageCount: cnt,
            progress: false
          });
        }
    }
      this.setState({
        updateAds: !this.state.updateAds
      });
     
    } else {
      this.setState({
        progress: true
      });
    
      this.setState(prev => {
        return { visible: prev.visible + 20 };
      });
    
      let cnt = this.state.pageCount;
      ++cnt;
      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: { filter: {}, pageNumber: cnt.toString() }
      });
      if(data.getAllProducts.length > 0){
        this.setState({
          allProducts: [...this.state.allProducts, ...data.getAllProducts],
          pageCount: cnt,
          progress: false
        });
       
        this.setState({
          updateAds: !this.state.updateAds
        });
      }else{
        this.setState({
          allProducts: [...this.state.allProducts],
          limitReached : true,
          pageCount: cnt,
          progress: false
        });
       
        this.setState({
          updateAds: !this.state.updateAds
        });
      }
    }
  };


  

  handleLike = (e, likesUpdate, id, index) => {
    e.target.classList.toggle("toggled");
    this.setState({ preventScroll: false });
    likesUpdate().then(({ data }) => {
      let { /*selectIndex,*/ productState } = this.state;

      if (productState.includes(id)) {
        let filletrLike = productState.filter(element => {
          return element != id;
        });
        this.setState({
          productState: filletrLike
        });
      } else {
        this.setState(prevstate => ({
          productState: [...prevstate.productState, id]
        }));
      }
    });
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

  closeSlidingPanel = discardType => {
    if (discardType === true) {
      this.setState({ modalIsOpen: true, isPaneOpen: true });
    } else {
      this.setState({ isPaneOpen: false });
    }
  };

  editSellYourStuff = async (client, id, productData) => {
    await client
      .query({
        query: GET_PRODUCT,
        variables: { id: Number(id) },
        fetchPolicy: "network-only"
      })
      .then(({ data }) => {
        if (data) {
          this.setState({
            editProductData: data.getProduct[0]
          });
        }
      })
      .catch(err => {
        console.log("catch", err);
      });
    await this.setState({
      isPaneOpen: true,
      editSellUrStuff: true,
      headerStuffClicked: false,
      postListing: this.props.t("Homepageheader._EditListing")
    });
    this.props.userEditActivated();
    this.setState({
      userEditClicked: Math.floor(Math.random() * 10000)
    });    
  };

  newPostListingProducts = () => {
    this.setState({
      isPaneOpen: true,
      headerStuffClicked: true,
      editProductData: false,
      postListing: this.props.t("Homepageheader._Whatselling")
    });
  };

  closeModalSlide = async type => {
    if (type === "Discard") {
      await this.setState({
        modalIsOpen: false,
        showDiscard: false,
        isPaneOpen: false
      });
    } else {
      this.setState({ modalIsOpen: false, showDiscard: true });
    }
  };

  imageClick = () => {
    if (this.state.preventSpeedClick) {
      this.setState({
        clicked: true
      });
      this.props.getCategoryId({ variables: { categoryId: "" } });
      this.setState({ categoryId: "" });
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    let { getSortByData,min,max,getCacheCategoryData,getCacheLocationData,getCacheSearchInput,AdvancedFilter,client } = this.props;
   
    if (this.props.getLoadCountFilter !== prevProps.getLoadCountFilter) {
      let fieldChildData = [];
      let rangeFilterData = [];

      if (
        prevProps.max !==  this.props.max ||
        prevProps.min !==  this.props.min ||
        prevProps.getSortByData !== this.props.getSortByData ||
        prevProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
        prevProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
        prevProps.getCacheLocationData !== this.props.getCacheLocationData ||
        prevProps.AdvancedFilter !== this.props.AdvancedFilter
      ) {

      if(AdvancedFilter && AdvancedFilter.fieldChild){
        fieldChildData = AdvancedFilter.fieldChild
      }

      if(AdvancedFilter && AdvancedFilter.rangeFilter){
        rangeFilterData = AdvancedFilter.rangeFilter
      }

      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: { filter: {
          sortBy: parseInt(getSortByData),
          rateFrom:parseInt(min),
          rateTo: parseInt(max) ,
          categoryId: parseInt(getCacheCategoryData),
          title: getCacheSearchInput,
          location: { lat_lon: getCacheLocationData },
          fieldChild: fieldChildData,
          rangeFilter: rangeFilterData
        }},
      });
        if(data && data.getAllProducts){
          this.setState({
            allProducts: data.getAllProducts, 
            limitReached : false,
            pageCount: 1,
            filterCount: 1,
            visible: 20
          })
          this.props.redirectHomeFilter({ variables: { pageCountFilter: false } });
        }else{
          this.setState({ progress: false,pageCount: 1,
            filterCount: 1,
            visible: 20,  limitReached : false });
          this.props.redirectHomeFilter({ variables: { pageCountFilter: false } });
        }
      }else{
        this.setState({ progress: false,pageCount: 1,
          filterCount: 1,
          visible: 20 ,  limitReached : false});
      }
    }
  }  
render() {
    let { classes, currentUser, history, t,getCacheCategoryData,min,max } = this.props;
   
    let {
      allProducts,
      editSellUrStuff,
      carfillter,
      editProductData,
      headerStuffClicked,
      showDiscard,
      filterData,
      googleAd,
      googleAdSenseId,
      productPageSlotId,
      getProductMount
    } = this.state;
    const { spacing } = this.state;
    const {getPriceData,getSortByData} = this.props;
    const minL = getPriceData && getPriceData.min;
    const maxL = getPriceData && getPriceData.max; 

    const minC =
    getPriceData && getPriceData.min
        ? getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.min
        : "";
    const maxC =
    getPriceData && getPriceData.max
        ? " -" + getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.max
        : "";
    const price = ((minL > 0 || maxL > 0) && (((minL === 0)|| (minL === "")) ? "Negotiable" : "")) + minC + maxC;

    const options = [
    "Homepagefilter._MostRecent",
    "Homepagefilter._lowtohigh",
    "Homepagefilter._hightolow",
    "Homepagefilter._ClosestFirst"
    ];

    const sortValue = getSortByData &&  getSortByData.sort 
    ? options.find((e,i) => i == getSortByData.sort) 
    : options.find((e,i) => i == getSortByData)
    return (
      <Product>
      <div className="productmain" id="productmain">
        <Grid style={{maxWidth:'100%'}} >
          <Grid item xs={12} sm={12} md={9} lg={12} style={{maxWidth:'100%'}}>
              <div className={(this.state.preLoadr ? "productctnload" :"") + " "+ "productctn"}>
                <>
                
                  {((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "")) ? (
                    <div className={(filterData && filterData.length == 0 ? "cls_overvisi":"")  + " " + "nn_adfilter"}  >
                          {" "}
                      
                          {/* <div className="d-flex justify-content-center">
                            <span
                              className="cls_themeclr"
                            >
                              {" "}
                              <i aria-hidden="true"></i>{" "}
                              {/* {t("Homepageheader._CarFilter")} */}
                                {/* {t("Homepageheader._AdvancedSearch")}
                            </span></div>
                            {" "} */} 
                          <HomeFilter min={min} max={max}/>
                         { filterData && filterData.length > 0 && <DynamicFilter 
                            categoryId={getCacheCategoryData} 
                            AdvancedFiltersubmit={this.props.AdvancedFiltersubmit}
                            filterData={filterData}
                          />}
                        </div>
                    ) : ""} 
                    <div className={
                          ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0))
                            ? "nn_filter1"
                            : "allproducts1"
                        }>
                    {((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "")) ? (
                      <div className={
                        ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== ""))
                          && "nn_filtervalue"
                      }>
                         {(minL > 0 || maxL > 0) && <span>{price} <CloseIcon onClick={this.resetPricebtn} /></span>}
                         {(sortValue !== undefined && sortValue !== "") &&  <span keyy={this.state.key}>{t(sortValue)} <CloseIcon onClick={this.resetSort} /></span>}
                       
                         {/* {(sortDateValue != undefined) && <span>{t(sortDateValue)} <CloseIcon onClick={this.resetDate} /></span>} */}
                      </div>
                    ) : ""}    
                   <div
                        className={
                          ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0))
                            ? ("nn_filter nn_filter4")
                            :  ("allproducts allproducts4") 
                        }
                      > 
                        {allProducts.map((p, index) => {
                          const newIndex = index + 1;
                          return (
                            <>
                              {(getCacheCategoryData === undefined || getCacheCategoryData === "") ? (
                                <div className= "proctn" key={index}>
                                        <div
                                          className={
                                            p.featured != null
                                              ? 'classes.iOHpjI + "aasd'
                                              : ""
                                          }
                                        >
                                          {/* <Link to={`/product/${p.id}`} key={p.id} {...p}> */}

                                          <section
                                            className={
                                              p.featured != null
                                                ? "bgcolor"
                                                : "prosection"
                                            }
                                          >
                                          <div className="nn_productimg">
                                            <Link
                                              title={`${p.title} ${
                                                p.location.city
                                                  ? p.location.city
                                                  : ""
                                              }, ${
                                                p.location.pincode
                                                  ? p.location.pincode
                                                  : ""
                                              }`}
                                              to={{
                                                pathname: `/products/${p.id}`
                                              }}
                                              className="nn_homproductctn"
                                            >
                                              <div className="inner" id="myId">
                                                <img src={p.images[0]} />
                                                {p.isFree && (
                                                  <div className="freeproduct">
                                                    <div>
                                                      {" "}
                                                      {t("Editprofile._Free")}
                                                    </div>
                                                  </div>
                                                )}

                                                {p.featured && (
                                                  <div className="featured">
                                                    <div>
                                                      {" "}
                                                      {t(
                                                        "Editprofile._Featured"
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </Link>
                                          </div>
                                            <div className="allprodetails">
                                              <div>
                                                
                                                {currentUser.getCurrentUser &&
                                                p.userId ==
                                                  currentUser.getCurrentUser
                                                    .id ? (
                                                <div className="productdetails">
                                                  <div className="prodetailsname">
                                                    <div
                                                      className={
                                                        classes.iBigWB +
                                                        " " +
                                                        "main"
                                                      }
                                                    >
                                                      <p className={classes.idbXKU}>
                                                        <strong>{p.title}</strong>
                                                      </p>
                                                    </div>
                                                    <div
                                                      className={
                                                        classes.lkKZlA +
                                                        " " +
                                                        "secondary"
                                                      }
                                                    >
                                                      <p className={classes.jVEKGa}>
                                                        {p.location.city}
                                                        {p.location.pincode &&
                                                          ","}{" "}
                                                        {p.location.pincode}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div
                                                    className="EditBtn">
                                                    <ApolloConsumer>
                                                      {client => (
                                                        <button
                                                          onClick={() =>
                                                            this.editSellYourStuff(
                                                              client,
                                                              p.id,
                                                              p
                                                            )
                                                          }
                                                        >
                                                          <EditIcon className="editicon" />
                                                          {/* {t(
                                                            "Productdetails._Edit"
                                                          )} */}
                                                        </button>
                                                      )}
                                                    </ApolloConsumer>
                                                  </div>
                                                </div>
                                                ) : (
                                                  <div className="productdetails">
                                                    <div className="prodetailsname">
                                                      <div
                                                        className={
                                                          classes.iBigWB +
                                                          " " +
                                                          "main"
                                                        }
                                                      >
                                                        <p className={classes.idbXKU}>
                                                          <strong>{p.title}</strong>
                                                        </p>
                                                      </div>
                                                      <div
                                                        className={
                                                          classes.lkKZlA +
                                                          " " +
                                                          "secondary"
                                                        }
                                                      >
                                                        <p className={classes.jVEKGa}>
                                                          {p.location.city}
                                                          {p.location.pincode &&
                                                            ","}{" "}
                                                          {p.location.pincode}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="chatimg">
                                                      <button
                                                        onClick={(e)=>
                                                          this.handleClick(
                                                            e,
                                                            p,
                                                            history
                                                          )
                                                        }
                                                        className={
                                                          classes.gyDxPI +
                                                          " " +
                                                          classes.jrOmri +
                                                          " " +
                                                          classes.btnSecondary +
                                                          " " +
                                                          classes.customBtn + " nn_chatBtn"
                                                        }
                                                      >
                                                         {/* <img src={Chatimg} alt="productimg"/> */}
                                                         <MailIcon className="nn_chatIcon"/>
                                                        {/* <span>
                                                          <svg
                                                            viewBox="0 0 24 24"
                                                            width="24"
                                                            height="24"
                                                            className="sc-jTzLTM eWXXCS"
                                                            fill="var(--theme-color)"
                                                          >
                                                            <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                                                          </svg>
                                                        </span> */}
                                                      </button>
                                                      {/* {p.id ===
                                                        this.state.chatId &&
                                                      this.state.openChatInput[
                                                        p.id
                                                      ] ? (
                                                        <ChatInput
                                                          key={index}
                                                          productInfo={p}
                                                          onClick={
                                                            this.handleChat
                                                          }
                                                          currentUser={
                                                            currentUser
                                                          }
                                                          history={history}
                                                        />
                                                      ) : (
                                                        ""
                                                      )} */}
                                                      {p.id ===
                                                        this.state.chatId &&
                                                        this.state.openChatWindow                                                        
                                                         ? <ChatWindow  
                                                        history={history}
                                                        parentCallback={this.state.currConv}
                                                        client={this.props.client}
                                                        /> : ""}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* conditionally show Favorite icons start */}
                                                {!(
                                                  currentUser.getCurrentUser &&
                                                  p.userId ==
                                                    currentUser.getCurrentUser
                                                      .id
                                                ) && (
                                                  <>
                                                    {this.props.currentUser
                                                      .getCurrentUser !=
                                                      null && (
                                                      <Mutation
                                                        mutation={LIKES_UPDATE}
                                                        variables={{
                                                          id: Number(p.id)
                                                        }}
                                                        refetchQueries={[
                                                          {
                                                            query: GET_PRODUCT,
                                                            variables: {
                                                              id: Number(p.id)
                                                            }
                                                          }
                                                        ]}
                                                      >
                                                        {(
                                                          likesUpdate,
                                                          { data }
                                                        ) => (
                                                          <div className="favicon">
                                                            <button
                                                              onClick={e =>
                                                                this.handleLike(
                                                                  e,
                                                                  likesUpdate,
                                                                  p.id,
                                                                  index
                                                                )
                                                              }
                                                              className={
                                                                classes.egQXgJ +
                                                                " " +
                                                                classes.kk +
                                                                " favBtn" +
                                                                (p.likedUsers.filter(
                                                                  x =>
                                                                    x ==
                                                                    currentUser
                                                                      .getCurrentUser
                                                                      .id
                                                                ).length > 0
                                                                  ? " toggled"
                                                                  : "")
                                                              }
                                                            >
                                                              <FavoriteOutlinedIcon />                                                             
                                                            </button>
                                                          </div>
                                                        )}
                                                      </Mutation>
                                                    )}
                                                  </>
                                                )}
                                                {/* conditionally show Favorite icons end */}

                                                {this.props.currentUser
                                                  .getCurrentUser == null && (
                                                  <div className={(p.title || p.location.city || (p.location.pincode && p.location.pincode)) ? "favicon" : "favicon1"}>
                                                    {" "}
                                                    <button
                                                      onClick={e =>
                                                        this.handleLogin(
                                                          e,
                                                          true
                                                        )
                                                      }
                                                      className={
                                                        classes.egQXgJ +
                                                        " " +
                                                        classes.kk
                                                      }
                                                    >
                                                      <FavoriteOutlinedIcon />
                                                      {/* <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        style={{
                                                          fill: "currentcolor",
                                                          userSelect: "none",
                                                          display:
                                                            "inline-block",
                                                          verticalAlign:
                                                            "middle",
                                                          lineHeight: "1",
                                                          transition:
                                                            "fill 0.25s ease 0s"
                                                        }}
                                                      >
                                                        <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                      </svg> */}
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </section>
                                        </div>
                                </div>
                              ) : (
                                ""
                              )}

                              {newIndex % 10 === 0 && (
                                <div className={`addproduct ${(getCacheCategoryData !== undefined && getCacheCategoryData !== "") ? "addproduct4" : ""}`}>
                                    <div className="addprosection">                                                                            
                                      <div className="make_money">
                                        <img
                                          className="responsive"
                                          src={Postimg}
                                        />
                                              {/* <div className="taxt-mal">
                                                <span className="make-mon">
                                                  {this.props.t(
                                                    "Homepageheader._make"
                                                  )}
                                                  <br />
                                                  {this.props.t(
                                                    "Homepageheader._Money"
                                                  )}
                                                </span>
                                                <br />{" "}
                                                {this.props.t(
                                                  "Homepageheader._SellingPassup"
                                                )}
                                              </div> */}
                                      </div>
                                       
                                          {/* <div className="post-nw">
                                            <div
                                              className={
                                                classes.iBigWB + " " + "main"
                                              }
                                            ></div>
                                            <div
                                              className={
                                                classes.lkKZlA +
                                                " " +
                                                "secondary"
                                              }
                                            ></div>
                                          </div> */}
                                          <div className="postbtn">
                                              <button
                                                onClick={() =>
                                                  this.newPostListingProducts()
                                                }
                                                type="button"
                                                className="ptbtn"
                                              >
                                                {this.props.t(
                                                  "Homepageheader._Postnow"
                                                )}
                                              </button>
                                          </div>                                                                        
                                    </div>                                
                                </div>
                              )}

                              {(getCacheCategoryData !== undefined && getCacheCategoryData !== "") && (
                                
                                <div className={
                          ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0))
                            ? "proctn car-daea"
                            : "proctn nn_filter"
                        }>
                                  {/*staart leftpart*/}

                                  {/*end leftpart*/}
                                  
                                        <div
                                          className={
                                            p.featured != null
                                              ? 'classes.iOHpjI + "aasd'
                                              : ""
                                          }
                                        >
                                
                                        <section
                                            className={
                                              p.featured != null
                                                ? "bgcolor"
                                                : "prosection"
                                            }
                                          >
                                          <div className="nn_productimg">
                                            <Link
                                              title={`${p.title} ${
                                                p.location.city
                                                  ? p.location.city
                                                  : ""
                                              }, ${
                                                p.location.pincode
                                                  ? p.location.pincode
                                                  : ""
                                              }`}
                                              to={{
                                                pathname: `/products/${p.id}`
                                              }}
                                              className="nn_homproductctn"
                                            >
                                              <div className="inner" id="myId">
                                                <img src={p.images[0]} />
                                                {p.isFree && (
                                                  <div className="freeproduct">
                                                    <div>
                                                      {" "}
                                                      {t("Editprofile._Free")}
                                                    </div>
                                                  </div>
                                                )}

                                                {p.featured && (
                                                  <div className="featured">
                                                    <div>
                                                      {" "}
                                                      {t(
                                                        "Editprofile._Featured"
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </Link>
                                          </div>
                                            <div className="allprodetails">
                                              <div>
                                                {currentUser.getCurrentUser &&
                                                p.userId ==
                                                  currentUser.getCurrentUser
                                                    .id ? (
                                                <div className="productdetails">
                                                  <div className="prodetailsname">
                                                    <div
                                                      className={
                                                        classes.iBigWB +
                                                        " " +
                                                        "main"
                                                      }
                                                    >
                                                      <p className={classes.idbXKU}>
                                                        <strong>{p.title}</strong>
                                                      </p>
                                                    </div>
                                                    <div
                                                      className={
                                                        classes.lkKZlA +
                                                        " " +
                                                        "secondary"
                                                      }
                                                    >
                                                      <p className={classes.jVEKGa}>
                                                        {p.location.city}
                                                        {p.location.pincode &&
                                                          ","}{" "}
                                                        {p.location.pincode}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div
                                                    className={
                                                      classes.exWZiu +
                                                      " EditBtn"
                                                    }
                                                  >
                                                    <ApolloConsumer>
                                                      {client => (
                                                        <button
                                                          onClick={() =>
                                                            this.editSellYourStuff(
                                                              client,
                                                              p.id,
                                                              p
                                                            )
                                                          }
                                                        >
                                                          <EditIcon className="editicon"/>
                                                          {/* {t(
                                                            "Productdetails._Edit"
                                                          )} */}
                                                        </button>
                                                      )}
                                                    </ApolloConsumer>
                                                  </div>
                                                </div>
                                                ) : (
                                                  <div className="productdetails">
                                                    <div className="prodetailsname">
                                                      <div
                                                        className={
                                                          classes.iBigWB +
                                                          " " +
                                                          "main"
                                                        }
                                                      >
                                                        <p className={classes.idbXKU}>
                                                          <strong>{p.title}</strong>
                                                        </p>
                                                      </div>
                                                      <div
                                                        className={
                                                          classes.lkKZlA +
                                                          " " +
                                                          "secondary"
                                                        }
                                                      >
                                                        <p className={classes.jVEKGa}>
                                                          <svg viewBox="0 0 24 24" width="16px" height="16px" className="sc-jTzLTM fznnpf"><path d="M12.364 2c2.204 0 4.327.865 5.915 2.463a8.4 8.4 0 0 1 2.448 5.939 8.4 8.4 0 0 1-2.448 5.942c-2.669 2.684-5.094 5.445-5.383 5.561a1.326 1.326 0 0 1-.532.095c-.19 0-.358-.024-.544-.1-.305-.123-2.767-2.937-5.372-5.556-3.264-3.282-3.264-8.6 0-11.88A8.319 8.319 0 0 1 12.364 2zm.091 11.91A3.455 3.455 0 1 0 9 10.455a3.455 3.455 0 0 0 3.455 3.455z"></path></svg>{p.location.city}
                                                          {p.location.pincode &&
                                                            ","}{" "}
                                                          {p.location.pincode}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="chatimg">
                                                        <button
                                                           onClick={(e) =>
                                                            this.handleClick(
                                                              e,
                                                              p,
                                                              history
                                                            )
                                                          }
                                                          className={
                                                            classes.gyDxPI +
                                                            " " +
                                                            classes.jrOmri +
                                                            " " +
                                                            classes.btnSecondary +
                                                            " " +
                                                            classes.customBtn + " nn_chatBtn"
                                                          }
                                                        >
                                                              {/* <img src={Chatimg} alt="productimg"/> */}
                                                         <MailIcon className="nn_chatIcon"/>
                                                          {/* <span>
                                                            <svg
                                                              viewBox="0 0 24 24"
                                                              width="24"
                                                              height="24"
                                                              className="sc-jTzLTM eWXXCS"
                                                              fill="var(--theme-color)"
                                                            >
                                                              <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                                                            </svg>
                                                          </span> */}
                                                        </button>
                                                       {p.id ===
                                                        this.state.chatId &&
                                                        this.state.openChatWindow                                                        
                                                         ? <ChatWindow  
                                                        history={history}
                                                        parentCallback={this.state.currConv}
                                                        client={this.props.client}
                                                        /> : ""}
                                                        {/* {p.id ===
                                                        this.state.chatId &&
                                                      this.state.openChatInput[
                                                        p.id
                                                      ] ? (
                                                        <ChatInput
                                                          key={index}
                                                          productInfo={p}
                                                          onClick={
                                                            this.handleChat
                                                          }
                                                          currentUser={
                                                            currentUser
                                                          }
                                                          history={history}
                                                        />
                                                      ) : (
                                                        ""
                                                      )} */}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* conditionally show Favorite icons start */}
                                                {!(
                                                  currentUser.getCurrentUser &&
                                                  p.userId ==
                                                    currentUser.getCurrentUser
                                                      .id
                                                ) && (
                                                  <>
                                                    {this.props.currentUser
                                                      .getCurrentUser !=
                                                      null && (
                                                      <Mutation
                                                        mutation={LIKES_UPDATE}
                                                        variables={{
                                                          id: Number(p.id)
                                                        }}
                                                        refetchQueries={[
                                                          {
                                                            query: GET_PRODUCT,
                                                            variables: {
                                                              id: Number(p.id)
                                                            }
                                                          }
                                                        ]}
                                                      >
                                                        {(
                                                          likesUpdate,
                                                          { data }
                                                        ) => (
                                                          <div className="favicon">
                                                            <button
                                                              onClick={e =>
                                                                this.handleLike(
                                                                  e,
                                                                  likesUpdate,
                                                                  p.id,
                                                                  index
                                                                )
                                                              }
                                                              className={
                                                                classes.egQXgJ +
                                                                " " +
                                                                classes.kk +
                                                                " favBtn" +
                                                                (p.likedUsers.filter(
                                                                  x =>
                                                                    x ==
                                                                    currentUser
                                                                      .getCurrentUser
                                                                      .id
                                                                ).length > 0
                                                                  ? " toggled"
                                                                  : "")
                                                              }
                                                            >
                                                              <FavoriteOutlinedIcon />
                                                              {/* <svg
                                                                viewBox="0 0 24 24"
                                                                width="24"
                                                                height="24"
                                                                // className={ "button" + (selectIndex.includes(index)? " toggled": "")}
                                                                className="button"
                                                                style={{
                                                                  fill:
                                                                    "currentcolor",
                                                                  userSelect:
                                                                    "none",
                                                                  display:
                                                                    "inline-block",
                                                                  verticalAlign:
                                                                    "middle",
                                                                  lineHeight:
                                                                    "1",
                                                                  transition:
                                                                    "fill 0.25s ease 0s"
                                                                }}
                                                              >
                                                                <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                              </svg> */}
                                                            </button>
                                                          </div>
                                                        )}
                                                      </Mutation>
                                                    )}
                                                  </>
                                                )}
                                                {/* conditionally show Favorite icons end */}

                                                {this.props.currentUser
                                                  .getCurrentUser == null && (
                                                  <div className="favicon">
                                                    {" "}
                                                    <button
                                                      onClick={e =>
                                                        this.handleLogin(
                                                          e,
                                                          true
                                                        )
                                                      }
                                                      className={
                                                        classes.egQXgJ +
                                                        " " +
                                                        classes.kk
                                                      }
                                                    >
                                                      <FavoriteOutlinedIcon />
                                                      {/* <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        style={{
                                                          fill: "currentcolor",
                                                          userSelect: "none",
                                                          display:
                                                            "inline-block",
                                                          verticalAlign:
                                                            "middle",
                                                          lineHeight: "1",
                                                          transition:
                                                            "fill 0.25s ease 0s"
                                                        }}
                                                      >
                                                        <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                      </svg> */}
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </section>
                                          </div>
                                        </div>
                                        

                              )}
                            </>
                          );
                        })}
                      </div>  
                      </div>
                      {this.state.preLoadr && (
                        <div className="nn_loader">
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>                     
                        </div>
                      )}
                    </>
              </div>
              <div  className={
                      ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData && filterData.length > 0)) ? "nn_loadmorefilter" : ""
                    }
              >             
                  <div className="nn_loadmore">
                    {this.state.visible === this.state.allProducts.length && (
                      <ApolloConsumer>
                        {client => (
                          <button
                            onClick={() => this.loadMore(client)}
                            type="button"
                            className="nn_loadbtn"
                          >
                          {t("Editprofile._loadmore")}</button>
                        )}
                      </ApolloConsumer>
                    )}
                    {this.state.limitReached && <div className="nn_loadmorectn"> you have reached the end</div>}
                  </div>
              </div>
                  <div
                    className={
                      ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData && filterData.length > 0)) ? "nn_searchfilter" : ""
                    }
                  >                    
                    {allProducts.length <= 0 && !this.state.preLoadr && (
                      <div className="nn_notFound">
                        <img src={empt} alt="empty" />
                        <h5> {t("Homepageheader._OOPS")}</h5>
                        <span>{t("Homepageheader._something")}</span>
                      </div>
                    )}{" "}
                  </div>
          </Grid>
          { googleAd ? 
               <Grid item xs={12} sm={12}  md={googleAd && 3 }   lg={googleAd  && 2 } >
                <AdSense.Google
                    client={googleAdSenseId} // {googleAnalyticsKey}
                    slot={productPageSlotId} // {productPageSlotId}
                    style={{ display: 'block' }}
                    layout='in-article'
                    format='fluid'
                    className="nn_sidead1"
                />
              </Grid> :
              <Grid item xs={12} sm={12}  md={!googleAd && 3 }   lg={!googleAd  && 2 } >
                <div className="nn_sidead">
                  <img src={sideImage} alt="sideImage" />
                </div>
              </Grid>                         
            }
        </Grid>
        <DiscardPopup
              isOpen={this.state.modalIsOpen}
              //onAfterOpen={this.afterOpenModal}
              //onRequestClose={this.closeModalSlide}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div className="discardPopup">
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
                    {t("Productdetails._Cancel")}{" "}
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
              overlayClassName="some-custom-overlay-class"
              isOpen={this.state.isPaneOpen}
              title={this.state.postListing}
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
      </div>     
      </Product>
    );
  }
}

var products = compose(
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(LIKES_UPDATE, { name: "likesUpdate" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
    name: "pageCountFilter",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(GET_CATEGORIES, { name: "categoryInfo" }),
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
    fetchPolicy: "cache-only"
    })
  }),
  graphql(SORTBY, { name: "getSortBy" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(CREATE_ROOM, { name: "createRoom" }),
  graphql(IS_MODEL_CLOSE, { name: "getModelClose" }),
  graphql(GET_ROSTER,{
    name: "getRoster"
  }),
  graphql(GET_ROSTER_GROUPID_DETAILS, {
    name: "getCacheRosterId",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(ROSTER_GROUPID, { name: "getRosterGroupId" }),
  graphql(UPDATE_CHATNOW_STATUS, {name: 'updateChatNowStatus'}),
  graphql(IS_CATEGORY_REFETCH, { name: "categoryRefetch" })
)(Products);

export default withTranslation("common")(withStyles(styles)(products));
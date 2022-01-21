import React from "react";
import PropTypes from "prop-types";
import { compose, graphql } from "react-apollo";
import { GET_CATEGORIES, CATEGORY_ID, GET_CATEGORY_ID, GET_REDIRECTFILTER_STATE,REDIRECT_HOME_FILTER,PRICE,SORTBY,RADIUS,GET_RADIUS,LOCATION_NAME,GET_LOCATION_NAME,LOCATION,GET_LOCATION
 } from "../../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import deleteButton from "../../../../assets/img/delete.png";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { withTranslation } from "react-i18next";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import history from "../../../../history"


class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      clicked: false,
      categoryId: null,
      preventSpeedClick: true,
      height: 0,
      width: 0 ,
      value: false,
      active: false,
      price: { min: '', max: '' },
      resetPrice: false,
      sort: '',
      resetSort: false,
      width: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {    
    // var xx = document.getElementById("selectval").selectedIndex;
    // var gg = document.getElementsByTagName("option")[xx].value;
    let { categoryInfo } = this.props;
    let categories = [];
    if(localStorage.getItem("lang")){
     categoryInfo.refetch().then(({ data }) => {
      if (data) {
        categories = data.getCategoryDetails && data.getCategoryDetails.category;
        this.setState({
          categories: categories
        })
      }
    }).catch(e => console.log(e));
  }
      setTimeout(() => {
        let fullwidth = this.divElement && this.divElement.clientWidth;
        let kk =0;
        this.li && this.li.parentElement && this.li.parentElement.childNodes.forEach(myFunction)
        function myFunction(item) {
            kk += item.clientWidth
        }       
        if(fullwidth > kk){
          {localStorage.getItem("lang") === "ar" ? 
          (
            this.setState({
              active: true
          })) : (

            this.setState({
              active: false
          })
        )}         
      }
      else if(fullwidth < kk ){
        {localStorage.getItem("lang") === "ar" ? 
        (
          this.setState({
            active: false
        })) : (

          this.setState({
            active: true
        })
      )}  
      }
      else{
        {localStorage.getItem("lang") === "ar" ? 
        (
          this.setState({
            active: true
        })) : (

          this.setState({
            active: false
        })
      )}  
      }
      }, 3000); 
  }
 
  componentDidUpdate(prevProps, prevState) {
     if(prevProps.categoryList !== this.props.categoryList){
     const list = this.props.categoryList ? this.props.categoryList : [];
     this.setState({
      categories: list
     })
   }
  }
  
  handleClick = (id, type, image) => {        
    this.props.getCategoryId({ variables: { categoryId: id } });
    this.setState({ categoryId: id });
    var url = new URL(window.location);
    url.searchParams.set("categoryId",id)
    if(url.searchParams.get("dyn_filter")){
      this.props.AdvancedFiltersubmit({
        fieldChild: []
      });
      url.searchParams.delete("dyn_filter")
    }
    if(url.searchParams.get("range_filter")){
      const rangeArrayData = url.searchParams.get("range_filter").split("-")
      if(rangeArrayData && rangeArrayData.length){
          for(var key in rangeArrayData) {
            url.searchParams.delete(rangeArrayData[key])
          }
          url.searchParams.delete("range_filter")
        }
        this.props.AdvancedFiltersubmit({
          rangeFilter : []
        });
    }
    history.push(`?${url.searchParams.toString()}`)
  }

  handleChange = (event) => {
    const i = event.target.value
    if(event.target.value != "0001" )
    {
      this.props.getCategoryId({ variables: { categoryId: i } });
      this.setState({ categoryId: i });
      //this.setState({ eee: gg });
    }
    else{
      this.props.getCategoryId({ variables: { categoryId: "" } });
      this.setState({ categoryId: "" });
    }    
  }
  imageClick = () => {
    if (this.state.preventSpeedClick) {
      this.setState({
        clicked: true
      })
      this.props.getCategoryId({ variables: { categoryId: "" } })
      this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
      this.props.AdvancedFiltersubmit({
        fieldChild: [],
        rangeFilter : []
      });
      this.setState({ categoryId: ""});
      this.resetPrice();
      var url = new URL(window.location);
      url.searchParams.delete("categoryId")
      if(url.searchParams.get("dyn_filter")){
        this.props.AdvancedFiltersubmit({
          fieldChild: []
        });
        url.searchParams.delete("dyn_filter")
      }
      if(url.searchParams.get("range_filter")){
        const rangeArrayData = url.searchParams.get("range_filter").split("-")
        if(rangeArrayData && rangeArrayData.length){
            for(var key in rangeArrayData) {
              url.searchParams.delete(rangeArrayData[key])
            }
            url.searchParams.delete("range_filter")
          }
          this.props.AdvancedFiltersubmit({
            rangeFilter : []
          });
      }
        if(url.searchParams.get("radius")){
          this.props.getRadius({variables:{radius:""}})
          url.searchParams.delete("radius") 
        }

        if(url.searchParams.get("location")){
          this.props.getLocation({
            variables: {
              lat_lon: null
            },
          });
          url.searchParams.delete("location")
       }

         if(url.searchParams.get("locationName")){
          this.props.getLocationName({
            variables: { locationName: "" },
          })
          url.searchParams.delete("locationName")
        }

        if(url.searchParams.get("locationName")){
          this.props.getLocationName({
            variables: { locationName: "" },
          })
          url.searchParams.delete("locationName")
        }

        if(url.searchParams.get("min")){
          url.searchParams.delete("min")
        }

        if(url.searchParams.get("max")){
          url.searchParams.delete("max")
        }

        if(url.searchParams.get("sort")){
          url.searchParams.delete("sort")
        }
      history.push(`?${url.searchParams.toString()}`)
    }
  }
  resetPrice = () => {
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
    this.props.getPrice({ variables: { max: 0, min: 0 } });
    const val = "Most Recent";
    this.props.getSortBy({ variables: { sort: val } });
    this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
    this.setState({
        price: { min: '', max: '' },
        resetPrice: !this.state.resetPrice,
        sort: '',
        resetSort: !this.state.resetSort
    });
    window.addEventListener('scroll', this.enableScrolling);
    };
    enableScrolling = e => {
      window.onscroll=function(){};
    }
  componentWillReceiveProps(nextProps) {
    if (nextProps.clearFilter !== this.props.clearFilter) {
      this.imageClick()
    }
    if (nextProps.getCacheCategoryData.categoryId !== this.props.getCacheCategoryData.categoryId) {
      if (this.state.preventSpeedClick) {
        this.setState({ 
          categoryId: nextProps.getCacheCategoryData.categoryId.toString(), 
          preventSpeedClick: false ,
        });
        setTimeout(() => {
          this.props.getCategoryId({ variables: { categoryId: nextProps.getCacheCategoryData.categoryId.toString() } });
          this.setState({ preventSpeedClick: true });
        }, 200);
      }
    }
  }
  handleRightClick = () => {
    let elmnt = this.cate
    elmnt.scrollLeft += 200;     
      this.setState({
        value: true              
      })    
  }  
  handleLeftClick = () => {
    let elmnt = this.cate
    elmnt.scrollLeft -= 200;    
    this.setState({
      value: true      
    }) 
  }
  render() {
    let { categories,value,active } = this.state;
    let { getCacheCategoryData } = this.props;   
    return (
    <div className={`${categories.length > 0 ? "" : "nn_categoryHide"} nn_categorylistname ${active ? "active" : "hidden" }`} id="cate">
      <div className={`nn_categorylist ${value ? "active" : "hidden" }`} ref={ (divElement) => { this.divElement = divElement } }>
      
      <div className="cls_cate_mbl"> <i className="arrow down"></i>
      <select className="form-control" name="category" value={getCacheCategoryData.categoryId} onChange={this.handleChange} id="selectval">
       
        <option defaultValue value="0001">{this.props.t("Homepageheader._ChooseCategory")}</option>
        {categories.map((c,i) => {
          return (
        	<option value={ c.id } key={i}>{c.name}</option>
          )}
        )}
        </select>
        </div>

      <div className={`cls_licount ${(active ) ? "nn_licount1" : "nn_licount"}`} ref={ (cate) => { this.cate = cate } }>        
        {categories.map((c,i) => {
                  return (
                    <div  key={c.id} ref={ (li) => { this.li = li } } className={(getCacheCategoryData.categoryId ? ((c.id !== getCacheCategoryData.categoryId ? " opLow" : " nn_selectCate")) : "") + ""  + " nn_catealign"} title={c.name} >
                       
                      <div className="nn_categoryctn">
                        <a>
                          <img src={c.image} alt="" className="cateimg" ref={ (li1) => { this.li1 = li1 } } onClick={() => this.handleClick(c.id, c.type, c.image)}/>
                          {c.id === getCacheCategoryData.categoryId ? <div className="closecate" onClick={this.imageClick}>
                            {/* <button className={classes.dioYWW}> */}
                              <img className="closeimg" src={deleteButton} alt="" width={20} height={20} />
                              {this.state.clicked}
                            {/* </button> */}
                            </div>
                             : ""}
                        </a>
                      </div>
                      <a className="nn_catetitle text-truncate d-block" onClick={() => this.handleClick(c.id, c.type, c.image)}>{c.name.length > 16 ? c.name.slice(0, 15) + "..." : c.name}</a>
                    </div>                   
                  )
                })}
      </div>
            <div className={`nn_btn cls_left  ${active ? "hidden" : "active" }`}>
              <button className="nn_catebtn" onClick={this.handleLeftClick}><KeyboardArrowLeftIcon className="icon"/></button>
            </div>
            <div className={`nn_btn cls_right ${active ? "active" : "hidden" }`}>
              <button className="nn_catebtn"  onClick={this.handleRightClick}><KeyboardArrowRightIcon className="icon"/></button>
            </div>
      </div>
    </div>
    )
  }
}
Category.propTypes = {
  onClick: PropTypes.func
};

var CategoryFilter = compose(
  
  graphql(GET_CATEGORIES, {
    name: "categoryInfo", options: () => ({
      fetchPolicy: "no-cache"
    })
 }),
 
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(GET_CATEGORY_ID, { name: "getCacheCategoryData", options: () => ({ fetchPolicy: "cache-only" }) }),

  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
    name: "pageCountFilter",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(PRICE, { name: "getPrice" }),
  graphql(SORTBY, { name: "getSortBy" }),
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
  }),
  graphql(LOCATION, { name: "getLocation" }),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
      fetchPolicy: "cache-only",
    }),
  })
)(Category);

export default withTranslation("common") (withStyles(styles)(CategoryFilter));

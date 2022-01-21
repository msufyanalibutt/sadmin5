import React, { Component } from 'react'
import Filter from "./Dashboard/Filters/Filter";
import PriceFilter from "./Dashboard/Filters/PriceFilter";
import SortFilter from './Dashboard/Filters/SortFilter';
import { withTranslation } from 'react-i18next';
import { getSymbol } from '../../helper.js';
import { compose, graphql } from "react-apollo";
import {
    REDIRECT_HOME_FILTER,GET_REDIRECTFILTER_STATE,PRICE,GET_PRICE_DETAILS,SORTBY,GET_SORTBY_DETAILS,DATEBY,GET_DATEBY_DETAILS,LOCATION_NAME, GET_LOCATION_NAME,RADIUS,GET_RADIUS,LOCATION,GET_LOCATION, GET_RESET_BUTTON, UPDATE_RESET_BUTTON,CATEGORY_ID,
    GET_CATEGORY_ID,SEARCH_INPUT,GET_SEARCH_INPUT
} from "../../queries/index";
import history from '../../history';
import { AdvancedFilter } from './css/styledcomponents';

class Home_filter extends Component {
    state = {
        resetBtn: false,
        price: { min: '', max: '' },
        sort: '',
        sortDate: '',
        resetPrice: false,
        resetDate: false,
        resetSort: false,
        location: false,
        disabledPriceFilter: false
    }

    componentDidMount() {
        // filter fixed in search bar
        var el = document.getElementById('srcFil');
        var el1 = document.getElementById('hdrFx');
        var elTop = el1.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        window.addEventListener('scroll', function () {
            if (document.documentElement.scrollTop > 15) {
                // el.classList.add('fxFilt');
                el1.classList.add('bxShdwnon');
            }
            else {
                el1.classList.remove('bxShdwnon');
                // el.classList.remove('fxFilt');
            }
        });
    }


    cng0 = () => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        }

    cng = (a) => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        if (a.min === '') {
            this.setState({
                price: a
            });

            if (this.state.sort === '' && this.state.sortDate === '' ) {
                this.setState({ resetBtn: false })
            }
        } else {
            this.setState({
                resetBtn: true,
                price: a
            });
        }
    }

    cng1 = (a) => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        if (a === 'Most Recent') {
            this.setState({
                sort: ''
            });

            if (this.state.price.min === ''  && this.state.sortDate === '') {
                this.setState({ resetBtn: false })
            }

        } else {
            this.setState({
                resetBtn: true,
                sort: a
            });
        }
    }

    // cng2 = (a) => {
    //     this.props.redirectHomeFilter({ variables: { pageCountFilter : true } })
    //     if (a === 'All listings') {
    //         this.setState({
    //             sortDate : ''
    //         });

    //         if (this.state.price.min === '' && this.state.sort === '') {
    //             this.setState({ resetBtn: false })
    //         }

    //     } else {
    //         this.setState({
    //             resetBtn: true,
    //             sortDate : a
    //         });
    //     }
    // }

    resetPrice = () => {
        var x=window.scrollX;
        var y=window.scrollY;
        window.onscroll=function(){window.scrollTo(x, y);};
        this.props.getPrice({ variables: { max: 0, min: 0 } });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        this.setState({
            price: { min: '', max: '' },
            resetPrice: !this.state.resetPrice,
        });
     window.addEventListener('scroll', this.enableScrolling);
      };
      

    resetSort = () => {
         var x=window.scrollX;
        var y=window.scrollY;
        const val = "Most Recent";
        this.props.getSortBy({ variables: { sort: val } });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        this.setState({
            sort: '',
            resetSort: !this.state.resetSort,
        });
         window.addEventListener('scroll', this.enableScrolling);
      };
      enableScrolling = e => {
          window.onscroll=function(){};
      }
    // resetDate = () => {
    //     const val = 'All listings';
    //     this.props.getDateBy({variables:{sortDate: val}});
    //     this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
    //     this.setState({
    //         sortDate: '',
    //         resetDate : !this.state.resetDate,
    //     });
    // }

    resetAll = () => {
        var x=window.scrollX;
        var y=window.scrollY;
        window.onscroll=function(){
            window.scrollTo(x, y);
        };
        this.props.getSortBy({ variables: { sort: 0 } });
        this.props.getPrice({ variables: { max: 0, min: 0 } });
        this.props.getLocationName({variables:{locationName: "" }})
        //this.props.getLocation({variables: {lat_lon: []}});
        //this.props.redirectHome({ variables: { pageCount: true } })
        this.setState({
            resetBtn: !this.state.resetBtn,
            sort: '',
            sortDate: "",
            price: { min: '', max: '' }
        });
        window.addEventListener('scroll', this.enableScrolling);
        var url = new URL(window.location);
         if(url.searchParams.get("sort")){
            url.searchParams.delete("sort")
         }
         if(url.searchParams.get("min")){
            url.searchParams.delete("min")
         }
         if(url.searchParams.get("max")){
            url.searchParams.delete("max")
         }
         if(url.searchParams.get("max")){
            url.searchParams.delete("max")
         }
         if(url.searchParams.get("categoryId")){
            url.searchParams.delete("categoryId")
         }
         if(url.searchParams.get("location")){
            url.searchParams.delete("location")
         }
         if(url.searchParams.get("radius")){
            url.searchParams.delete("radius")
         }
         if(url.searchParams.get("locationName")){
            url.searchParams.delete("locationName")
         }
         if(url.searchParams.get("searchText")){
            url.searchParams.delete("searchText")
         }
         history.push(`?${url.searchParams.toString()}`)
    };
    

    componentWillReceiveProps(nxt) {
        if (nxt.clearFilter !== this.props.clearFilter) {
            var url = new URL(window.location);
            const val = "Most Recent";
            const DateVal = "All listings";
            this.setState({
                resetBtn: false,
                sort: '',
                sortDate: "",
                price: { min: '', max: '' },
                location: !this.state.location
            });
            this.props.getPrice({ variables: { max: 0, min: 0 } });
            this.props.getSortBy({ variables: { sort: val } });
            this.props.getDateBy({variables:{sortDate: DateVal}});
            this.props.getLocationName({variables:{locationName: "" }});
            this.props.searchResult({ variables: { searchInput: ""}});
            this.props.getRadius({variables:{radius:""}})
            //this.props.getLocation({variables: {lat_lon: []}});
            //this.props.redirectHome({ variables: { pageCount: true } })

            if(url.searchParams.get("searchText")){
                url.searchParams.delete("searchText")
            }
            if(url.searchParams.get("radius")){
                url.searchParams.delete("radius")
            }
            history.push(`?${url.searchParams.toString()}`)
        }
        if (nxt.getCacheCategoryData === '3') {
            this.setState({
                disabledPriceFilter: true
            })
        } else if (nxt.getCacheCategoryData || nxt.getCacheCategoryData == '') {
            this.setState({
                disabledPriceFilter: false
            })
        }
    }

    render() {
        const {getPriceData,getSortByData,getDateByData,getCacheLocationData,getCacheResetButton,t, min,max} = this.props;
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
        const price = (minL > 0 || maxL > 0) && (((minL === 0)|| (minL === "")) ? "Negotiable" : "") + minC + maxC;

        const options = [
        "Homepagefilter._MostRecent",
        "Homepagefilter._lowtohigh",
        "Homepagefilter._hightolow",
        "Homepagefilter._ClosestFirst"
        ];
    
        const sortValue = getSortByData &&  getSortByData.sort 
        ? options.find((e,i) => i == getSortByData.sort) 
        : options.find((e,i) => i == getSortByData)

        const Dateoptions = [
            'Homepagefilter._AllLisings',  
            'Homepagefilter._last24', 
            'Homepagefilter._last7', 
            'Homepagefilter._last30'
        ]

        const sortDateValue = getDateByData &&  getDateByData.sortDate 
        ? Dateoptions.find((e,i) => i == getDateByData.sortDate) 
        : Dateoptions.find((e,i) => i == getDateByData)


        return (
            <AdvancedFilter id="srcFil" className="cls_overflowx">
                 {/* <div className="filterBx cls_onlyboth">
                    {(minL > 0 || maxL > 0) && <span>{price} <CloseIcon onClick={this.resetPrice} /></span>}
                    {(sortValue != undefined) && <span>{t(sortValue)} <CloseIcon onClick={this.resetSort} /></span>}
                    {/* {(sortDateValue != undefined) && <span>{t(sortDateValue)} <CloseIcon onClick={this.resetDate} /></span>} */}
                 {/* </div>  */} 
                {/* <div className="nn_home_filter" >
                        <div className="nn_respfile">
                            <div className="nn_locfilter">
                                    <Filter 
                                        location={this.state.location} 
                                        getCacheLocationData={this.props.getCacheLocationData} 
                                        change={this.cng0}
                                    />
                            </div>
                            
                             { 
                              (getCacheLocationData && getCacheLocationData.lat_lon) ? 
                                <div className="comonw locrespgh distanceFilter cls_res_dist">
                                   <span>{this.props.t("Homepagefilter._Distance")}</span>
                                    <div className="filterhover-eff">
                                         <DistanceFilter /> 
                                    </div>
                                </div> 
                            : ""  } 
                             
                            <div className="nn_pricse_filter">
                                    <div className={this.state.disabledPriceFilter === true ? "disabled" : ""}>
                                        <PriceFilter 
                                         getPriceData={this.props.getPriceData}
                                         resetPrice={this.state.resetPrice} 
                                         change={this.cng} 
                                         reset={this.state.resetBtn} 
                                         min={min}
                                         max={max}
                                        />
                                    </div>
                            </div>
                            <div className="nn_sortfilter">
                                    <SortFilter
                                        getSortByData={this.props.getSortByData} 
                                        change={this.cng1} 
                                        resetSort={this.state.resetSort} 
                                        reset={this.state.resetBtn} />
                            </div>
                            <div className="comonw sortfillee">
                                <div className="filterhover-eff">
                                    <DateFilter
                                    getDateByData={this.props.getDateByData} 
                                    change={this.cng2} 
                                    resetDate={this.state.resetDate} 
                                    reset={this.state.resetBtn} />
                                </div>
                            </div> 
                        </div>
                    {this.state.resetBtn && <div className="nn_reset"><button onClick={this.resetAll} type="button" className="reset nn_resetbtn resposnreset">
                        {this.props.t('Homepagefilter._Reset')}
                    </button></div>}
                </div> */}
             </AdvancedFilter>
        )
    }
}

var homeFilter = compose(
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
    graphql(SEARCH_INPUT, { name: "searchResult" }),
    graphql(GET_SEARCH_INPUT, {
        name: "getCacheSearchInput",
        options: () => ({
          fetchPolicy: "cache-only"
        })
      }),

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
    graphql(DATEBY, {name: 'getDateBy'}),
    graphql(GET_DATEBY_DETAILS, {
        name: "getDateByData",
        options: () => ({
        fetchPolicy: 'cache-only'
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
    graphql(UPDATE_RESET_BUTTON, {name: 'updateResetButton'}),
    graphql(GET_RESET_BUTTON, {
      name: "getCacheResetButton",
      options: () => ({
          fetchPolicy: 'cache-only'
        })
    }),
    graphql(CATEGORY_ID, { name: 'getCategoryId' }),
    graphql(GET_CATEGORY_ID, { name: "getCacheCategoryData", options: () => ({ fetchPolicy: 'cache-only' }) })
)(Home_filter);

export default withTranslation('common')(homeFilter);
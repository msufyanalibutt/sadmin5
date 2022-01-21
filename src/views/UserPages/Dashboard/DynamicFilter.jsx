import React, { Component } from 'react';
import { compose, graphql } from "react-apollo";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import { GET_CATEGORIES,IS_CATEGORY_REFETCH,CATE_LANG_REFETCH } from "../../../queries";
import "react-sliding-pane/dist/react-sliding-pane.css";
import InputRange from "react-input-range-rtl";
import history from "../../../history"
import {AdvancedFilter1} from '../css/styledcomponents';

var styles = theme => ({
  ...loginStyles,
  ...headerStyles(),
  customBtn: {
    borderColor: "white !important",
    "&:hover": {
      borderColor: "white !important"
    }
  },

  dropdownStyle: {
    transform: "translate3d(290px, -5px, 0px) !important",
    width: "270px"
  },
  [theme.breakpoints.only("md")]: {
    dropdownStyle: {
      transform: "translate3d(0px, 0px, 0px) !important"
    }
  },

  [theme.breakpoints.only("sm")]: {
    dropdownStyle: {
      transform: "translate3d(0px, 0px, 0px) !important"
    }
  },

  [theme.breakpoints.only("xs")]: {
    dropdownStyle: {
      transform: "translate3d(0px, 0px, 0px) !important"
    }
  }
});

var initialState = {
  fieldChild: [],
  rangeFilter: [],
  values: {},
  openChatInput: {}
}

class DynamicFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
  }

  change = (e) => {
    const value = this.state.fieldChild.some(selected_index => e.target.name === selected_index)
      ? this.state.fieldChild.filter(i => i !== e.target.name)
      : this.state.fieldChild.concat([e.target.name])

    this.setState({
      fieldChild: value
    });
  }


  minMaxChanges = (e, filterId) => {
    let { values } = this.state;
    let newObj = { ...values, [filterId]: { ["fieldId"]: filterId, ['rangeFrom']: e.min, ['rangeTo']: e.max } }
    this.setState({
      values: newObj
    })
    let rangeFilter = [];
    for (var key in newObj) {
      rangeFilter.push(newObj[key]);
    }
    this.setState({
      rangeFilter
    })
  }

  handleSubmit = () => {
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
    let { fieldChild, rangeFilter } = this.state;
    this.props.AdvancedFiltersubmit({
      fieldChild: fieldChild,
      rangeFilter: rangeFilter
    });
    if (window.screen.width < 991) {
      this.props.handleCloseModal();
    }
   window.addEventListener('scroll', this.enableScrolling);
   var searchDynFields = [];
   var url = new URL(window.location);
    for(var key in rangeFilter) {
          let arrayFieldData = [rangeFilter[key].rangeFrom, rangeFilter[key].rangeTo]
          if(!searchDynFields.includes(rangeFilter[key].fieldId)){ 
            searchDynFields.push(rangeFilter[key].fieldId)
          }
          url.searchParams.set("range_filter",searchDynFields.join("-"))
          url.searchParams.set(rangeFilter[key].fieldId,arrayFieldData.join("-"))
          //history.push(`?${url.searchParams.toString()}`)
      }
      if(fieldChild && fieldChild.length){
        url.searchParams.set("dyn_filter",fieldChild.join("-"))
        //history.push(`?${url.searchParams.toString()}`)
      }else{
        url.searchParams.delete("dyn_filter")
       
      }
      history.push(`?${url.searchParams.toString()}`)
  };

  componentDidMount(){  
    let { values,rangeFilter } = this.state;
    var url = new URL(window.location);
    if(url.searchParams.get("dyn_filter")){
      const data_array = url.searchParams.get("dyn_filter").split("-")
      this.props.AdvancedFiltersubmit({
        fieldChild: data_array
      });
      this.setState({
        fieldChild: data_array
      })
    }

    if(url.searchParams.get("range_filter")){
      const rangeArrayData = url.searchParams.get("range_filter").split("-")
      if(rangeArrayData && rangeArrayData.length){
          for(var key in rangeArrayData) {
            let fieldData = url.searchParams.get(rangeArrayData[key]) && url.searchParams.get(rangeArrayData[key]).split("-")
            let newObj = { ...values, [rangeArrayData[key]]: { ["fieldId"]: Number(rangeArrayData[key]), ['rangeFrom']: fieldData && Number(fieldData[0]), ['rangeTo']: fieldData && Number(fieldData[1]) } }
             this.setState({
               values : newObj
             })
             for (var key in newObj) {
              rangeFilter.push(newObj[key])
            }
            this.props.AdvancedFiltersubmit({
              rangeFilter: rangeFilter
            });
         }
      }

      if(rangeFilter && rangeFilter.length){
          for (var key in rangeFilter) {
            if (rangeFilter.hasOwnProperty(key)) {
            values[rangeFilter[key]['fieldId']] = rangeFilter[key];
            this.setState({ values : values})
          }
        }
      }
    }
  }

  enableScrolling = e => {
      window.onscroll=function(){};
  }

  clearFilter = () => {
    var url = new URL(window.location);
     var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
    this.props.AdvancedFiltersubmit({
      fieldChild: [],
      rangeFilter: []
    });
    if(url.searchParams.get("dyn_filter")){
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
    }
     history.push(`?${url.searchParams.toString()}`)
    this.setState({
      ...initialState
    })
    if (window.screen.width < 991) {
      this.props.handleCloseModal();
    }
   window.addEventListener('scroll', this.enableScrolling);
  };
  enableScrolling = e => {
      window.onscroll=function(){};
  }
  toggleMenu = (e, num) => {
    let { openChatInput } = this.state;
    e.preventDefault();
    let newObj = { ...openChatInput, [num]: !this.state.openChatInput[num] }
    this.setState({
      openChatInput: newObj
    });
  }

  render() {
    let { t, classes,filterData } = this.props;
    let { values, fieldChild, openChatInput } = this.state;
    return (
      <AdvancedFilter1 className="nn_advancedflt">
        <div className=" cls_homefilter nn_homefilter">
         {/* <HomeFilter />      */}
         {/* <span className="cls_themeclr_res nn_adtitle"> */}
              {" "}
              {/* <i aria-hidden="true"></i>{" "} */}
              {/* {t("Homepageheader._CarFilter")} */}
                {/* {t("Homepageheader._AdvancedSearch")} */}
            {/* </span> */}
           
          {
            filterData.length > 0 && filterData.map((x, index) =>
              x.inputTag === "dropdown" ?
                <section>
                  <div className="nn_fliterctn">
                    <div className="nn_fltproctn">{x.name}</div>
                      {
                        x.values && x.values[0] && x.values[0].valueChild.map((z, i) => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  key={i}
                                  checked={fieldChild && fieldChild.length > 0 && fieldChild.some(selected_index => z.valueChildId == selected_index) || false}
                                  onChange={(e) => this.change(e)}
                                  name={z.valueChildId}
                                  value={z.valueChildId}
                                  classes={{
                                    root: classes.root,
                                    checked: classes.checked + " nn_adlabel",
                                  }}
                                />
                              }
                              label={z.valueChildData}                              
                            />
                          );


                        }
                        )
                      }
                  </div>
                </section>
                : x.inputTag === "range" ?
                  <section>
                    <div>
                      <div className="dPKTsi" >
                        <div className="ewsakU yesrsnover nn_fliterctn">
                          <div className="fIVfGS">
                            <div className=""> </div>
                            <div className="yearway respmileage nn_fltproctn">
                              {" "}
                              {x.name}
                            </div>
                             <div className="rightyesd reskm">
                             { /*values[x.filterId] ? values[x.filterId].rangeFrom : x.min} - {values[x.filterId] ? values[x.filterId].rangeTo : x.max*/}
                             {/* <span onClick={(e) => this.toggleMenu(e, index)}> <i class="fa fa-caret-down" aria-hidden="true"></i> </span>*/}
                            </div> 
                          </div>
                        </div>
                      </div>
                      <div className="inpydeanrr">
                        {localStorage.getItem("lang") === "ar" ? (
                           <InputRange
                            maxValue={x.max}
                            minValue={x.min}
                             direction="rtl"
                            value={values[x.filterId] !== undefined ? { min: values[x.filterId] && values[x.filterId].rangeFrom, max: values[x.filterId] && values[x.filterId].rangeTo } : { min: x.min, max: x.max }} //
                            onChange={value => this.minMaxChanges(value, x.filterId)}
                          />
                        ) : (
                          <InputRange
                            maxValue={x.max}
                            minValue={x.min}
                            value={values[x.filterId] !== undefined ? { min: values[x.filterId] && values[x.filterId].rangeFrom, max: values[x.filterId] && values[x.filterId].rangeTo } : { min: x.min, max: x.max }} //
                            onChange={value => this.minMaxChanges(value, x.filterId)}
                          />
                        )}
                      </div>
                    </div>
                  </section> :
                  x.inputTag === "multilevel" ?
                    <section>
                      <div className="ewsakU nn_fliterctn">
                          {
                            x.values && x.values.length > 0 && x.values.map((z, i) =>
                              <div keyy={i} key={i} data={z.id}>
                                <span className="yearway respmileage nn_fltproctn">{z.valueParent}</span>
                                <div>
                                  {z.valueChild && z.valueChild.length > 0 && z.valueChild.map((v, i) => {
                                    return (
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            key={i}
                                            checked={fieldChild && fieldChild.length > 0 && fieldChild.some(selected_index => v.valueChildId == selected_index) || false}
                                            onChange={(e) => this.change(e, i, x.filterId)}
                                            value={v.valueChildId}
                                            name={v.valueChildId}
                                            classes={{
                                              root: classes.root,
                                              checked: classes.checked + " nn_checkbox",
                                            }}                                            
                                          />
                                        }
                                        label={v.valueChildData}
                                      />
                                    );
                                  })}
                                </div>
                              </div>)
                          }
                      </div>
                    </section>  : ""

            )}

          <div className="sav_chang maghgh">
            <button
              type="submit"
              onClick={this.handleSubmit}
              className="btn btn-danger btn-block"
            >
              {t("Carfilter._SaveFilters")}
            </button>
          </div>
          <div className="sav_chang maghgh">
            <button
              type="submit"
              onClick={this.clearFilter}
              className="btn btn-danger btn-block"
            >
              {t("Carfilter._clearFilter")}
            </button>
          </div>
        </div>
      </AdvancedFilter1>
    )
  }
}


var dynList = compose(
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(IS_CATEGORY_REFETCH, { name: "categoryRefetch" }),
  graphql(CATE_LANG_REFETCH, { name: "getRefetch" })
)(DynamicFilter);

export default withTranslation("common")(withStyles(styles)(dynList));

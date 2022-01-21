import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { graphql, compose } from "react-apollo";
import {
  GET_PRICE_DETAILS,
  PRICE,
  REDIRECT_HOME,
  GET_REDIRECT_STATE
} from "../../../../queries";
import { withTranslation } from "react-i18next";
import history from "../../../../history"
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { priceRange: { min: "", max: "" } ,disabledButton:false,priceValidation:false ,priceUpdated: false };
  }

  handlePriceMinMax = () => {
    // var a = document.getElementById("cate").clientHeight;
    // var b = document.getElementById("cate").clientWidth;
    // var c = document.getElementById("banner").clientHeight;
    // var d = document.getElementById("banner").clientWidth;
    // var h = document.getElementById("hdrFx").clientHeight;
    // var i = document.getElementById("hdrFx").clientWidth;
    // var e = c + h;
    // var f = b + d + i;
    // document.getElementById("productmain").style.marginTop = e + "px";
    // console.log(e)
    var x=  window.scrollX;
    var y=  window.scrollY;
    // console.log(x,y)
    window.onscroll=function(){window.scrollTo(x, y);};
    const priceRange = this.state.priceRange;
    this.props.getPrice({
      variables: { max: priceRange.max, min: priceRange.min }
    });
    this.props.data(this.state.priceRange);
    // (async function() {
    //   // this.props.change(this.state.priceRange);
    // })();
    window.addEventListener('scroll', this.enableScrolling);
    var url = new URL(window.location);
    url.searchParams.set("min",priceRange.min)
    url.searchParams.set("max",priceRange.max)
    history.push(`?${url.searchParams.toString()}`)
  };

  enableScrolling = e => {
      window.onscroll=function(){};
  }
  cng = e => {
    const {priceRange} = this.state;
    //eslint-disable-next-line
    const reg = /^[0-9\b]+$/;
    if (e.target.value === "" || reg.test(e.target.value)) {
      this.setState({
        priceRange: {
          ...this.state.priceRange,
          [e.target.name]: e.target.value
        }
      });
    }
    if(e.target.name == "max"){
      if(priceRange.min != "" && e.target.value != ""  && Number(priceRange.min) >= Number(e.target.value)){
        this.setState({
          priceValidation:true,
          disabledButton:true
        });
    }else{
      this.setState({
        priceValidation:false,
        disabledButton:false
      });
    }
    }else if(e.target.name == "min"){
      if(priceRange.max != "" && (Number(priceRange.max) <= Number(e.target.value))){
        this.setState({
          priceValidation:true,
          disabledButton:true
        });
    }else{
      this.setState({
        priceValidation:false,
        disabledButton:false
      });
    }
  }

  };

  rest = () => {
    this.setState({
      priceRange: { min: "", max: "" },
      priceValidation:false,
      disabledButton:false
    });
    this.props.getPrice({ variables: { max: 0, min: 0 } });
    //this.props.redirectHome({ variables: { pageCount: true } });
    var url = new URL(window.location);
    url.searchParams.delete("min")
    url.searchParams.delete("max")
    history.push(`?${url.searchParams.toString()}`)
    this.props.data({ min: "", max: "" });
  };

  componentWillReceiveProps(nextProps) {
    const {priceUpdated} = this.state;
    if(!priceUpdated && (this.props.min===this.props.max && this.props.min===0)){
      this.rest();
      this.setState({priceUpdated: true});
    }
    if (nextProps.resetPrice !== this.props.resetPrice) {
      this.rest();
    }
    if (nextProps.reset !== this.props.reset) {
      if (nextProps.reset === false) {
        this.rest();
      }
    }
  }

  //  componentDidMount(){
  //   const {priceRange} = this.state;
  //   let url = new URL(window.location);
   
  //   if(url.searchParams.get("min") || url.searchParams.get("max")){
  //     console.log(url.searchParams.get("min"))
  //     this.setState({
  //       priceRange:{
  //         min : url.searchParams.get("min"),
  //         max : url.searchParams.get("max")
  //       },
  //       priceUpdated: true
  //     })
  //    }
  // }

  render() {
    const { t } = this.props;
    const {priceRange} = this.state;
    return (
      <div className="form-group">
        {localStorage.getItem("lang") === "ar" ? (
          <>
            <input
              type="text"
              className="float-left min-price"
              value={this.state.priceRange.max}
              onChange={this.cng}
              name="max"
              placeholder={t("Homepagefilter._Min")}
            />
            <span className="float-left intedement-val">
              {t("Homepagefilter._To")}
            </span>
            <input
              type="text"
              className="float-left max-price"
              value={this.state.priceRange.min}
              onChange={this.cng}
              name="min"
              placeholder={t("Homepagefilter._Max")}
            />{" "}
          </>
        ) : (
          <>
            <input
              type="text"
              className="float-left min-price"
              value={this.state.priceRange.min}
              onChange={this.cng}
              name="min"
              placeholder={t("Homepagefilter._Min")}
            />
            <span className="float-left intedement-val">
              {t("Homepagefilter._To")}
            </span>
            <input
              type="text"
              className="float-left max-price"
              value={this.state.priceRange.max}
              onChange={this.cng}
              name="max"
              placeholder={t("Homepagefilter._Max")}
            />
          </>
        )}
        { 
          this.state.priceValidation ? <span className="pricePop">{t('Homepagefilter._priceVal')}</span> : ""
        }
      
      {(priceRange.min && priceRange.min.length > 0 || priceRange.max && priceRange.max.length > 0)
         && <button type="submit" onClick={this.rest} className="btn2 mt1">{t('Homepagefilter._Reset')}</button>}

      {(priceRange.min && priceRange.min.length  || priceRange.max && priceRange.max.length) && <button type="button" disabled={this.state.disabledButton}  onClick={this.handlePriceMinMax} className="btn1 float-right mt1">{t('Homepagefilter._Apply')}</button>}
      </div>
    );
  }
}

var PriceDetails = compose(
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(REDIRECT_HOME, {
    name: "redirectHome"
  }),
  graphql(GET_REDIRECT_STATE, {
    name: "getLoadCount",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  })
)(Parent);

export default withTranslation("common")(withStyles(styles)(PriceDetails));

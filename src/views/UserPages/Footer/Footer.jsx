import React from "react";
import { compose, graphql } from "react-apollo";
import {
  GET_CURRENCIES,
  GET_SITE_INFO,
  GET_ALL_PRODUCTS,
  GET_CATEGORIES,
  GET_LANGUAGES,
  GET_STATIC_PAGE,
  CATE_LANG_REFETCH,
  GET_META_TAG
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
//import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { Link } from "react-router-dom";
//import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import pagesStyle from "../../../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import googleplay from "../../../assets/img/badge_googleplay.svg";
import appstroe from "../../../assets/img/badge_appstore.svg";
import { withTranslation } from "react-i18next";
// import "../css/style.css";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import Footermobileimg from '../../../assets/img/signup.png'
import Grid from "@material-ui/core/Grid";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {FooterMain} from '../css/styledcomponents';
import { createGlobalStyle } from "styled-components";

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

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iosLink: "",
      androidLink: "",
      sitename: "",
      facebookLink: "",
      twitterLink: "",
      instagramLink: "",
      image: "",
      footerLogo: "",
      footerBatch: "",
      footerBackground: "",
      currency: "",
      totalLanguages: []
    };
  }
  change = e => {
    let { productsInfo, currencyInfo } = this.props;
    localStorage.setItem("currency", e.target.value);
    productsInfo.refetch({ filter: {} }).then(({ data }) => {});

    currencyInfo.getCurrencies.map((cur, i) => {
      if (cur.code === e.target.value) {
        localStorage.setItem("currencySymbol", cur.symbol);
      }
    });
    this.props.getRefetch({ variables: { categoryRefetch: true } });
  };

  changeLng = (e, i18n) => {
    let arr = ["ar", "fr", "en"];
    let langList = e;
    let { categoryInfo, staticPagesTerms, productsInfo,AdvancedFilter, getMetatags } = this.props;
    localStorage.setItem("lang", e);
    if(AdvancedFilter && AdvancedFilter !== undefined){
        this.props.AdvancedFiltersubmit({
          fieldChild: [],
          rangeFilter: []
        });
    }
    localStorage.setItem("langList", e);
    if (window.location.pathname === "/") {
      categoryInfo.refetch().then(({ data }) => {
        this.props.getCategory(data);
      });
    }
    staticPagesTerms.refetch().then(({ data }) => {});

    productsInfo.refetch({ filter: {} }).then(({ data }) => {
    })

    if (e === "ar") {
      // document.getElementById("rtlsz").style.fontSize = "35px";
      document.body.setAttribute("dir", "rtl");
      localStorage.setItem("rtl", "rtl");
    } else if (e === "fr") {
      // document.getElementById("rtlsz").style.fontSize = "35px";
      document.body.setAttribute("dir", "ltr");
      localStorage.setItem("ltr", "ltr");
    } else {
      if (!arr.includes(e)) {
        //localStorage.setItem("lang", "en");
        langList = "en";
        localStorage.setItem("langList", e);
      } else {
        //  localStorage.getItem("lang")
        // localStorage.setItem("langList", e);
      }
      // document.getElementById("rtlsz").style.fontSize = "64px";
      document.body.setAttribute("dir", "ltr");
      localStorage.setItem("ltr", "ltr");
    }
    i18n.changeLanguage(langList);
    this.props.getRefetch({ variables: { categoryRefetch: true } });
    getMetatags.refetch().then(({ data }) => { });           
  };

  componentWillMount() {
    let { siteInfo, getLanguages, currencyInfo } = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        fbLink,
        twLink,
        instagramLink,
        image,
        footerLogo,
        footerBatch,
        footerBackground,
        copyrightsText
      } = siteInfo.getSiteInfo;
      this.setState({
        iosLink: iosLink,
        androidLink: androidLink,
        sitename: name,
        facebookLink: fbLink,
        twitterLink: twLink,
        instagramLink: instagramLink,
        image: image,
        footerLogo: footerLogo,
        footerBatch: footerBatch,
        footerBackground: footerBackground,
        copyrightsText: copyrightsText
      });
    }

    getLanguages.refetch({}).then(({ data }) => {
      if (data) {
        let langData = data && data.getLanguages;
        this.setState({
          totalLanguages: langData
        });
      }
    });

    currencyInfo.refetch({}).then(({ data }) => {
      if (data && data.getCurrencies) {
        let check = data.getCurrencies.find(cat => {
          if (cat.code === localStorage.getItem("currency")) {
            this.setState({
              currency: localStorage.getItem("currency")
            });
          }
          return cat.code === localStorage.getItem("currency");
        });

        if (check === undefined) {
          if (this.props.siteInfo && this.props.siteInfo.getSiteInfo) {
            const key = this.props.siteInfo.getSiteInfo;
            localStorage.setItem("currency", key.defaultCurrency);
            this.setState({
              currency: localStorage.getItem("currency")
            });
          }
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        fbLink,
        twLink,
        instagramLink,
        utubeLink,
        image,
        footerLogo,
        footerBatch,
        footerBackground,
        copyrightsText
      } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        iosLink: iosLink,
        androidLink: androidLink,
        sitename: name,
        facebookLink: fbLink,
        twitterLink: twLink,
        instagramLink: instagramLink,
        utubeLink: utubeLink,
        image: image,
        footerLogo: footerLogo,
        footerBatch: footerBatch,
        footerBackground: footerBackground,
        copyrightsText: copyrightsText,
        currency: localStorage.getItem("currency")
      });
    }
  }
  playStore = link => {
    window.open(link, "_blank");
  };

  socialMedia = url => {
    window.open(url, "_blank");
  };

  render() {
    let { classes, t, i18n, currencyInfo, staticPagesTerms } = this.props;
    var {
      iosLink,
      androidLink,
      sitename,
      facebookLink,
      twitterLink,
      instagramLink,
      utubeLink,
      currency,
      footerLogo,
      totalLanguages,
      footerBatch,
      footerBackground,
      copyrightsText
    } = this.state;

    return (
      <FooterMain>
      <div className="nn_footer">
        <div className="nn_ftmain">
          <div id="ftctn">
            {this.state.androidLink || this.state.iosLink !== "" ? (
              <section
                className={
                  localStorage.getItem("lang") === "fr" && "ar"
                    ? "nn_footerfirstpart friss"
                    : "nn_footerfirstpart"
                }
              >
                <div className="nn_footermain" id="footerId">
                <Grid container>
                  <GridItem xs={12} sm={5} md={4} className="nn_footermain1">
                    <div className="nn_footermobileimg nn_ftctn">
                      <img src={footerBatch} className="img-fluid" alt="" />
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={7} md={8}>
                    <div className="nn_ftmainctn">
                    <div className="nn_ftctn">
                    <h1
                        className={
                          localStorage.getItem("lang") === "fr" && "ar"
                            ? "nn_getfreeapp frissues"
                            : "nn_getfreeapp"
                        }
                        id="rtlsz"
                      >
                        {" "}
                        {t("footer._freeapp")}
                      </h1>

                    </div>
                    <div
                      className={
                        localStorage.getItem("lang") === "fr" && "ar"
                          ? "nn_ftapps frissus"
                          : "nn_ftapps nn_ftctn"
                      }
                    >
                    <div
                      className={
                        localStorage.getItem("lang") === "fr" && "ar"
                          ? "nn_appsimg friss"
                          : "nn_appsimg"
                      }
                    >
                      <div className="nn_footerapps">
                        {this.state.androidLink !== "" ? (
                          <div onClick={() => this.playStore(androidLink)} className="nn_googlepay">
                            <img src={googleplay} alt="" />
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.iosLink !== "" ? (
                          <div onClick={() => this.playStore(iosLink)} className="nn_googlepay">
                            <img src={appstroe} alt="" />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    </div>
                    </div>
                  </GridItem>
                  </Grid>
                </div>
              </section>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="nn_footersecpart" style={{backgroundImage: `url(${footerBackground})`,backgroundRepeat: "no-repeat",backgroundSize: "100% 100%"}}>
          {/* <img src={footerBackground} className="nn_ftbgimg" alt="" style={{width: "100%"}}/> */}
          <div className="nn_footersecctn">
              <Grid container>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="nn_footerlogo">
                    <img src={footerLogo} alt="" />                  
                  </div>
                  <div className="nn_socialicons">
                    <div className="nn_ftsocialctn">
                        <ul>
                          {this.state.facebookLink !== "" ? (
                            <li
                              className="nn_fticon"
                              onClick={() => this.socialMedia(facebookLink)}
                            >
                              <a title="facebook" target="_blank">
                                <i className="fa fa-facebook" aria-hidden="true"></i>
                              </a>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.twitterLink !== "" ? (
                            <li
                              className="nn_fticon"
                              onClick={() => this.socialMedia(twitterLink)}
                            >
                              <a title="twitter" target="_blank">
                                <i className="fa fa-twitter" aria-hidden="true"></i>
                              </a>
                            </li>
                          ) : (
                            ""
                          )}

                          {this.state.instagramLink !== "" ? (
                            <li
                              className="nn_fticon"
                              onClick={() => this.socialMedia(instagramLink)}
                            >
                              <a title="instagram" target="_blank">
                                <i className="fa fa-instagram" aria-hidden="true"></i>
                              </a>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.utubeLink !== "" ? (
                            <li
                              className="nn_fticon"
                              onClick={() => this.socialMedia(utubeLink)}
                            >
                              <a title="youtube" target="_blank">
                                <i
                                  className="fa fa-youtube-play"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={5}>
                      <div className="nn_ftaboutctn">
                        <ul>
                          <li>
                            <Link to="/Info/contact">
                              {" "}
                              {this.props.t("footer._ContactUs")}{" "}
                            </Link>{" "}
                          </li>
                          {staticPagesTerms.getstaticPageDetails &&
                            staticPagesTerms.getstaticPageDetails.filter(x => x.status === "Active").map(
                              (p, index) => {
                                return (
                                  <li key={index}>
                                    {" "}
                                    <Link to={p.url}> {p.title} </Link>{" "}
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </div>
                    </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                      <div className="nn_ftdropdown">
                        <div className="nn_selectwrapper">
                          {/* noral selet */}
                          <select value={localStorage.getItem("lang") }
                            onChange={(e) => this.changeLng(e.target.value, i18n)}  className="selectboxsize nn_formselect"> 
                            {totalLanguages &&
                                totalLanguages.map((item, index) => {   return (
                                      <option
                                        key={index}
                                        value={item.value}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                })}
                          </select>
                          <KeyboardArrowDownIcon className="nn_downarrow"/>
                          {/* <FormControl
                            // fullWidth
                            className="nn_formselect"
                          >
                            <InputLabel
                              htmlFor="lang"
                              className={classes.selectLabel}
                            >
                              {localStorage.getItem("lang")}
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className:
                                  classes.selectMenu + " " + "nn_selectlang"
                              }}
                              classes={{
                                select: classes.select
                              }}
                              className="nn_selectlang"
                              value={localStorage.getItem("lang")}
                              onChange={e =>
                                this.changeLng(e.target.value, i18n)
                              }
                              inputProps={{
                                name: "lang",
                                id: "lang"
                              }}
                              disableUnderline={true}
                            >
                              {totalLanguages &&
                                totalLanguages.map((item, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item.value}
                                      className="select"
                                    >
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              : ""}
                            </Select>
                          </FormControl> */}
                        </div>
                        <div className="nn_selectwrapper">
                          <select value={currency}
                            onChange={(event) => this.change(event)}  className="selectboxsize nn_formselect"> 
                            {
                                currencyInfo.getCurrencies ? 
                                currencyInfo.getCurrencies.map((cur, i) => {
                                  return (
                                    <option key={i} value={cur.code}>
                                      {cur.code}
                                    </option>
                                  )
                                })
                              : ""}
                          </select>
                          <KeyboardArrowDownIcon className="nn_downarrow"/>
                          {/* <FormControl
                            // fullWidth
                            className={
                              classes.selectFormControl + " " + "nn_formselect"
                            }
                          >
                            <InputLabel
                              htmlFor="currency"
                              className={classes.selectLabel}
                            >
                              {localStorage.getItem("currency")}
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className:
                                  classes.selectMenu + " " + "nn_selectlang"
                              }}
                              classes={{
                                select: classes.select
                              }}
                              className="nn_selectcurrency"
                              value={currency}
                              onChange={event => this.change(event)}
                              inputProps={{
                                name: "currency",
                                id: "currency"
                              }}
                              disableUnderline={true}
                            >
                              {currencyInfo.getCurrencies
                                ? currencyInfo.getCurrencies.map((cur, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected
                                        }}
                                        value={cur.code}
                                      >
                                        {cur.code}
                                      </MenuItem>
                                    );
                                  })
                                : ""}
                            </Select>
                          </FormControl> */}
                        </div>
                      </div>
                    </GridItem>
              </Grid>
              <hr/>
              <Grid container>
                <GridItem xs={12} sm={12}>
                  <div className="nn_footerPara txt_center">                   
                    <p className="nn_ftpara">
                      {/* @ {sitename} {1900 + new Date().getYear()}{" "} */}
                      {copyrightsText}
                    </p>
                  </div>
                </GridItem>
              </Grid>           
          </div>
        </div>
      </div>
      </FooterMain>
    );
  }
}

var footer = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),

  graphql(GET_CATEGORIES, {
    name: "categoryInfo",
    options: () => ({
      fetchPolicy: "cache and network"
    })
  }),
  graphql(GET_STATIC_PAGE, { name: "staticPagesTerms" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(GET_CURRENCIES, { name: "currencyInfo" }),
  graphql(GET_LANGUAGES, { name: "getLanguages" }),
  graphql(CATE_LANG_REFETCH, { name: "getRefetch" }),
  graphql(GET_META_TAG, { name: "getMetatags" })
)(Footer);

export default withTranslation("common")(withStyles(pagesStyle)(footer));

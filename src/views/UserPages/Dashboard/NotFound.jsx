import React, {Component} from "react";
import Error from "../../../assets/img/404error.jpg";
import {ProductConsumer } from "../../UserPages/ProductContext.js"
import Header from "../../UserPages/Header/index.jsx"
import { GET_CURRENT_USER, GET_SITE_INFO} from "../../../queries/index.js"
import { graphql , compose } from "react-apollo";
import { withTranslation } from "react-i18next";
import {Helmet} from "react-helmet"
import Footer from "../Footer/Footer.jsx";
import history from '../../../history';

class NotFound extends Component{
    goHome = () =>{
        history.push("/");
    }

    componentDidMount(){
      setTimeout(() => {
        const { siteInfo } = this.props;
        const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
        const subcolor1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.subcolorCode;
        this.setState({
          cancelStatus: siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.hideOrderCancelStatus
        })
        const r = document.querySelector(':root').style;
        r.setProperty('--theme-color', color1);
        r.setProperty("--theme-color-hvr", (color1 + "bf"));
        r.setProperty('--subtheme-color', subcolor1);
        r.setProperty("--subtheme-color-hvr", (subcolor1 + "bf"));
      }, 1000);
    }

    componentWillMount(){
        let { currentUser } = this.props;
        if (!currentUser.getCurrentUser) currentUser.refetch();
        this.setState({
          cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
        });
      }


      componentWillReceiveProps(nextProps){
        let { currentUser } = nextProps;
        if (!currentUser.getCurrentUser) currentUser.refetch();
        this.setState({
          cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
        });

      }

      head() {
        return (
          <Helmet>
            <title>Page NotFound</title>
            {/* <link rel="shortcut icon" href={this.state.favicon} /> */}
          </Helmet>
        );
      }

    render(){
        const { classes, match ,history, t } = this.props;
        const { cUser } = this.state
        return <div className="notFoundProduct">
        {this.head()}
         <ProductConsumer>
            {
            value => (
              <>
              <Header stuffImage={value.stuffImage} categorySubmitted={value.categorySubmitted} CategoryWithImage={value.CategoryWithImage} discardStuffStatus={value.discardStuff} discardYourStuff={value.discardYourStuff} manageBeforeLogin={value.stuffValue} refetchValue={value} setRef={this.setRef} postAnotherListing={value.postAnotherListing} contextConsumerInner={value} showValue={value.showValue} match={match}  history={history} currentUser={cUser} AdvancedFiltersubmit={value.AdvancedFiltersubmit}
              postDone={value.postDone} />
              </>

              )
            }
          </ProductConsumer>
            <img src={Error} alt="empty" width="500"/>
           {/* <h5>The page you're looking for isn't available.</h5> */}
           <h5>{t("Homepageheader._notFound1")} </h5>
           <h6>{t("Homepageheader._notFound2")}</h6>
           <span className="logbtnss" onClick={this.goHome}>{t("Homepageheader._goHome")}</span>
           {/* <div className="newcontacrf"> */}
            <Footer/>
           {/* </div> */}
          </div>;
    }
}

var notfound = compose(
    graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  )(NotFound);

// export default notfound;
export default withTranslation("common")(notfound);

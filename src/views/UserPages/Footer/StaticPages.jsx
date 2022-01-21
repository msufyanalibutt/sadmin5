import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { animateScroll as scroll } from "react-scroll";
// import "../../../views/UserPages/css/style.css";
// style component
import registerPageStyle from "../../../assets/jss/material-dashboard-pro-react/views/registerPageStyle.jsx";
import { GET_STATIC_PAGE,GET_META_TAG } from "../../../queries";
import { compose, graphql } from "react-apollo";
import { withTranslation } from "react-i18next";
import Footer from "./Footer.jsx";
import { Helmet } from "react-helmet";
import {ScrollTop,StaticPage} from '../css/styledcomponents';
import PageNotFound from '../../../views/UserPages/Dashboard/NotFound';


class StaticFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      showScroll: false,
      sitename: "",
      staticPages: [],
      title: "",
      Content: "",
      isLoading: true
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }
  
  componentWillReceiveProps(nextProps) {
    let { staticPagesTerms, location } = nextProps;
    const url = location.pathname;
    staticPagesTerms.refetch().then(({ data }) => {
      if (url) {
        if (data && data.getstaticPageDetails) {
          let aboutUs =data.getstaticPageDetails && data.getstaticPageDetails.filter(a => a.url === url);
          if (aboutUs && aboutUs.length > 0) {
            this.setState({
              Content: aboutUs[0].content,
              title: aboutUs[0].title
            });
          }
        }
      }
    });
  }

  async componentDidMount() {
    window.addEventListener( "scroll", () => { this.componentScroll(); }, true );
    await this.getApiData();
    await this.setState({ isLoading: false });
  }

  getApiData = async () => {
    let { staticPagesTerms, location } = this.props;
    const url = location.pathname;
    await staticPagesTerms.refetch().then(({ data }) => {
      if (url) {
        if (data && data.getstaticPageDetails) {
          let aboutUs = data.getstaticPageDetails && data.getstaticPageDetails.filter(a => a.url === url);
          if (aboutUs && aboutUs.length > 0) {
            this.setState({
              Content: aboutUs[0].content,
              title: aboutUs[0].title
            });
          }
        }
      }
    });
  }
  
  componentWillUnmount() {
    window.removeEventListener( "scroll", () => { this.componentScroll(); }, true );
  }

  componentScroll = () => {
    const scope = this;
    var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight;
    var D = document;
    var docheight = Math.max( D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight );
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body) .scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100);
    if (pctScrolled > 10) {
      scope.setState({ showScroll: true });
    } else {
      scope.setState({ showScroll: false });
    }
  };

  scrollToTop() {
    scroll.scrollToTop();
  }

 head(){
  if(this.state.title !== ""){
    return(
      <Helmet>
        <title>{this.state.title}</title>
      </Helmet>
    )
  }
 }

  render() {
    const { classes } = this.props;
    const { showScroll, Content, isLoading } = this.state;

    if (!Content && !isLoading){
      return <PageNotFound />
    }

    return (
      <>
       {this.head()}
       <StaticPage>
        <div className={classes.landingStyle + " nn_container"}>
          <div className="priourpg nn_service">
            <section dangerouslySetInnerHTML={{ __html: Content }}></section>
            {showScroll && (
              <ScrollTop>
              <div className="anchor-fixed" onClick={this.scrollToTop}>
                  <span>
                    {" "}
                    <i class="fa fa-chevron-up" aria-hidden="true"></i>
                  </span>{" "}
              </div>
              </ScrollTop>
            )}
          </div>
        </div>
        </StaticPage>
        {Content.length > 0 && <Footer />}
      </>
    );
  }
}

StaticFooter.propTypes = {
  classes: PropTypes.object.isRequired
};
var SP = compose(
  graphql(GET_STATIC_PAGE, { name: "staticPagesTerms" }),
  graphql(GET_META_TAG, {name: "getMetatags"})
)(StaticFooter);

export default withTranslation("common")(withStyles(registerPageStyle)(SP));

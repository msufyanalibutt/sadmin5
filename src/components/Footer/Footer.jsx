import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";

import footerStyle from "../../assets/jss/material-dashboard-pro-react/components/footerStyle.jsx";
const {REACT_APP_URL,REACT_APP_Site_Url} = process.env;
 

function Footer({ ...props }) {
  const { classes, fluid, white, rtlActive, copyrightsText } = props;
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  });
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white
    });
  // var block = cx({
  //   [classes.block]: true,
  //   [classes.whiteColor]: white
  // });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <p className={classes.right}>
        {/* <a href={`${REACT_APP_URL + REACT_APP_Site_Url}`} className={anchor}> */}
          {copyrightsText}
         {/* </a> */}
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);

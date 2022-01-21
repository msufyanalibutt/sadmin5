// ##############################
// // // RegisterPage view styles
// #############################

import {
  container,
  cardTitle
} from "../../material-dashboard-pro-react.jsx";

import customCheckboxRadioSwitch from "../../material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const registerPageStyle = {
  ...customCheckboxRadioSwitch,
  cardTitle: {
    ...cardTitle,
    textAlign: "center"
  },
  container: {
    ...container,
    position: "relative",
    zIndex: "3"
    // paddingTop: "23vh"
  },
  cardSignup: {
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    marginBottom: "100px",
    padding: "40px 0px",
    marginTop: "15vh"
  },
  center: {
    textAlign: "center"
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  landingStyle: {
    "@media (min-width: 768px)": {
      width: "750px"
    },
    "@media (min-width: 992px)": {
      width: "970px"
    },
    "@media (min-width: 1200px)": {
      width: "1170px"
    },
    paddingRight: "15px",
    paddingLeft: "40px",
    marginRight: "auto",
    marginLeft: "auto",
    fontFamily: "source sans pro,helvetica neue,Helvetica,Arial,sans-serif"
  },
  form: {
    padding: "0 20px",
    position: "relative"
  },
  socialTitle: {
    fontSize: "18px"
  },
  inputAdornment: {
    marginRight: "18px",
    position: "relative"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  customFormControlClasses: {
    margin: "0 12px"
  },
  checkboxLabelControl: {
    margin: "0"
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(0, 0, 0, 0.26)"
  }
};

export default registerPageStyle;

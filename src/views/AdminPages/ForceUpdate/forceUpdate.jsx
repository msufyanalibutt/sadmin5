import React from "react";
import { Mutation,compose, graphql } from "react-apollo";

// react component for creating dynamic tables
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormHelperText from  "@material-ui/core/FormHelperText";

// material ui icons
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardText from "../../../components/Card/CardText.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

import {GET_FORCE_UPDATE,UPDATE_FORCE_UPDATE_DATA,UPDATE_TOGGLE_STATUS} from "../../../queries";
const { REACT_APP_EDIT_MODE, REACT_APP_ADMIN_PATH} = process.env;

const styles = {
    ...validationFormsStyle,
    ...extendedFormsStyle,
    cardTitle: {
      ...validationFormsStyle.cardTitle,
      color: "white"
    }
};
const initialState = {
    version: "",
    deviceType: "",
    forceUpdate: "",  
    editData: {},
    errors: {},
    popUpDetails: [],
    isButtonDisabled: true,
    submitionLoad: false
};

class ForceUpdate extends React.Component {
    constructor(props) {
        super(props);        
        this.state = {           
          ...initialState
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.numberRestriction = this.numberRestriction.bind(this);
    }
    componentWillMount() {
        let {getForceUpdates, match} = this.props;
        let id = match.params.id;
        if (id) {
            getForceUpdates.refetch({id: Number(id)});
        }
    }

    async componentDidMount(){
            await this.forceUpdateData();
    }


    forceUpdateData = () => {
        let { getForceUpdates, match } = this.props;
        let id = match.params.id;
        getForceUpdates.refetch().then(({ data }) => {
        if (id && data) {
            var forceUpdateData = data.getForceUpdates.find((force) => {
            return Number(force.id) === Number(id);
            });
            this.setState({
                version : forceUpdateData.version,
                deviceType: forceUpdateData.deviceType,
                forceUpdate: forceUpdateData.forceUpdate
              });
            }
        }).catch(e => {
           // console.log("e",e);
        }) 
    }

    clearState() {
        this.setState({...initialState});
    }

    validateInput() {
        let {match} = this.props;
        let id = match.params.id;
        var self = this;
        let required = ["version", "deviceType", "forceUpdate"];
        let error = {}, flag = false;
        required.forEach((data) => {
          if (id && data === "version" && self.state.editData.version === undefined){
            error[data] = "";
          }
          else if (data === "version" && id && (self.state.editData.version === "" || self.state.editData.version.trim() === "")) {
            error[data] = `The ${data} field is required.`;
          }
          else if (!self.state[data] && !self.state[data].length) {
            error[data] = `The ${data} field is required.`;
          } else {
            error[data] = "";
          }         
        });
        this.setState({
          errors: error
        });
        flag = Object.keys(error).find((obj) => {
          if (error[obj]) {
            return true;
          }
        });
        if (id) {
          if (Object.keys(this.state.editData).length){
            return flag;
          }
          else{
            return true;
          }
        }
        return flag;
    }

    handleChange(id, event, stateName) { 
        this.setState({
          isButtonDisabled: false
        });
        this.setState({ [stateName]: event.target.value });
        if (id) {
          this.setState({
            editData: Object.assign({}, {id: Number(id)}, this.state.editData, {data:{[stateName]: event.target.value } })
          });
        }        
    }

    numberRestriction(e){
        if ((e.charCode >= 48 && e.charCode <= 57) || e.charCode === 46) {
            return true
        }
        else {
            e.preventDefault();
        }
    }
    
    handleSubmit(event, userAction) {
        const { submitionLoad } = this.state;
        let {match} = this.props;
        let id = match.params.id;
        event.preventDefault();
        if (!this.validateInput()) {
            // console.log("validateInput");
        if ((REACT_APP_EDIT_MODE !== "prod") && !submitionLoad){
            // console.log("submitionLoad");
          this.setState({
            isButtonDisabled: true,
            submitionLoad: true
          });
          userAction().then(async ({data}) => {
            //   console.log(data,"data");
            if (data && data.updateForceUpdateOption) {
              this.props.updateToggle({variables: {
                toggleStatus: true,
                message: id
                ? "User Updated Successfully"
                : "User Added Successfully"
              }});
              this.setState({ submitionLoad: false });
              this.props.history.push(`${REACT_APP_ADMIN_PATH}/mobile-app-version`);
            }
        }).catch((error) => {
          this.setState({
            popUpDetails: error.graphQLErrors.map((x) => x.message),
            submitionLoad: false
          });
        });
        } else{
          let error = ["Add/Edit Restricted for Live"];
          this.setState({
            popUpDetails: error
          });
        }
        }
    }

    cancelButtonClick = () => {
        this.props.history.push(`${REACT_APP_ADMIN_PATH}/mobile-app-version`);
    };

    render() {     
        const { classes ,match} = this.props;
        const id = match.params.id;
        const { version, deviceType, forceUpdate, editData, errors, popUpDetails, submitionLoad} = this.state;
        editData.type = "Admin";
        const variables = id ?  editData : {
            data : {
                version: version,
                deviceType: deviceType,
                forceUpdate: forceUpdate
            }
        }


        const derviceTypeList = [
            {name: "Apple",value: "Apple"},
            {name: "Android",value: "Android"}
        ]
        const forceUpdateList = [
            {name: "Yes",value: "Yes"},
            {name: "No",value: "No"}
        ]
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Mutation mutation={UPDATE_FORCE_UPDATE_DATA} variables={variables}>
                    {(userAction, { data, loading, error }) => {
                        return (
                    <form onSubmit={(event) => this.handleSubmit(event, userAction)}>
                    <Card>
                        <CardHeader color="rose" text>
                            <CardText color="rose">
                                <h4 className={classes.cardTitle}>{id ? "Edit Mobile App Version" : "Add Mobile App Version"}</h4>
                            </CardText>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                    Version<span className="validatcolor">*</span>
                                    </FormLabel>
                                </GridItem>
                                <GridItem xs={12} sm={10}>
                                    <CustomInput
                                    id="version"
                                    error={!!errors.version}
                                    success={!!errors.version}
                                    helpText={errors.version}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: (event) =>
                                        this.handleChange(id, event, "version"),
                                        type: "text",
                                        autoComplete: "off",
                                        value: version,
                                        onKeyPress: (e) => 
                                        this.numberRestriction(e)
                                    }}
                                    />
                                     <FormHelperText className="Notemgs nn_msg">
                                        NOTE: Version should be in integer and decimal points
                                    </FormHelperText>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Dervice Type<span className="validatcolor">*</span>
                                    </FormLabel>
                                </GridItem>

                            <GridItem xs={12} sm={10}>
                            <FormControl fullWidth className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="deviceType"
                                    className={classes.selectLabel}
                                >
                                    Choose Dervice Type
                                </InputLabel>
                                <Select
                                MenuProps={{ className: classes.selectMenu }}
                                classes={{ select: classes.select }}
                                value={deviceType}
                                onChange={ (event) =>
                                    this.handleChange(id, event, "deviceType")
                                }
                                name="deviceType"
                                inputProps={{
                                    name: "deviceType",
                                    id: "deviceType"
                                }}
                                >
                                <MenuItem classes={{ root: classes.selectMenuItem }}>
                                    Choose Dervice Type
                                </MenuItem>

                                { derviceTypeList.map((item, index) => {
                                        return (
                                        <MenuItem
                                            key={index}
                                            classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                            }}
                                            value={item.value}
                                        >
                                            {item.name}
                                        </MenuItem>
                                        );
                                    })}
                                </Select>
                                <FormHelperText error={errors.deviceType ? true : false}>
                                    {errors.deviceType}
                                </FormHelperText>
                                </FormControl>
                                </GridItem>
                            </GridContainer>     
                            <GridContainer>
                                <GridItem xs={12} sm={2}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Force Update<span className="validatcolor">*</span>
                                    </FormLabel>
                                </GridItem>

                            <GridItem xs={12} sm={10}>
                            <FormControl fullWidth className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="forceUpdate"
                                    className={classes.selectLabel}
                                >
                                    Choose Force Update
                                </InputLabel>
                                <Select
                                MenuProps={{ className: classes.selectMenu }}
                                classes={{ select: classes.select }}
                                value={forceUpdate}
                                onChange={ (event) =>
                                    this.handleChange(id, event, "forceUpdate")
                                }
                                name="forceUpdate"
                                inputProps={{
                                    name: "forceUpdate",
                                    id: "forceUpdate"
                                }}
                                >
                                <MenuItem classes={{ root: classes.selectMenuItem }}>
                                    Choose Force Update
                                </MenuItem>

                                { forceUpdateList.map((item, index) => {
                                        return (
                                        <MenuItem
                                            key={index}
                                            classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                            }}
                                            value={item.value}
                                        >
                                            {item.name}
                                        </MenuItem>
                                        );
                                    })}
                                </Select>
                                <FormHelperText error={errors.deviceType ? true : false}>
                                    {errors.deviceType}
                                </FormHelperText>
                                </FormControl>
                                </GridItem>
                            </GridContainer>                                                                                 
                        </CardBody>
                        <CardFooter>
                            <Button
                                className={classes.roomTypeCancelBtn}
                                onClick={() => this.cancelButtonClick()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" color="rose" disabled={this.state.isButtonDisabled || submitionLoad}>
                                Submit
                            </Button>
                        </CardFooter>
                        {popUpDetails.length ?
                            <Snackbar place="tc"
                            color="rose"
                            message={popUpDetails[0]}
                            open={!!popUpDetails.length}
                            closeNotification={() => {
                            this.setState({popUpDetails: []});
                            }
                            }
                            close /> : ""}
                    </Card>
                    </form>
                    );}}
                    </Mutation>                   
                </GridItem>
            </GridContainer>

        )
    }
}

var forceUpdate = compose(
    graphql(GET_FORCE_UPDATE, {name: "getForceUpdates"}),
    graphql(UPDATE_FORCE_UPDATE_DATA, {name: "updateForceUpdateOption"}),    
    graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(ForceUpdate);

export default withStyles(styles)(forceUpdate);


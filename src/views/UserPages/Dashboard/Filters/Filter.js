import React from "react";
import { compose, graphql } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import LocationFilter from "./LocationFilter.js";
import {GET_LOCATION,LOCATION,LOCATION_NAME,GET_LOCATION_NAME} from "../../../../queries";
import { withTranslation } from "react-i18next";
import history from "../../../../history"
import CloseIcon from '@material-ui/icons/Close';
import {LocationModal} from '../../css/styledcomponents';

class Filter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            location: "",
            city: "",
            centerLocation: {
              lat: 40.7127753,
              lng: -74.0059728
            }
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
   
//     componentDidMount() {
//       this.getGeoInfo();
//   }

    handleOpenModal () {
        this.setState({ showModal: true });
      }
      
      handleCloseModal () {
        this.setState({ showModal: false });
      }

 

      // getLocation = (location) =>{
      //   if(location.name){
      //     this.setState({
      //       location: location.name
      //     })
      //   }else{
      //     this.setState({
      //       location: location.city
      //     })
      //   }
      // }
       
 

    centerLocation = (a) =>{
      this.setState({
        centerLocation: a
      })
    }

    componentWillReceiveProps(nxt){
      if(nxt.location !== this.props.location){
          this.props.getLocation({variable:{lat_lon:[]}})
          this.setState({
              location: ""
          });
          var url = new URL(window.location);
          if(url.searchParams.get("location")){
            url.searchParams.delete("location")
           }
          if(url.searchParams.get("locationName")){
              url.searchParams.delete("locationName")
          }
        history.push(`?${url.searchParams.toString()}`)
    }
}

    render(){
      // const {location} = this.state;
      const { getCacheLocationData,getLoactionNameData } = this.props;
      return(
        <div>
        <div className="location-filter first-loct respimg" data-toggle="modal" data-target="#locationmap" onClick={this.handleOpenModal}> 
          <div className="locatext locatingval">{this.props.t("Homepagefilter._Location")} </div>
          <div className="locmap popress" >
          {getLoactionNameData && getLoactionNameData.locationName}
             {(getLoactionNameData.locationName === undefined || getLoactionNameData.locationName === "") && this.props.t('Homepagefilter._yourLocation')}
            </div>
        </div>
        
        <LocationModal 
           isOpen={this.state.showModal}
           contentLabel="onRequestClose Example"
           onRequestClose={this.handleCloseModal}
           shouldCloseOnOverlayClick={false}>
             <div className="rtlarr"> 
          <button type="button" 
          class="location-close ltn nn_loc_btn" 
          data-dismiss="modal"
          onClick={this.handleCloseModal}> 
           <CloseIcon className="nn_close_icon"/>
          </button> <span className="chng-loc"> { this.props.t("Homepagefilter._ChangeLocation")} </span> </div>
          
         <LocationFilter 
         centerLocationGet={getCacheLocationData.lat_lon} 
         centerLocation={this.centerLocation} 
         close={this.handleCloseModal} 
         location={this.getLocation}
         getLatLon={getCacheLocationData.lat_lon}  
         />
        </LocationModal>
        </div>
        );
    }
}

var Filters=compose(
  graphql(LOCATION, {name: "getLocation"}),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
        fetchPolicy: "cache-only"
      })
  }),
  graphql(LOCATION_NAME, {name: 'getLocationName'}),
  graphql(GET_LOCATION_NAME, {
    name: "getLoactionNameData",
    options: () => ({
        fetchPolicy: 'cache-only'
      })
  }),
)(Filter);


export default withTranslation("common")(withStyles(styles)(Filters));

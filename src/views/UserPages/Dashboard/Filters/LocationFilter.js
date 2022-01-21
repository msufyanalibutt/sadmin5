import React from "react";
/* global google */

import { graphql, compose } from "react-apollo";
import { compose as pose } from "recompose";
import PropTypes from "prop-types";
// react components used to create a google map
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Geocode from "react-geocode";

// react components used for map searchbox
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../../components/Grid/GridItem.jsx";
import FormHelperText from "@material-ui/core/FormHelperText";
import Card from "../../../../components/Card/Card.jsx";
import CardBody from "../../../../components/Card/CardBody.jsx";

// style component
import { cardTitle } from "../../../../assets/jss/material-dashboard-pro-react.jsx";
import { withTranslation, Trans } from "react-i18next";
import marker from "../../../../assets/img/marker.png";
import { mapLocation } from "../../../../helper";
import Slider from 'react-rangeslider'
import history from "../../../../history"
import {
  GET_SITE_INFO,
  GET_LOCATION,
  LOCATION,
  LOCATION_NAME,
  GET_LOCATION_NAME,
  RADIUS,
  GET_RADIUS
} from "../../../../queries";
import DistanceFilter from "./DistanceFilter";
const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

var locationUpdate = document.getElementsByClassName("location");

const CustomSkinMap = pose(
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <GoogleMap
      ref={props.onMapLoad}
      center={{ lat: props.center.lat, lng: props.center.lng }}
      //zoom={props.maxZoom}
      zoom={1}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      onDragEnd={props.onDragEnd}
      onBoundsChanged={props.onBoundsChanged}
      defaultOptions={{
        scrollwheel: true,
        disableDefaultUI: true,
        defaultVisible: true,
        zoomControl: true,
      }}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        onPlacesChanged={props.onPlacesChanged}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
      >
        <input
          type="text"
          className="location"
          placeholder={props.t("Homepagefilter._EnterYour")}
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            margin: `10px 10px 0 10px`,
            width: `95%`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </SearchBox>
    </GoogleMap>
  );
});

class LocationFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      lat: 13.0846594,
      lng: 80.27023860000001,
      center: {
        lat: 40.7127753,
        lng: -74.0059728,
      },
      bounds: null,
      location: {},
      editData: {},
      allProducts: [],
      bnt: true,
      changeLocation: "",
      distanceFilterDisabled: true,
      horizontal: 50,
      defaultUnit:""
    };

    // this.MarkPlace = this.MarkPlace.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount() {
    let { siteInfo, centerLocationGet } = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
      let defaultUnit = siteInfo.getSiteInfo && siteInfo.getSiteInfo.defaultUnit;
      this.setState({ googleApi, defaultUnit });
     
    }
  }

  componentWillReceiveProps(nextProps) {
    let { siteInfo,centerLocationGet } = nextProps;
    if (siteInfo.getSiteInfo) {
      let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
      let defaultUnit = siteInfo.getSiteInfo && siteInfo.getSiteInfo.defaultUnit;
      this.setState({ googleApi, defaultUnit });
    }
    this.setState({
      center:{
        lat: centerLocationGet && centerLocationGet[0] ? centerLocationGet[0] : 40.7127753,
        lng: centerLocationGet && centerLocationGet[1] ? centerLocationGet[1] : -74.0059728
      } ,
    });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    if(this.props.getLatLon !== [] && this.props.getLatLon !== undefined && this.props.getLatLon !== null){
      this.setState({
        location:{
          lat_lon:[this.props.getLatLon[0],this.props.getLatLon[1]]
        }
      })
    }
    if(this.props.getCacheRadiusData && this.props.getCacheRadiusData.radius !== undefined){
      this.setState({
        horizontal : this.props.getCacheRadiusData.radius
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    if (this.state.location && Object.keys(this.state.location).length) {
      this.setState({
        errors: "",
      });
      return true;
    }
    this.setState({
      errors: "Location Should not be empty",
    });
    return false;
  }

  onBoundsChanged() {
    this.setState({
      bounds: this._mapComponent.getBounds(),
      center: this._mapComponent.getCenter(),
    });
  }

  handleMapDrag() {
    let mapRef = this._mapComponent;
    this.setState({
      center: mapRef.getCenter(),
    });
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey(this.state.googleApi);
    // Enable or disable logs. Its optional.
    Geocode.enableDebug();
    // Get address from latidude & longitude.
    Geocode.fromLatLng(mapRef.getCenter().lat(), mapRef.getCenter().lng()).then(
      (response) => {
        const address = response && response.results[0].formatted_address;
        if(locationUpdate && locationUpdate[0]){
          locationUpdate[0].value = address;
        }
        const lat_lon = response &&  response.results[0].geometry.location;
        var locationSet = mapLocation(response.results);
        var location = {
          address: locationSet.street_name
            ? locationSet.street_name
            : "" + locationSet.route
            ? locationSet.route
            : "",
          city: locationSet.locality || locationSet.administrative_area_level_2,
          state: locationSet.administrative_area_level_1,
          country: locationSet.country,
          pincode: locationSet.postal_code,
          lat_lon: [lat_lon.lat, lat_lon.lng],
        };
        this.setState({
          location: location,
          changeLocation: location,
          editData: location,
          errors: "",
          bnt: false,
          center: {
            lat: location.lat_lon[0],
            lng: location.lat_lon[1],
          },
        });
        this.props.centerLocation({
          lat: location.lat_lon[0],
          lng: location.lat_lon[1],
        });
        // this.props.getLocation({variables:{lat_lon:location.lat_lon}})
      },

      (error) => {
        console.error(error);
      }
    );
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
    let { location, googleApi } = this.state;
    let { getLatLon } = this.props;
    let l = getLatLon && getLatLon.length > 0 ? getLatLon[0] : 40.748817;
    let lo = getLatLon && getLatLon.length > 0 ? getLatLon[1] : -73.985428;
    if (getLatLon && this._searchBox) {
      // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
      Geocode.setApiKey(googleApi);
      // Enable or disable logs. Its optional.Geocode.enableDebug();
      Geocode.fromLatLng(l, lo).then(
        (response) => {
          const address = response.results[0].formatted_address;
          if (this._searchBox && this._searchBox.containerElement) {
            if (
              this._searchBox.containerElement.getElementsByClassName(
                "location"
              ) &&
              this._searchBox.containerElement.getElementsByClassName(
                "location"
              )[0]
            ) {
              this._searchBox.containerElement.getElementsByClassName(
                "location"
              )[0].value = address;
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();
    if (places && places.length) {
      var locationSet = mapLocation(places);
      //var url = new URL(window.location);
      // let latlon_Array = [places[0].geometry.location.lat() , places[0].geometry.location.lng()]
      // url.searchParams.set("location",latlon_Array.join("_"))
      //   places[0].name ? url.searchParams.set("locationName",places[0].name) : url.searchParams.set("locationName",places[0].city)
      //   history.push(`?${url.searchParams.toString()}`)
      // places[0].name
      //   ? this.props.getLocationName({
      //       variables: { locationName: places[0].name },
      //     })
      //   : this.props.getLocationName({
      //       variables: { locationName: places[0].city },
      //     });
      // this.props.getLocation({
      //   variables: {
      //     lat_lon: [
      //       places[0].geometry.location.lat(),
      //       places[0].geometry.location.lng(),
      //     ],
      //   },
      // });

      var location = {
        address: locationSet.street_name
          ? locationSet.street_name
          : "" + locationSet.route
          ? locationSet.route
          : "",
        city: locationSet.locality || locationSet.administrative_area_level_2,
        state: locationSet.administrative_area_level_1,
        country: locationSet.country,
        pincode: locationSet.postal_code,
        lat_lon: [
          places[0].geometry.location.lat(),
          places[0].geometry.location.lng(),
        ],
      };
      this.setState({
        center: {
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
        },
        location: location,
        editData: { location },
        errors: "",
        bnt: false,
      });
    }
    this.props.centerLocation({
      lat: places[0].geometry.location.lat(),
      lng: places[0].geometry.location.lng(),
    });
    this.setState({
      changeLocation: places[0],
    });
  }

  dataSend = () => {
    const { location } = this.state;
    var url = new URL(window.location);
    this.props.getLocation({variables: { lat_lon: location && location.lat_lon }});
    location && location.address !== undefined ? this.props.getLocationName({variables: {locationName: location.address}}) : location && location.city !== undefined ?
    this.props.getLocationName({variables: {locationName: location.city}}) : location && location.state !== undefined ? this.props.getLocationName({variables: {locationName: location.state}}) : this.props.getLocationName({variables: {locationName: location.country}})

    let locationData =  location && location.address !== undefined ? location.address : location && location.city !== undefined ? location.city : location && location.state !== undefined ? location.state : location.country
  
    if(Object.keys(this.state.location).length > 0) {
      this.props.getRadius({variables:{radius:this.state.horizontal.toString()}})
      url.searchParams.set("radius",this.state.horizontal.toString()) 
      url.searchParams.set("location",location && location.lat_lon.join("_"));
      url.searchParams.set("locationName",locationData) 
    }
   
    history.push(`?${url.searchParams.toString()}`)
    this.props.close();
  };


  handleChangeHorizontal = value => {
    this.setState({
      horizontal: value
    })
    if(Object.keys(this.state.location).length > 0) {
      this.setState({
          bnt: false
      })
    }
  };

  render() {
    const { lat, lng, bounds, center, googleApi,horizontal,defaultUnit } = this.state;
    const { classes, t, i18n, getLatLon } = this.props;

    const horizontalLabels = {
        50: 'Home',
        100: '100',
        200: '200',
        300: '300',
        500: 'Default'
  }
    const format = () => {
      return horizontal + defaultUnit
    }
  
    return (
      <Card>
        <FormHelperText error={!!this.state.errors}>
          {this.state.errors + (this.state.errors ? " *" : "")}
        </FormHelperText>
        <CardBody>
          <CustomSkinMap
            onBoundsChanged={this.onBoundsChanged}
            onMapLoad={this.handleMapLoad}
            onDragEnd={this.handleMapDrag}
            onSearchBoxMounted={this.handleSearchBoxMounted}
            bounds={bounds}
            onPlacesChanged={this.handlePlacesChanged}
            handleChange={this.handleChange}
            onCenterChanged={this.onCenterChanged}
            center={this.state.center}
            lat={getLatLon && getLatLon[0]}
            lng={getLatLon && getLatLon[1]}
            t={t}
            maxZoom={this.state.horizontal}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleApi}&libraries=places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div
                style={{
                  height: `280px`,
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
          <img
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
            src={marker}
            alt="..."
          />
        </CardBody>
        <div style={{"padding-bottom":"4%"}}>
        <div className='slider custom-labels mapSlider'>
          {/* <div className="col-lg-1 col-3 col-md-2"><i className="fa fa-home"></i></div>  */}
          {localStorage.getItem("lang") === "ar" ? (             
              <Slider
                min={50}
                max={500}
                value={horizontal}
                labels={horizontalLabels}
                format={format}
                handleLabel={horizontal}
                onChange={this.handleChangeHorizontal}   
                className={"nn_rangeslider"} 
                reverse = {true}                       
                //kclassName="col-lg-10 col-6 col-md-8"
            />
               ) : (
                <Slider
                min={50}
                max={500}
                value={horizontal}
                labels={horizontalLabels}
                format={format}
                handleLabel={horizontal}
                onChange={this.handleChangeHorizontal}                     
                //kclassName="col-lg-10 col-6 col-md-8"
              />
              )}            
      {/* <div  className="col-lg-1 col-3 col-md-2"><i className="fa fa-road"></i></div>  */}
        </div>
        </div>
            <div className="sav_chang">
                  <button disabled={this.state.bnt} type="submit" onClick={this.dataSend} 
                       className="btn btn-danger btn-block">{ this.props.t('Homepagefilter._SetLocation')}
                  </button>
              </div> 
      </Card>
    );
  }
}

LocationFilter.propTypes = {
  onPlacesChanged: PropTypes.func,
};

var Load = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(LOCATION, { name: "getLocation" }),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
      fetchPolicy: "cache-only",
    }),
  }),
  graphql(RADIUS, {name: 'getRadius'}),
  graphql(GET_RADIUS, {
    name: "getCacheRadiusData",
    options: () => ({
        fetchPolicy: 'cache-only'
      })
  }),
  graphql(LOCATION_NAME, { name: "getLocationName" }),
  graphql(GET_LOCATION_NAME, {
    name: "getLoactionNameData",
    options: () => ({
      fetchPolicy: "cache-only",
    }),
  })
)(LocationFilter);

export default withTranslation("common")(withStyles(styles)(Load));

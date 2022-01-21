import React from "react";
import ReactDOM from "react-dom";
import Grid from '@material-ui/core/Grid';
import delimg from "../../../assets/img/delete-icon.png";
import editimg from "../../../assets/img/edit-icon.png";
import { withStyles } from "@material-ui/core/styles";
import { UPDATE_SHIPPING_ADDRESS, GET_CURRENT_USER, GET_USER ,GET_PRODUCT,GET_SITE_INFO, DELETE_SHIPPING_ADDRESS, GET_PAYMENT_TOKEN, GET_STRIPE_SECRET, UPDATE_PAYMENT, GET_FEATURELIST_DETAILS,IS_CATEGORY_REFETCH,CATE_LANG_REFETCH} from "../../../queries";
import { compose, graphql } from "react-apollo";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import {  getSymbol } from "../../../helper";
import FormHelperText from  "@material-ui/core/FormHelperText";
import paypal from 'paypal-checkout';
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";
import Footer from "../Footer/Footer";
import { animateScroll as scroll } from "react-scroll";
import {ScrollTop,OrderViewPage,DiscardPopup,OrderViewPopup} from '../css/styledcomponents';
import history from "../../../history";

const initialState = {
	NameError: "",
	countryError: "",
	address1Error: "",
	cityError: "",
	stateError: "",
	zipCodeError: "",
	phoneNumberError: "",
	allBuyerShippingAddress: [],
	_id: null,
	stripeClientSecret: "",
	stripePublishKey: "",
	clientToken:"",
	commit:true,
	paypalButtonEnable: false
}

const styles = (theme) => ({
	root: {
	  flexGrow: 1,
	  backgroundColor: theme.palette.background.paper,
	},
	bigIndicator: {
	  backgroundColor: "transparent",
	},
});

const customStyles2 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    margin: "0px 0",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "calc(100% - 20px)"
  }
};
const customStylesDetails = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
const customStylesDetails_pay = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width:'500px'
  }
};

const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

class OrderView extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
			...initialState,
	    	reportlistco: false,
	    	modalIsOpen: false,
	    	paypalmodal:false,
	    	address:true,
	    	ordersummery:false,
			paymentmethod:false,
			errors: {
				submitBtn: false
			},
			errors:{},
			userId:"",
			deleteId:"",
			colorId:"",
			addressData: {
				Name: "",
				country: "",
				address1: "",
				address2: "",
				city: "",
				state: "",
				zipCode: "",
				phoneNumber: ""
		   },
		   showScroll: false,
		   activeBox: 0
	    };

	}


	componentScroll = () => {
		const scope = this;
		var winheight =
		  window.innerHeight ||
		  (document.documentElement || document.body).clientHeight;
		var D = document;
		var docheight = Math.max(
		  D.body.scrollHeight,
		  D.documentElement.scrollHeight,
		  D.body.offsetHeight,
		  D.documentElement.offsetHeight,
		  D.body.clientHeight,
		  D.documentElement.clientHeight
		);
		var scrollTop =
		  window.pageYOffset ||
		  (document.documentElement || document.body.parentNode || document.body)
			.scrollTop;
		var trackLength = docheight - winheight;
		var pctScrolled = Math.floor((scrollTop / trackLength) * 100);

		if (pctScrolled > 10) {
		  scope.setState({
			showScroll: true
		  });
		} else {
		  scope.setState({
			showScroll: false
		  });
		}
	  };
	componentWillUnmount() {
		window.removeEventListener(
		  "scroll",
		  () => {
			this.componentScroll();
		  },
		  true
		);
	  }
	  componentDidMount() {
		window.addEventListener(
			"scroll",
			() => {
			  this.componentScroll();
			},
			true
		  );
		//  setTimeout(()=>{
		//	const {siteInfo}=this.props;
		//	const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
		//	const r = document.querySelector(':root').style;
		//	r.setProperty('--theme-color',color1);
		//	r.setProperty("--theme-color-hvr",(color1 + "bf"));
		 // },2000);
	  }
	  scrollToTop() {
		scroll.scrollToTop();
	}

	componentWillMount(){
		var root = document.getElementsByTagName( 'html' )[0];
		root.style.backgroundColor="#f6f5f7";
		let {match,client,siteInfo,getFeatureddetails,currentUser, getUser,}= this.props;

	   if(currentUser.getCurrentUser && currentUser.getCurrentUser.id) {
		   // for refetch
		   	getUser.refetch({ id: Number(currentUser.getCurrentUser.id) }).then(({ data }) => {
			   if (data && data.getUserDetails) {
				 this.setState({
				   allBuyerShippingAddress: data.getUserDetails.foundUser.buyerShippingAddress,
				   userId : currentUser.getCurrentUser.id
				 });
			   }
			 });
			}
			client.query({
				query: GET_PRODUCT,
				variables: { id: Number(match.params.id) },
				fetchPolicy: "network-only"
			}).then(({data}) => {
			this.setState({
				getProductMount: data.getProduct[0],
			})
			if(Number(currentUser.getCurrentUser.id) === Number(this.state.getProductMount.userId) || this.state.getProductMount.sellingStatus !== "ForSale" || this.state.getProductMount.status !== "Approved" || this.state.getProductMount.instantBuy !== true) {
				this.props.history.push(`/`);
			}
			})
			.catch(err => {
			console.log("catch", err);
			this.props.history.push(`/`);
			});

			 client.query({
			   query: GET_SITE_INFO
			 })
			 .then(({data}) => {
				 this.setState({
				   getPaymentMount: data.getSiteInfo,
				})
			  })
			 .catch(err => {
			   console.log("catch", err);
			 });

			 client.query({
			   query: GET_FEATURELIST_DETAILS
			 })
			 .then(({data}) => {
				 if(data){
				   let paymentData = data.getFeaturedDetails.paymentInfo;
				   paymentData.filter(x=> x.payment_type === "Paypal").map((z) => {
					   this.setState({
						 paypalClientKey : z.key
					 })
				   })
			   }
			 });

	}

	reporList = () => {
		this.setState({
			addressData: {
				Name: "",
				country: "",
				address1: "",
				address2: "",
				city: "",
				state: "",
				zipCode: "",
				phoneNumber: "",
			},
			NameError:"",
			countryError:"",
			cityError:"",
			zipCodeError:"",
			address1Error:"",
			stateError:"",
			phoneNumberError:"",
			reportlistco: true
		});
	};

	modaldel = (data) => {
		this.setState({
			deleteId:data._id,
		    modalIsOpen: true,
		    });
	};

	closeModalSlide  = () => {
		this.setState({
		    modalIsOpen: false,
		    });
  	};
	editList = (data) => {
	    this.setState({
			_id: data._id,
			addressData : {
	    		Name: data.Name,
	    		country: data.country,
	    		address1: data.address1,
	    		address2: data.address2,
	    		city: data.city,
	    		state: data.state,
	    		zipCode: data.zipCode,
				phoneNumber: data.phoneNumber
			},
			NameError:"",
			countryError:"",
			cityError:"",
			zipCodeError:"",
			address1Error:"",
			stateError:"",
			phoneNumberError:"",
	      	reportlistco: true
	    });
	};


	componentWillReceiveProps(nextProps){
		let {getUser,currentUser,match,categoryRefetch} =  nextProps
		if(nextProps !== this.props){
			if (currentUser && currentUser.getCurrentUser.id) {
				getUser.refetch({ id: Number( currentUser.getCurrentUser.id) }).then(({ data }) => {
				  if (data && data.getUserDetails) {
					this.setState({
						allBuyerShippingAddress: data.getUserDetails.foundUser.buyerShippingAddress,
						userId : currentUser.getCurrentUser.id,
						colorId: data.getUserDetails.foundUser.buyerShippingAddress && data.getUserDetails.foundUser.buyerShippingAddress.length > 0 && data.getUserDetails.foundUser.buyerShippingAddress[0].name
					});
				  }
				});
		   }
		}
		if (categoryRefetch.categoryRefetch === true) {
			if (match.params.id) {
			  this.props.getRefetch({ variables: { categoryRefetch: false } });
			  if(nextProps != this.props){
				this.props.client
				.query({
				  query: GET_PRODUCT,
				  variables: { id: Number(match.params.id) },
				  fetchPolicy: "network-only"
				})
				.then(({data}) => {
				  this.setState({
					  getProductMount: data.getProduct[0],
					  chatRoomId: data.getProduct[0].groupsId
				   })
				})
				.catch(err => {
				  console.log("catch", err);
				});
			  }
		 	}
		}
	}

	closePopup = () => {
		this.setState({ _id: null,  reportlistco: false,paypalmodal: false,PayButtonEnabled: false });
	}

	handleChange = (event) => {
		let name = event.target.name;
		if(name === "userName" || name === "Name" || name === "address1" || name === "address2" || name === "city" || name === "state" || name === "country" || name === "zipCode" || name === "phoneNumber") {
			this.setState({
				addressData: {
					...this.state.addressData,
					[name]: event.target.value.trimLeft()
				}
			});
		}
	};

	updateShippingAddressData = async () => {
		let { addressData, _id ,userId } = this.state;
		let {getUser,updateShippingAddress} = this.props;
		let buyerShippingAddress = [];
			var data = {
				// userName: userName,
				Name: addressData.Name,
				country: addressData.country,
				address1: addressData.address1,
				address2: addressData.address2,
				city: addressData.city,
				state: addressData.state,
				zipCode: addressData.zipCode,
				phoneNumber: addressData.phoneNumber
			}
		buyerShippingAddress.push(data)

		if(_id) {
			updateShippingAddress({
				variables: {
					id: _id,
					data:  buyerShippingAddress
				},
				refetchQueries: [
					{ query: GET_USER, variables: { id: Number(userId) } }
				]
			}).then(({data}) => {
				this.setState({
					_id: null,  reportlistco: false
				})
			})
		}
		else {
			updateShippingAddress({
				variables: {
					data:  buyerShippingAddress
				},
				refetchQueries: [
					{ query: GET_USER, variables: { id: Number(userId) } }
				]
			})
			.then(({data}) => {
				this.setState({
					_id: null,  reportlistco: false
				})
			})
		}
	};


	isValidated() {
		let self = this;
		var error = {}, flag;
		if(this.state.addressData.Name === '' || this.state.addressData.Name.trimLeft() === ""){
		  error.Name = 'Name required'
		  this.setState({
			NameError: this.props.t("orderViewPage._NameErrorCtn")
		  });
		}
		else{
		  error.Name = ''
		  this.setState({
			NameError: ""
		  });
		}if(this.state.addressData.country === '' || this.state.addressData.country.trimLeft() === ""){
		  error.country = 'Country required'
		  this.setState({
			countryError: this.props.t("orderViewPage._CountryErrorCtn")
		  });
		}
		else{
		  error.country = ''
		  this.setState({
			countryError: ""
		  });
		}if(this.state.addressData.address1 === '' || this.state.addressData.address1.trimLeft() === ""){
		  error.address1 = 'Address1 required'
		  this.setState({
			address1Error: this.props.t("orderViewPage._Address1ErrorCtn")
		  });
		}
		else{
		  error.address1 = ''
		  this.setState({
			address1Error: ""
		  });
		}if(this.state.addressData.city === '' || this.state.addressData.city.trimLeft() === ""){
		  error.city = 'City required'
		  this.setState({
			cityError: this.props.t("orderViewPage._CityErrorCtn")
		  });
		}
		else{
		  error.city = ''
		  this.setState({
			cityError: ""
		  });
		}if(this.state.addressData.state === '' || this.state.addressData.state.trimLeft() === ""){
		  error.state = 'State required'
		  this.setState({
			stateError: this.props.t("orderViewPage._StateErrorCtn")
		  });
		}
		else{
		  error.state = ''
		  this.setState({
			stateError: ""
		  });
		}if(this.state.addressData.zipCode === '' || this.state.addressData.zipCode.trimLeft() === ""){
		  error.zipCode = 'Zip Code required'
		  this.setState({
			zipCodeError: this.props.t("orderViewPage._ZipCodeErrorCtn")
		  });
		}
		else{
		  error.zipCode = ''
		  this.setState({
			zipCodeError: ""
		  });
		}if(this.state.addressData.phoneNumber === '' || this.state.addressData.phoneNumber.trimLeft() === ""){
		  error.phoneNumber = 'Phone Number required'
		  this.setState({
			phoneNumberError: this.props.t("orderViewPage._PhoneNumberErrorCtn")
		  });
		}
		else{
		  error.phoneNumber = ''
		  this.setState({
			phoneNumberError: ""
		  });
		}

	  this.setState({
		errors: error
	  });
	  flag = Object.keys(error).find((obj) => {
		if (error[obj]) return true;
		return false;
	  });
	  if (flag) {
		return false;
	  }
	  return true;
	}

	handleFormSubmit = (e) => {
		e.preventDefault();
			if(this.isValidated()) {
				this.updateShippingAddressData();
			}
	  };

	handleDelete = (data) => {
		if(data) {
			let { userId } = this.state;
			this.props.deleteShippingAddress({
				variables: {
					id: data,
				},
				refetchQueries: [
					{ query: GET_USER, variables: { id: Number(userId) } }
				]
			}).then(({data})=> {
				if (data) {
					this.setState({
				    modalIsOpen: false,
				    deleteId:""
				    });
				}
			})
		}
	};

	toggleclickEvent = ({ clickTab }, x) => {
		let { address, paymentmethod, ordersummery } = this.state;
		let {currentUser} = this.props;
		if(clickTab === "address"){
			address = !address;
			ordersummery = false;
			paymentmethod = false;
		}else if(clickTab === "ordersummery"){
			if(x !== undefined){
			if(currentUser.getCurrentUser !== null){
			  const {verifications} = currentUser.getCurrentUser;
			  if(verifications.apple || verifications.google || verifications.faceBook ||verifications.email){
				ordersummery = !ordersummery;
				address = false;
				paymentmethod = false;
				this.setState({
					colorId:x._id,
					addressData : {
						Name: x.Name,
						country: x.country,
						address1: x.address1,
						address2: x.address2,
						city: x.city,
						state: x.state,
						zipCode: x.zipCode,
						phoneNumber: x.phoneNumber
					}
				})
			  }else{
				Toastr.success(
				  <div className="msgg">
					<div>
					  <svg
						viewBox="0 0 24 24"
						width="32"
						height="32"
						style={{ fill: "red" }}
					  >
						<path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
					  </svg>
					</div>
					<div>{this.props.t("login._verifyMail")}</div>
				  </div>
				);
			  }
			}
		}else {
			address = false;
			ordersummery = !ordersummery
			paymentmethod = false;
		  }
		}else{
		paymentmethod = true;
			ordersummery = false;
			address = false;
		}
	this.setState({ address, ordersummery, paymentmethod });
	}

	handleClick = (i) => {
		this.setState({
		activeBox: i
		})
	}
	proceedToPayment = (addressId) => {
		const productId = this.props.match.params.id;
		history.push(`/api/payment?type=instantBuy&addressId=${addressId}&productId=${productId}`)
	}

	render() {
		const {t} = this.props;
		const {addressData, address,ordersummery,paymentmethod, NameError, countryError, address1Error,  cityError, stateError, zipCodeError, phoneNumberError, allBuyerShippingAddress, _id,
			getProductMount,getPaymentMount, clientToken,paypalClientKey,showScroll,activeBox} = this.state

		return (
			<OrderViewPage>
			<div className="cls_orderview">
				<div className="container">
					<div className="cls_product_heading">
						<h2 className="cls-heading-text">{this.props.t("orderViewPage._reviewOrder")}</h2>
						<p className="cls-heading-sub-text">{this.props.t("orderViewPage._reviewOrderDescription")}</p>
					</div>

					<div className="cls_orderall">
						<div className="cls_address my-3 cls_common d-flex align-items-center justify-content-between flex-wrap">
							<h2 onClick={() => this.toggleclickEvent({ clickTab: "address"})}>{this.props.t("orderViewPage._selectAddress")}</h2>
							{allBuyerShippingAddress.length > 0 ? <button id="cls_addressbtn" ref={ (divElement) => { this.divElement = divElement } } onClick={this.reporList}>{this.props.t("orderViewPage._addAddress")}</button>:""}
						</div>
						{address && <div className="cls_address_view" id="fulladdress">
							<Grid container spacing={2}>
							{allBuyerShippingAddress.length > 0 ?
							<> {
								allBuyerShippingAddress.map((x,i) => (
									<Grid  xs={12} sm={6} md={4} key={i}>

									<>
									<div className={`cls_addlist ${(activeBox === i) ? "active" : ""}`}
									onClick={()=>this.handleClick(i)} >
										<div className="cls_editdel">
												<img src={editimg} onClick={() => this.editList(x)} alt="Edit" />
												<img src={delimg} onClick={() => this.modaldel(x)} alt="Delete" />
										</div>
										<div className="cls_adddisplay">
											{/* <p>{x.userName}</p> */}
											<p>{x.Name}</p>
											<p>{x.address1}</p>
											<p>{x.address2}</p>
											<p>{x.city} - {x.zipCode}</p>
											<p>{x.state}</p>
											<p>{x.country}</p>
											{/* <p>{x.zipCode}</p> */}
										</div>
										<h3>{x.phoneNumber}</h3>
										<button
										onClick={() => this.toggleclickEvent({ clickTab: "ordersummery"}, x)}
										// onClick={() => this.continueclick(x._id)}
										>{this.props.t("orderViewPage._continue")}</button>
									</div>
									</>
									</Grid>
								))
							} </>
							:
							<div className="cls_emptyaddress">
							<h1>{this.props.t("orderViewPage._addressNotyet")}</h1>
								<button onClick={this.reporList}>{this.props.t("orderViewPage._addAddress")}</button>
							</div>}

							</Grid>
						</div>}


						{<div className="cls_summery my-3 cls_common d-flex align-items-center justify-content-between flex-wrap nn_order">
						<h2 onClick={() => this.toggleclickEvent({ clickTab: "ordersummery"})} style={{cursor:"pointer"}} >2.{this.props.t("orderViewPage._orderSummary")}</h2>
							<span>{this.props.t("orderViewPage._orderTotal")} : <strong>{getSymbol(getProductMount && getProductMount.currencySymbol)} {((getProductMount &&  getProductMount.rate ) + (getProductMount && getProductMount.shippingRate) + (getProductMount && getProductMount.serviceFeeBuyerRate)).toFixed(2)} </strong></span>
						</div>}
						{ordersummery && <div className="cls_ordersummery" id="ordersummery">

							<Grid container spacing={2}>
								<Grid xs={12} sm={3} md={2}>
									<div className="cls_orderimg">
										<img src={(getProductMount && getProductMount.images[0])} alt="" />
									</div>
								</Grid>
								<Grid xs={12} sm={6} md={7}>
									<div className="cls_ordertxt">
										<p>{(getProductMount && getProductMount.title)}</p>
										<label>{this.props.t("orderViewPage._seller")}</label> <span>{(getProductMount && getProductMount.userName)}</span>
									</div>
								</Grid>
								<Grid xs={12} sm={3} md={3}>
									<div className="cls_orderprice">
										<p><label>{this.props.t("orderViewPage._itemFee")}</label> <span>{getSymbol(getProductMount && getProductMount.currencySymbol)} {getProductMount && getProductMount.rate}</span></p>
										<p><label>{this.props.t("orderViewPage._shippingRate")}: </label> <span>{getSymbol(getProductMount && getProductMount.currencySymbol)} {getProductMount && getProductMount.shippingRate}</span></p>
										{(getProductMount.serviceFeeBuyerRate != 0 ) ? <p><labe>{this.props.t("orderViewPage._serviceFeeBuyerRate")}</labe> <span>{getSymbol(getProductMount && getProductMount.currencySymbol)} {getProductMount && getProductMount.serviceFeeBuyerRate} </span></p> : ""}
									</div>
								</Grid>

							</Grid>
							<div className="cls_orderbtn">
								<button className="btn btn_theme"
								// onClick={this.nextpayment}
								onClick={() => this.toggleclickEvent({ clickTab: "payment"})}

								>{this.props.t("orderViewPage._continue")}</button>
								{/* <button  className="btn btn_cancel">{this.props.t("orderViewPage._cancel")}</button> */}
							</div>
						</div>}

						<div className="cls_payment my-3 cls_common d-flex align-items-center justify-content-between flex-wrap">
							<h3>3.{this.props.t("orderViewPage._paymentmethod")}</h3>
							{localStorage.getItem("currency") !== "USD" ?
							<span>{this.props.t("orderViewPage._note")} <strong> {((getProductMount &&  getProductMount.rate ) + (getProductMount && getProductMount.shippingRate) + (getProductMount && getProductMount.serviceFeeBuyerRate)).toFixed(2)} {getSymbol(getProductMount && getProductMount.currencySymbol)} </strong>
							{this.props.t("orderViewPage._convertedInto")} <strong> {((getProductMount &&  getProductMount.usdProductRate ) + (getProductMount && getProductMount.usdShippingRate) + (getProductMount && getProductMount.usdServiceFeeBuyerRate)).toFixed(2)} {getSymbol("&#36;")}</strong></span> : ""}
						</div>
						{((paymentmethod) && ((getPaymentMount && getPaymentMount.braintree) || (getPaymentMount && getPaymentMount.stripe) || (getPaymentMount && getPaymentMount.paypal))) ? <div className="cls_paymentmethod" id="paymentmethod"> 
							<button className="nn_cancel_btn nn_cancel_ok" onClick={() => this.proceedToPayment(this.state.colorId)}> {t("orderViewPage._proceedPayment")} </button>
						</div> : ((paymentmethod) && !((getPaymentMount && getPaymentMount.braintree) || (getPaymentMount && getPaymentMount.stripe) || (getPaymentMount && getPaymentMount.paypal))) && <div className="cls_paymentmethod" id="paymentmethod">  {t("orderViewPage._paymentNotAvailable")} </div>}
					</div>
				</div>
				<OrderViewPopup
				isOpen={this.state.reportlistco}
				contentLabel="Minimal Modal Example"
				style={customStyles2}
				>
				<div className="cls_mainmodal">
				<h3 className="cls_pophead">{this.props.t("orderViewPage._address")}
				<div class="cls_popclose">
					<button
					type="button"
					onClick={this.closePopup}
					class=" float-left location-close ltn"
					>
					<span class="clsbtn"> &times; </span>
					</button>
				</div>
				</h3>
	        	<div className="cls_addaddress">
	        		<form onSubmit={this.handleFormSubmit}>
	        		{/* <div class="form-group">
	        		 <label>User Name</label>
	        		<CustomInput
                              formControlProps={{
                                fullWidth: true,
                                className: "cls_from_ctrl"
							  }}
							  error={userNameError}
                  			  helperText={userNameError}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "userName",
								onChange: this.handleChange,
								value: userName,
                                autoComplete: "off",
							  }}
                     />
                    {userNameError ? <FormHelperText error={userNameError ? true : false}>
                    {userNameError}
                  	</FormHelperText> : ""}

                     </div> */}
	        		<div class="form-group">
					<label>{this.props.t("orderViewPage._name")}<span className="nn_validatcolor">*</span></label>
					   <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                className: "cls_from_ctrl"
							  }}
							  error={NameError}
                  			  helperText={NameError}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "Name",
								onChange: this.handleChange,
								value: addressData.Name,
                                autoComplete: "off",
                              }}
                     />
                     {NameError ? <FormHelperText error={NameError ? true : false}>
                    {NameError}</FormHelperText> : ""}

					 </div>
					 <div class="form-group">
					  <label>{this.props.t("orderViewPage._country")}<span className="nn_validatcolor">*</span></label>
					     <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
							  error={countryError}
                  			  helperText={countryError}
                              required
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
                                ),
                                name: "country",
								onChange: this.handleChange,
								value: addressData.country,
                                autoComplete: "off"
                              }}
                     />
                     {countryError ? <FormHelperText error={countryError ? true : false}>
                    {countryError}</FormHelperText> : ""}

					 </div>
					 <div class="form-group">
					  <label>{this.props.t("orderViewPage._address1")}<span className="nn_validatcolor">*</span></label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
							  error={address1Error}
                  			  helperText={address1Error}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "address1",
								onChange: this.handleChange,
								value: addressData.address1,
                                autoComplete: "off"
                              }}
                     />
                     {address1Error ? <FormHelperText error={address1Error ? true : false}>
                    {address1Error}</FormHelperText> : ""}
					 </div>
					 <div class="form-group">
					    <label>{this.props.t("orderViewPage._address2")}</label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "address2",
								onChange: this.handleChange,
								value: addressData.address2,
                                autoComplete: "off",
                              }}
                     />
					 </div>
					 <div class="form-group">
					     <label>{this.props.t("orderViewPage._city")}<span className="nn_validatcolor">*</span></label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
							  error={cityError}
                  			  helperText={cityError}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "city",
								onChange: this.handleChange,
								value: addressData.city,
                                autoComplete: "off",
                              }}
                     />
                     {cityError ? <FormHelperText error={cityError ? true : false} style={{margin: "0px 0px 15px"}}>
                    {cityError}</FormHelperText> : ""}
					 </div>
					 <div class="form-group">
					     <label>{this.props.t("orderViewPage._state")}<span className="nn_validatcolor">*</span></label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
							  error={stateError}
                  			  helperText={stateError}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "state",
								onChange: this.handleChange,
								value: addressData.state,
                                autoComplete: "off",
                              }}
                     />
                     {stateError ? <FormHelperText error={stateError ? true : false}>
                    {stateError}</FormHelperText> : ""}
					 </div>
					 <div class="form-group">
					     <label>{this.props.t("orderViewPage._zipCode")}<span className="nn_validatcolor">*</span></label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                 className: "cls_from_ctrl"
							  }}
							  error={zipCodeError}
                  			  helperText={zipCodeError}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "zipCode",
								onChange: this.handleChange,
								value: addressData.zipCode,
                                autoComplete: "off",
                              }}
                     />
                    {zipCodeError ? <FormHelperText error={zipCodeError ? true : false}>
                    {zipCodeError}</FormHelperText> : ""}
					 </div>
					 <div class="form-group">
					     <label>{this.props.t("orderViewPage._phone")}<span className="nn_validatcolor">*</span></label>
					    <CustomInput
                              formControlProps={{
                                fullWidth: true,
                                className: "cls_from_ctrl"
							  }}
							  error={phoneNumberError}
                  			  helperText={phoneNumberError}
                               variant="outlined"
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className="sdasdasd"
                                  >
                                  </InputAdornment>
								),
								name: "phoneNumber",
								type: "number",
								onChange: this.handleChange,
								// onChange: this.updateMobileNumber,
								value: addressData.phoneNumber,
                                autoComplete: "off",
                              }}
                     />
                     {phoneNumberError ? <FormHelperText error={phoneNumberError ? true : false}>
                    {phoneNumberError}</FormHelperText> : ""}
					 </div>
					 <div className="my-3 text-center">
					  <button type="submit" class="btn btn_theme">{this.props.t("orderViewPage._saveAddress")}</button>
					 </div>
					</form>
	        	</div>
	        	</div>
	        </OrderViewPopup>

	          <DiscardPopup
                isOpen={this.state.modalIsOpen}
                //onAfterOpen={this.afterOpenModal}
                //onRequestClose={this.closeModalSlide}
                style={customStylesDetails}
                contentLabel="Example Modal"
              >
                <div className="discardPopup cls_delepop">
                  {/* <h3>Listing not posted</h3>
              <hr /> */}
                  <section>
                    <article className="nn_popup_title">
                      <p>{this.props.t("orderViewPage._deleteConfirm")}</p>
                    </article>
                  </section>
                  <footer>
				  <div className="nn_discard_btn">
                   <button
                      className="btn1"
                      onClick={(event) => this.handleDelete(this.state.deleteId)}
                    >
                      {" "}
                      {this.props.t("orderViewPage._delete")}{" "}
                    </button>

                    <button
                      className="btn2"
                      onClick={() => this.closeModalSlide()}
                    >
                      {" "}
                      {this.props.t("orderViewPage._cancel")}{" "}
                    </button>
                    </div>
                  </footer>
                </div>
              </DiscardPopup>
			  <Footer />
			  {showScroll && (
				<ScrollTop>
                <div className="anchor-fixed" onClick={this.scrollToTop}>
                  <a>
                    <span>
                      {" "}
                      <i class="fa fa-chevron-up" aria-hidden="true"></i>
                    </span>{" "}
                  </a>
                </div>
				</ScrollTop>
              )}
			</div>
			</OrderViewPage>

			)
	}

}

var shippingAddressAction = compose(
	graphql(UPDATE_SHIPPING_ADDRESS, {name: "updateShippingAddress"}),
	graphql(DELETE_SHIPPING_ADDRESS, {name: "deleteShippingAddress"}),
	graphql(GET_SITE_INFO, { name: "siteInfo" }),
	graphql(GET_CURRENT_USER, { name: "currentUser" }),
	graphql(GET_PAYMENT_TOKEN, { name: "getPaymentToken" }),
	graphql(GET_STRIPE_SECRET, { name: "getStripeClientToken" }),
	graphql(UPDATE_PAYMENT, { name: "updatePayment" }),
	graphql(GET_FEATURELIST_DETAILS, { name: "getFeatureddetails"}),
	graphql(GET_USER, {
		name: "getUser",
		options: props => ({
			variables: { id: Number(props.currentUser.getCurrentUser.id) },
			fetchPolicy: "network-only"
		})
	}),
	graphql(IS_CATEGORY_REFETCH, { name: "categoryRefetch" }),
    graphql(CATE_LANG_REFETCH, { name: "getRefetch" })
  )(OrderView);

export default withTranslation("common")(withStyles(styles)(shippingAddressAction));
// export default OrderView;
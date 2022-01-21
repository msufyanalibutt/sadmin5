import React from "react";
import { compose, graphql } from "react-apollo";

// react component for creating dynamic tables
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import ReactTable from "react-table";
import "react-table/react-table.css";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardText from "../../../components/Card/CardText.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";
import Modal from "react-modal";
import CloseIcon from '@material-ui/icons/Close';
// core components
import { GET_ORDER_DETAILS, REFUND, PAYOUT_UPDATE, GET_SITE_INFO, UPDATE_ORDER_STATUS } from "../../../queries";
//style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import { dateSet1, getSymbol } from "../../../helper.js";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    buttonStyle: {
        float: "right",
        position: "relative",
        marginTop: "20px"
    },
    smallButton: {
        marginRight: "5px",
        backgroundColor: "#00acc1 !important",
        marginTop: "25px"
    }
};

const customStylesReview = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      maxHeight:"100%",
      padding: "0px"
    }
  };


class orders extends React.Component {
    constructor(props) {
        super(props);
        this.reactTable = React.createRef();
        this.state = {
            popUpDetails: [],
            canDelete: false,
            open: false,
            currentChosen: {},
            data: [],
            refundbtn: false,
            cancelReason:"",
            payoutStatus: null
        };
    }

    async componentDidMount() {
        let { getOrderDetails, match} = this.props;        
        let orderId = match.params.id
        await getOrderDetails.refetch()
            .then(({ data }) => {
                var orderData = data && data.getOrderDetails && data.getOrderDetails.find((o) => o._id == orderId)
                if(orderData && orderData.orderDetails){
                    // console.log(orderData,"oderData");
                    var shippingProductTotal = Number(orderData.orderDetails.productFee) + (orderData.orderDetails.shippingRate)
                    var totalPayoutFee = Number(shippingProductTotal) - Number(orderData.orderDetails.serviceFeeSellerRate)   
                    var orderDetailsSellerFeeFixed = (orderData.orderDetails && orderData.orderDetails.serviceFeeSellerRate).toFixed(2)       
                    var orderDetailstotalFeeFixed = (orderData.orderDetails && orderData.orderDetails.totalFee).toFixed(2)
                    this.setState({
                        orderPlaceId: orderData._id,
                        buyerName: orderData.orderDetails.buyerName,
                        sellerName: orderData.orderDetails.sellerName,
                        beforePayoutDefaultType: orderData.beforePayoutDefaultType,
                        beforePayoutDefaultDetails: orderData.beforePayoutDefaultDetails,
                        payoutMethod:orderData.payoutMethod ,
                        payoutId:orderData.payoutId,
                        payoutAmount:orderData.payoutAmount ,
                        payoutCurrency: orderData.payoutCurrency,
                        isBeforeDefaultPayout: orderData.isBeforeDefaultPayout,
                        buyerShippingAddressname: orderData.buyerShippingAddress.Name,
                        buyerShippingAddressaddress1: orderData.buyerShippingAddress.address1,
                        buyerShippingAddressaddress2: orderData.buyerShippingAddress.address2,
                        buyerShippingAddresscity: orderData.buyerShippingAddress.city,
                        buyerShippingAddresscountry: orderData.buyerShippingAddress.country,
                        buyerShippingAddressstate: orderData.buyerShippingAddress.state,
                        buyerShippingAddressphoneNumber: orderData.buyerShippingAddress.phoneNumber,
                        buyerShippingAddressPincode: orderData.buyerShippingAddress.zipCode,
                        shippingDetailshippementService: orderData.shippingDetails.shippementService,
                        orderDetailsproductName: orderData.orderDetails.productName,
                        shippingDetailstrackingId: orderData.shippingDetails.trackingId,
                        shippingDetailsshippmentDate: dateSet1(orderData.shippingDetails.shippmentDate).split(' ')[0],
                        shippingDetailshippmentMethod: orderData.shippingDetails.shippmentMethod,
                        shippingDetailsnotes: orderData.shippingDetails.notes,
                        cancelReason: orderData.cancelReason,
                        orderDetailsBuyerFee: (orderData.orderDetails.serviceFeeBuyerRate).toFixed(2),
                        orderDetailsSellerFee:orderDetailsSellerFeeFixed,
                        orderDetailstotalFee: orderDetailstotalFeeFixed,
                        orderDetailsproductFee: (orderData.orderDetails.productFee).toFixed(2),
                        orderDetailsshippingFee: orderData.orderDetails.shippingRate.toFixed(2),
                        TotlePayoutFee: (totalPayoutFee).toFixed(2),
                        orderDetailscurrency: orderData.orderDetails.currencySymbol,
                        status: orderData.status,
                        payoutStatus: orderData.payoutStatus,
                        updatedAt: dateSet1(orderData.updatedAt).split(' ')[0],
                        id: orderData._id,
                        refundsuccess: orderData.orderDetails.refundSuccess,
                        currencySymbol: orderData.orderDetails.currencySymbol
                    })
                } 
            })
        }

    refund = async () => {
        let { refund } = this.props;
        refund({
            variables: {
                id: Number(this.state.id)
            },
            refetchQueries: [
                { query: GET_ORDER_DETAILS, variables: { id: Number(this.state.id) } }
            ]
        })
            .then(({ data }) => {
                if (data.refund === "Refund Success") {
                    this.setState({
                        popUpDetails: [data.refund],
                        refundbtn: true
                    })
                }
            }).catch(error => {
                if (error && error.graphQLErrors) {
                    var message = error && error.graphQLErrors && error.graphQLErrors.map(x => x.message);
                    this.setState({
                        popUpDetails: message
                    });
                }
            })

    }

    payout = async () => {
        let { PayoutMethod, match, getOrderDetails } = this.props;
        this.setState({
            isButtonDisabled: true
        })
        PayoutMethod({
            variables: { id: this.state.orderPlaceId }
        }).then(async ({ data }) => {
            if (data.PayoutMethod) {
                this.setState({
                    popUpDetails: [data.PayoutMethod]
                })
            await getOrderDetails.refetch().then(({ data }) => {
                var orderData = data && data.getOrderDetails && data.getOrderDetails.find((o) => o._id == match.params.id)
                this.setState({
                    status: orderData.status,
                    payoutMethod:orderData.payoutMethod,
                    payoutId:orderData.payoutId,
                    payoutAmount:orderData.payoutAmount,
                    payoutCurrency: orderData.payoutCurrency,
                    payoutStatus: orderData.payoutStatus
                })
            })
            }
        }).catch((error) => {
            if (error.graphQLErrors) {
                this.setState({
                    popUpDetails: error.graphQLErrors.map((x) => x.message)
                });
            }
        });
    }

    updateStatus = () => {
        let { match, getOrderDetails } = this.props;
        this.props.updateOrderStatus({
            variables: {
                status: "RECEIVED",
                id: this.state.id
            }
        })
            .then(async ({ data }) => {
                if (data && data.updateOrderStatus) {
                    await getOrderDetails.refetch().then(({ data }) => {
                        var orderDate = data && data.getOrderDetails && data.getOrderDetails.find((o) => o._id == match.params.id)
                        this.setState({
                            status: orderDate.status
                        })
                    })
                }
            })
    }

    closeModal = () => {
        this.setState({
            isModelOpen : false
        })
    }

    payOutDetailS = () => {
        this.setState({
            isModelOpen : true
        })
    }


    render() {
        const { classes,t } = this.props;
        const { sellerName, buyerName, buyerShippingAddressname, buyerShippingAddressaddress1, buyerShippingAddressaddress2, buyerShippingAddresscity, buyerShippingAddresscountry, buyerShippingAddressstate, buyerShippingAddressphoneNumber, shippingDetailshippementService, orderDetailsproductName, orderDetailsproductFee, orderDetailsshippingFee, orderDetailstotalFee, orderDetailsSellerFee,TotlePayoutFee,orderDetailsBuyerFee,shippingDetailsshippmentDate, shippingDetailstrackingId, shippingDetailsnotes, shippingDetailshippmentMethod, currencySymbol, status, refundsuccess, popUpDetails, refundbtn,serviceFeeBuyerPecentage, cancelReason, orderPlaceId,buyerShippingAddressPincode,updatedAt,beforePayoutDefaultType,beforePayoutDefaultDetails,payoutMethod,payoutId,payoutAmount,payoutCurrency,isBeforeDefaultPayout,payoutStatus } = this.state;
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="rose" text>
                            <CardText color="rose">
                                <h4 className={classes.cardTitle}>{"View Order"}</h4>
                            </CardText>
                        </CardHeader>
                        <CardBody className="cls_admin_orderwhole">
                            <div className="border-bottom pb-3 mb-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <h5>Payment To</h5>
                                    <p><strong>{sellerName}</strong></p>
                                </div>
                                <div className="payoutTop">
                                {isBeforeDefaultPayout && <div>
                                <button className="btn btn-success" onClick={this.payOutDetailS}>Payout Details</button> 
                                </div>}
                                {
                                    this.state.isModelOpen && 
                                    <Modal
                                    isOpen={this.state.isModelOpen}
                                    onRequestClose={this.makeClosemodal}
                                    style={customStylesReview}
                                    contentLabel="Example Modal"
                                     >
                                    <div className="nochatuser">
                                      <div className="nn_share_ctn">
                                      <h6>Payout Details</h6>
                                        <button
                                          type="button"
                                          onClick={this.closeModal}
                                          className="location-close ltn nn_close_btn"
                                          data-dismiss="modal"
                                        >
                                          {" "}
                                          
                                          <CloseIcon className="nn_close_icon"/>
                                        </button>
                                      </div>
                                      <div className="centeralignnochat1">
                                        
                                        {
                                            status !== "COMPLETED" ? <>
                                            {(beforePayoutDefaultType !== null) && beforePayoutDefaultType} : {beforePayoutDefaultDetails !== null && beforePayoutDefaultDetails}
                                            </> : <>
                                            <p>
                                            PayoutMethod : {payoutMethod}
                                            </p>
                                            <p>
                                            PayoutId : {payoutId}
                                            </p>
                                            <p>
                                            PayoutAmount : {payoutAmount}
                                            </p>
                                            <p>
                                            PayoutCurrency : {payoutCurrency}
                                            </p>
                                            </>
                                        }
                                        
                                      
                                      </div>
                                    </div>
                                  </Modal>
                                }

                                {(status == "CANCELLED") && (refundsuccess !== true) && (refundbtn !== true) ? <div className="text-right">
                                    <button className="btn btn-success" onClick={this.refund}>Refund</button>                                
                                    </div> : " "}
                                {(refundsuccess === true) || (refundbtn === true) ? <><h3 style={{ fontSize: "18px", color: "#f44961", fontWeight: "bold" }}>Refund Completed</h3></> : ""}

                                {(status && status !== undefined && status === "DELIVERED") && (payoutStatus !== "SUCCESS" && payoutStatus !== "COMPLETED" && payoutStatus !== "PENDING") && 
                                    <Button
                                        color="rose"
                                        type="button"
                                        className={classes.registerButton}
                                        disabled={this.state.isButtonDisabled}
                                        onClick={() => this.payout()}
                                        style={{ float: "right" }}
                                    > Payout
                                 </Button>}
                                {status && status !== undefined && status === "COMPLETED" ?
                                    <h5 style={{ float: "right" }}>
                                        <strong>
                                            payout completed
                                        </strong>
                                    </h5> : <> { (status !== "COMPLETED" && (payoutStatus !== null && payoutStatus !== "SUCCESS" && payoutStatus !== "COMPLETED")) && <h5 style={{ float: "right" }}>
                                        <strong>
                                            payout {payoutStatus && payoutStatus.toLowerCase()}
                                        </strong>
                                    </h5> }</> }

                                {status && status !== undefined && status === "CLAIMED" &&
                                    <h5 style={{ float: "right" }}>
                                        <Button
                                            color="rose"
                                            type="button"
                                            className={classes.registerButton}
                                            //disabled={this.state.isButtonDisabled}
                                            onClick={() => this.updateStatus()}
                                            style={{ float: "right" }}
                                        > Mark as Received
                                 </Button>
                                    </h5>}

                                </div>
                            </div>
                            <div className="row">
                                <div className={shippingDetailshippementService !== null ? " col-lg-4" : "" + "col-lg-6"}>
                                    <div className="cls_orderview_admin">
                                        <h5>Buyer Details</h5>
                                        <p><strong>{buyerName}</strong></p>
                                    </div>
                                    {status == "CANCELLED" ? 
                                    <div className="cls_orderview_admin mt-5">
                                        <h5>Cancelled Details</h5>
                                        <p>Cancelled Date : <strong>{updatedAt}</strong></p>
                                    </div>
                                : ""}
                                </div>
                                
                                
                                <div className={shippingDetailshippementService !== null ? " col-lg-4" : "" + "col-lg-6"}>
                                    <div className="cls_orderview_admin">
                                        <h5>Shipping Details</h5>
                                        <p>Name : <strong>{buyerShippingAddressname}</strong></p>
                                        <p>Address1 : <strong>{buyerShippingAddressaddress1}</strong></p> 
                                        <p>Address2 : <strong>{buyerShippingAddressaddress2}</strong></p>
                                        <p>City : <strong>{buyerShippingAddresscity}</strong> - <strong>{buyerShippingAddressPincode}</strong></p>
                                        <p>Country : <strong>{buyerShippingAddresscountry}</strong></p>
                                        <p>State : <strong>{buyerShippingAddressstate}</strong></p>
                                        <p>Phone No : <strong>{buyerShippingAddressphoneNumber}</strong></p>
                                    </div>
                                </div>
                                {shippingDetailshippementService !== null ?
                                    <div className={shippingDetailshippementService !== null ? " col-lg-4" : "" + ""}>
                                        <div className="cls_orderview_admin">
                                            <h5>Tracking Details</h5>
                                            <p>Shipment Date : <strong>{shippingDetailsshippmentDate}</strong></p>
                                            <p>Shipment Method : <strong>{shippingDetailshippmentMethod}</strong></p>
                                            <p>Shipment Service : <strong>{shippingDetailshippementService}</strong></p>
                                            <p>Tracking ID : <strong>{shippingDetailstrackingId}</strong></p>
                                            <p>Additional Notes : <strong>{shippingDetailsnotes}</strong></p>
                                        </div>
                                    </div> : ""}
                                <div className="col-lg-12">
                                    <table className="table table-striped mt-4">
                                        <thead>
                                            <tr>
                                            <th>Order Id</th>
                                            <th>Product Name</th>
                                            <th>Product Fee</th>
                                            <th>Shipping Price</th>
                                            {orderDetailsBuyerFee !==0 ? <th>Buyer Service Fee</th> : ""}
                                            {/* <th>Seller Service Fee</th> */}
                                            <th>Buyer Paid Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{orderPlaceId}</td>
                                            <td>{orderDetailsproductName}</td>
                                            <td>{getSymbol(currencySymbol)} {orderDetailsproductFee}</td>
                                            <td>{getSymbol(currencySymbol)}  {orderDetailsshippingFee}</td> 
                                            { orderDetailsBuyerFee !== 0 ? <td>{getSymbol(currencySymbol)}  {orderDetailsBuyerFee}</td> : ""}
                                            {/* <td>{getSymbol(currencySymbol)}  {orderDetailsSellerFee}</td> */}
                                            <td>{getSymbol(currencySymbol)}  {orderDetailstotalFee}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="cls_subtotal">
                                    <p><span>Product Fee</span><strong>{getSymbol(currencySymbol)} {orderDetailsproductFee}</strong></p>
                                    <p><span>Shipping Price</span><strong>{getSymbol(currencySymbol)} {orderDetailsshippingFee}</strong></p>
                                    {orderDetailsSellerFee != 0 ? <p><span>Seller Service Fee</span><strong> - {getSymbol(currencySymbol)} {orderDetailsSellerFee}</strong></p> : ""}
                                    <p className="cls_border"><span>Payout Amount</span><strong>{getSymbol(currencySymbol)} {TotlePayoutFee}</strong></p>                                
                                </div>   
                                {(status == "CANCELLED") && (refundsuccess !== true) && (refundbtn !== true) ?                                   
                                    <div className="" style={{textAlign: "left", fontSize:"18px",padding:"10px",border:"1px solid #ddd"}}>
                                        {(cancelReason && cancelReason !== "") &&  <p> <b> CancelReason : </b> {cancelReason} </p> }                                 
                                    </div>
                                : " "}
                            </div>
                        </CardBody>
                        {popUpDetails.length ?
                            <Snackbar place="tc"
                                color="rose"
                                message={popUpDetails[0]}
                                open={!!popUpDetails.length}
                                closeNotification={() => {
                                    this.setState({ popUpDetails: [] })
                                }
                                }
                                close /> : ""}
                    </Card>
                    
                </GridItem>
            </GridContainer>

        )
    }
}

var Orders = compose(
    graphql(GET_ORDER_DETAILS, { name: "getOrderDetails" }),
    graphql(PAYOUT_UPDATE, { name: "PayoutMethod" }),
    graphql(UPDATE_ORDER_STATUS, { name: "updateOrderStatus" }),
    graphql(REFUND, { name: "refund" })
)(orders);

export default withStyles(styles)(Orders);


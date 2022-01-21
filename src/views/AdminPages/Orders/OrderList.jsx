import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Visibility from "@material-ui/icons/Visibility";

// core components
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import { UPDATE_TOGGLE_STATUS, GET_ORDER_DETAILS } from "../../../queries";
import { onTableViewChange, dateSet,getSymbol } from "../../../helper.js";
//style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const { REACT_APP_ADMIN_PATH } = process.env;

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


class orderList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      popUpDetails: "",
      canDelete: false,
      open: false,
      currentChosen: {},
      data: [],
      preLoadr: false
    };
    this.dataMapper = this.dataMapper.bind(this);
  }

  onTableChange = () => {
    this.setState({
      dataToexport: onTableViewChange(this.reactTable.current)
    });
  }

  dataMapper(props) {
    var { getOrderDetails } = props;
    this.setState({preLoadr: true})
    if (getOrderDetails && getOrderDetails.getOrderDetails) {
      this.setState({
        preLoadr: false,
        data: getOrderDetails.getOrderDetails.map((order, key) => {
          return {
            id: order._id,
            buyerName: order.orderDetails.buyerName,
            sellerName: order.orderDetails.sellerName,
            orderDate: dateSet(order.createdAt),
            productCost: getSymbol(order.orderDetails.currencySymbol) + " " + (order.orderDetails.productFee).toFixed(2),
            shippingCost: getSymbol(order.orderDetails.currencySymbol) + " " + (order.orderDetails.shippingRate).toFixed(2),
            BuyerServiceFee: !!(order.orderDetails.serviceFeeBuyerRate !== 0) ? getSymbol(order.orderDetails.currencySymbol)  + " " + (order.orderDetails.serviceFeeBuyerRate).toFixed(2) : " ----- ",
            SellerServiceFee: !!(order.orderDetails.serviceFeeSellerRate != 0) ? getSymbol(order.orderDetails.currencySymbol)  + " " + (order.orderDetails && order.orderDetails.serviceFeeSellerRate).toFixed(2) : " ----- ",
            totalCost: getSymbol(order.orderDetails.currencySymbol) + " " + (order.orderDetails && order.orderDetails.totalFee).toFixed(2),
            status: order.status,
            actions: (
              <div className="actions-left">
                {/* use this button to add a edit kind of action */}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    let obj = this.state.data.find((o) => o.id === order._id);
                    if (obj.id) {
                      this.props.history.push(`${REACT_APP_ADMIN_PATH}/order-view/${obj.id}`);
                    }
                  }}
                  color="twitter"
                  className="edit"
                >
                  <Visibility />
                </Button>{" "}
              </div>
            )
          };
        })
      });
    }
  }

  async componentWillMount() {
    let { getOrderDetails } = this.props;
    await getOrderDetails.refetch()
    if (getOrderDetails) {
      this.dataMapper(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  
  render() {
    let { data ,preLoadr } = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <ReactTable
                data={data}
                minRows={0}
                ref={this.reactTable}
                onPageChange={this.onTableChange}
                onPageSizeChange={this.onTableChange}
                onSortedChange={this.onTableChange}
                onExpandedChange={this.onTableChange}
                onFilteredChange={this.onTableChange}
                onResizedChange={this.onTableChange}
                loading={preLoadr}
                filterable
                columns={[
                  {
                    Header: "Order Id",
                    accessor: "id",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    sortMethod: (a, b, desc) => {
                      // force null and undefined to the bottom
                      a = a === null || a === undefined ? -Infinity : a;
                      b = b === null || b === undefined ? -Infinity : b;
                      // force any string values to lowercase
                      a = typeof a === "string" ? Number(a) : a;
                      b = typeof b === "string" ? Number(b) : b;
                      // Return either 1 or -1 to indicate a sort priority
                      if (a > b) {
                        return 1;
                      }
                      if (a < b) {
                        return -1;
                      }
                      // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                      return 0;
                    },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Buyer",
                    accessor: "buyerName",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Seller",
                    accessor: "sellerName",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                 
                  {
                    Header: "Order Date",
                    accessor: "orderDate",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                    // Cell: (prop) => {
                    //   const parser = new DOMParser();
                    //   return parser.parseFromString(`<!doctype html><body>${prop.value}`, "text/html").body.textContent;
                    // },
                  },
                  {
                    Header: "Product Cost",
                    accessor: "productCost",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Shipping Price",
                    accessor: "shippingCost",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Buyer Service Cost",
                    accessor: "BuyerServiceFee",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Seller Service Cost",
                    accessor: "SellerServiceFee",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Total Cost",
                    accessor: "totalCost",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined && row[filter.id] !== null) ?
                          String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                          : true
                      );
                    }
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                    sortable: false,
                    filterable: false
                  }
                ]}
                defaultSorted={[
                  {
                    id: "id",
                    desc: true
                  }
                ]}
                defaultPageSize={10}
                // showPaginationTop={false}
                // showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var OrderList = compose(
  graphql(GET_ORDER_DETAILS, { name: "getOrderDetails" }),
)(orderList);

export default withStyles(styles)(OrderList);


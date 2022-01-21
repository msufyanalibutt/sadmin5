import React from "react";
import { compose, graphql } from "react-apollo";
// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";
import Edit from "@material-ui/icons/Edit";
import "../../../assets/scss/material-dashboard-pro-react/plugins/_plugin-react-table.scss";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import {GET_BLOCKED} from "../../../queries";
import {downloadCSV, onTableViewChange, downloadXLSX, exportData} from "../../../helper.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const { REACT_APP_ADMIN_PATH } = process.env;

const keys = [
  {key: "id", value: "ID"},
  {key: "fromName", value: "User Name"},
  {key: "toName", value: "Blocked User Name"}];

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  buttonStyle:{
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


class blockedList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      deleted: false,
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
  var {blockedInfo} = props;
    this.setState({preLoadr: true})
    if (blockedInfo && blockedInfo.getBlocked) {
        this.setState({
          preLoadr: false,
          data: blockedInfo.getBlocked.map((review, key) => {
            return {
              id: review.id,
              fromName: review.fromName,
              toName: review.toName,
              actions: (
                <div>
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => this.props.history.push(`${REACT_APP_ADMIN_PATH }/users-editUser/${review.userTo}`)}
                    color="twitter"
                    className="edit"
                  >
                    <Edit />
                  </Button>{" "}

                </div>
              )
            };
          })
        });
      }
  }


  componentWillMount() {
    let {blockedInfo} = this.props;
    blockedInfo.refetch();
    if (blockedInfo) {
      this.dataMapper(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    const {dataToexport,preLoadr} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
          <Button

            size="sm"
            className={classes.smallButton}
            onClick={(e) => downloadCSV(e, exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
            >CSV</Button>
                <Button

                  size="sm"
                  className={classes.smallButton}
                  onClick={(e) => downloadXLSX(e, exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
                >
                  Excel
                </Button>
                {/* <Button

                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
            </CardHeader>
            <CardBody>
              <ReactTable
              // style={{overflow:"wrap"}}
                data={this.state.data}
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
                    Header: "ID",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    //width: getColumnWidth(this.state.data, "id", "ID"),
                    accessor: "id",
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
                    Header: "User Name",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    //width: getColumnWidth(this.state.data, "fromName", "Username"),
                    accessor: "fromName",
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Blocked User Name",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    accessor: "toName",
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
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

var BlockedList = compose(
  graphql(GET_BLOCKED, {name: "blockedInfo"})
)(blockedList);

export default withStyles(styles)(BlockedList);


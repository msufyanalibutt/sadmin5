import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Dialogue from "../../../components/Dialog/index.jsx";
import Delete from "@material-ui/icons/Delete";

// core components
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";

import {GET_FORCE_UPDATE,DELETE,UPDATE_TOGGLE_STATUS} from "../../../queries";
import {downloadCSV, onTableViewChange, dateSet, downloadXLSX, exportData} from "../../../helper.js";

import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";


const { REACT_APP_ADMIN_PATH } = process.env;


const keys = [
  {key: "id", value: "ID"},
  {key: "version", value: "Version"},
  {key: "deviceType", value: "Device Type"},
  {key: "forceUpdate", value: "Force Update"},
  {key: "createdAt", value: "Created At"},
  {key: "updatedAt", value: "Updated At"},
];

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


class ForceUpdateList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      data: [],
      currentChosen: {},
      canDelete: false,
      open: false,
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
  var {getForceUpdates} = props;
  this.setState({preLoadr: true});  
    if (getForceUpdates && getForceUpdates.getForceUpdates) {      
        this.setState({
          preLoadr: false,
          data: getForceUpdates&&getForceUpdates.getForceUpdates.map((forceData, key) => {
            var b = "***";                                    
            return {
              id: forceData.id,
              version: forceData.version,
              deviceType: forceData.deviceType,
              forceUpdate: forceData.forceUpdate,
              createdAt: dateSet(forceData.createdAt),
              updatedAt: dateSet(forceData.updatedAt),             
              actions: (
                // we"ve added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      let obj = this.state.data.find((o) => o.id === forceData.id);
                      if (obj.id) {
                        this.props.history.push(`${REACT_APP_ADMIN_PATH}/edit-app-version/${forceData.id}`);
                      }
                    }}
                    color="twitter"
                    className="edit"
                  >
                    <Edit />
                  </Button>{" "}
                  {/* use this button to remove the data row */}
                  <Button
                    justIcon
                    round
                    simple                   
                    color="danger"
                    className="remove"
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.updateToggle({variables: {
                          toggleStatus: false,
                          message: ""
                        }});
                        this.setState({
                          open: true,
                          currentChosen: forceData
                        });
                      }}
                      color="danger"
                      className="remove"
                    >                  
                    <Delete />
                  </Button>{" "}
                </div>
              )
            };
          })
        });
      }   
  }

  componentWillMount() {
    let {getForceUpdates} = this.props;
    this.props.getForceUpdates.refetch();
    if (getForceUpdates) {
      this.dataMapper(this.props);         
    }
  }


  componentWillReceiveProps(nextProps) {
    // if (this.state.count && this.state.count !== nextProps.getForceUpdates.getAllUserslength) {
    //   nextProps.usersInfo.getAllUsers.refetch();
    // }
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    let {data, dataToexport, currentChosen,preLoadr} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader icon>
          <Button
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadCSV(
              e,
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>CSV</Button>
          <Button
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadXLSX(
              e,
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>Excel</Button>
                {/* <Button

                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
                <Button
                onClick={() => {this.props.history.push(`${REACT_APP_ADMIN_PATH}/add-app-version`);}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add Mobile App Version
                </Button>
            </CardHeader>
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
                    Header: "ID",
                    accessor: "id",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
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
                    Header: "Version",
                    accessor: "version",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Device Type",
                    accessor: "deviceType",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Force Update",
                    accessor: "forceUpdate",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "CreatedAt",
                    accessor: "createdAt",
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
                    Header: "UpdatedAt",
                    accessor: "updatedAt",
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
            <Dialogue open={this.state.open}
              handleClickOpen={() => {
                var self = this;
                this.setState({
                  open: false,
                  canDelete: true
                },() => {
                  if (this.state.canDelete) {
                    var data = self.state.data;
                    data.find((o, i) => {
                      if (o.id === currentChosen.id) {
                        self.props.delete({
                          variables: { id: Number(currentChosen.id), typeConfig: "forceUpdate" }
                        }).then(async (d) => {
                          if(d.data.delete) {
                            this.props.getForceUpdates.refetch({fetch: "all"});
                        //data.splice(i, 1);
                        this.props.updateToggle({
                          variables: {
                            toggleStatus: true,
                            message: "App verison Deleted Successfully"
                          }
                        });
                      }
                  }).catch((error) => {
                    this.props.updateToggle({
                      variables: {
                        toggleStatus: true,
                        message: error.graphQLErrors.map((x) => x.message)
                      }
                    });
                  });
                        return true;
                      }
                      return false;
                    });
                    this.setState({ data, canDelete: false });
                  }
              });
            }}
            handleClose={() => {
              this.setState({
                open: false
              });
            }}
            />           
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var forceUpdateList = compose(
  graphql(GET_FORCE_UPDATE, {name: "getForceUpdates"}),
  graphql(DELETE, {name: "delete"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(ForceUpdateList);
export default withStyles(styles)(forceUpdateList);


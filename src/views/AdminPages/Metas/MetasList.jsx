import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Delete";

// core components
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import Dialogue from "../../../components/Dialog/index.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";

import {GET_ADMIN_METAS,DELETE, GET_TOGGLE_STATUS, UPDATE_TOGGLE_STATUS} from "../../../queries";
import {downloadCSV, onTableViewChange, downloadXLSX, exportData} from "../../../helper.js";

// style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const { REACT_APP_ADMIN_PATH } = process.env;

const keys = [
  {key: "id", value: "ID"},
  {key: "pageTitle", value: "Title"},
  {key: "metaDescription", value:"Description"},
  {key: "pageUrl", value:"Url"},
  {key: "keywords", value:"keywords"}
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


class FeatureList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      popUpDetails: "",
      canDelete: false,
      open: false,
      currentChosen: {},
      data: [],
      pageTitle:"",
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
  var {getAdminMetatags} = props;
  this.setState({preLoadr: true})
    if (getAdminMetatags && getAdminMetatags.getAdminMetatags) {
      let test = getAdminMetatags.getAdminMetatags;
     // console.log("object", test)
        this.setState({
          preLoadr: false,
          data: test.map((feature, key) => {
            let c1 = feature.language.filter((v) => v.langCode === "en").map((v) => {
                 return  v;
             });
            return {
              id: feature.id,
              pageTitle: c1[0] && c1[0].pageTitle,
              metaDescription: c1[0] && c1[0].metaDescription,
              pageUrl: feature.pageUrl,
              keywords: c1[0] && c1[0].keywords,
              createdAt: feature.createdAt,
              actions: (
                // we"ve added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      let obj = this.state.data.find((o) => o.id === feature.id);
                      if (obj.id) {
                        this.props.history.push(`${REACT_APP_ADMIN_PATH}/MetasList-editMetas/${obj.id}`);
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
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.updateToggle({variables: {
                        toggleStatus: false,
                        message: ""
                      }});
                      this.setState({
                        open: true,
                        currentChosen: feature
                      });
                    }}
                    color="danger"
                    className="remove"
                  >
                    <Close />
                  </Button>{" "}
                </div>
              )
            };
          })
        });
      }
  }

  componentWillMount() {
    let {getAdminMetatags} = this.props;
    getAdminMetatags.refetch({fetch: "all"});
    if (getAdminMetatags) {
      this.dataMapper(this.props);
    }
  }

  componentWillUnmount() {
    this.props.updateToggle({
      variables: {
        toggleStatus: false,
        message: ""
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    let {currentChosen, dataToexport,preLoadr} = this.state;
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
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
                onClick={() => {this.props.history.push(`${REACT_APP_ADMIN_PATH}/MetasList-addMetas`);}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add Meta tags
                </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
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
                    Header: "Url",
                    accessor: "pageUrl",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id][0].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Title",
                    accessor: "pageTitle",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toString().toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  // {
                  //   Header: "Description",
                  //   accessor: "description",
                  //   style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                  // },
                  {
                    Header: "Description",
                    accessor: "metaDescription",
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
                    Header: "keywords",
                    accessor: "keywords",
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
              this.setState({
                open: false,
                canDelete: true
              },() => {
                if (this.state.canDelete) {
                  var data = this.state.data;
                  data.find((o, i) => {
                    if (o.id === currentChosen.id) {
                      this.props.delete({
                        variables: { id: Number(currentChosen.id), typeConfig: "metatags" }
                      }).then(async (d) => {

                        if(d.data.delete) {
                          this.props.getAdminMetatags.refetch({fetch: "all"});
                      //data.splice(i, 1);
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: "Metas Deleted Successfully"
                        }
                      });
                    }
                })
                .catch((error) => {
                  this.props.updateToggle({
                    variables: {
                      toggleStatus: true,
                      message: error.graphQLErrors.map((x) => x.message)
                    }
                  });
                });
                      // here you should add some custom code so you can delete the data
                      // from this component and from your server as well
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
 <Query query={GET_TOGGLE_STATUS}>
            {({loading, data}) =>
          <Snackbar place="tc"
          color="rose"
          message={data.message}
          open={data.toggleStatus}
          closeNotification={() =>
            this.props.updateToggle({variables: {
              toggleStatus: false,
              message: ""
            }})
            }
          close />
          }
            </Query>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var fList = compose(
  graphql(GET_ADMIN_METAS, {name: "getAdminMetatags",options: () => ({variables: {fetch: "all"}})}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(DELETE, {name: "delete"})
)(FeatureList);

export default withStyles(styles)(fList);


import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/chatStyle";
import defaultImage from "../../../assets/img/default.png"
import { withTranslation, Trans } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import MessageWindow from "./MessageWindow";
import {
  GET_ROSTER,
  INACTIVE,
  GET_OPEN_STATE,
  ISOPEN,
  BLOCK_USER,
  SEND_MESSAGE,
  ROSTER_GROUPID,
  GET_ROSTER_GROUPID_DETAILS,
  GET_CURRENT_USER,
  CHATLIST_SUBSCRIPTION,
  GET_CHATNOW_STATUS,
  UPDATE_CHATNOW_STATUS,
  GET_MESSAGES,
  DELETE_CHAT_ROOM
} from "../../../queries";
import {ChatBox} from '../css/styledcomponents';

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      typeClick: "All",
      autoOpen: true,
      closedId:"",
      currConv: [],
      currentArray:[],
      currConvMessageWindow:[],
      unReadMessageData:[],
      values:{}
    };
    this.toggleMenu1 = this.toggleMenu1.bind(this);
  }
  

  toggleMenu1(){
    this.setState({
      visible1 : !this.state.visible1
    })
  }

  componentWillMount() {
    let { currentUser } = this.props;
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser.id
    });

     let currentUserData = currentUser.getCurrentUser && currentUser.getCurrentUser.id
     this.unsubscribe = this.subscribe(Number(currentUserData), "All");
  }


  componentWillReceiveProps(nxt) {
    let {rosters, currentUser,parentCallback,getCacheChatNowButton,currConv} = nxt;
    if(nxt !== this.props){
      if(this.state.cUser != null  && this.state.autoOpen === true){
        if (this.unsubscribe) {
          this.unsubscribe();
       }
       this.unsubscribe = this.subscribe(Number(this.state.cUser),"All");
        this.setState({
            autoOpen : false
        })
      }
     
      if(nxt.rosters.getRoster !== this.props.rosters.getRoster){
        rosters.refetch({type: "All"}).then(({data}) => { 
          if(data){
            let unRead = data.getRoster && data.getRoster.filter(x => x.unreadMessage !== 0).map(z => z.unreadMessage);
            this.setState({
               unReadMessageData : unRead
            })
          }
        })
      }

      this.setState({
        cUser: currentUser.getCurrentUser && currentUser.getCurrentUser.id
      })
      if(parentCallback && getCacheChatNowButton.chatNow !== undefined && getCacheChatNowButton.chatNow === true){
        this.chatWithUser(parentCallback)
        this.props.updateChatNowStatus({variables:{ chatNow: false}})
        this.setState({
          autoOpen: false
        })
      }
    }
   
  }

  subscribe = (userId,type) =>  
  this.props.rosters.subscribeToMore({
    document: CHATLIST_SUBSCRIPTION,
    variables: { userId:userId, type:type },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;
      let rosterData = subscriptionData.data.newrosterAdded
      return {
          getRoster: [
            ...rosterData
          ]
      };
      
    }
});

chatWithUser = async userData => {
  let {values} = this.state;
  this.props.rosters.refetch({type: "All"})
  let newObj = {...values,[userData.groupName]:userData}
  if(Object.keys(newObj).length > 2){
    for (var i in newObj) {
      delete newObj[i];
      break;
    }
    this.setState({
      values: newObj
    })
  }
  this.setState({
    values: newObj,
    rosterGroupId : userData.groupId,
    msgDiv: true
  })
  let currentArray = [];
    for (var key in newObj) {
      currentArray.push(newObj[key]);
    }
    this.setState({
      currentArray
    })
};
 
  // getConversation = async (e, currConv) => {
  //   e.preventDefault();
    
  //   let { currentUser } = this.props;
  //   this.setState({
  //     unRead: currentUser.getCurrentUser.unreadMessage,
  //   });
  //   await this.setState({
  //     unRead: false
  //   });
  //   await this.props.getRosterGroupId({
  //     variables: { rosterGroupId: currConv.groupId }
  //   });

  //   await this.setState({
  //     rosterGroupId: currConv.groupId,
  //     //initialload: false
  //   });
   

  //   await this.setState({
  //     ChangeInRoaster: Math.floor(Math.random() * 10000)
  //   });
  // };

  openCloseChat = (data,groupName) => {
     let { currentArray,values } = this.state;
      delete values[groupName];
      this.setState({
        values
      })
     currentArray.splice(data, 1)
      this.setState({
        currentArray
      })

      if(currentArray.length === 0){
       this.setState({
         currentArray: []
       })
      }
  }

  componentWillUnmount() {
    let { currentUser } = this.props; 
    if(currentUser && currentUser.getCurrentUser){
      this.props.deleteChatRoom({
        refetchQueries: [{ query: GET_ROSTER, variables: { type: "All" } }]
      }).catch(e => {
       // console.log(e, "error");
      })
    }
  
  }
 
  render() {
    let {rosters: { loading, getRoster, startPolling },classes, t,currentUser,history} = this.props;
    const {currConv,cUser,visible1,unReadMessageData,values,currentArray} = this.state
    const {pathname} = history.location;
  
    if(pathname === "/chat/conversation" || pathname.includes("admin") || cUser == null) {
      return null;
    }
   
    else if(cUser != null && cUser){
    return (
      <ChatBox className="nn_chatNow">
        <div className="nn_chatboxheader">
          <div className="nn_chatboxtitle" onClick={this.toggleMenu1}>
            <div className="nn_chatleft">
             <div className="nn_msg_count_head">
              <div className="nn_msg_count">
                <span><i className="fa fa-envelope" aria-hidden="true"></i></span> 
                    <b>{t("Sellerdetails._message")}</b>
                             </div> 
                               {unReadMessageData && unReadMessageData.length > 0  &&
                            <div className="nn_notification">
                            </div>}  
                    
              </div>
              {/* <div className="chatusenae">  </div> */}
            </div>
            <div className="nn_chatright">
              <ul>
                <li > <span> <i className="fa fa-minus" aria-hidden="true"></i> </span> </li>
              </ul>
            </div>
          </div>
       {visible1 && 
          <div className="nn_chatconver">
             <div className="nn_respchar">
                  {getRoster != undefined &&
                    getRoster.map((rf, i) => {
                      if (this.state.typeClick !== "Blocked" && !!rf.image) {
                        return (
                          <div
                            onClick={() => this.chatWithUser(rf)}
                            className={
                              currConv.groupId === rf.groupId
                                ? " testactivechat"
                                : ""
                            }
                          >
                            <div
                              //onClick={e => this.getConversation(e, rf)}
                              className="nn_chatmain"
                              key={i}
                            >
                              <div className="nn_chatctn">
                                <img src={rf.image} />

                                <div className="nn_pro_chatctn">
                                  <div>
                                    <span
                                      className="nn_pro"
                                      style={{ fontSize: "15px" }}
                                    >
                                      {rf.userName}
                                    </span>

                                    <div style={{ marginTop: "-5px",width: "160px"}} className="text-truncate">
                                      <span
                                        className="nn_pro1 text-truncate"
                                        style={{ fontSize: "12px" }}
                                      >
                                        {rf.productName}
                                      </span>
                                    </div>
                                    { (!rf.isBlocked && !rf.blockedBy && !rf.isDeleted)  ? <div className="nn_urgent1_new">
                                       {rf.role === "buyer" ?  <div className="nn_buying_color"> {t("Productdetails._Buying")} </div> : 
                                      rf.role === "seller" ?  <div className = "nn_selling_color"> {t("Productdetails._Selling")}  </div> : "" }
                                  </div> : "" }
                                    <div title={t(
                                                "Sellerdetails._blockedthisuser"
                                              )}>
                                      <span
                                        className="nn_blockuser"
                                        style={{ fontSize: "11px" }}
                                      >
                                        { !!rf.isDeleted ? (
                                                <div
                                                style={{ display: "inline-flex" }}
                                              >
                                                 <svg className="MuiSvgIcon-root-141 nn_blkicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                              <path fill="none" d="M0 0h24v24H0V0z"></path>
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path>
                                            </svg>
                                                <span className="nn_blockctn">
                                                {t("Productdetails._deleted")}
                                                    </span>
                                              </div>
                                            ) :  !!rf.isBlocked ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg className="MuiSvgIcon-root-141 nn_blkicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                              <path fill="none" d="M0 0h24v24H0V0z"></path>
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path>
                                            </svg>
                                            <span className="nn_blockctn"> {t("Productdetails._Blocked")}</span>
                                           
                                          </div>
                                        ) : !!rf.blockedBy ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                            title={t("Sellerdetails._blockedbyuser")}
                                            className="nn_blockuser"
                                          >
                                            <svg className="MuiSvgIcon-root-141 nn_blkicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                              <path fill="none" d="M0 0h24v24H0V0z"></path>
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path>
                                            </svg>
                                            <span className="nn_blockctn">{t("Productdetails._Blocked")}</span>
                                          </div>
                                        ) : !!rf.sellingStatus ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                            title={t("Sellerdetails._Sold")}
                                            className="nn_soldmain"
                                          >
                                            <span className="nn_soldcctn"> {t("Sellerdetails._Sold")}</span>
                                            {/* <span style={{ paddingTop: "5px" }}>
                                              {t("Sellerdetails._Sold")}
                                            </span> */}
                                          </div>
                                        ) : (
                                                <h6>{rf.lastseen}</h6>
                                              )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="nn_chatimg">
                             
                                <img
                                  src={rf.profileImage}
                                  style={{ borderRadius: "50%" }}
                                />
                              </div>
                               {(rf.unreadMessage > 0 ) && 
                                  <div className="nn_notification">
                                    {rf.unreadMessage}
                                  </div> 
                              } 
                            </div>
                          </div>
                        );
                      } else if (!!rf.image) {
                        return (
                          <div
                            onClick={() => this.chatWithUser(rf)}
                            className={
                              currConv.groupId === rf.groupId
                                ? " testactivechat"
                                : ""
                            }
                          >
                            <div
                             // onClick={e => this.getConversation(e, rf)}
                              className={
                                classes.chatSpec + " " + "rtlechatuimg"
                              }
                              key={i}
                            >
                              <div className="trlaonlyadd">
                                <img src={rf.image} />

                                <div
                                  className={
                                    classes.chatText + " " + "productvwtrl"
                                  }
                                >
                                  <div>
                                    <span
                                      className="testclg"
                                      style={{ fontSize: "16px" }}
                                    >
                                      {rf.userName}
                                    </span>

                                    <div>
                                      <span
                                        className="testclg1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {rf.productName}
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        className="testclg2"
                                        style={{ fontSize: "12px" }}
                                      >
                                        { !!rf.isDeleted ? (
                                                <div
                                                style={{ display: "inline-flex" }}
                                              >
                                                 <svg className="MuiSvgIcon-root-141 nn_blkicon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                              <path fill="none" d="M0 0h24v24H0V0z"></path>
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path>
                                            </svg>
                                                <span className="nn_blockctn">
                                                {t("Productdetails._deleted")}
                                                    </span>
                                              </div>
                                            ) : !!rf.isBlocked ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="var(--theme-color)"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedthisuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.blockedBy ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="var(--theme-color)"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedbyuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.sellingStatus ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="16"
                                              height="24"
                                              className="sc-VigVT eRlXQh"
                                              fill="#00A8A8"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t("Sellerdetails._Sold")}
                                            </span>
                                          </div>
                                        ) : (
                                                <h6>{rf.lastseen}</h6>
                                              )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
          </div>}
          { this.state.msgDiv ?
              <MessageWindow
                getConversation={this.getConversation}
                handleBlock={this.handleBlock}
                handleCloseBlockModal={this.handleCloseBlockModal}
                handleClick={this.handleClick}
                handleBlockModel={this.handleBlockModel}
                currConv={this.state.currentArray}
                initialload={this.state.initialload}
                rosterGroupId={this.state.rosterGroupId}
                handleSelect={this.handleSelect}
                DeleteModelBlock={this.state.DeleteModelBlock}
                currentUser={currentUser}
                openCloseChat={this.openCloseChat}
                client={this.props.client}
                //newSubscribe = {this.state.newSubscribe}
                //openHideChat={this.openHideChat}
              />
              : ""
            }
        </div>
      </ChatBox>

    )
  }
}
}

var ChatComp = compose(
  graphql(GET_ROSTER, {
    name: "rosters",
    options: props => ({
      variables: { type: "All" },
      fetchPolicy: "network-only"
    })
  }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(BLOCK_USER, { name: "blockUser" }),
  graphql(SEND_MESSAGE, { name: "sendMessage" }),
  graphql(ROSTER_GROUPID, {
    name: "getRosterGroupId",
    options: () => ({
      fetchPolicy: "no-cache"
    })
  }),
  graphql(GET_ROSTER_GROUPID_DETAILS, {
    name: "getCacheRosterId",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_OPEN_STATE, {
    name: "getCacheData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_CURRENT_USER, {
    name: "currentUser"
  }),
  graphql(UPDATE_CHATNOW_STATUS, {name: 'updateChatNowStatus'}),
  graphql(DELETE_CHAT_ROOM, { name: "deleteChatRoom" }),
  graphql(GET_CHATNOW_STATUS, {
    name: "getCacheChatNowButton",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),

)(ChatWindow);

export default withTranslation("common")(withStyles(styles)(ChatComp));
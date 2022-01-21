import React from "react";
import { compose, graphql } from "react-apollo";
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
  GET_MESSAGES,
  DELETE_CHAT_ROOM
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/chatStyle.jsx";
import { getRoster } from "../../../helper.js";
import MessageList from "./MessageList.jsx";
import Modal from "react-modal";
import prgd2 from "../../../assets/img/ad.png";
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";
import Grid from '@material-ui/core/Grid';
import BlockSharpIcon from '@material-ui/icons/BlockSharp';
import { ChatPage, DiscardPopup } from '../css/styledcomponents';
import AdSense from 'react-adsense';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "25px"
  }
};

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeClick: "All",
      currConv: {},
      messages: [],
      chatText: "",
      isOpen: false,
      rosterGroupId: "",
      initialload: true,
      DeleteModelBlock: false,
      clickWithbutton: false,
      responsivemode: true,
      rightresponse: true,
      autoOpen: "",
      ChangeInRoaster: Math.floor(Math.random() * 10000),
      preventEnter: true,
      msgDiv: false,
      unRead: true,
      subscriberNewMsgs: false,
      active: false,
      googleAd: false,
      googleAdSenseId: "",
      chatPageSlotId: ""
    };

    this.gobackHandler = this.gobackHandler.bind(this);
    this.getConversation = this.getConversation.bind(this);
    //this.handleInput = this.handleInput.bind(this);
    //this.handleSend = this.handleSend.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    //this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCloseBlockModal = this.handleCloseBlockModal.bind(this);
    this.resizeFunction = this.resizeFunction.bind(this);
  }

  resizeFunction() {
    if (window.innerWidth < 992 && this.state.initialload === false) {
      this.setState({ responsivemode: false });
    } else if (window.innerWidth > 992 && this.state.initialload === false) {
      this.setState({ responsivemode: true });
    } else {
      this.setState({ responsivemode: true });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeFunction);
    this.setState({
      active: true
    })
   
    setTimeout(() => {
      const { siteInfo } = this.props;
      const color1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.colorCode;
      const subcolor1 = siteInfo && siteInfo.getSiteInfo && siteInfo.getSiteInfo.subcolorCode;
      const r = document.querySelector(':root').style;
      r.setProperty('--theme-color', color1);
      r.setProperty("--theme-color-hvr", (color1 + "bf"));
      r.setProperty('--subtheme-color', subcolor1);
      r.setProperty("--subtheme-color-hvr", (subcolor1 + "bf"));
    }, 2000);
  }

  handleSelect() {
    this.refs.fileUploader.click();
  }

  handleClick = () => {
    this.setState({ responsivemode: true, initialload: true });
  };

  componentWillMount() {
    let { currentUser, siteInfo } = this.props
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser.id
    });
    let currentUserData = currentUser.getCurrentUser && currentUser.getCurrentUser.id
    this.unsubscribe = this.subscribe(Number(currentUserData), "All");
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let info = siteInfo.getSiteInfo
      this.setState({
        googleAd: info.googleAdsence,
        googleAdSenseId: info.googleAdSenseId,
        chatPageSlotId: info.chatPageSlotId
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      if (this.state.autoOpen && this.state.autoOpen.length > 0 && this.state.preventEnter && (nextProps.getCacheRosterId.rosterGroupId !== undefined)) {
        if (nextProps.rosters && nextProps.rosters.getRoster && nextProps.rosters.getRoster.filter(rosterInfo => rosterInfo.groupId === nextProps.getCacheRosterId.rosterGroupId)) {
          const get = nextProps.rosters && nextProps.rosters.getRoster && nextProps.rosters.getRoster.filter(rosterInfo => rosterInfo.groupId === nextProps.getCacheRosterId.rosterGroupId);
          this.props.getRosterGroupId({
            variables: { rosterGroupId: this.state.autoOpen }
          });
          this.setState({
            initialload: false,
            currConv: get && get[0],
            preventEnter: false,
            rosterGroupId: this.state.autoOpen,
            msgDiv: true
          });
        }
      }
    }

    if (nextState.rosterGroupId != this.state.rosterGroupId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(Number(this.state.cUser), "All");
    }

  }

  componentWillReceiveProps(nxt) {
    let { rosters } = nxt;
    if (nxt.getCacheRosterId.rosterGroupId !== undefined) {
      this.setState({
        autoOpen: nxt.getCacheRosterId.rosterGroupId,
        rosterGroupId: nxt.getCacheRosterId.rosterGroupId
      });
    }

    // if(nxt.getCacheRosterId.rosterGroupId != this.props.getCacheRosterId.rosterGroupId){
    //   console.log("inside chat")
    //   if (this.unsubscribe) {
    //     this.unsubscribe();
    //   }
    //   this.unsubscribe = this.subscribe(Number(this.state.cUser),"");
    // }
    if (nxt != this.props) {
      rosters.refetch({ type: "All" })
    }
    if (nxt.siteInfo && nxt.siteInfo.getSiteInfo) {
      let info = nxt.siteInfo.getSiteInfo
      this.setState({
        googleAd: info.googleAdsence,
        googleAdSenseId: info.googleAdSenseId,
        chatPageSlotId: info.chatPageSlotId
      })
    }
  }


  subscribe = (userId, type) =>
    this.props.rosters.subscribeToMore({
      document: CHATLIST_SUBSCRIPTION,
      variables: { userId: userId, type: type },
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

  componentWillUnmount() {
    this.props.getRosterGroupId({
      variables: { rosterGroupId: "" }
    });
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.props.deleteChatRoom({
      refetchQueries: [{ query: GET_ROSTER, variables: { type: "All" } }]
    });
    window.removeEventListener("resize", this.resizeFunction);
  }

  handleOpen() {
    this.props.isOpenScreen({ variables: { open: true } });
  }

  selectFile() { }
  handleBlock(e, cc, flag, type) {
    e.persist();
    let { currentUser, isOpenScreen, rosters } = this.props;

    if (currentUser && currentUser.id !== cc.userId) {
      this.props
        .blockUser({
          variables: { id: Number(cc.userId) },
          // refetchQueries: [{ query: GET_ROSTER, variables: { type: "All" } }]
        })
        .then(({ data }) => {
          if (window.innerWidth < 992 && this.state.initialload === false) {
            this.setState({ initialload: false });
          } else {
            this.changeTab(e, "All");
          }
          if (flag) {
            if (data.blockUser.status)
              cc.isBlocked = data.blockUser.status === "blocked";
            this.setState({ currConv: cc });
            isOpenScreen({ variables: { open: false } });
            this.setState({
              DeleteModelBlock: false,
              clickWithbutton: false
            });
            if (this.state.clickWithbutton === true) {
              this.setState({
                initialload: true
              });
            } else {
              this.setState({
                initialload: false
              });
            }
            this.setState({
              clickWithbutton: false
            });
          }
        });
    }
  }

  gobackHandler(e) {
    e.preventDefault();
    this.props.history.goBack();
  }
  getConversation = async (e, currConv) => {
    e.preventDefault();
    let { currentUser } = this.props;
    currentUser.refetch();
    this.setState({
      unRead: currentUser.unreadMessage,
      msgDiv: true
    });
    await this.setState({
      unRead: false
    });
    await this.props.getRosterGroupId({
      variables: { rosterGroupId: currConv.groupId }
    });

    await this.setState({
      rosterGroupId: currConv.groupId,
      initialload: false
    });
    await this.setState({
      ChangeInRoaster: Math.floor(Math.random() * 10000)
    });

    if (window.innerWidth < 992 && this.state.initialload === false) {
      this.setState({ responsivemode: false });
    } else {
      this.setState({ responsivemode: true });
    }
  };

  // handleInput(e) {
  //   e.preventDefault();
  //   this.setState({
  //     chatText: e.target.value
  //   });
  // }

  chatWithUser = async userData => {
    await this.setState({
      currConv: userData,
      active: false
    });
    // setTimeout (() => {
    //   var rendu = document.getElementById("nn_chatrt")
    //   var mooonu = rendu.clientHeight;
    //   console.log(mooonu + "shan")
    //   document.getElementById("nn_chatlt").style.height = mooonu + 'px';
    //   },500);
  };


  changeTab = (e, buttonVal) => {
    e.preventDefault();
    this.setState({ preventEnter: false });
    let { rosters } = this.props;
    rosters
      .refetch({ type: "All" })
      .then(({ data, errors }) => {
        if (data && !errors) {
          if (data.getRoster) return getRoster(data.getRoster);
        }
      })
      .then(data => {
        this.setState({
          //typeClick: buttonVal,
          initialload: true
        });
      });
  };

  handleBlockModel = async (userData, type) => {
    if (type === "InButton") {
      this.setState({
        clickWithbutton: true
      });
    }
    this.setState({
      initialload: false,
      DeleteModelBlock: true
    });
  };

  handleCloseBlockModal = () => {
    this.setState({ ...this.state.DeleteModelBlock }, () => {
      this.setState({
        DeleteModelBlock: false,
        clickWithbutton: false
      });
    });
  };

  render() {
    let { typeClick, currConv, DeleteModelBlock, googleAd, googleAdSenseId, chatPageSlotId } = this.state;

    let {
      rosters: { loading, getRoster, startPolling },
      classes,
      t
    } = this.props;
    let { active } = this.state;

    return (
      <ChatPage className="nn_chatmsg">
        <div className="nn_chatmainctn">
          <div className="container">
            <Grid container>
              <Grid md={12}>
                <div className="nn_chatsmallscreen">
                  <div className="nn_chat_back_arrow">
                    <nav className={classes + " " + classes}>
                      <div
                        onClick={this.gobackHandler}
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="30"
                          height="28"
                          className="sc-VigVT fVWeqY"
                        >
                          <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z" />
                        </svg>
                      </div>
                    </nav>
                  </div>
                  <div className="nn_chat_title">
                    <span>{t("Sellerdetails._chats")}</span>
                  </div>
                  {/* <div>
                        <img
                          className={classes.chatProfile}
                          src={ambassador}
                        />
                      </div> */}

                </div>
              </Grid>
            </Grid>
            <div className={`nn_chatreswrapper ${active ? "active" : ""}`} id="nn_chatwrapper">
              {this.state.responsivemode ? (
                <div className="nn_reschat" id="nn_chatlt">
                  <div className={`nn_reschatview ${active ? "active" : ""}`}>
                    <nav className="nn_chatltctn">
                      <div className="nn_chatctn">
                        {getRoster != undefined &&
                          getRoster.map((rf, i) => {
                            if (typeClick !== "Blocked" && !!rf.image) {
                              return (
                                <div
                                  onClick={() => this.chatWithUser(rf)}
                                  className={
                                    currConv.groupId === rf.groupId
                                      ? "nn_testactivechat"
                                      : ""
                                  }
                                >
                                  <div
                                    onClick={e => this.getConversation(e, rf)}
                                    className="rtlechatuimg nn_chatprofile"
                                    key={i}
                                  >
                                    <div className="nn_chat_proctn">
                                      <div className="nn_proimg">
                                        {(rf.unreadMessage > 0) ?
                                          <div className="notification">
                                            {rf.unreadMessage}
                                          </div> : ""
                                        }
                                        <img
                                          src={rf.profileImage}
                                          style={{ borderRadius: "50%" }}
                                        />
                                      </div>
                                      <div className="nn_pro_ctn text-truncate">
                                        <span className="nn_chatproname" title={rf.userName}>
                                          {rf.userName}
                                        </span>
                                        {/* <div>
                                              <span
                                                className="testclg1"
                                                style={{ fontSize: "14px" }}
                                              >
                                                {rf.productName}
                                              </span>
                                            </div> */}
                                        {(!rf.isBlocked && !rf.blockedBy && !rf.isDeleted) ? <div className="nn_urgent_new">
                                          {rf.role === "buyer" ? <div className="nn_buying_color"> {t("Productdetails._Buying")} </div> :
                                            rf.role === "seller" ? <div className="nn_selling_color"> {t("Productdetails._Selling")}  </div> : ""}
                                        </div> : ""}
                                        <div className="unblock_sect nn_block_user">
                                          <span
                                            className="testclg2"
                                            style={{ fontSize: "12px" }}
                                          >
                                            { !!rf.isDeleted ? (
                                                <div
                                                title={t("Productdetails._deleted")}
                                              >
                                                <BlockSharpIcon className="nn_blkicon" />
                                                <span style={{ paddingTop: "5px" }}>
                                                {t("Productdetails._deleted")}
                                                    </span>
                                              </div>
                                            ) :  !!rf.isBlocked  ? (
                                              <div
                                                title={t(
                                                  "Sellerdetails._blockedthisuser"
                                                )}
                                              >
                                                <BlockSharpIcon className="nn_blkicon" />
                                                <span style={{ paddingTop: "5px" }}>
                                                  {t("Productdetails._Blocked")}
                                                    </span>
                                              </div>
                                            ) : !!rf.blockedBy ? (
                                              <div
                                                title={t(
                                                  "Sellerdetails._blockedbyuser"
                                                )}
                                              >
                                                <BlockSharpIcon className="nn_blkicon" />
                                                <span style={{ paddingTop: "5px" }}>
                                                {t("Productdetails._Blocked")}
                                                    </span>
                                              </div>
                                            ) : !!rf.sellingStatus ? (
                                              <div
                                                style={{ display: "inline-flex" }}
                                                title={t("Sellerdetails._Sold")}
                                              >
                                                <svg
                                                  viewBox="0 0 24 24"
                                                  width="16"
                                                  height="24"
                                                  class="sc-VigVT eRlXQh"
                                                  fill="#00A8A8"
                                                >
                                                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                                </svg>
                                                <span style={{ paddingTop: "3px" }}>
                                                  {t("Sellerdetails._Sold")}
                                                </span>
                                              </div>
                                            ) : (
                                                    <h6>{rf.lastseen}</h6>
                                                  )}
                                          </span>
                                        </div>
                                        {/* <div>
                                            <span className="dateseen">
                                              {findTimeStamp(message.createdAt, timestamp,t)}
                                            </span>
                                          </div> */}
                                      </div>
                                    </div>
                                    <div className="nn_product_img">
                                      <img src={rf.image} />
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (!!rf.image) {
                              return (
                                <div
                                  onClick={() => this.chatWithUser(rf)}
                                  className={
                                    currConv.groupId === rf.groupId
                                      ? "testactivechat"
                                      : ""
                                  }
                                >
                                  <div
                                    onClick={e => this.getConversation(e, rf)}
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
                                                title={t(
                                                  "Sellerdetails._blockedthisuser"
                                                )}
                                              >
                                                <BlockSharpIcon className="nn_blkicon" />
                                                <span style={{ paddingTop: "5px" }}>
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
                                                    class="sc-VigVT eRlXQh"
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
                      {googleAd ?
                        <AdSense.Google
                          client={googleAdSenseId} // {googleAdSenseId}
                          slot={chatPageSlotId} // {productPageSlotId}
                          style={{ display: 'block' }}
                          layout='in-article'
                          format='fluid'
                          className="adminadd1"
                        />
                        :
                        <div className="adminadd">
                           <img src={prgd2} className="img-fluid" />
                        </div>
                      }                   
                    </nav>
                  </div>
                  {active && <div className={`nn_chatrtwrapper ${active ? "active" : ""}`}>
                    <p> {t("Sellerdetails._Tapconversation")} </p>
                  </div>}
                </div>
              ) : (
                  ""
                )}

              <DiscardPopup
                isOpen={DeleteModelBlock}
                contentLabel="Minimal Modal Example"
                style={customStyles}
              >
                <section className="iHQQug ">
                  {!currConv.isBlocked && (
                    <>
                      <div className="bwXZIf nn_discardPopup">
                        <h3>{t("Sellerdetails._Blockuser")} </h3>
                        <hr></hr>
                      </div>
                      <article className="nn_article">
                        <span className="nn_popup_title">{t("Sellerdetails._goingtoblock")} </span>
                      </article>
                      <div class="sav_chang cancee nn_discard_btn">
                        <button
                          type="submit"
                          onClick={e =>
                            this.handleBlock(e, currConv, true, "blockUser")
                          }
                          class="btn1"
                        >
                          {t("Sellerdetails._Blockuser")}
                        </button>
                        <button
                          type="submit"
                          onClick={this.handleCloseBlockModal}
                          class="btn2"
                        >
                          {t("Productdetails._Cancel")}
                        </button>
                      </div>
                    </>
                  )}
                  {currConv.isBlocked && (
                    <>
                      {" "}
                      <div className="bwXZIf nn_discardPopup">
                        <h3>{t("Sellerdetails._UnBlockuser")} </h3>
                        <hr></hr>
                      </div>
                      <article className="nn_article">
                        <span className="nn_popup_title">{t("Sellerdetails._goingtounblock")}</span>
                      </article>
                      <div class="sav_chang cancee nn_discard_btn">
                        <button
                          type="submit"
                          onClick={e =>
                            this.handleBlock(e, currConv, true, "UnblockUser")
                          }
                          class="btn1"
                        >
                          {t("Sellerdetails._UnBlockuser")}
                        </button>
                        <button
                          type="submit"
                          onClick={this.handleCloseBlockModal}
                          class="btn2"
                        >
                          {t("Productdetails._Cancel")}
                        </button>
                      </div>{" "}
                    </>
                  )}
                </section>
              </DiscardPopup>

              {this.state.msgDiv ? (
                <MessageList
                  getConversation={this.getConversation}
                  handleBlock={this.handleBlock}
                  handleCloseBlockModal={this.handleCloseBlockModal}
                  handleClick={this.handleClick}
                  handleBlockModel={this.handleBlockModel}
                  currConv={this.state.currConv}
                  initialload={this.state.initialload}
                  rosterGroupId={this.state.rosterGroupId}
                  handleSelect={this.handleSelect}
                  DeleteModelBlock={this.state.DeleteModelBlock}
                //handleSend={this.handleSend}
                //chatText={this.state.chatText}
                //handleInput={this.handleInput}
                //handleKeyPress={this.handleKeyPress}
                />
              ) : ""
              }
            </div>
          </div>
        </div>
      </ChatPage>
    );
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
  graphql(DELETE_CHAT_ROOM, { name: "deleteChatRoom" }),
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
)(ChatComponent);

export default withTranslation("common")(withStyles(styles)(ChatComp));
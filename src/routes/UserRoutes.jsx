import React, { Component } from "react";
import WithSessionUser from "../hoc/WithsessionUser.js";
import { Route,Switch, Redirect } from "react-router-dom";
import ScrollIntoTop from "../views/UserPages/ScrollIntoTop.js";
import { ApolloConsumer } from "react-apollo";
import { ProviderRefech, ProductConsumer } from "../views/UserPages/ProductContext.js";
import TitleComponent from "./TitleComponent.js";
import ChatWindow from "../views/UserPages/Chat/ChatWindow.jsx"
import { GET_CURRENT_USER, GET_SITE_INFO } from "../queries";
import { graphql, compose } from "react-apollo";

export class UserRoutesClass extends Component {
    constructor(props) {
        super(props)

        this.state = {
             isUserExist: false
        }
    }

    async componentDidMount(){
        let { siteInfo } = this.props;
        await siteInfo.refetch().then(({ data }) => {
            const color1 = data && data.getSiteInfo && data.getSiteInfo.colorCode;
            const subcolor1 = data && data.getSiteInfo && data.getSiteInfo.subcolorCode;
            const r = document.querySelector(':root').style;
            r.setProperty('--theme-color', "#00AFFF");
            r.setProperty("--theme-color-hvr", ("#00AFFF" + "bf"));
            r.setProperty('--subtheme-color', subcolor1);
            r.setProperty("--subtheme-color-hvr", (subcolor1 + "bf"));
        });
    }

    render() {
        const { prop, keys, session, refetch,currentUser } = this.props;
        return (
            <>
        {(currentUser && (currentUser.getCurrentUser !== null) && (currentUser.getCurrentUser !== undefined)) && 
        <ApolloConsumer>
            { client =>(
            <div>
                <ProviderRefech>
                    <ProductConsumer>
                        { contextConsumer => (
                                <Route render={ props => ( <ChatWindow  client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} />)} 
                                />  
                        )}
                    </ProductConsumer>
                </ProviderRefech>
             </div>
           )}
         </ApolloConsumer> }
        <Switch>
        <Route path={prop.path} render={props => {
            return (
            <div>
            <TitleComponent titleProps={props} />
            <ScrollIntoTop>
                <ApolloConsumer>
                    { client =>(
                    <div>
                        <ProviderRefech>
                            <ProductConsumer>
                                { contextConsumer => (
                                    <>
                                       {
                                        (prop.path === '/') ? <Route exact path={prop.path}  render={ props => ( <prop.component   client={client} contextConsumer={contextConsumer} {...props}
                                        session={session} refetch={refetch} />)} key={keys} /> :(prop.path ==='/EditProfile/:id') ? <Route  exact path={prop.path} render={props =>(session.getCurrentUser !== null && props.match.params.id === session.getCurrentUser.id  ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)} key={keys} />
                                        :(prop.path ==='/OrderView/:id') ? <Route  exact path={prop.path} render={props =>(session.getCurrentUser !== null ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)} key={keys} />

                                        :(prop.path === "/chat/conversation") ? <Route exact path={prop.path} render={props =>(session.getCurrentUser !== null ? <prop.component
                                        client={client} contextConsumer={contextConsumer} {...props}
                                        session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                        key={keys} /> : (prop.path === "/pages/:url") ? <Route exact path={prop.path} render={ props => (
                                        <prop.component contextConsumer={contextConsumer} client={client}
                                        {...props} session={session} refetch={refetch} /> )} key={keys} /> :
                                        <Route exact path={prop.path} render={ props => (
                                        <prop.component contextConsumer={contextConsumer} client={client}
                                        {...props} session={session} refetch={refetch} /> )} key={keys} />
                                        // <></>
                                        }
                                    </>
                                )}
                            </ProductConsumer>
                        </ProviderRefech>
                    </div>
                    )}
                    </ApolloConsumer>
            </ScrollIntoTop>
            </div>
                    )
                }} key={keys} />
            </Switch>
        </>
        )
        /* if (prop.path == '/') {
            return <Switch>
                <Route exact path={prop.path} render={props => {
                    return (
                        <>
                        <ScrollIntoTop>
                        <ProviderRefech>
                            <ProductConsumer>
                                { contextConsumer => (
                                <prop.component contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} />
                                )}
                            </ProductConsumer>
                            </ProviderRefech>
                        </ScrollIntoTop>
                        </>
                    )
                }} key={keys} />
            </Switch>
        } else {
            if(prop.path === '/EditProfile/:id') {
                return <>
                    <ScrollIntoTop>
                        <ApolloConsumer>
                        { client => (
                            <>
                                <ProviderRefech>
                                    <ProductConsumer>
                                        { contextConsumer => (
                                            <Route path={prop.path} render={props => (session.getCurrentUser !== null && props.match.params.id === session.getCurrentUser.id ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                            />
                                        )}
                                    </ProductConsumer>
                                </ProviderRefech>
                            </>
                        )}
                        </ApolloConsumer>
                    </ScrollIntoTop>
                </>
            }

            } else if(prop.path === '/chat') {
                return <>
                    <ScrollIntoTop>
                        <ApolloConsumer>
                        { client => (
                            <>
                                <ProviderRefech>
                                    <ProductConsumer>
                                        { contextConsumer => (
                                            <Route path={prop.path} render={props => (session.getCurrentUser !== null ? <prop.component client={client} contextConsumer={contextConsumer} {...props} session={session} refetch={refetch} /> : <Redirect to="/" />)}
                                            />
                                        )}
                                    </ProductConsumer>
                                </ProviderRefech>
                            </>
                        )}
                        </ApolloConsumer>
                    </ScrollIntoTop>
                </>
            } else {
                return <Switch>
                    <Route path={prop.path} render={props => {
                        return (
                            <>
                            <ScrollIntoTop>
                            <ApolloConsumer>
                                { client =>(
                                <>
                                    <ProviderRefech>
                                        <ProductConsumer>
                                            { contextConsumer => (
                                            <prop.component contextConsumer={contextConsumer} client={client} {...props} session={session} refetch={refetch} />
                                            )}
                                        </ProductConsumer>
                                    </ProviderRefech>
                                </>
                                )}
                            </ApolloConsumer>
                            </ScrollIntoTop>
                            </>
                        )
                    }} key={keys} />
                </Switch>
            }
        }  */
    }
}
const UserRoutesVar = WithSessionUser(UserRoutesClass)

var UserRoutes = compose(graphql(GET_CURRENT_USER, { name: "currentUser" }), graphql(GET_SITE_INFO, { name: "siteInfo" }))(UserRoutesVar);

export default UserRoutes;
// export default UserRoutes

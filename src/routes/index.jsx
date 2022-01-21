import React , {lazy}from "react";
import { Route, matchPath } from "react-router-dom";
import indexRoutes from "./route.jsx";
import { ApolloConsumer } from "react-apollo";
import ScrollIntoTop from "../views/UserPages/ScrollIntoTop.js";
import { ProviderRefech, ProductConsumer } from "../views/UserPages/ProductContext.js";
import { InnerPage } from '../views/UserPages/css/styledcomponents';


// import AdminRoutes from "./AdminRoutes.jsx";
// import UserRoutes from "./UserRoutes.jsx";

const UserRoutes = lazy(() => import("./UserRoutes.jsx"));
// const indexRoutes = lazy(() => import("./route.jsx"));
const AdminRoutes = lazy(() => import("./AdminRoutes.jsx"));
const PageNotFound = ( lazy(() => ( import('../views/UserPages/Dashboard/NotFound') )) )

// Common no path redirection
const DisplayNotFound = (data) => {
  return <Route render={props => {
    const curPath = props.location.pathname;
    const currentRoute = data.filter(route => matchPath(curPath, route))
    return currentRoute && currentRoute.length > 0 ? <></> :
    <ScrollIntoTop>
        <InnerPage>
          <div className="nn_inner_page">
                <ApolloConsumer>
                    { client =>(
                    <div>
                        <ProviderRefech>
                            <ProductConsumer>
                                { contextConsumer => (
                                    <>
                                       {
                                        <Route exact path={props.path} render={ propsData => (
                                        <PageNotFound contextConsumer={contextConsumer} client={client}
                                        {...propsData} session={props.session} refetch={props.refetch} /> )} />
                                        }
                                    </>
                                )}
                            </ProductConsumer>
                        </ProviderRefech>
                    </div>
                    )}
                    </ApolloConsumer>
          </div>
          </InnerPage>
            </ScrollIntoTop>
    // <PageNotFound />
  }} />
}

const AppComponent = () => {
  return <React.Suspense fallback={""}>
{
   indexRoutes.map((prop, key) => {
    if(prop.AccessType === 'Admin') {
      return <AdminRoutes prop={prop} key={key} keys={key} />
      } else {
      return <UserRoutes prop={prop} key={key} keys={key} />
      }
    })
  }
  <Route component={() => DisplayNotFound(indexRoutes)} />
  </React.Suspense>
}

export default AppComponent




/* const Root = ({ refetch, session }) =>
<Switch>
{indexRoutes.map((prop, key) => {
 if (prop.path == '/') {
    return <Route exact path={prop.path} render={props => {
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
  }} key={key} />;
  } else {
    return <Route path={prop.path} render={props => {
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
  }} key={key} />;
  }
})}
</Switch>
;

const AppComponent = withSession(Root);

export default AppComponent; */



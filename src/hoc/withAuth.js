import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { GET_CURRENT_ADMIN } from "../queries";
import Error from "./error.js";
const { REACT_APP_ADMIN_PATH } = process.env;


const withAuth = conditionFunc => Component => props => {
    return (
    <Query query={GET_CURRENT_ADMIN}>
    {({ data, loading, error }) => {
        if (loading){
            return null;
        }
        if (error){
            return <div><Error error={error}/></div>;
        }
        if (!props.session || !props.session.getCurrentAdmin){
            return <Redirect to={`${REACT_APP_ADMIN_PATH }/login`} />;
        }
        if(props.session  && (props.location.pathname === `${REACT_APP_ADMIN_PATH }/` || props.location.pathname === `${REACT_APP_ADMIN_PATH }`) ){
            return <Redirect to={`${REACT_APP_ADMIN_PATH }/dashboard`} />;
        }
        return conditionFunc(data) ? <Component {...props} /> : <Redirect to={`${REACT_APP_ADMIN_PATH }/login`} />
    }}
    </Query>
    )
};

export default withAuth;

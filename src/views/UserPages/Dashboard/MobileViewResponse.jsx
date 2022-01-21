import React from "react";
import {withRouter} from "react-router-dom"

class MobileViewResponse extends React.Component {
    constructor(props) {
        super(props); 
    }

    render() { 
        const {location} = this.props;
        return <div>
                {(location.state !== undefined) && <div id="demodata" className={"mobile_data"} style={{opacity: "0"}}> {JSON.stringify(location.state, null, 2) } </div>}
              </div> 

    
    }
}
 
export default withRouter(MobileViewResponse);
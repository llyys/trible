import * as React from "react";
import {Html} from "./Html"
interface ErrorProps extends ReactProps{
  error:any;
}

class ErrorPage extends React.Component<ErrorProps, any> {
  render(){
    return (
      <Html>
        <div className="error">
          <h1>
            {this.props.error.message}
          </h1>
          <pre>
            {this.props.error.stack}
          </pre>
        </div>
        </Html>
    )
  }
}

module.exports = ErrorPage;
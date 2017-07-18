import * as React from "react";
import {Html} from "./Html"
interface PageProps extends ReactProps{
  component:any;
  state:any;
}

class Page extends React.Component<PageProps, any> {
  render(){
    return (
      <Html state={this.props.state}>
        <div className="page">
            {this.props.component}
        </div>
      </Html>
    )
  }
}

module.exports = Page;
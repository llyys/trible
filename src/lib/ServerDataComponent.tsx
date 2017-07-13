import * as React from "react";
import * as ReactDOM from "react-dom";
//todoo maybe we dont need this... https://github.com/gizmag/react-serverside-wrapper
interface ServerDataComponentProps extends ReactProps {
  element: string;
  properties: any;
}
export class ServerDataComponent extends React.Component<
  ServerDataComponentProps,
  any
> {
  render() {
    let json = JSON.stringify(this.props.properties);
    return React.createElement("script", {
      type: "application/json",
      id: this.props.element + "_props",
      dangerouslySetInnerHTML: { __html: json.replace(/\//g, "\\/") }
    });
  }
}

export const createDomElement = function(opts) {
  if (
    typeof window !== "undefined" &&
    document.getElementById(opts.domElement + "_props") !== null
  ) {
    var componentProperties = JSON.parse(
      document.getElementById(opts.domElement + "_props").innerHTML
    );
    ReactDOM.render(
      React.createElement(opts.component, componentProperties),
      document.getElementById(opts.domElement)
    );
  }
};

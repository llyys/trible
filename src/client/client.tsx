//require("react-hot-loader/patch")
import * as querystring from "querystring";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as UniversalRouter from "universal-router";
import * as queryString from "query-string";

import "core-js/es6/map";
import "core-js/es6/set";

import { Provider } from "mobx-react";

import { AppContainer } from "react-hot-loader";
import history from "~/client/utils/history";
import routes from "~/routes";
import { App, isProduction } from "~/lib/App";
import router from "./router";
import Page from "./Page";
import { ErrorBoundary } from "~/client/components/ErrorBoundary";
require("~/style/global");

//import profileStore from "./stores/profileStore";

const rootElement = document.getElementById("root");
let currentLocation = history.location;
const context = {
  state: { server: false, store: {} }
};

context.state = (() => {
  let elem = document.getElementById("__route_state");
  let res = JSON.parse(elem.getAttribute("data-initial-state"));
  if (elem.parentNode && isProduction) elem.parentNode.removeChild(elem); //cleanup
  return res;
})();

let route = null;
const stores = {
  //  profileStore
};

// For easier debugging
window["__STORES__"] = stores;
context.state.store = stores;

history.listen((location, action) => {
  if (currentLocation.key !== location.key) {
    currentLocation = location;
    render();
  }
});
const render = async () => {
  try {
    if (context.state.server) {
      return;
    }

    const routeContext = {
      ...context,
      path: location.pathname,
      query: queryString.parse(location.search)
    };
    route = await router.resolve(routeContext);
    ReactDOM.render(
      <AppContainer className="page">
        <Provider {...stores}>
          <ErrorBoundary>
            {route.component}
          </ErrorBoundary>
        </Provider>
      </AppContainer>,
      document.getElementById("root")
    );
  } catch (err) {
    console.log(err);
  }
};

render();

if (!isProduction && module.hot) {
  module.hot.accept();
  render();
}
// registerServiceWorker()

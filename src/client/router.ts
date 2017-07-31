import * as Router from "universal-router";
import routes from "~/routes";

export default new Router(routes, {
  resolveRoute(context, params) {
    let { route } = context;
    // if (typeof route.load === 'function') {
    //   return route.load().then(action => action.default(context, params));
    // }

    //this function will be rendered only once for initial props loading no more!
    if (typeof route.getInitialProps === "function" && !route.props) {
      //return new Promise((resolve, reject) => {
      // to make sure that when there is server side props, we don't invoke getInitialProps from client side
      let props =
        context.state && context.state.route && context.state.route[route.path];

      let state = objectWithoutKey(context.state, "route");
      const serverProps = { props, state };

      return route.getInitialProps(serverProps).then(props => {
        route.props = context.props = props || {};
        return route.action(context, params);
      });
    }
    if (typeof route.action === "function") {
      context.props = route.props;
      return route.action(context, params);
    }
    return null;
  }
});

const objectWithoutKey = (object, key) => {
  return Object.keys(object).reduce((result, propName) => {
    if (propName !== key) {
      result[propName] = object[propName];
    }
    return result;
  }, {});
};

import * as Router from "universal-router";
//Resolve Universal react routing components in server side
export function serverRouter(routes) {
  function resolveServerRoute(context, params) {
    if (typeof context.route.action === "function") {
      let props = {};
      if (typeof context.route.getInitialProps === "function") {
        return Promise.resolve(
          context.route.getInitialProps(context)
        ).then(props => {
          context.props = props;
          if (props) {
            context.state.route[context.route.path] = props;
          }
          return context.route.action(context, params);
        });
      }
      return context.route.action(context, params);
    }

    return null;
  }

  return new Router(routes, { resolveRoute: resolveServerRoute });
}

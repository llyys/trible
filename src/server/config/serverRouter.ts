import * as Router from "universal-router";
export function serverRouter(routes) {
  return new Router(routes, resolveRoute);
}


function resolveRoute(context, params) {
  if (typeof context.route.action === 'function') {
    let props = {};
    if (typeof context.route.getInitialProps === 'function') {
      return Promise.resolve(context.route.getInitialProps(context))
        .then(props => {
          context.props = props;
          if (props) {
            context.store[context.route.path] = props;
          }
          return context.route.action(context, params)
        });
    }
    return context.route.action(context, params);
  }

  return null;
}

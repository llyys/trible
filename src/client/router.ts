import * as Router from 'universal-router';
import routes from "~/routes";

export default new Router(routes, {
  resolveRoute(context, params) {
    let {route} = context;
    // if (typeof route.load === 'function') {
    //   return route.load().then(action => action.default(context, params));
    // }

    //this function will be rendered only once for initial props loading no more!
    if (typeof route.getInitialProps === 'function' && !route.props) {
      return new Promise((resolve, reject) => {
        let serverPathProps = context.state[route.path];
        return resolve(serverPathProps || route.getInitialProps(context))
      })
      .then(props => {
        route.props = context.props = props;
        return route.action(context, params)
      });
    }
    if (typeof route.action === 'function') {
      context.props = route.props;
      return route.action(context, params);
    }
    return null;
  },
});


import { IRoute } from '~/lib/router';

import * as React from 'react';
const route: IRoute = {
  name:'admin',
  path: '/admin',
  getInitialProps: async ({ req }) => {
    return {time:'12'}
  },
  action({ next, props, params }) {
    return { component: (<div className="container">admin page {props.time}</div>)};
  },
}
export default route;
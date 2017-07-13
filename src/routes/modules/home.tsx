import { IRoute } from '~/lib/router';

import { HomePage } from '~/client/containers/HomePage';

import * as React from 'react';
const route: IRoute = {
  name:'home',
  path: '/',
  getInitialProps: async ({ req }) => {
    return {time:'15'}
  },
  async action({ next, props, params }) {
    return {
      component: <HomePage />
    }
  }
}
export default route;
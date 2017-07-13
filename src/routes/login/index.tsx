import * as React from 'react';
import LoginComponent from './Login';
import { IRoute } from '~/lib/router';

const route: IRoute = {
  name:'login',
  path: '/login',

  action({ next, props, params }) {
    return { component: (<LoginComponent/>)};
  },
}
export default route;
import { IRoute } from '../lib/router';

import * as React from 'react';
const route: IRoute = {
  name:'404',
  path: '*',
  async action() {
    return {component: <div>Sorry the page is not found</div>}
  }
}
export default route;
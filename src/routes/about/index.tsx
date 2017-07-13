import * as React from 'react';
//import about from './about.md';


import { IRoute } from '~/lib/router';

const route: IRoute = {
  name:'about',
  path: '/about',
  getInitialProps: async ({ req }) => {
    return {time:Date.now(), ver:req?"server":"client"}
  },
  action({ next, props, params }) {
    return { component: (<div className="container">About page! {props.time} {props.ver}</div>)};
  },
}
export default route;
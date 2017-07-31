import { IRoute } from "../lib/router";

import * as React from "react";
import Layout from "~/client/components/Layout";
import page404 from "./404";
import page500 from "./500";
import home from "./modules/home";
import admin from "./modules/admin";
import about from "./about";
import Page from "~/client/Page";
import login from "./login";

import profileStore from "~/client/stores/profileStore";

const routes: Array<IRoute> = [];

export default {
  path: "/",

  // Keep in mind, routes are evaluated in order
  children: [home, admin, about, login, page500, page404],

  getInitialProps: async ({ req, state }) => {
    if (req) {
      //on server side
      return (state.session = { sessionID: req.sessionID, user: req.user });
    }
    state.store.profileStore = profileStore;
    profileStore.currentUser(state.session.user);
  },

  async action({ next, url }) {
    //middleware

    // Execute each child route until one of them return the result
    try {
      const route = await next();
      if (route !== undefined && route.component !== undefined) {
        route.component = (
          <Layout path={url} title={route.name || "demo"}>
            {route.component}
          </Layout>
        );
        //route.component=(<Page />)
      }
      return route;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};

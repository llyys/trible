import * as passport from "passport";
import * as url from "url";
import { Strategy as TwitterStrategy } from "passport-twitter";
import * as config from "config";
import {
  onAuthenticationCompleted,
  oauthCallback,
  registerAuthenticationRouter
} from "../passport";
import * as express from "express";
import { Request, Express } from "express";

import logger from "~/lib/Logger";
const log = logger.get(module);

export default function(app: Express) {
  // Use twitter strategy
  // var router = express.Router();
  // app.use('/auth/twitter', router)
  let twitter = config.get("passport.twitter");

  let conf = {
    consumerKey: twitter.clientID,
    consumerSecret: twitter.clientSecret,
    callbackURL: twitter.callbackURL || "/auth/twitter/callback",
    passReqToCallback: true
  };
  log.info(`register twitter strategy with ${JSON.stringify(conf)}`);

  passport.use(
    new TwitterStrategy(conf, function(
      req: Request,
      token,
      tokenSecret,
      profile,
      done
    ) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
        displayName: profile.displayName,
        username: profile.username,
        provider: "twitter",
        providerId: providerData.id_str,
        providerData: providerData
      };

      // Save the user OAuth profile
      onAuthenticationCompleted(req, providerUserProfile).then(user =>
        done(null, user)
      );
    })
  );

  //registerAuthenticationRouter(router, 'twitter', callbackURL);
  app.route("/auth/twitter").get(passport.authenticate("twitter"));
  app.route("/auth/twitter/callback").get(oauthCallback("twitter"));
}

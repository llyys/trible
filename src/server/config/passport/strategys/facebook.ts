import * as passport from "passport";
import * as url from "url";
import { Strategy as FacebookStrategy } from "passport-facebook";
import config from "../config";
import { onAuthenticationCompleted, oauthCallback } from "../passport";
import { Request, Express } from "express";

export default function(app: Express) {
  // Use facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        passReqToCallback: true
      },
      function(req: Request, accessToken, refreshToken, profile, done) {
        // Set the provider data and include tokens
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        // Create the user OAuth profile
        var providerUserProfile = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: "facebook",
          providerId: providerData.id,
          providerData: providerData
        };

        // Save the user OAuth profile
        onAuthenticationCompleted(req, providerUserProfile).then(user =>
          done(null, user)
        );
      }
    )
  );

  app.route("/auth/facebook").get();
  app.route("/auth/facebook/callback").get(oauthCallback("facebook"));
}

import * as passport from "passport";
import * as url from "url";
import { Strategy as GithubStrategy } from "passport-github";
import config from "../config";
import { onAuthenticationCompleted } from "../passport";
import { Request } from "express";

export default function() {
  // Use github strategy
  passport.use(
    new GithubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        passReqToCallback: true
      },
      function(req: Request, accessToken, refreshToken, profile, done) {
        // Set the provider data and include tokens
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        // Create the user OAuth profile
        var providerUserProfile = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: "github",
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
}

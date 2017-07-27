import * as passport from "passport";
import * as url from "url";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import config from "../config";
import { onAuthenticationCompleted } from "../passport";
import { Request } from "express";

export default function() {
  // Use google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
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
          provider: "google",
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

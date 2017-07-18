import * as passport from 'passport';
import * as url from 'url';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import config from '../config';
import { onAuthenticationCompleted, oauthCallback } from "../passport";
import {Request, Express} from 'express';

export default function(app:Express) {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req : Request, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
			onAuthenticationCompleted(req, providerUserProfile)
				.then(done);
		}
	));

	app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(oauthCallback('twitter'));
    
};

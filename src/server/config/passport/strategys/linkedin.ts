'use strict';

import * as passport from 'passport';
import * as url from 'url';
import {Strategy as LinkedInStrategy} from 'passport-linkedin';
import config from '../config';
import { onAuthenticationCompleted } from "../passport";
import {Request} from 'express';

export default function() {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			passReqToCallback: true,
			profileFields: ['id', 'first-name', 'last-name', 'email-address']
		},
		function(req : Request, accessToken, refreshToken, profile, done) {
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
				provider: 'linkedin',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			onAuthenticationCompleted(req, providerUserProfile)
				.then(done);
		}
	));
}

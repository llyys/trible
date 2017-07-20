import * as passport from 'passport';
import * as url from 'url';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import * as config from 'config';
import { onAuthenticationCompleted, oauthCallback, registerAuthenticationRouter } from "../passport";
import * as express from 'express';
import {Request, Express} from 'express';



export default function(app:Express) {
	// Use twitter strategy
	// var router = express.Router();
	// app.use('/auth/twitter', router)
	let twitter = config.get('passport.twitter');
	let callbackURL = `/auth/twitter/callback`;
	
	let conf = {
		consumerKey: twitter.clientID,
		consumerSecret: twitter.clientSecret,
		callbackURL: callbackURL,
		passReqToCallback: true
	}
	console.log(`register twitter strategy with ${JSON.stringify(conf)}`)
	
	passport.use(new TwitterStrategy(conf,
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

	//registerAuthenticationRouter(router, 'twitter', callbackURL);
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(oauthCallback('twitter'));
    
};

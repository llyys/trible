import * as passport from "passport";
import { Express } from "express";
import * as glob from 'glob';

import FacebookStrategy from './strategys/facebook'
import TwitterStrategy from './strategys/twitter'

export function configureRoutes(app:Express){
    FacebookStrategy(app);
    TwitterStrategy(app);
    
    // app.route('/auth/twitter').get(passport.authenticate('twitter'));
    // app.route('/auth/twitter/callback').get(oauthCallback('twitter'));
    
    // app.route('/auth/google').get(passport.authenticate('google', {
    //     scope: [
    //         'https://www.googleapis.com/auth/userinfo.profile',
    //         'https://www.googleapis.com/auth/userinfo.email'
    //     ]
    // }));
    // app.route('/auth/google/callback').get(oauthCallback('google'));
    
    // app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
    // app.route('/auth/linkedin/callback').get(oauthCallback('linkedin'));
    
    // app.route('/auth/github').get(passport.authenticate('github'));
    // app.route('/auth/github/callback').get(oauthCallback('github'));
 
}

export async function onAuthenticationCompleted(req:Express.Request, profile:IUserProfile){
  return;
}

export function oauthCallback(strategy) {
    return function(req, res, next) {
        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#!/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/#!/signin');
                }

                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    };
};


export interface IUserProfile{
  id?:string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  username?: string;
  provider: string;
  providerIdentifierField: string;
  providerData: any;
}
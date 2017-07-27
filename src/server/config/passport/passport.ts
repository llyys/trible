import { promisify } from "util";
import * as passport from "passport";
import { Express } from "express";
import * as glob from "glob";
import db = require("~/server/db");

import FacebookStrategy from "./strategys/facebook";
import TwitterStrategy from "./strategys/twitter";

export function configureRoutes(app: Express) {
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

export async function onAuthenticationCompleted(
  req: Express.Request,
  profile: IUserProfile
) {
  let user = req.user;
  if (req.user) {
    await appendProfileToExistingUser(req.user, profile);
    return user;
  } else {
    user = await createNewUserWithProfile(profile);

    // const loginAsync = promisify(req.login);
    // await loginAsync(user);
    return user;
  }
}

async function appendProfileToExistingUser(
  req: Express.Request,
  profile: IUserProfile
) {
  let user = await db.users.getUserFromProfile(profile);
  let reqUser = req.user;
  if (user.users_id !== reqUser.id) {
    throw new Error(
      `There is already a ${profile.provider} account that belongs to you. Sign in with that account or delete it, then link it with your current account.`
    );
  }
  await db.users.addProfileToUser(user.users_id, profile);
}

async function createNewUserWithProfile(profile: IUserProfile) {
  return await db.users.getOrCreateUserProfile(profile);
}

export function oauthCallback(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, redirectURL) {
      if (err || !user) {
        return res.redirect("/#!/signin");
      }
      req.login(user, function(err) {
        if (err) {
          return res.redirect("/#!/signin");
        }

        return res.redirect(redirectURL || "/");
      });
    })(req, res, next);
  };
}

export function registerAuthenticationRouter(router, mode) {
  router.get(`/`, passport.authenticate(mode));

  router.get(
    "/callback",
    passport.authenticate(mode, {
      failureRedirect: `/auth/login?err=${mode}`,
      session: false
    }),
    (req, res, next) => {
      console.log("onAuthSuccess");
      //onAuthSuccess(mode, req, res, next)
    }
  );
}

export interface IUserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  username?: string;
  provider: string;
  providerId: string;
  providerData: any;
}

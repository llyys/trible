

export default {
  twitter:{
    clientID:process.env.TWITTER_CLIENT_ID || "123",
    clientSecret:process.env.TWITTER_CLIENT_SECRET ||'123',
    callbackURL:'/auth/twitter/callback'
  },
  facebook:{
    clientID:process.env.TWITTER_CLIENT_ID||'123',
    clientSecret:process.env.TWITTER_CLIENT_SECRET||'123',
    callbackURL:'/auth/facebook/callback'
  },
  google:{
    clientID:process.env.TWITTER_CLIENT_ID||'123',
    clientSecret:process.env.TWITTER_CLIENT_SECRET||'123',
    callbackURL:'/auth/google/callback'
  },
  linkedin:{
    clientID:process.env.TWITTER_CLIENT_ID||'123',
    clientSecret:process.env.TWITTER_CLIENT_SECRET||'123',
    callbackURL:'/auth/linkedin/callback'
  },
  github:{
    clientID:process.env.TWITTER_CLIENT_ID||'123',
    clientSecret:process.env.TWITTER_CLIENT_SECRET||'123',
    callbackURL:'/auth/github/callback'
  }
}
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthId: profile.id });
    if (!user) {
      user = await User.create({
        name: profile.displayName || 'No Name',
        email: profile.emails && profile.emails[0] && profile.emails[0].value ? profile.emails[0].value : `no-email-${profile.id}@example.com`,
        oauthProvider: 'google',
        oauthId: profile.id
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

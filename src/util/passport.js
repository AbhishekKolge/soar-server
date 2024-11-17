const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { name, email, picture } = profile._json;
      const googleProfile = {
        name,
        email,
        profileImageUrl: picture,
      };
      done(null, googleProfile);
    }
  )
);

module.exports = passport;

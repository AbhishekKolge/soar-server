const PORT = process.env.PORT || 8000;
const GOOGLE_SCOPE = ["profile", "email"];
const GOOGLE_SESSION = false;

module.exports = { PORT, GOOGLE_SCOPE, GOOGLE_SESSION };

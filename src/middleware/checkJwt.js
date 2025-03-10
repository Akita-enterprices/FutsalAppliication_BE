const { expressjwt: expressJwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config();

// Debugging: Check if .env variables are loaded
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  console.error("ERROR: Missing AUTH0_DOMAIN or AUTH0_AUDIENCE in .env file");
  process.exit(1); // Stop server if config is missing
}

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
}).unless({ path: ["/api/public-route"] });

module.exports = checkJwt;

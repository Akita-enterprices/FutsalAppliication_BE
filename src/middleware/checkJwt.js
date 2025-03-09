const { expressjwt: expressJwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config();

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE, // Make sure this is set in .env
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
}).unless({ path: ["/api/public-route"] }); // Optional: Exclude certain routes

module.exports = checkJwt;

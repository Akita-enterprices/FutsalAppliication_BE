const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // Auth0 JWKS URL
  }),
  algorithms: ['RS256'], // Auth0 uses RS256 by default
});

module.exports = checkJwt;

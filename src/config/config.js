module.exports = {
  port: process.env.PORT || 4000,
  dbUri: process.env.DB_URI,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

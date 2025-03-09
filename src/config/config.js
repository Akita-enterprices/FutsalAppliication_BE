module.exports = {
  port: process.env.PORT || 8001,
  dbUri: process.env.DB_URI,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

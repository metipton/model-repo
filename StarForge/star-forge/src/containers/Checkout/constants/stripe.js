const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
  ? 'pk_test_Q9g5lzmq42s3HZWbfZknF0n0' // put real key here when ready
  : 'pk_test_Q9g5lzmq42s3HZWbfZknF0n0';

export default STRIPE_PUBLISHABLE;
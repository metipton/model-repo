const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
  ? 'pk_live_MY_PUBLISHABLE_KEY'
  : 'pk_test_Q9g5lzmq42s3HZWbfZknF0n0';

export default STRIPE_PUBLISHABLE;
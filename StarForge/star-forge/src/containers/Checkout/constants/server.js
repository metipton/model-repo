const PAYMENT_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'http://www.starforge.com'
  : 'http://localhost:3000';

export default PAYMENT_SERVER_URL;
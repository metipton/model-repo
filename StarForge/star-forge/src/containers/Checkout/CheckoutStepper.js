import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import STRIPE_PUBLISHABLE from './constants/stripe';
import PAYMENT_SERVER_URL from './constants/server';
import ty from './ty.jpg';

const CURRENCY = 'USD';

const fromEuroToCent = amount => amount * 100;

const successPayment = data => {
  alert('Payment Successful');
};

const errorPayment = data => {
  alert('Payment Error');
};

const onToken = (amount, description) => token => {
  axios.post(PAYMENT_SERVER_URL,
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: fromEuroToCent(amount)
    }
    )
    .then(successPayment)
    .catch(errorPayment);
}
const Checkout = (props) =>(
    <div >
        <StripeCheckout
            name="Starforge" // the pop-in header title
            description="Forge your star" // the pop-in header subtitle
            image="https://stripe.com/img/documentation/checkout/marketplace.png"// the pop-in header image (default none)
            ComponentClass="div"
            panelLabel="Pay" // prepended to the amount in the bottom pay button
            amount={1000000} // cents
            currency={CURRENCY}
            stripeKey={STRIPE_PUBLISHABLE}
            locale="auto"
            email="starforge@starforge.com"
            // Note: Enabling either address option will give the user the ability to
            // fill out both. Addresses are sent as a second parameter in the token callback.
            shippingAddress={true}
            billingAddress={true}
            // Note: enabling both zipCode checks and billing or shipping address will
            // cause zipCheck to be pulled from billing address (set to shipping if none provided).
            zipCode={true}
            allowRememberMe // "Remember Me" option (default true)
            token={onToken} // submit callback
            disabled={props.disabled}
            >
        </StripeCheckout>
    </div>
)
export default Checkout;
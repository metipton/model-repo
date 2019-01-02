import React from 'react'
import firebase from '../../Firebase';
import StripeCheckout from 'react-stripe-checkout';
import {connect} from 'react-redux';

import STRIPE_PUBLISHABLE from './constants/stripe';
import PAYMENT_SERVER_URL from './constants/server';


class Checkout extends React.Component {

  successPayment = data => {
    console.log(data);
    alert('Payment Successful');
  };

  errorPayment = data => {
    alert('Payment Error');
  };

  onToken = token => {
    firebase.database().ref(`/stripe_customers/${this.currentUser.uid}/sources`).push({token: token})
      .then(this.successPayment)
      .catch(this.errorPayment);
  }
  // ...

  render() {
    const CURRENCY = 'USD';

    const fromEuroToCent = amount => amount * 100;
    return (
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
            token={this.onToken} // submit callback
            disabled={this.props.disabled}
            >
        </StripeCheckout>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
      currentCart: state.shoppingCart.cartProducts.items,
      userId: state.auth.userId,
      addInProgress: state.shoppingCart.cartProducts.addInProgress
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

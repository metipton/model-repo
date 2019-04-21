import React from 'react'
import {fbDatabase} from '../../Firebase';
import StripeCheckout from 'react-stripe-checkout';
import {connect} from 'react-redux';
import {openOrderModal, closeOrderModal} from '../../store/actions/index';

import STRIPE_PUBLISHABLE from './constants/stripe';
//import PAYMENT_SERVER_URL from './constants/server';


class Checkout extends React.Component {

  constructor(props) {
    super(props);
    this.stripeCheckout = React.createRef();
  }


  errorPayment = data => {
    alert(data);
  };

  onToken = (token, addresses) => {
    fbDatabase.ref(`/users/${this.props.userId}/sources`).push({token: token.id,  amount: Math.round(this.props.totalPrice * 100 + this.props.shipping)})
      .then(this.props.openOrderModal(token, addresses))
      .catch(this.errorPayment);
  }


  render() {
    const CURRENCY = 'USD';

   // desktopShowModal={this.props.autoCheckout}
    return (
      <div >
        <StripeCheckout
            ref={this.stripeCheckout}
            desktopShowModal={this.props.autoCheckout}
            name="Starforge" // the pop-in header title
            description="Forge your star" // the pop-in header subtitle
            image="https://stripe.com/img/documentation/checkout/marketplace.png"// the pop-in header image (default none)
            ComponentClass="div"
            panelLabel="Review Order" // prepended to the amount in the bottom pay button
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
      userId: state.auth.userId,
      totalPrice: state.shoppingCart.cartTotals.item.totalPrice,
      shipping: state.shoppingCart.cartTotals.shipping,
      autoCheckout: state.order.autoOpenCheckout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openOrderModal: (token, addresses) => dispatch(openOrderModal(token, addresses)),
    closeOrderModal: () => dispatch(closeOrderModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

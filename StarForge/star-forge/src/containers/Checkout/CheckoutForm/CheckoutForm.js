// index.js
import React from 'react';

import STRIPE_PUBLISHABLE from '../constants/stripe';
import PAYMENT_SERVER_URL from '../constants/server';
import {StripeProvider, Elements} from 'react-stripe-elements';
import Modal from '../../../components/UI/Modal/Modal';

import CheckoutStepper from './CheckoutStepper';

const CheckoutForm = () => {
  return (
    <StripeProvider apiKey={STRIPE_PUBLISHABLE}>
      <Modal             
        show={true}
        ModalClosed={null}>
          <Elements>
            <CheckoutStepper />
          </Elements>
      </Modal>
    </StripeProvider>
  );
};

export default CheckoutForm;
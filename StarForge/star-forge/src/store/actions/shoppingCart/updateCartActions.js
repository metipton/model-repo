import * as actionTypes from '../actionTypes';

import persistentCart from '../../../components/ShoppingCart/persistentCart';

export const updateShipping = (shippingMode, shippingPrice) => dispatch => {
  dispatch({
    type: actionTypes.UPDATE_SHIPPING,
    mode: shippingMode,
    price: shippingPrice
  })
}

export const updateCart = (cartProducts) => dispatch => {
  let productQuantity = cartProducts.reduce( (sum, p) => {
    sum += p.quantity;
    return sum;
  }, 0);

  let totalPrice = cartProducts.reduce((sum, p) => {
    sum += p.price * p.quantity;
    return sum;
  }, 0);

  let installments = cartProducts.reduce((greater, p) => {
    greater = p.installments > greater ? p.installments : greater;
    return greater;
  }, 0);


  let cartTotals = {
    productQuantity,
    installments,
    totalPrice,
    currencyId: 'USD',
    currencyFormat: '$',
  }

  persistentCart().persist(JSON.stringify(cartProducts));

  dispatch({
    type: actionTypes.UPDATE_CART,
    payload: cartTotals,
  });

}

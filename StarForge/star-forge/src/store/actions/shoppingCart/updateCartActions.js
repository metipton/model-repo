import * as actionTypes from '../actionTypes';

const postShippingInfo = (userId, shippingMode) => {
  const url = `https://us-central1-starforge-153cc.cloudfunctions.net/setShippingMode?userId=${userId}&shippingMode=${shippingMode}`;
  return new Promise( ( resolve, reject ) => {
      fetch(url)
          .then((response) => {
              resolve(response.json())
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
}

export const updateShipping = (userId, shippingMode, shippingPrice) => async dispatch => {
  await postShippingInfo(userId, shippingMode);

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

  dispatch({
    type: actionTypes.UPDATE_CART,
    payload: cartTotals,
  });

}

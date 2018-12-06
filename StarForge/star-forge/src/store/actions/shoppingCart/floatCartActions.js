import * as actionTypes from '../actionTypes';


export const loadCart = (cartProducts) => dispatch => {
  dispatch({
    type: actionTypes.LOAD_CART,
    payload: cartProducts,
  });
}

export const addProduct = (productData) => dispatch => {
  dispatch({
    type: actionTypes.ADD_PRODUCT,
    payload: productData,
  });
}

export const removeProduct = (productData) => dispatch => {
  dispatch({
    type: actionTypes.REMOVE_PRODUCT,
    payload: productData,
  });
}

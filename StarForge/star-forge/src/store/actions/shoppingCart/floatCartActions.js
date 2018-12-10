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

export const addInProgress = () => dispatch => {
  dispatch({
    type: actionTypes.ADD_IN_PROGRESS
  })
}

export const completedAddToCart = () => dispatch => {
  dispatch({
    type: actionTypes.FINISHED_ADD
  })
}

export const removeProduct = (productData) => dispatch => {
  dispatch({
    type: actionTypes.REMOVE_PRODUCT,
    payload: productData,
  });
}

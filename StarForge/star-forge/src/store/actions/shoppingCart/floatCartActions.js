import * as actionTypes from '../actionTypes';

export const loadShipping = (shipping) => dispatch => {
  dispatch({
    type: actionTypes.LOAD_SHIPPING,
    payload: shipping
  })
}

export const toggleCart = () => dispatch => {
  dispatch({
    type: actionTypes.TOGGLE_CART,
  });
}

export const openCart = () => dispatch => {
  dispatch({
    type: actionTypes.OPEN_CART,
  });
}

export const closeCart = () => dispatch => {
  dispatch({
    type: actionTypes.CLOSE_CART,
  });
}


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

export const resetCart = () => dispatch => {
  dispatch({
    type: actionTypes.RESET_CART,
  })
}

export const enterCheckout = () => dispatch => {
  dispatch({
    type: actionTypes.ENTER_CHECKOUT,
  })
}

export const exitCheckout = () => dispatch => {
  dispatch({
    type: actionTypes.EXIT_CHECKOUT,
  })
}
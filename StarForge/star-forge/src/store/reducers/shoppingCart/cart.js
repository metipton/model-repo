import * as actionTypes from '../../actions/actionTypes';

// initial state
const initState = {
    cartOpen: false,
    inCheckout: false,
    checkout: { lineItems: [] },
    shop: {}
  }

  // reducers
  export default (state = initState, action) => {
    switch (action.type) {
      case actionTypes.OPEN_CART:
        return {...state, cartOpen: true}
      case actionTypes.CLOSE_CART:
        return {...state, cartOpen: false}
      case actionTypes.TOGGLE_CART:
        return { ...state, cartOpen: !initState.cartOpen };
      case actionTypes.CLIENT_CREATED:
        return {...state, client: action.payload}
      case actionTypes.CHECKOUT_FOUND:
        return {...state, checkout: action.payload}
      case actionTypes.SHOP_FOUND:
        return {...state, shop: action.payload}
      case actionTypes.ENTER_CHECKOUT:
        return {
          ...state,
          inCheckout: true
        }
      case actionTypes.EXIT_CHECKOUT:
        return {
          ...state,
          inCheckout: false
      }
      default:
        return state
    }
  }
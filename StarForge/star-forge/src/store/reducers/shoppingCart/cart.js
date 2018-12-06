import * as actionTypes from '../../actions/actionTypes';

// initial state
const initState = {
    checkout: { lineItems: [] },
    shop: {}
  }

  // reducers
  export default (state = initState, action) => {
    switch (action.type) {
      case actionTypes.CLIENT_CREATED:
        return {...state, client: action.payload}
      case actionTypes.CHECKOUT_FOUND:
        return {...state, checkout: action.payload}
      case actionTypes.SHOP_FOUND:
        return {...state, shop: action.payload}
      default:
        return state
    }
  }
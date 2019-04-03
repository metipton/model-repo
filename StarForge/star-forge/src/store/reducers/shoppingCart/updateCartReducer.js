import * as actionTypes from '../../actions/actionTypes';


const initialState = {
  mode: null,
  shipping: 0,
  item: {
    productQuantity: 0,
    installments: 0,
    totalPrice: 0,
  }
};




export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_SHIPPING:
      return {
        ...state,
        mode: action.mode,
        shipping: (action.price * 100)
      }
    case actionTypes.UPDATE_CART:
      return {
        ...state,
        item: action.payload
      };
    default:
      return state;
  }
}

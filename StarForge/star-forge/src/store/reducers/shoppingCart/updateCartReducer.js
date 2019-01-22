import * as actionTypes from '../../actions/actionTypes';


const initialState = {
  shipping: 499,
  item: {
    productQuantity: 0,
    installments: 0,
    totalPrice: 0,
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_CART:
      return {
        ...state,
        item: action.payload
      };
    default:
      return state;
  }
}

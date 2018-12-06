import * as actionTypes from '../../actions/actionTypes';


const initialState = {
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };
    case actionTypes.ADD_PRODUCT:
      return {
        ...state,
        item: Object.assign({}, action.payload)
      };
    case actionTypes.REMOVE_PRODUCT:
      return {
        ...state,
        itemToRemove: Object.assign({}, action.payload)
      };
    default:
      return state;
  }
}

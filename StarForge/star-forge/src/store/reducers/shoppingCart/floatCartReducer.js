import * as actionTypes from '../../actions/actionTypes';


const initialState = {
  addInProgress: false,
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
    case actionTypes.ADD_IN_PROGRESS:
      return {
        ...state,
        addInProgress: true
      }
    case actionTypes.FINISHED_ADD:
      return {
        ...state,
        addInProgress: false
      }
    case actionTypes.RESET_CART:
      return {
        addInProgress: false,
        items: []
      }
    default:
      return state;
  }
}

import * as actionTypes from '../../actions/actionTypes';


const initialState = {
  items: [],
}

export default function(state = initialState, action){
  switch(action.type){
    case actionTypes.FETCH_PRODUCTS:
      return {
        ...state,
        items: action.payload
      }
    default:
      return state;
  }
}

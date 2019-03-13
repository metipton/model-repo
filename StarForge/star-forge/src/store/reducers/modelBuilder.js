import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: false,
    inCheckoutScreen: false,
    loading: true
};


const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.CHECKOUT_OPEN_MODAL:
            return {
                ...state,
                inCheckoutScreen: true
            }
        case actionTypes.CHECKOUT_CLOSE_MODAL:
            return {
                ...state,
                inCheckoutScreen: false
            }
        case actionTypes.MODEL_FINISHED_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};

export default reducer;

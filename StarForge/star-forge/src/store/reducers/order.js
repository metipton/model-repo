import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    orders: [],
    mostRecentId: null,
    mostRecentCart: null,
    mostrecentInfo: null,
    loading: false,
    purchased: false
};

const purchaseInit = ( state, action ) => {
    return updateObject( state, { purchased: false } );
};

const purchaseModelStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const passOrderData = ( state, action ) => {

    return updateObject( state, {
        loading: false,
        purchased: true,
        mostRecentId: action.orderId,
        mostRecentCart: action.Cart,
        mostrecentInfo: action.Info,
    } );
};

const purchaseModelFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const fetchOrdersStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchOrdersSuccess = ( state, action ) => {
    return updateObject( state, {
        orders: action.orders,
        loading: false
    } );
};

const fetchOrdersFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PURCHASE_INIT: return purchaseInit( state, action );
        case actionTypes.PURCHASE_MODEL_START: return purchaseModelStart( state, action );
        case actionTypes.PASS_ORDER_DATA: return passOrderData(state, action);
        case actionTypes.PURCHASE_MODEL_FAIL: return purchaseModelFail( state, action );
        case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart( state, action );
        case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess( state, action );
        case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail( state, action );
        default: return state;
    }
};

export default reducer;

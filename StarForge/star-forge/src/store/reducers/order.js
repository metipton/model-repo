import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    orders: [],
    mostRecentId: null,
    mostRecentCart: null,
    shippingMode: "Value ( 2-5 days )",
    shippingPrice: 4.99,
    numItems: 0,
    loading: false,
    purchased: false,
    orderState: 'Review',
    inCheckoutScreen: false,
    cardData: null,
    addresses: null,
    autoOpenCheckout: null,
    orderResults: null
};

const setCompleteOrderState = (state, action) => {
    return updateObject( state, {
        mostRecentId: action.id,
        mostRecentCart: action.products,
        shippingMode: action.shippingMode,
        shippingPrice: action.shippingPrice,
        numItems: action.numItems

    })
}

const setAutoCheckout = (state) => {
    return updateObject( state, {
        autoOpenCheckout: true
    })
}

const cancelAutoCheckout = (state) => {  
    return updateObject( state, {
        autoOpenCheckout: null
    })
}

const openOrderModal = ( state, action ) => {

    return updateObject( state, {
        inCheckoutScreen: true,
        cardData: action.cardData,
        addresses: action.bothAddr });
}

const closeOrderModal = ( state, action ) => {
    return updateObject( state, {
        inCheckoutScreen: false,
        orderState: 'Review'
    });
}

const purchaseModelStart = ( state, action ) => {
    return updateObject( state, { 
        loading: false,
        orderState: 'Pending',
        purchased: false
    } );
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
    return updateObject( state, { 
        loading: false,
        orderState: 'Failed',
        puchased: false
    } );
};

const purchaseModelSuccess = ( state, action ) => {
    return updateObject( state, { 
        loading: false,
        orderState: 'Complete',
        purchased: true,
        orderResults: action.payload,
        orderNumber: action.orderNumber
    } );
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
        case actionTypes.SET_AUTO_CHECKOUT: return setAutoCheckout( state, action );
        case actionTypes.CANCEL_AUTO_CHECKOUT: return cancelAutoCheckout( state, action );
        case actionTypes.PURCHASE_MODEL_START: return purchaseModelStart( state, action );
        case actionTypes.PURCHASE_MODEL_SUCCESS: return purchaseModelSuccess(state, action);
        case actionTypes.PASS_ORDER_DATA: return passOrderData(state, action);
        case actionTypes.PURCHASE_MODEL_FAIL: return purchaseModelFail( state, action );
        case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart( state, action );
        case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess( state, action );
        case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail( state, action );
        case actionTypes.OPEN_ORDER_MODAL: return openOrderModal( state, action);
        case actionTypes.CLOSE_ORDER_MODAL: return closeOrderModal( state, action);
        case actionTypes.SET_COMPLETE_ORDER_STATE: return setCompleteOrderState( state, action);
        default: return state;
    }
};

export default reducer;

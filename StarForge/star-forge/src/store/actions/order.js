import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';


export const autoCheckoutTimeout = () => {
    return (dispatch) => {
        dispatch(setAutoCheckout());
        setTimeout(() => {
            dispatch(cancelAutoCheckout());
        },  2000);
    };
}

export const setAutoCheckout = () => {
    return {
        type: actionTypes.SET_AUTO_CHECKOUT
    }
}

export const cancelAutoCheckout = () => {
    return {
        type: actionTypes.CANCEL_AUTO_CHECKOUT
    }
}

export const openOrderModal = (token, addresses) => {
    return {
        type: actionTypes.OPEN_ORDER_MODAL,
        cardData: token.card,
        bothAddr: addresses
    }
}

export const closeOrderModal = () => {
    return {
        type: actionTypes.CLOSE_ORDER_MODAL,
    }
}

export const purchaseModelStart = () => {

    return {
        type: actionTypes.PURCHASE_MODEL_START
    };
};

export const purchaseModelSuccess = (key, results) => {
    return {
        type: actionTypes.PURCHASE_MODEL_SUCCESS,
        payload: results,
        orderNumber: key
    };
};

export const passOrderData = (orderKey, Cart, Info) => {
    return {
        type: actionTypes.PASS_ORDER_DATA,
        orderKey: orderKey,
        Cart: Cart,
        Info: Info
    }
}

export const purchaseModelFail = (error) => {
    return {
        type: actionTypes.PURCHASE_MODEL_FAIL,
        error: error
    };
};


export const fetchOrdersSuccess = ( orders ) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = ( error ) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get( '/orders.json' + queryParams)
            .then( res => {
                const fetchedOrders = [];
                for ( let key in res.data ) {
                    fetchedOrders.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            } )
            .catch( err => {
                dispatch(fetchOrdersFail(err));
            } );
    };
};

import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import firebase from '../../Firebase';

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

export const purchaseModelSuccess = (userId) => {
    return  async dispatch => {
        dispatch(purchaseModelSuccess());
        const database =  firebase.database().ref('users/' + userId + '/CompletedOrders');
        let snapshot = await database.once("value");
        var keys = Object.keys(snapshot.val());
        var orderKey = keys[keys.length-1];
        var orderData = snapshot.val()[orderKey];
        var dataKey = Object.keys(orderData['Info']);
        var orderInfo = orderData['Info'][dataKey[0]];
        dispatch(passOrderData(orderKey, orderData['Cart'], orderInfo))
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


export const purchaseModelStart = () => {
    return {
        type: actionTypes.PURCHASE_MODEL_START
    };
};


export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
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

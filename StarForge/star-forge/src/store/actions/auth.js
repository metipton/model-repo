import * as actionTypes from './actionTypes';

export const authOpenModal = () => {
    return {
        type: actionTypes.AUTH_OPEN_MODAL
    };
};

export const authCloseModal = () => {
    return {
        type: actionTypes.AUTH_CLOSE_MODAL
    };
};

export const setFirebaseUIWidget = (widget) => { 
    return {
        type: actionTypes.AUTH_SET_FIREBASE_WIDGET,
        firebaseUIWidget: widget
    };
};

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (accessToken, refreshToken, userId, idToken, expiresAt, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        idToken: idToken,
        expiresAt: expiresAt,
        email: email,
    };
};

export const socialAuth = (accessToken, refreshToken, userId, idToken, expiresAt, email) => {
    return dispatch => {
        dispatch(authSuccess(accessToken, refreshToken, userId, idToken, expiresAt, email));
        dispatch(checkAuthTimeout(86400));
        dispatch(authCloseModal());
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('userId', userId);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('email', email);
        localStorage.setItem('expiresAt', expiresAt);
    };
};


export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};

export const logout = () => {
    
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};


export const authCheckState = () => {
        return async dispatch => {
                // const accessToken = localStorage.getItem('accessToken');
                // if(!accessToken ){
                //     dispatch(logout());
                // } else {
                //     const expiresAt = parseInt(localStorage.getItem('expiresAt'), 10);
                //     const userId = localStorage.getItem('userId');
                //     const idToken = localStorage.getItem('idToken');
                //     const expirationTime = new Date(expiresAt);
                //     const nowTime = new Date();
                //     if(fbExpirationTime < nowTime){
                //         try{
                //             fbExpiry =  await getFirebaseToken(idToken);
                //         } catch(error){
                //             dispatch(logout());
                //             return;
                //         }
                //     }
                //     const email = localStorage.getItem('email');
                //     if(expirationTime > nowTime){    
                //         dispatch(authSuccess(accessToken, userId, idToken, expiresAt, email, fbToken, fbExpiry));
                //         //dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
                //     } else {
                //         dispatch(logout());
                //     }
                // }
        };
};

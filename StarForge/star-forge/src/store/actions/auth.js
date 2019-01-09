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

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (accessToken, userId, idToken, expiresAt, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        accessToken: accessToken,
        userId: userId,
        idToken: idToken,
        expiresAt: expiresAt,
        email: email,

    };
};

export const socialAuth = (accessToken, userId, idToken, expiresAt, email) => {
    return dispatch => {
        dispatch(authSuccess(accessToken, userId, idToken, expiresAt, email));
        //dispatch(authCloseModal());
        dispatch(checkAuthTimeout(86400));
        localStorage.setItem('accessToken', accessToken);
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
        return dispatch => {
                const accessToken = localStorage.getItem('accessToken');
                if(!accessToken){
                    dispatch(logout());
                } else {
                    const expiresAt = parseInt(localStorage.getItem('expiresAt'), 10);
                    const userId = localStorage.getItem('userId');
                    const expirationTime = new Date(expiresAt);
                    const email = localStorage.getItem('email');
                    console.log(expiresAt);
                    console.log(expirationTime);
                    console.log(new Date());
                    if(expirationTime > new Date()){
                        const idToken = localStorage.getItem('idToken');
                        dispatch(authSuccess(accessToken, userId, idToken, expiresAt, email));
                        //dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
                    } else {
                        console.log("logging out");
                        dispatch(logout());
                    }
                }
        };
};

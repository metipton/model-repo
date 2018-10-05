import axios from 'axios';

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

export const authSuccess = (token, userId, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
        email: email,

    };
};

export const socialAuth = (token, userId, email) => {
    return dispatch => {
        const expirationDate = new Date(new Date().getTime() + 86400000);
        dispatch(authSuccess(token, userId, email));
        dispatch(authCloseModal());
        dispatch(checkAuthTimeout(86400));
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('expirationDate', expirationDate);
    };
};


export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
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

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCFhZpMGAAUnjCqcziGL-Yh7TjXB37BPG0';
        if(!isSignup){
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCFhZpMGAAUnjCqcziGL-Yh7TjXB37BPG0';
        }

        axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                localStorage.setItem('email', response.data.email);
                dispatch(authSuccess(response.data.idToken, response.data.localId, response.data.email));
                dispatch(authCloseModal());
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const authCheckState = () => {
        return dispatch => {
                const token = localStorage.getItem('token');
                if(!token){
                    dispatch(logout());
                } else {
                    const expirationDate = new Date(localStorage.getItem('expirationDate'));
                    const email = localStorage.getItem('email');
                    if(expirationDate > new Date()){
                        const userId = localStorage.getItem('userId');
                        dispatch(authSuccess(token, userId, email));
                        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
                    } else {
                        dispatch(logout());
                    }
                }
        };
};

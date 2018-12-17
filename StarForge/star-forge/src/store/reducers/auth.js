import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    idToken: null,
    userId: null,
    accessToken: null,
    expiresAt: 0,
    email: null,
    error: null,
}

const authStart = (state, action) => {
    return updateObject(state, {error:null, loading: true});
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        accessToken: action.accessToken,
        userId: action.userId,
        idToken: action.idToken,
        expiresAt: action.expiresAt,
        email: action.email,
        error: null,
    });
};

const authFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, {
            accessToken: null,
            userId: null,
            idToken: null,
            expiresAt: 0,
            email: null
        });
};

const authOpenModal = (state, action) => {
    return updateObject(state, {
            inAuthScreen: true
        });
};

const authCloseModal = (state, action) => {
    return updateObject(state, {
            inAuthScreen: false
        });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_FAILED: return authFailed(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_OPEN_MODAL: return authOpenModal(state,action);
        case actionTypes.AUTH_CLOSE_MODAL: return authCloseModal(state,action);
        default:
            return state;
    }
};

export default reducer;

import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    firebaseUIWidget: null,
    inAuthScreen: false,
    idToken: null,
    userId: null,
    accessToken: null,
    expiresAt: 0,
    email: null,
    error: null,
}

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

const setFirebaseUIWidget = (state, action) => {
    return updateObject(state, {
            firebaseUIWidget: action.firebaseUIWidget
        });
};

const authStart = (state, action) => {
    return updateObject(state, {error:null, loading: true});
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
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
            refreshToken: null,
            userId: null,
            idToken: null,
            expiresAt: 0,
            email: null,
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
        case actionTypes.AUTH_SET_FIREBASE_WIDGET: return setFirebaseUIWidget(state,action);
        default:
            return state;
    }
};

export default reducer;

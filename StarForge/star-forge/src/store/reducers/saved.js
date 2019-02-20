import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    modalOpen: false,
};


const openSavedModal = (state) => {
    return updateObject(state, {
            modalOpen: true
        });
};

const closeSavedModal = (state) => {
    return updateObject(state, {
            modalOpen: false
        });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_SAVED_MODAL: return openSavedModal(state);
        case actionTypes.CLOSE_SAVED_MODAL: return closeSavedModal(state);
        default:
            return state;
    }
};

export default reducer;
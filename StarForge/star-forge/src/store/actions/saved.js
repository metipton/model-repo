import * as actionTypes from './actionTypes';

export const openSavedModal = () => {
    return {
        type: actionTypes.OPEN_SAVED_MODAL
    };
};

export const closeSavedModal = () => {
    return {
        type: actionTypes.CLOSE_SAVED_MODAL
    };
};
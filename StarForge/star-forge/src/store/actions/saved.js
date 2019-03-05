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

export const addSavedModels = (modelData, timestampArray) => {
    return {
        type: actionTypes.ADD_SAVED_MODELS,
        payload: modelData,
        timestamps: timestampArray
    };
}

export const removeSavedModel = (modelTimestamp) => {
    return {
        type: actionTypes.REMOVE_SAVED_MODEL,
        timestamp: modelTimestamp,
    };
}

export const updateSavedModel = (modelData, modelTimestamp) => {
    return {
        type: actionTypes.UPDATE_SAVED_MODEL,
        payload: modelData,
        timestamp: modelTimestamp
    }
}
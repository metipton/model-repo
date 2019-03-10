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

export const openNameModal = () => {
    return {
        type: actionTypes.OPEN_NAME_MODAL
    };
};

export const closeNameModal = () => {
    return {
        type: actionTypes.CLOSE_NAME_MODAL
    };
};

export const openDeleteModal = () => {
    return {
        type: actionTypes.OPEN_DELETE_MODAL
    };
};

export const closeDeleteModal = () => {
    return {
        type: actionTypes.CLOSE_DELETE_MODAL
    };
};

export const addSavedModels = (modelData, timestampArray) => {
    return {
        type: actionTypes.ADD_SAVED_MODELS,
        payload: modelData,
        timestamps: timestampArray
    };
}


export const selectModel = (timestamp) => {
    return {
        type: actionTypes.SELECT_MODEL,
        payload: timestamp
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

export const saveInProgress = () => {
    return {
        type: actionTypes.SAVE_IN_PROGRESS,
    }
}

export const saveComplete = () => {
    return {
        type: actionTypes.SAVE_COMPLETE,
    }
}
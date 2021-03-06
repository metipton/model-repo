import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';


const initialState = {
    saveInProgress: false,
    loadInProgress: false,
    modalOpen: false,
    modalSmallNameShow: false,
    modalSmallDeleteShow: false,
    selected: null,
    modelByTimestamp: null,
    modelById: null
};

const loadInProgress = (state) => {
    return updateObject(state, {
            loadInProgress: true
        });
};

const loadComplete = (state) => {
    return updateObject(state, {
            loadInProgress: false
        });
};

const saveInProgress = (state) => {
    return updateObject(state, {
            saveInProgress: true
        });
};

const saveComplete = (state) => {
    return updateObject(state, {
            saveInProgress: false
        });
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

const openNameModal = (state) => {
    return updateObject(state, {
            modalSmallNameShow:  true
        });
};

const closeNameModal = (state) => {
    return updateObject(state, {
            modalSmallNameShow:  false
        });
};

const openDeleteModal = (state) => {
    return updateObject(state, {
            modalSmallDeleteShow: true
        });
};

const closeDeleteModal = (state) => {
    return updateObject(state, {
            modalSmallDeleteShow: false
        });
};

const addSavedModels = (state, action) => {
    return updateObject(state, {
        modelById: [ ...action.timestamps],
        modelByTimestamp: {
            ...action.payload
        }
      })
}

const selectModel = (state, action ) => {
    return updateObject(state, {
        selected : action.payload
      })
}

const removeSavedModel = (state, action) => {
    const prunedIds = state.modelById.filter(item => {
        return item !== action.timestamp // return all the items not matching the action.id
      })
    delete state.modelByTimestamp[action.timestamp] // delete the hash associated with the action.id
    return updateObject( state, {
        modelById: prunedIds,
        modelByTimestamp: state.modelByTimestamp
    })
}

const updateSavedModel = (state, action) => {
    state.modelByTimestamp[action.timestamp] = {
        ...state.modelByTimestamp[action.timestamp],
        ...action.payload
    }
      return updateObject( state, {
          ...state
      })
}

const renameSavedModel = (state, action) => {
    state.modelByTimestamp[action.timestamp] = {
        ...state.modelByTimestamp[action.timestamp],
        'name' : action.payload
    }
      return updateObject( state, {
          ...state,
      })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_SAVED_MODAL: return openSavedModal(state);
        case actionTypes.CLOSE_SAVED_MODAL: return closeSavedModal(state);
        case actionTypes.OPEN_NAME_MODAL: return openNameModal(state);
        case actionTypes.CLOSE_NAME_MODAL: return closeNameModal(state);
        case actionTypes.OPEN_DELETE_MODAL: return openDeleteModal(state);
        case actionTypes.CLOSE_DELETE_MODAL: return closeDeleteModal(state);
        case actionTypes.ADD_SAVED_MODELS: return addSavedModels(state, action);
        case actionTypes.REMOVE_SAVED_MODEL: return removeSavedModel(state, action);
        case actionTypes.UPDATE_SAVED_MODEL: return updateSavedModel(state, action);
        case actionTypes.SELECT_MODEL: return selectModel(state, action);
        case actionTypes.SAVE_IN_PROGRESS: return saveInProgress(state);
        case actionTypes.SAVE_COMPLETE: return saveComplete(state);
        case actionTypes.LOAD_IN_PROGRESS: return loadInProgress(state);
        case actionTypes.LOAD_COMPLETE: return loadComplete(state);
        case actionTypes.RENAME_SAVED_MODEL: return renameSavedModel(state, action);
        default:
            return state;
    }
};

export default reducer;
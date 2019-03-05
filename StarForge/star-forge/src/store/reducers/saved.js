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

const addSavedModels = (state, action) => {
    return updateObject(state, {
        modelById: [ ...action.timestamps],
        modelByTimestamp: {
            ...action.payload
        }
      })
}

const removeSavedModel = (state, action) => {
    const prunedIds = state.modelById.filter(item => {
        return item !== action.timestamp // return all the items not matching the action.id
      })
    delete state.modelByTimestamp[action.timestamp] // delete the hash associated with the action.id
      
    return updateObject( state, {
        modelById: prunedIds,
        modelByTimestamp: initialState.modelByTimestamp
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

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_SAVED_MODAL: return openSavedModal(state);
        case actionTypes.CLOSE_SAVED_MODAL: return closeSavedModal(state);
        case actionTypes.ADD_SAVED_MODELS: return addSavedModels(state, action);
        case actionTypes.REMOVE_SAVED_MODEL: return removeSavedModel(state, action);
        case actionTypes.UPDATE_SAVED_MODEL: return updateSavedModel(state, action);
        default:
            return state;
    }
};

export default reducer;
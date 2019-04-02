import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
}

export const fetchModelFailed = () => {
    return {
        type: actionTypes.FETCH_MODEL_FAILED
    };
};

export const modelFinishedLoading = () => {
    return {
        type: actionTypes.MODEL_FINISHED_LOADING
    };
};

export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-my-burger-2b828.firebaseio.com/ingredients.json')
        .then(response => {
            console.log(response.data);
            dispatch(setIngredients(response.data));
        })
        .catch(error => {
            dispatch(fetchModelFailed());
        });
    };
};


import * as actionTypes from '../actionTypes';
import axios from 'axios';


const productsAPI = "";


export const fetchProducts = (callback) => dispatch => {

  axios.get(productsAPI)
    .then(res => {
      let { products } = res.data;

      if(!!callback) {
        callback();
      }

      return dispatch({
        type: actionTypes.FETCH_PRODUCTS,
        payload: products
      });

    })
    .catch(err => {
      console.log(err);
      throw new Error('Could not fetch products. Try again later.');
    });
}
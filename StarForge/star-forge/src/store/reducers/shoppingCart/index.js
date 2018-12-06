import { combineReducers } from 'redux';
import productReducer from './productReducer';
import floatCartReducer from './floatCartReducer';
import updateCartReducer from './updateCartReducer';
import cartReducer from './cart';


export default combineReducers({
  products: productReducer,
  cartProducts: floatCartReducer,
  cartTotals: updateCartReducer,
  cart: cartReducer
});
import { combineReducers } from 'redux';
import floatCartReducer from './floatCartReducer';
import updateCartReducer from './updateCartReducer';
import cartReducer from './cart';


export default combineReducers({
  cartProducts: floatCartReducer,
  cartTotals: updateCartReducer,
  cart: cartReducer
});
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import Client from 'shopify-buy';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import modelBuilderReducer from './store/reducers/modelBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import shoppingCartReducer from './store/reducers/shoppingCart'
import newStore from './store';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const rootReducer = combineReducers({
//     modelBuilder: modelBuilderReducer,
//     order: orderReducer,
//     auth: authReducer,
//     shoppingCart: shoppingCartReducer
// });

// const store = createStore(rootReducer, composeEnhancers(
//     applyMiddleware(thunk)

// ));

const store = newStore;

const client = Client.buildClient({
    storefrontAccessToken: '210a96f2a3cecb6c4a13fcba1c6438b8',
    domain: 'starforge.myshopify.com'
});
store.dispatch({type: 'CLIENT_CREATED', payload: client});
// buildClient() is synchronous, so we can call all these after!
client.product.fetchAll().then((res) => {
    store.dispatch({type: 'FETCH_PRODUCTS', payload: res});
  });
  client.checkout.create().then((res) => {
    store.dispatch({type: 'CHECKOUT_FOUND', payload: res});
  });
  client.shop.fetchInfo().then((res) => {
    store.dispatch({type: 'SHOP_FOUND', payload: res});
  });

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);



ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();

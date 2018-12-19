import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import Client from 'shopify-buy';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import newStore from './store';


const store = newStore;

const client = Client.buildClient({
    storefrontAccessToken: '7bc9d103a7ed2b545ea1441111961445',
    domain: 'starforge1.myshopify.com'
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

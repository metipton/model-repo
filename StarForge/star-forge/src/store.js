import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import modelBuilderReducer from './store/reducers/modelBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import shoppingCartReducer from './store/reducers/shoppingCart';
import savedHeroesReducer from './store/reducers/saved';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    modelBuilder: modelBuilderReducer,
    order: orderReducer,
    auth: authReducer,
    shoppingCart: shoppingCartReducer,
    savedModal: savedHeroesReducer
});

const newStore = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
    
export default newStore;



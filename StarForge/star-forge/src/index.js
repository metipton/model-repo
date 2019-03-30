import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import newStore from './store';



const store = newStore;

// Or Create your Own theme:
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6772e5'
            },
        secondary: {
            main: '#f6a4eb'
            },  
      },
      typography: {
        "fontFamily": "\"Griffos\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 16,
        "fontWeight": 'normal',
        "fontWeightLight": 100,
        "fontWeightRegular": 100,
        "fontWeightMedium": 100
       }
    },
  )

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>
);



ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();

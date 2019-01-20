import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import newStore from './store';
import { normalize } from 'path';


const store = newStore;

// Or Create your Own theme:
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#06437A'
            },
        secondary: {
            main: '#47494c'
            },  
      },
      typography: {
        "fontFamily": "\"Griffos\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 18,
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

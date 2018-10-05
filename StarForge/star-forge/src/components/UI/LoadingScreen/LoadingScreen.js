import React from 'react';

import classes from './LoadingScreen.css';
import Spinner from '../Spinner/Spinner';

const loadingScreen = () => (
    <div className={classes.LoadingScreen}>
        <Spinner />
    </div>
);

export default loadingScreen;

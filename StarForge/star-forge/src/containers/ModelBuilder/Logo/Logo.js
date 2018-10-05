import React from 'react';

import Logo from '../../../assets/Logo/Logo.png';
import classes from './Logo.css' ;

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={Logo} alt="Starforge" />
    </div>
);

export default logo;

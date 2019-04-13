import React from 'react';
import Aux from  '../../../../hoc/_Aux/_Aux'

import classes from './DrawerToggle.css';

const drawerToggle = (props) => (
    <Aux >
        <div className={classes.DrawerToggle} onClick={props.clicked}>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className={classes.Menu} onClick={props.clicked}>
            MENU
        </div>
    </Aux>
);

export default drawerToggle;
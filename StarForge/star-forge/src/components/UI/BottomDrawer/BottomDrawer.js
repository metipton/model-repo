import React from 'react';

import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './BottomDrawer.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/_Aux/_Aux';
import CloseButton from '../../../assets/Icons/close_white_24x24.png';

const bottomDrawer = ( props ) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')} >
                <img src={CloseButton} alt="close_button" className={classes.CloseButton} onClick={props.closed} />
                <nav className={classes.Nav}>
                    <NavigationItems />
                </nav>
            </div>
        </Aux>
    );
};

export default bottomDrawer;

import React from 'react';

import classes from './BackdropOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const backdropOrder = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}>
                    <FontAwesomeIcon className={classes.OrderInProgress} icon={['fas','spinner']} spin size="4x" />
                </div> : null
);

export default backdropOrder;
import React from 'react'
import classes from './ItemHeader.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ItemHeader = (props) => {
    let string = "items"
    if(props.numItems == 1){
        string = "item"
    }
    return (
        <div className={classes.container}>
            <p className={classes.Items}> {props.numItems} {string}</p>
            <p className={classes.Para}> shipping mode: <span style={{fontWeight:'bold', fontSize: '1rem'}}>{props.mode}</span></p>
        </div>
    )
}

export default ItemHeader;
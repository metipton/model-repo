import React from 'react'
import classes from './ItemHeader.css'

const ItemHeader = (props) => {
    let string = "items"
    if(props.numItems === 1){
        string = "item"
    }
    return (
        <div className={classes.container}>
            <p className={classes.Items}> {props.numItems} {string}</p>
            <p className={classes.Para}> shipping mode: <span style={{fontWeight:'bold', fontSize: '1rem'}}>{props.mode}</span></p>
            <p className={classes.Note}>Note :3-d printing typically adds 3-4 days to the delivery date</p>
        </div>
    )
}

export default ItemHeader;
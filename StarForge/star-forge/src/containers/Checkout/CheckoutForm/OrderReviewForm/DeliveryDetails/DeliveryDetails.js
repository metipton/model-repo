import React from 'react'
import classes from './DeliveryDetails.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DeliveryDetails = (props) => {
    let editIcon = null;
    if(props.allowEdit){
        editIcon = (
            <FontAwesomeIcon
                className={classes.edit} 
                icon={['fas', 'edit']} 
                size="1x" 
                onClick={props.edit}
                />
        )
    }

    return (
        <div className={classes.container}>
            <div>
                <p className={classes.Head}>Delivery Address</p>
                {editIcon}
            </div>
            <p className={classes.Para}>{props.address.shipping_name}, {props.address.shipping_address_line1},   
                {props.address.shipping_address_line2 ? props.address.shipping_address_line2: null} </p>
            <p className={classes.Para}> {props.address.shipping_address_city}, {props.address.shipping_address_state}, {props.address.shipping_address_zip}</p>
        </div>
    )
}

export default DeliveryDetails
import React from 'react'
import classes from './PriceTotalForm.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PriceTotalForm = (props) => {
    let string = "items"
    if(props.numItems === 1){
        string = "item"
    }
    return (
        <div className={classes.container}>
            <div className={classes.Head}>
                <FontAwesomeIcon className={classes.icon} icon={['fas', 'shopping-bag']} size="1x" />
                <p className={classes.numItems}> {props.numItems} {string}</p>
                <FontAwesomeIcon 
                                className={classes.edit} 
                                icon={['fas', 'edit']} 
                                size="1x"/>
            </div>
            <div className={classes.Items}>
                <p className={classes.Para}>Subtotal: <span style={{float: 'right', marginRight: '.5rem'}}>${props.subTotal}</span></p>
                <p className={classes.Para}>Shipping: <span style={{float: 'right', marginRight: '.5rem'}}>${props.shippingPrice}</span></p>
                <p className={classes.ParaSmall}>Total: <span style={{fontSize: '1.25rem', float: 'right', marginRight: '.5rem'}}>${(props.subTotal + props.shippingPrice).toFixed(2)}</span></p>
            </div>
        </div>
    )
}

export default PriceTotalForm;
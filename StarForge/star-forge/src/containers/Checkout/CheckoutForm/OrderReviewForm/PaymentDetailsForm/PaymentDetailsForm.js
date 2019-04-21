import React from 'react'
import classes from './PaymentDetailsForm.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PaymentDetailsForm = (props) => {

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

    let billingAddr = (props.equality ? <p style={{margin:'0', marginLeft: '.25rem'}}>Same as shipping address</p> 
        : <div style={{margin:'0', marginLeft: '.25rem'}}><p style={{margin:'0'}}>{props.addresses.billing_name}, {props.addresses.billing_address_line1},   
            {props.addresses.billing_address_line2 ? props.addresses.billing_address_line2: null} </p>
            <p style={{margin:'0', marginLeft: '.25rem'}}> {props.addresses.billing_address_city}, {props.addresses.billing_address_state}, {props.addresses.billing_address_zip}</p></div>);

    return (
        <div className={classes.container}>
            <div className={classes.Head}>
                <p className={classes.numItems}>Payment Details </p>
                {editIcon}
            </div>
            <div className={classes.Items}>
                <p style={{fontWeight: '600', fontSize: '1.25rem', marginTop: '.5rem', marginBottom:".25rem", marginLeft: '.25rem'}}>Credit Card</p>
                <img  style={{margin:'0', marginLeft: '.25rem'}} src={props.cardImg} alt="card_image" />
                <p style={{margin: '.1rem', marginLeft: '.25rem'}}>Card ending: <span style={{fontWeight: 'bold'}}>{props.cardData.last4}</span></p> 
                <p style={{margin: '0', marginLeft: '.25rem'}}>Expiration date: <span style={{fontWeight: 'bold'}}>{props.cardData.exp_month}/{props.cardData.exp_year}</span></p>
                <p style={{fontWeight: '600', fontSize: '1.25rem', marginTop: '.5rem', marginBottom:".1rem", marginLeft: '.25rem'}}>Billing Address</p>
                {billingAddr}
            </div>
        </div>
    )
}

export default PaymentDetailsForm;
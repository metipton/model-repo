import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux';
import {autoCheckoutTimeout} from '../../../../store/actions/index';
import classes from './OrderCompleteForm.css';

import DeliveryDetails from '../OrderReviewForm/DeliveryDetails/DeliveryDetails';
import ItemHeader from '../OrderReviewForm/ItemHeader/ItemHeader';
import ItemDescriptionCard from '../OrderReviewForm/ItemDescriptionCard/ItemDescriptionCard';
import PriceTotalForm from '../OrderReviewForm/PriceTotalForm/PriceTotalForm';
import PaymentDetailsForm from '../OrderReviewForm/PaymentDetailsForm/PaymentDetailsForm';

import visa from '../../../../assets/Thumbs/creditcards/visa.png';
import amex from '../../../../assets/Thumbs/creditcards/amex.png';
import defaultCard from '../../../../assets/Thumbs/creditcards/credit.png';
import diners from '../../../../assets/Thumbs/creditcards/diners.png';
import discover from '../../../../assets/Thumbs/creditcards/discover.png';
import mastercard from '../../../../assets/Thumbs/creditcards/mastercard.png';

class OrderReviewForm extends Component {
    state = {
        confirmedTOS: false
    }

    checkBillingEqualsShipping = () => {
        let addresses = this.props.addresses;
        if(addresses.billing_name === addresses.shipping_name && addresses.billing_address_country === addresses.shipping_address_country
            && addresses.billing_address_zip === addresses.shipping_address_zip && addresses.billing_address_city === addresses.shipping_address_city
            && addresses.billing_address_state === addresses.shipping_address_state){
                return true;
            }
        return false;
    }


    getCardImage = () => {
        if(this.props.cardData.brand === "Visa"){
            return visa;
        }
        if(this.props.cardData.brand === "MasterCard"){
            return mastercard;
        }
        if(this.props.cardData.brand === "Discover"){
            return discover;
        }
        if(this.props.cardData.brand === "American Express"){
            return amex ;
        }
        if(this.props.cardData.brand === 'Diners Club'){
            return diners;
        }
        return defaultCard;
    }

    render() {
        let addressEquality = this.checkBillingEqualsShipping();
        const defaultCard = this.getCardImage();
    return (
    <div className={classes.holder}>
        <h1 style={{marginLeft: '.25rem'}}>thanks for your order </h1>
        <p style={{fontSize: '1rem', marginTop: '.25rem', marginLeft: '.25rem'}}>order number: <span style={{fontweight: 'bold'}}></span></p>
        <p style={{fontSize: '1rem', marginTop: '.25rem', marginLeft: '.25rem'}}>confirmation email will be sent to: <span style={{fontweight: 'bold'}}></span></p>
        <p style={{fontSize: '1rem', marginTop: '.25rem', marginLeft: '.25rem'}}>expected delivery date: <span style={{fontweight: 'bold'}}></span></p>
        <FontAwesomeIcon 
                className={classes.escape} 
                icon={['fas', 'times-circle']} 
                size="1x" 
                onClick={this.props.close}/>
        <div className={classes.header}>
            <div className={classes.text}>

                <div className={classes.FlexContainer}>
                    <div className={classes.flexChild1}>
                        <DeliveryDetails 
                            allowEdit={false}
                            address={this.props.addresses}
                            edit={this.editInformation}/>
                        <ItemHeader numItems={this.props.numItems} mode={this.props.shippingMode}/>
                        {this.props.cart ? this.props.cart.map((item, index) => (
                            <ItemDescriptionCard
                                key={index}
                                image={item.image}
                                name={item.title}
                                description={item.description}
                                material={item.matType}
                                price={item.price}
                                />
                        )) : null}
                    </div>
                    <div className={classes.flexChild2}>
                        <PriceTotalForm
                            allowEdit={false}
                            shippingPrice={this.props.shippingPrice}
                            subTotal={this.props.subTotal}
                            numItems={this.props.numItems}
                        />
                        <PaymentDetailsForm 
                            allowEdit={false}
                            equality={addressEquality}
                            addresses={this.props.addresses}
                            cardData={this.props.cardData}
                            cardImg={defaultCard}
                            edit={this.editInformation}/>
                    </div>
                </div>
            </div>
        </div>  
    </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        cart: state.order.mostRecentCart,
        cardData: state.order.cardData,
        addresses: state.order.addresses,
        numItems: state.order.mostRecentTotals.item.productQuantity,
        shippingMode: state.order.mostRecentTotals.mode,
        shippingPrice: state.order.mostRecentTotals.shipping / 100,
        subTotal: state.order.orderResults.Cart.cartTotal
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        handleAutoCheckout: () => dispatch(autoCheckoutTimeout())
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(OrderReviewForm);
import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux';
import {autoCheckoutTimeout} from '../../../../store/actions/index';
import classes from './OrderReviewForm.css';

import MaterialUIButton from '../../../../components/UI/Button/MaterialUIButton'

import Checkbox from '@material-ui/core/Checkbox';
import DeliveryDetails from './DeliveryDetails/DeliveryDetails';
import ItemHeader from './ItemHeader/ItemHeader';
import ItemDescriptionCard from './ItemDescriptionCard/ItemDescriptionCard';
import PriceTotalForm from './PriceTotalForm/PriceTotalForm';
import PaymentDetailsForm from './PaymentDetailsForm/PaymentDetailsForm';

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

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        };

    checkBillingEqualsShipping = () => {
        let addresses = this.props.addresses;
        if(addresses.billing_name === addresses.shipping_name && addresses.billing_address_country === addresses.shipping_address_country
            && addresses.billing_address_zip === addresses.shipping_address_zip && addresses.billing_address_city === addresses.shipping_address_city
            && addresses.billing_address_state === addresses.shipping_address_state){
                return true;
            }
        return false;
    }

    editInformation = () => {
        this.props.handleAutoCheckout();
        this.props.close();
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
        <FontAwesomeIcon 
                className={classes.escape} 
                icon={['fas', 'times-circle']} 
                size="1x" 
                onClick={this.props.close}/>
        <div className={classes.header}>
            <div className={classes.text}>
                <h1 style={{marginLeft: '.25rem'}}>Review Your Order</h1>
                <p style={{fontSize: '1rem', marginTop: '.25rem', marginLeft: '.25rem'}}>Please check your delivery and payment details below before placing your order.</p>
                <div style={{fontSize: '1rem', marginLeft: '25%'}}>
                    <Checkbox
                        style={{display: 'inline-block', fontSize: '1rem'}}
                        checked={this.state.confirmedTOS}
                        onChange={this.handleChange('confirmedTOS')}
                        value="confirmedTOS"
                        color="primary"/>
                    <p style={{display: 'inline-block', fontSize: '1rem ', borderRight: '.05rem solid grey', paddingRight: '.65rem'}}>i accept the s&f terms and conditions</p>
                    <div style={{display: 'inline-block', fontSize: '1rem '}}>            
                        <MaterialUIButton
                            classes={{label : classes.buttonText}}
                            disabled={false}
                            variant="contained"
                            color="primary"
                            clicked={this.handleChange}>place order and pay
                        </MaterialUIButton>
                    </div>
                </div>
                <div className={classes.FlexContainer}>
                    <div className={classes.flexChild1}>
                        <DeliveryDetails 
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
                            shippingPrice={this.props.shippingPrice}
                            subTotal={this.props.subTotal}
                            numItems={this.props.numItems}
                        />
                        <PaymentDetailsForm 
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
        cart: state.shoppingCart.cartProducts.items,
        cardData: state.order.cardData,
        addresses: state.order.addresses,
        numItems: state.shoppingCart.cartTotals.item.productQuantity,
        shippingMode: state.shoppingCart.cartTotals.mode,
        shippingPrice: state.shoppingCart.cartTotals.shipping / 100,
        subTotal: state.shoppingCart.cartTotals.item.totalPrice
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        handleAutoCheckout: () => dispatch(autoCheckoutTimeout())
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(OrderReviewForm);
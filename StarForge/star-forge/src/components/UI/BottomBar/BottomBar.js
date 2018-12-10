import React, {Component} from 'react';
import {connect} from 'react-redux';

import classes from './BottomBar.css';
import MaterialUIButton from '../Button/AddToCartButton';
import Modal from '../Modal/Modal';
import * as actions from '../../../store/actions/index';


class BottomBar extends Component {

    handleAddToCart = () => {
        if( !this.props.isAuthenticated){
            this.props.openAuth();
        } else {
            this.props.addToCart();
        }
    }

    render (){

        const bottomBar = (
            <div className={classes.BottomBar}>
                <div className={classes.Checkout}>
                    <MaterialUIButton
                        variant="contained"
                        color="primary"
                        clicked={this.handleAddToCart}>Add to Cart</MaterialUIButton>
                </div>
            </div>
        );


        return (
            <div>
                {bottomBar}
                <Modal show={this.props.inCheckoutScreen} modalClosed={this.props.closeCheckout}>
                    <p> Checkout Form </p>
                </Modal>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        inCheckoutScreen: state.modelBuilder.inCheckoutScreen === true,
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAuth: () => dispatch(actions.authOpenModal()),
        openCheckout: () => dispatch(actions.checkoutOpenModal()),
        closeCheckout: () => dispatch(actions.checkoutCloseModal()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);

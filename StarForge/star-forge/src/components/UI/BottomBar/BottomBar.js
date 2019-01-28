import React, {Component} from 'react';
import {connect} from 'react-redux';

import classes from './BottomBar.css';
import MaterialUIButton from '../Button/AddToCartButton';
import * as actions from '../../../store/actions/index';
import Auth from '../../../containers/auth0/Auth';

class BottomBar extends Component {

    componentDidMount  () {
        // const auth = new Auth();
        // this.auth = auth;
    }

    handleAddToCart = () => {
        this.props.addToCart();
    }


    render (){

        let bottomBar = (
            <div className={classes.BottomBar}>
                <div className={classes.Checkout}>
                    <MaterialUIButton
                        disabled={false}
                        variant="contained"
                        color="primary"
                        clicked={this.handleAddToCart}>Add to Cart</MaterialUIButton>
                </div>
            </div>
        );

        if(this.props.addInProgress){
            bottomBar = (
                <div className={classes.BottomBar}>
                    <div className={classes.Checkout}>
                        <MaterialUIButton
                            disabled={true}
                            variant="contained"
                            color="primary"
                            clicked={this.handleAddToCart}>Adding to Cart</MaterialUIButton>
                    </div>
                </div>
            ); 
        }


        return (
            <div>
                {bottomBar}
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        inCheckoutScreen: state.modelBuilder.inCheckoutScreen === true,
        isAuthenticated: state.auth.idToken !== null,
        addInProgress: state.shoppingCart.cartProducts.addInProgress
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

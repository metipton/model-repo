import React, {Component} from 'react';
import {connect} from 'react-redux';

import classes from './BottomBar.css';
import MaterialUIButton from '../Button/AddToCartButton';


class BottomBar extends Component {

    componentDidMount  () {
        // const auth = new Auth();
        // this.auth = auth;
    }

    handleAddToCart = () => {
        this.props.addToCart();
    }


    render (){
        let addText = "Add to Cart     ($" + this.props.materialPrice + ")";
        let bottomBar = (
            <div className={classes.BottomBar}>
                <div className={classes.Checkout}>
                    <MaterialUIButton
                        disabled={false}
                        variant="contained"
                        color="primary"
                        clicked={this.handleAddToCart}>{addText}</MaterialUIButton>
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
        isAuthenticated: state.auth.idToken !== null,
        addInProgress: state.shoppingCart.cartProducts.addInProgress
    };
};



export default connect(mapStateToProps, null)(BottomBar);

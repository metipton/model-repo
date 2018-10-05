import React, {Component} from 'react';
import {connect} from 'react-redux';

import classes from './BottomBar.css';
import MaterialUIButton from '../Button/AddToCartButton';
import Modal from '../Modal/Modal';
import * as actions from '../../../store/actions/index';


class BottomBar extends Component {

    render (){

        const bottomBar = (
            <div className={classes.BottomBar}>
                <div className={classes.Checkout}>
                    <MaterialUIButton
                        variant="contained"
                        color="primary"
                        clicked={this.props.openCheckout}>Add to Cart</MaterialUIButton>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openCheckout: () => dispatch(actions.checkoutOpenModal()),
        closeCheckout: () => dispatch(actions.checkoutCloseModal()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from '../../Firebase';



import classes from './Toolbar.css';
import DrawerToggle from '../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle';
import MaterialUIButton from '../../components/UI/Button/MaterialUIButton';
//import AuthFormik from '../Auth/AuthFormik';
import Modal from '../../components/UI/Modal/Modal';
import * as actions from '../../store/actions/index';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ShoppingCart from '../../components/ShoppingCart/FloatCart';
import ShoppingCartIcon from '../../components/UI/ShoppingCartIcon/ShoppingCartIcon';

import Auth from '../auth0/Auth';


import shoppingCartImage from '../../assets/Icons/shopping_cart_white_24x24.png';

class Toolbar extends Component {

    state = {
        showShoppingCart: false
    }

    componentWillMount(){
        const auth = new Auth();
        this.auth = auth;
    }

    shoppingCartOpenHandler = () => {
    this.setState( { showShoppingCart: true } );
    }

    shoppingCartCloseHandler = () => {
    this.setState( { showShoppingCart: false } );
    }


    shoppingCartToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showShoppingCart: !prevState.showShoppingCart };
        } );
    }

    authLogin = () => {
        this.auth.login();
    }

    authLogout = () => {
        this.auth.logout();
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }

    StyledLoginUI = (uiConfig, firebaseAuth) => {
        return (
        <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebaseAuth}/>
        );
    }


//<img className={classes.toolbarItem} src={shoppingCartImage} alt='shopping_cart' onClick={this.ShoppingCartToggleHandler} />

    render (){
        let authSection = (
            <MaterialUIButton
                color="primary"
                clicked={this.authLogin}>Log In</MaterialUIButton>
        );

        if(this.props.isAuthenticated){
            authSection = (
                <div className={classes.Login}>
                    <div className={classes.toolbarItem}>{this.props.authEmail}</div>
                    <div>
                        <MaterialUIButton
                            color="primary"
                            clicked={this.authLogout}>Log Out</MaterialUIButton>
                    </div>
                    <div className={classes.toolbarItem}>
                        <ShoppingCartIcon
                            numItems={this.props.numCartItems}
                            showBadge={this.state.showShoppingCart}
                            clicked={this.shoppingCartToggleHandler}/>
                    </div>
                    <div>
                        <ShoppingCart
                            show={this.state.showShoppingCart}
                            open={this.shoppingCartOpenHandler}
                            close={this.shoppingCartCloseHandler} />
                    </div>
                </div>
            );
        }

        const toolbar = (
            <header className={classes.Toolbar}>
                <DrawerToggle clicked={this.props.drawerToggleClicked} />
                {authSection}
            </header>
        );


        return (
            <div>
                {toolbar}
                <Modal show={this.props.inCheckout} modalClosed={this.props.closeCheckout}>

                </Modal>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.accessToken !== null,
        authEmail: state.auth.email,
        inCheckout: state.shoppingCart.cart.inCheckout,
        checkoutURL: state.shoppingCart.cart.checkout.webUrl,
        numCartItems: state.shoppingCart.cartTotals.item.productQuantity
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        closeCheckout: () => dispatch(actions.exitCheckout()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

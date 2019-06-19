import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fbAuth} from '../../Firebase';

import classes from './Toolbar.css';
import DrawerToggle from '../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle';
import MaterialUIButton from '../../components/UI/Button/MaterialUIButton';

import {logout, exitCheckout, closeCart, openCart, toggleCart} from '../../store/actions/index';
import ShoppingCart from '../../components/ShoppingCart/FloatCart';
import ShoppingCartIcon from '../../components/UI/ShoppingCartIcon/ShoppingCartIcon';
import SocialMedia from '../../components/Navigation/NavigationItems/SocialMedia/SocialMedia';

import Auth from '../auth0/Auth';
  

class Toolbar extends Component {

    state = {
        showShoppingCart: false
    }

    componentWillMount(){
        const auth = new Auth();
        this.auth = auth;
    }

    shoppingCartOpenHandler = () => {
        this.props.openCart();
        //this.setState( { showShoppingCart: true } );
    }

    shoppingCartCloseHandler = () => {
        this.props.closeCart();
        //this.setState( { showShoppingCart: false } );
    }


    shoppingCartToggleHandler = () => {
        this.props.toggleCart();
        // this.setState( ( prevState ) => {
        //     return { showShoppingCart: !prevState.showShoppingCart };
        // } );
    }

    authLogin = () => {
        this.auth.login();
    }

    authLogout = () => {
        this.auth.logout();
        fbAuth.signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }


    render (){   
        
        let authSection = (
            <MaterialUIButton
                color="primary"
                clicked={this.authLogin}>Log In</MaterialUIButton>
        );

        if(this.props.isAuthenticated){
            authSection = (
                <div className={classes.Login}>
                    <div>
                        <MaterialUIButton
                            color="primary">
                            {this.props.authEmail}
                        </MaterialUIButton>
                    </div>
                    <div>
                        <MaterialUIButton
                            color="primary"
                            clicked={this.authLogout}>Log Out</MaterialUIButton>
                    </div>
                    <div className={classes.toolbarItem}>
                        <ShoppingCartIcon
                            numItems={this.props.numCartItems}
                            showBadge={this.props.isCartOpen}
                            clicked={this.shoppingCartToggleHandler}/>
                    </div>
                    <div>
                        <ShoppingCart
                            show={this.props.isCartOpen}
                            open={this.shoppingCartOpenHandler}
                            close={this.shoppingCartCloseHandler} />
                    </div>
                </div>
            );
        }

        const toolbar = (
            <header className={classes.Toolbar}>
                <DrawerToggle clicked={this.props.drawerToggleClicked} />
                <SocialMedia className={classes.socialMedia}/>
                {authSection}
            </header>
        );


        return (
            <div>
                {toolbar}
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isCartOpen: state.shoppingCart.cart.cartOpen,
        isAuthenticated: state.auth.accessToken !== null,
        authEmail: state.auth.email,
        inCheckout: state.shoppingCart.cart.inCheckout,
        checkoutURL: state.shoppingCart.cart.checkout.webUrl,
        numCartItems: state.shoppingCart.cartTotals.item.productQuantity
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        closeCheckout: () => dispatch(exitCheckout()),
        closeCart: () => dispatch(closeCart()),
        openCart: () => dispatch(openCart()),
        toggleCart: () => dispatch(toggleCart())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

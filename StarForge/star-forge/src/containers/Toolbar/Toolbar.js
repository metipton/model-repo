import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from '../../Firebase';


import classes from './Toolbar.css';
import DrawerToggle from '../../components/Navigation/SideDrawer/DrawerToggle/DrawerToggle';
import MaterialUIButton from '../../components/UI/Button/MaterialUIButton';
import AuthFormik from '../Auth/AuthFormik';
import Modal from '../../components/UI/Modal/Modal';
import * as actions from '../../store/actions/index';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ShoppingCart from '../../components/ShoppingCart/FloatCart';


import shoppingCartImage from '../../assets/Icons/shopping_cart_white_24x24.png';

class Toolbar extends Component {

    state = {
        showShoppingCart: false
    }

    shoppingCartOpenHandler = () => {
    this.setState( { showShoppingCart: true } );
    }

    shoppingCartCloseHandler = () => {
    this.setState( { showShoppingCart: false } );
    }


    ShoppingCartToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showShoppingCart: !prevState.showShoppingCart };
        } );
    }

    authLogout = () => {
        this.props.logout();
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




    render (){
        let authSection = (
            <MaterialUIButton
                variant="outlined"
                color="primary"
                clicked={this.props.openAuth}>Log In</MaterialUIButton>
        );

        if(this.props.isAuthenticated){
            authSection = (
                <div className={classes.Login}>
                    <div className={classes.toolbarItem}>{this.props.authEmail}</div>
                    <div>
                        <MaterialUIButton
                            variant="outlined"
                            color="primary"
                            clicked={this.authLogout}>Log Out</MaterialUIButton>
                    </div>
                    <div className={classes.toolbarItem}>
                        <img className={classes.toolbarItem} src={shoppingCartImage} alt='shopping_cart' onClick={this.ShoppingCartToggleHandler} />
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
                <Modal show={this.props.inAuthScreen} modalClosed={this.props.closeAuth}>
                    <AuthFormik loginUI={(uiConfig, firebaseAuth) =>this.StyledLoginUI(uiConfig, firebaseAuth)}  />
                </Modal>

            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        inAuthScreen: state.auth.inAuthScreen === true,
        authEmail: state.auth.email
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openAuth: () => dispatch(actions.authOpenModal()),
        closeAuth: () => dispatch(actions.authCloseModal()),
        logout: () => dispatch(actions.logout())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

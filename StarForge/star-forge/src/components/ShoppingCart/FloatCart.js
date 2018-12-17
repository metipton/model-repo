import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from '../../Firebase';
import 'firebase/storage';

import { connect } from 'react-redux';
import { loadCart, removeProduct } from '../../store/actions/shoppingCart/floatCartActions';
import { updateCart } from '../../store/actions/shoppingCart/updateCartActions';

import classes from './FloatCart.css';
import CartProduct from './CartProduct';
import util from './util';


class FloatCart extends Component {

  state = {
    isOpen: false,
  };

  componentWillMount() {
    //this.props.loadCart( JSON.parse(persistentCart().get()) || [] );
    this.pullCartFromFirebase();
  }

 

  componentDidMount() {
    setTimeout(() => {
      this.props.updateCart(this.props.cartProducts);
    }, 0);
    this.addProduct = this.addProduct.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }
  }

   pullCartFromFirebase = () => {
    let product = [];
    const cart = firebase.database().ref();
    const json = cart.child('Carts/' + this.props.userId);
    json.once("value").then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // childData will be the actual contents of the child
        product.push(childSnapshot.val());
      })
      console.log()
      for(let i = 0; i < product.length; i++){
        this.addProduct(product[i]);
      }
    });
  }

  openFloatCart = () => {
    this.props.open();
  }

  closeFloatCart = () => {
    this.props.close();
  }

  addProduct = (product) => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    // cartProducts.forEach(cp => {
    //   if (cp.id === product.id) {
    //     cp.quantity += product.quantity;
    //     productAlreadyInCart = true;
    //   }
    // });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);

  }

  removeProduct = (product) => {
    const { cartProducts, updateCart } = this.props;

    //remove 
    const storage = firebase.storage().ref();
    storage.child( '/Carts/' + this.props.userId + '/CartItem' + product.cartNumber + '/screenshot.png' ).delete();
    storage.child( '/Carts/' + this.props.userId + '/CartItem' + product.cartNumber + '/model.glb' ).delete();
    const database = firebase.database().ref('Carts/' + this.props.userId + '/Cart' + product.cartNumber );
    database.set(null);

    const index = cartProducts.findIndex(p => p.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
    }
  }

  proceedToCheckout = () => {
    const { totalPrice, productQuantity, currencyFormat, currencyId } = this.props.cartTotals;

    if (!productQuantity) {
      alert("Add some product in the bag!");
    }else {
      alert(`Checkout - Subtotal: ${currencyFormat} ${util.formatPrice(totalPrice, currencyId)}`);
    }
  }

  render() {
    const { cartTotals, cartProducts, removeProduct } = this.props;

    const products = cartProducts.map(p => {
      return (
        <CartProduct
          product={p}
          removeProduct={removeProduct}
          key={p.id}
        />
      );
    });

    let floatClass = [classes['float-cart']];

    if (!!this.props.show) {
      floatClass.push(classes['float-cart--open']);
    }

    return (
      <div className={floatClass.join(' ')}>
        {/* If cart open, show close (x) button */}
        {this.props.show && (
          <div
            onClick={() => this.closeFloatCart()}
            className={classes['float-cart__close-btn']}
          >
          X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.props.show && (
          <span
            onClick={() => this.openFloatCart()}
            className={classes['bag bag--float-cart-closed']}
          >
            <span className={classes['bag__quantity']}>{cartTotals.productQuantity}</span>
          </span>
        )}

        <div className={classes['float-cart__content']}>
          <div className={classes['float-cart__header']}>
            <span className={classes['bag']}>
              <span className={classes['bag__quantity']}>
                {cartTotals.productQuantity}
              </span>
            </span>
            <span className={classes['header-title']}>Bag</span>
          </div>

          <div className={classes['float-cart__shelf-container']}>
            {products}
            {!products.length && (
              <p className={classes['shelf-empty']}>
                Add some product in the bag <br />:)
              </p>
            )}
          </div>

          <div className={classes['float-cart__footer']}>
            <div className={classes['sub']}>SUBTOTAL</div>
            <div className={classes['sub-price']}>
              <p className={classes['sub-price__val']}>
                {`${cartTotals.currencyFormat} ${util.formatPrice(cartTotals.totalPrice, cartTotals.currencyId)}`}
              </p>
            </div>
            <div onClick={() => this.proceedToCheckout()} className={classes['buy-btn']}>
              Checkout
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FloatCart.propTypes = {
  loadCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  cartProducts: PropTypes.array.isRequired,
  newProduct: PropTypes.object,
  removeProduct: PropTypes.func,
  productToRemove: PropTypes.object,
};

const mapStateToProps = state => ({
  cartProducts: state.shoppingCart.cartProducts.items,
  newProduct: state.shoppingCart.cartProducts.item,
  productToRemove: state.shoppingCart.cartProducts.itemToRemove,
  cartTotals: state.shoppingCart.cartTotals.item,
  userId: state.auth.userId,
});

export default connect(mapStateToProps, { loadCart, updateCart, removeProduct})(FloatCart);

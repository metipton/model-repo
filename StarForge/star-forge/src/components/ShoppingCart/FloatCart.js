import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {fbDatabase} from '../../Firebase';

import { connect } from 'react-redux';
import { loadShipping, loadCart, removeProduct, enterCheckout } from '../../store/actions/shoppingCart/floatCartActions';
import { updateShipping,updateCart } from '../../store/actions/shoppingCart/updateCartActions';
import {purchaseModelSuccess, purchaseModelFail, purchaseModelStart} from '../../store/actions/order'
import CheckoutStepper from '../../containers/Checkout/CheckoutStepper';
import ShippingSelector from './ShippingSelector/ShippingSelector'

import classes from './FloatCart.css';
import CartProduct from './CartProduct';
import util from './util';


class FloatCart extends Component {

  state = {
    isOpen: false,
  };

  componentWillMount() {
    this.pullCartFromFirebase();
    this.pullShippingFromFirebase();
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
    const cart = fbDatabase.ref();
    const json = cart.child('users/' + this.props.userId + '/Cart/Items');
    json.once("value").then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // childData will be the actual contents of the child
        product.push(childSnapshot.val()); 
      })
      for(let i = 0; i < product.length; i++){
        this.addProduct(product[i]);
      }   
    });
  }

  pullShippingFromFirebase = () => {
    let shipping = [];

    const cart = fbDatabase.ref();
    const json = cart.child('Prices/Shipping');
    json.once("value").then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // childData will be the actual contents of the child
        let key = childSnapshot.key;
        let value = childSnapshot.val();
        let mode = {"mode": key, "price": value}
        shipping.push(mode);
      }) 
      let price = Number.POSITIVE_INFINITY;
      let mode;
      for(var option in shipping){
        if(shipping[option]['price'] < price){
          price = shipping[option]['price'];
          mode = shipping[option]['mode'];
        }
      }

      this.props.updateShipping(this.props.userId, mode, price);
      this.props.loadShipping(shipping);
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

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);

  }

  removeProduct = async (product) => {
    const { cartProducts, updateCart } = this.props;

    const database = fbDatabase.ref('users/' + this.props.userId + '/Cart/Items/' + product.cartNumber );
    await database.set(null);
    const index = cartProducts.findIndex(p => p.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      await updateCart(cartProducts);
    }
  }

  resetShoppingCart = async () => {
    const { cartProducts, updateCart } = this.props;

    this.props.purchaseModelSuccess(this.props.userId);
    cartProducts.splice(0, this.props.cartProducts.length);
    await updateCart(cartProducts);
  }

  proceedToCheckout = () => {
    const {productQuantity} = this.props.cartTotals;
    // Create an empty checkout
    if (!productQuantity) {
      alert("Add some product in the bag!");
    }else {
      this.props.close();
      this.props.enterCheckout();
    }
  }

  render() {
    const { cartTotals, cartProducts, removeProduct } = this.props;

    let shippingDetails;
    if(shippingDetails !== undefined && shippingDetails !== null){

    }
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
            <span className={classes['header-title']}>Cart</span>
          </div>

          <div className={classes['float-cart__shelf-container']}>
            {products}
            {!products.length && (
              <p className={classes['shelf-empty']}>
                Add a model to your cart <br />
              </p>
            )}
          </div>

          <div className={classes['float-cart__footer']}>
          <div className={classes['sub']}>SHIPPING</div>
            <div className={classes['sub-price']}>
              <p className={classes['sub-price__val']}>
                {`${cartTotals.currencyFormat} ${util.formatPrice(this.props.cartEmpty ? 0 : this.props.shippingPrice / 100, cartTotals.currencyId)}`}
              </p>
            </div>
            <ShippingSelector/>
            <div className={classes['sub']}>TOTAL</div>
            <div className={classes['sub-price']}>
              <p className={classes['sub-price__val']}>
                {`${cartTotals.currencyFormat} ${util.formatPrice(this.props.cartEmpty? 0 : cartTotals.totalPrice + this.props.shippingPrice / 100, cartTotals.currencyId)}`}
              </p>
            </div>
            <div className={classes['buy-btn']}>
                <CheckoutStepper
                  disabled={this.props.cartEmpty}
                  checkout={()=> this.proceedToCheckout()}
                  resetCart={this.resetShoppingCart}
                  closeCart={this.closeFloatCart}/>
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
  inCheckout: state.shoppingCart.cart.inCheckout,
  cartEmpty: state.shoppingCart.cartTotals.item.productQuantity === 0,
  shippingPrice: state.shoppingCart.cartTotals.shipping,
  shippingDetails: state.shoppingCart.cartProducts.shipping
});




export default connect(mapStateToProps, { updateShipping, loadShipping, loadCart, updateCart, removeProduct, enterCheckout, purchaseModelStart, purchaseModelSuccess, purchaseModelFail})(FloatCart);

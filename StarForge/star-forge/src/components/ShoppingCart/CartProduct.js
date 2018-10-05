import React, { Component } from 'react';
import PropTypes from "prop-types";

import Thumb from "./Thumb";
import classes from './FloatCart.css';
import util from './util';


class CartProduct extends Component {

  state = {
    isMouseOver: false,
  }

  handleMouseOver = () => {
    this.setState({isMouseOver: true});
  }

  handleMouseOut = () => {
    this.setState({isMouseOver: false});
  }


  render(){
    const { product, removeProduct } = this.props;

    const cartClasses = classes['shelf-item'];

    if(!!this.state.isMouseOver){
      cartClasses.push(classes['shelf-item--mouseover']);
    }

    return (
      <div className={cartClasses.join(" ")}>
        <div
          className={classes['shelf-item__del']}
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
          onClick={() => removeProduct(product)}
        />
    <div className={classes['shelf-item__details']}>
          <p className={classes['title']}>{product.title}</p>
          <p className={classes['desc']}>
            {`${product.availableSizes[0]} | ${product.style}`} <br />
            Quantity: {product.quantity}
          </p>
        </div>
        <div className={classes['shelf-item__price']}>
          <p>{`${product.currencyFormat}  ${util.formatPrice(product.price)}`}</p>
        </div>

        <div className={classes['clearfix']} />
      </div>
    );
  }
}


CartProduct.propTypes = {
  product: PropTypes.object.isRequired,
  removeProduct: PropTypes.func.isRequired,
};

export default CartProduct;

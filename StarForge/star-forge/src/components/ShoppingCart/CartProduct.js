import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {fbStorage} from '../../Firebase';


import classes from './FloatCart.css';

import Thumb from "./Thumb/Thumb";
import util from './util';


class CartProduct extends Component {

  state = {
    isMouseOver: false,
    thumbnail: null,
    largeThumbnail: null
  }

  handleMouseOver = () => {
    this.setState({isMouseOver: true});
  }

  handleMouseOut = () => {
    this.setState({isMouseOver: false});
  }

  componentDidMount() {
    this.getThumbnail();
    this.getLargeThumbnail();
 }

  getThumbnail = () => {
    const storage = fbStorage.ref();
    storage.child('/Carts/' + this.props.userId + '/CartItem' + this.props.product.cartNumber + '/screenshot-sm.png').getDownloadURL().then((url) => {
      this.setState({
        ...this.state,
        thumbnail: url
      })
    })
  }

  getLargeThumbnail = () => {
    const storage = fbStorage.ref();
    storage.child('/Carts/' + this.props.userId + '/CartItem' + this.props.product.cartNumber + '/screenshot-lg.png').getDownloadURL().then((url) => {
      this.setState({
        ...this.state,
        largeThumbnail: url
      })
    })
  }

  render(){
    const { product, removeProduct } = this.props;
    let cartClasses = 'shelf-item';

    if(!!this.state.isMouseOver){
      cartClasses = 'cartRemoveHover';
    }

    let image = null;
    if( this.state.thumbnail ) {
      image =  <Thumb
                classes={classes["shelf-item__thumb"]}
                src={this.state.thumbnail}
                alt={product.title}
                lgSrc={this.state.largeThumbnail}
                cartNum={this.props.product.cartNumber}
                />
    }

    return (
      <div className={classes[cartClasses]}>
        <div
          className={classes['shelf-item__del']}
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
          onClick={() => removeProduct(product)}
        />
        {image}
        <div className={classes['shelf-item__details']}>
          <p className={classes['title']}>{product.title}</p>
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

const mapStateToProps = state => {
  return {
      currentCart: state.shoppingCart.cartProducts.items,
      userId: state.auth.userId,
  };
};


export default connect(mapStateToProps, null)(CartProduct);

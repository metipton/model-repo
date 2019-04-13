import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {updateShipping} from  '../../../store/actions/index';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  container: {
      display: 'inline-block'
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  group: {

  },
  selector: {
      height: '1.25rem'
  }
});

class ShippingSelector extends React.Component {

  handleChange = (event) => {
    let price;
    for(var mode in this.props.shipping){
        if(this.props.shipping[mode]['mode'] === event.target.value){
            price = this.props.shipping[mode]['price'];
        }
    }
    this.props.updateShipping(event.target.value, price);
  };

  render() {
    const { classes } = this.props;
    let shippingDetails;
    if(this.props.shipping){
        shippingDetails = this.props.shipping
    }  
    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="Shipping Method"
            name="shippingMethod"
            className={classes.group}
            value={this.props.currentMode}
            onChange={this.handleChange}
          >
          {shippingDetails ? shippingDetails.map((detail) => (
            <FormControlLabel
                key={detail.mode}
                className={classes.selector}
                value={detail.mode}
                control={<Radio  checked={detail.mode===this.props.currentMode} key={detail.mode} color="primary" />}
                label={detail.mode + ' - $' + detail.price}/>

            )) : null}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}


const mapStateToProps = state => {
    return {
        shipping: state.shoppingCart.cartProducts.shipping,
        currentPrice: state.shoppingCart.cartTotals.shipping,
        currentMode: state.shoppingCart.cartTotals.mode
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        updateShipping: (shippingMode, ShippingPrice) => dispatch(updateShipping(shippingMode, ShippingPrice))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShippingSelector));
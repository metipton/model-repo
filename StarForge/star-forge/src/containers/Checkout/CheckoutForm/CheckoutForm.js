import React from 'react'
import {connect} from 'react-redux';
import {closeOrderModal} from '../../../store/actions/index';

import OrderReviewForm from './OrderReviewForm/OrderReviewForm';
import OrderCompleteForm from './OrderCompleteForm/OrderCompleteForm';

class CheckoutForm extends React.Component {


  render() {
    let screen;
    if(this.props.orderState === 'Review'){
        screen = (
            <div>
                <OrderReviewForm close={this.props.closeOrderModal}/>
            </div>
            );
    } else {
        screen = (
            <div>
                <OrderCompleteForm close={this.props.closeOrderModal}/>
            </div>
        );
    }
    return (
      <div>
          {screen}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
      orderState: state.order.orderState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeOrderModal: () => dispatch(closeOrderModal())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);

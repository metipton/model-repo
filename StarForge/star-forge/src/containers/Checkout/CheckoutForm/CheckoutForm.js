import React from 'react'
import {connect} from 'react-redux';
import {closeOrderModal} from '../../../store/actions/index';
import OrderReviewForm from './OrderReviewForm/OrderReviewForm';
import OrderCompleteForm from './OrderCompleteForm/OrderCompleteForm';


class CheckoutForm extends React.Component {


  render() {
    let orderReviewForm = (
      <div>
          <OrderReviewForm close={this.props.closeOrderModal}/>
      </div>
      );

    let orderCompleteForm = (
            <div>
                <OrderCompleteForm close={this.props.closeOrderModal}/>
            </div>
    );
    return (
      <div>
          {this.props.orderState === "Review" || this.props.orderState === "Pending" ? orderReviewForm : null}
          {this.props.orderState === "Complete" ? orderCompleteForm : null}
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

import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    header: {
        width: '100%',
        borderTop: '.05rem solid black',
    },
    logo: {
        height: '3rem'
    },   
    text: {
        marginLeft: '.25rem'
    },
    escape: {
        color: '#696969',
        top: '.3rem',
        right: '.3rem',
        position: 'absolute',
        cursor: 'pointer',
        zIndex: 101,
        '&:hover': {
            color: 'black',
          }
      },   

})

class OrderReviewForm extends Component {
  render() {
    return (
    <div>
        <div className={this.props.classes.logo}>
            <FontAwesomeIcon 
                    className={this.props.classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.close}/>
        </div>
        <div className={this.props.classes.header}>
            <div className={this.props.classes.text}>
                <h1>Place Your Order</h1>
                <p>Please check your delivery and payment details below before placing your order.</p>
            </div>
        </div>  
    </div>
    )
  }
}

export default withStyles(styles)(OrderReviewForm);
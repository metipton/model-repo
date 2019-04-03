import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles';
import MaterialUIButton from '../../../../components/UI/Button/MaterialUIButton'

import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    header: {
        width: '100%',
        borderTop: '.05rem solid black',
    },
    logo: {
        textAlign: 'center',
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
    buttonText: {
        fontSize: '.8rem'
    }  

})

class OrderReviewForm extends Component {
    state = {
        confirmedTOS: false
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        };

    render() {
    return (
    <div>
        <div className={this.props.classes.logo}>
            <p>1. Delivery > 2. Payment > <span style={{fontWeight: 'bold'}}>3. Place Order</span></p>
            <FontAwesomeIcon 
                    className={this.props.classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.close}/>
        </div>
        <div className={this.props.classes.header}>
            <div className={this.props.classes.text}>
                <h1>Place Your Order</h1>
                <p style={{fontSize: '1rem'}}>Please check your delivery and payment details below before placing your order.</p>
                <div style={{fontSize: '1rem', marginLeft: '25%'}}>
                    <Checkbox
                        style={{display: 'inline-block', fontSize: '1rem'}}
                        checked={this.state.confirmedTOS}
                        onChange={this.handleChange('confirmedTOS')}
                        value="confirmedTOS"
                        color="primary"/>
                    <p style={{display: 'inline-block', fontSize: '1rem ', borderRight: '.05rem solid grey', paddingRight: '.65rem'}}>i accept the s&f terms and conditions</p>
                    <div style={{display: 'inline-block', fontSize: '1rem '}}>            
                        <MaterialUIButton
                            classes={{label : this.props.classes.buttonText}}
                            disabled={false}
                            variant="contained"
                            color="primary"
                            clicked={this.handleChange}>place order and pay
                        </MaterialUIButton>
                    </div>
                </div>
            </div>
        </div>  
    </div>
    )
    }
}

export default withStyles(styles)(OrderReviewForm);
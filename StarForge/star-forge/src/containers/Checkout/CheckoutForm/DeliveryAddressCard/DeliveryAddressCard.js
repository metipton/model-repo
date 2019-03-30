// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import classes from './DeliveryAddressCard.css';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button,
} from 'reactstrap';


class DeliveryAddressCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      address : {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
      }
    }
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
      console.log('Received Stripe token:', token);
    });
  };


    handleAddressChange = (evt) => {
      evt.preventDefault()
      const address = this.state.address
      address[evt.target.name] = evt.target.value
      this.setState({address})
    }

    handleNameChange = (evt) => {
      evt.preventDefault()
      const name = this.state.name
      name[evt.target.name] = evt.target.value
      this.setState({name})
    }

    handleAddressChange = (evt) => {
      evt.preventDefault()
      const address = this.state.address
      address[evt.target.name] = evt.target.value
      this.setState({address})
    }

    handleAddressChange = (evt) => {
      evt.preventDefault()
      const address = this.state.address
      address[evt.target.name] = evt.target.value
      this.setState({address})
    }

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', owner: {
    //   name: 'Jenny Rosen'
    // }});


  render() {
      const state = this.state
      const submittable =  state.name && address.line1 && address.city && address.state && address.country && address.postal_code;
      const fetching = state.fetching
      const address = state.address

      return (
        <div className={classes.Container}>
          <form>
            <fieldset className={classes.fieldset}>
              <div className={classes.row}>
                <label htmlFor="name" data-tid="form.name+placeholder">Name</label>
                <input id="example1-name" data-tid="form.name+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="address1" data-tid="form.address1+placeholder">Address 1</label>
                <input id="address1" data-tid="form.address1+placeholder" type="text" placeholder="123 My Place" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="address2" data-tid="form.address2+placeholder">Address 2</label>
                <input id="address2" data-tid="form.address2+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="city" data-tid="form.city+placeholder">City</label>
                <input id="city" data-tid="form.city+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="state" data-tid="form.state+placeholder">State</label>
                <input id="state" data-tid="form.state+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="country" data-tid="elements_examples.form.name_label">Country</label>
                <input id="country" data-tid="form.country+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
              <div className={classes.row}>
                <label htmlFor="zipcode" data-tid="elements_examples.form.name_label">Zip Code</label>
                <input id="zipcode" data-tid="form.zipcode+placeholder" type="text" placeholder="Enter your name" required autoComplete="name"></input>
              </div>
            </fieldset>
          </form>
        </div>
      )
  
  }
}

export default injectStripe(DeliveryAddressCard);
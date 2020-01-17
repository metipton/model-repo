import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {connect} from 'react-redux';
import {fbAuth} from '../../../Firebase'
import FirebaseAuth from '../FirebaseAuth'
import {authCloseModal, setFirebaseUIWidget} from '../../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalAuth from '../AuthModal/ModalAuth'
import { CompressedPixelFormat } from 'three';



const styles = () => ({
  AuthForm: {
    boxSizing: 'border-box',
    display: 'block',
    justifyContent: 'space-between',
    textAlign: 'center',
    height: '94%',
    width: '100%',
    marginTop: '3rem' ,
  },
  escape: {
    color: '#696969',
    top: '.3rem',
    right: '.2rem',
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 101,
    '&:hover': {
        color: 'black',
      }
    }
});

class AuthForm extends Component {
    state = {
        uiInstance : null
    }

    constructor(){
        super()
        this.firebaseAuth = new FirebaseAuth();
        this.buttons = (                       
            <StyledFirebaseAuth
                uiCallback={ui => this.loginCallback(ui)}     
                uiConfig={this.firebaseAuth.uiConfig}
                firebaseAuth={fbAuth}/>)
    }

    loginCallback = (input) => {
        //initialize the firebaseuiInstance in the FirebaseAuth class, so that it can be reset on opening
        this.props.setFirebaseUIWidget(input)
    }

    closeLogInHandler = () => {
        this.props.closeLogInModal()
    }

    render() {
        const { classes } = this.props;
        return (                
            <ModalAuth show={this.props.logInModalOpen}>
                <div className={classes.Authform}>
                    <FontAwesomeIcon 
                        className={classes.escape} 
                        icon={['fas', 'times-circle']} 
                        size="1x" 
                        onClick={this.closeLogInHandler}/>
                    <div>
                        {this.buttons}
                    </div>
                </div>
            </ModalAuth>
        )
    }
}

const mapStateToProps = state => {
  return {
    logInModalOpen: state.auth.inAuthScreen,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeLogInModal: () => dispatch(authCloseModal()),
    setFirebaseUIWidget: (widget) => dispatch(setFirebaseUIWidget(widget))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AuthForm));


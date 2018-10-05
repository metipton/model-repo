import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as firebaseui from 'firebaseui'

import { withFormik} from 'formik';
import * as Yup from 'yup';
import firebase from '../../Firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import classes from'./AuthFormik.css';
import * as actions from '../../store/actions/index';
import Divider from '@material-ui/core/Divider';


class Auth extends Component {
    state = {
        ui : null,
        uiConfig : {
            credentialHelper: firebaseui.auth.CredentialHelper.None,
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            callbacks: {
                signInSuccessWithAuthResult: (authResult) =>  this.socialSubmitHandler(authResult.credential.accessToken, authResult.user.uid, authResult.user.email)
            },

        }
    }



    componentDidMount = () => {
        this.setState({ui : new firebaseui.auth.AuthUI(firebase.auth())});
    }

    socialSubmitHandler =(accessToken, userId, email) => {
        this.state.ui.reset();
        //this.state.ui.start('#firebaseui-auth-container', this.state.uiConfig);
        console.log(this.state.ui);
        this.props.socialAuth(accessToken, userId, email);
    }


    submitHandler = (event, email, password, isSignup) => {
        event.preventDefault();
        this.props.onAuth(email, password, isSignup);
    }

    render() {
        const LoginForm = props => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleBlur,
              } = props;
              return (
                <form onSubmit={(event) => this.submitHandler(event, values.loginEmail, values.loginPassword, false)}>
                  <label className={classes.Label} htmlFor="email" style={{ display: 'block' }}>
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    placeholder="Enter your email"
                    type="text"
                    value={values.loginEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.loginEmail && touched.loginEmail ? 'text-input error' : 'text-input'}
                  />
                  {errors.loginEmail &&
                  touched.loginEmail && <div className={classes.inputFeedback}>{errors.loginEmail}</div>}
                  <label className={classes.Label} htmlFor="password" style={{ display: 'block' }}>
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    placeholder="Enter your password"
                    type="password"
                    value={values.loginPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.loginPassword && touched.loginPassword ? 'text-input error' : 'text-input'}
                  />
                  {errors.loginPassword &&
                  touched.loginPassword && <div className={classes.inputFeedback}>{errors.loginPassword}</div>}
                  <button variant="contained" color="primary" className={classes.button} type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </form>
              );
          };

          const EnhancedLoginForm = withFormik({
              mapPropsToValues: () => (
                  { loginEmail: '',
                    loginPassword: '' }),
              validationSchema: Yup.object().shape({
                email: Yup.string().email('Invalid email address').required('Email is required'),
                password: Yup.string().min(6, 'Password must be 6 characters or longer').required('Password is required')
              }),
              handleSubmit: (values, { setSubmitting }) => {
                  this.submitHandler(values.email, values.password, false);
              },
              displayName: 'BasicForm', // helps with React DevTools
          })(LoginForm);

        const loginForm = (
            <div><EnhancedLoginForm /></div>
          );

          const SignupForm = props => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                } = props;
                return (
                  <form onSubmit={(event) => this.submitHandler(event, values.signupEmail, values.signUpPassword, true)}>
                    <label className={classes.Label} htmlFor="email" style={{ display: 'block' }}>
                      Email
                    </label>
                        <input
                          id="signupEmail"
                          placeholder="Enter your email"
                          type="text"
                          value={values.signupEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.signupEmail && touched.signupEmail ? 'text-input error' : 'text-input'}
                        />
                    { (this.props.error !== null && this.props.error.message === 'EMAIL_EXISTS') ?
                        <div className={classes.inputFeedback}>A user with that email address already exists</div> :
                        errors.signupEmail &&
                        touched.signupEmail && <div className={classes.inputFeedback}>{errors.signupEmail}</div>}
                    <label className={classes.Label} htmlFor="password" style={{ display: 'block' }}>
                      Password
                    </label>
                        <input
                          id="signUpPassword"
                          placeholder="Enter your password"
                          type="password"
                          value={values.signUpPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.signUpPassword && touched.signUpPassword ? 'text-input error' : 'text-input'}
                        />

                    {errors.signUpPassword && touched.signUpPassword &&
                            <div className={classes.inputFeedback}>{errors.signUpPassword}</div>}


                    <label className={classes.Label} htmlFor="passwordConfirm" style={{ display: 'block' }}>
                      Confirm Password
                    </label>
                    <input
                      id="passwordConfirm"
                      placeholder="Confirm your password"
                      type="password"
                      value={values.passwordConfirm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.passwordConfirm && touched.passwordConfirm ? 'text-input error' : 'text-input'}
                    />
                    {errors.passwordConfirm &&
                    touched.passwordConfirm && <div className={classes.inputFeedback}>{"Passwords don't match"}</div>}
                    <button variant="contained" color="primary" className={classes.button} type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </form>
                );
            };

            const EnhancedSignupForm = withFormik({
                mapPropsToValues: () => (
                    { signupEmail: '',
                      signUpPassword: '',
                      passwordConfirm: '' }),
                validationSchema: Yup.object().shape({
                  email: Yup.string().email('Invalid email address').required('Email is required'),
                  password: Yup.string().min(6, 'Password must be 6 characters or longer').required('Password is required'),
                  passwordConfirm: Yup.string().oneOf([Yup.ref('signUpPassword'), "Passwords don't match"]).required('Password confirm is required')
                }),
                handleSubmit: (values, { setSubmitting }) => {
                    this.submitHandler(values.email, values.password, true);
                },
                displayName: 'BasicForm', // helps with React DevTools
            })(SignupForm);

          const signupForm = (
              <div><EnhancedSignupForm /></div>
            );


        return (
            <div className={classes.AuthContainer}>
                <div>
                    {this.props.loginUI(this.state.uiConfig, firebase.auth())}
                </div>

                <div className={classes.DividerContainer}>
                    <Divider absolute={false} width="47%" />
                    <span>or</span>
                    <Divider absolute={false} width="47%" />
                </div>

                <div className={classes.Container}>
                    <div className={classes.FormContainer}>
                        <p>Log In </p>
                        {loginForm}
                    </div>
                    <div className={classes.FormContainer}>
                        <p>Register</p>
                        {signupForm}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        socialAuth: (token, userId, email) => dispatch(actions.socialAuth(token, userId, email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

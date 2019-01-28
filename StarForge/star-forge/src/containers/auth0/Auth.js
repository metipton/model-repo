// src/Auth/Auth.js
import auth0 from 'auth0-js';
import * as actions from '../../store/actions/index';
import decode from 'jwt-decode';
import newStore from '../../store.js';

class Auth {

  
  constructor() {
    this.accessToken = null;
    this.userId = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.email = null;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.setSession = this.setSession.bind(this);
    this.store = newStore;
  }

  auth0 = new auth0.WebAuth({
    domain: 'starforge.auth0.com',
    clientID: '3B3sGylxcV2tLMmN-gHSvTpeNhAsvrwv',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid email profile',
  });

  login = (callback) => {
    var that = this;
    that.callback = callback;
    this.auth0.popup.authorize({
        redirectUri: 'http://localhost:3000/callback',
        owp: true
    }, function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            that.setSession(authResult);
            console.log(that.callback);
            typeof callback === 'function' && callback();
          } else if (err) {
            console.log(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
          }
    });
  }

  getProfile = (idToken) => {
    this.email = decode(idToken).email;
    console.log(this.email);
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.email = null;
    this.userId = null;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.store.dispatch(actions.logout());
    this.store.dispatch(actions.resetCart());
    // navigate to the home route
  }


  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    const decodedResult = decode(authResult.idToken);
    this.email = decodedResult.email;
    this.userId = decodedResult.sub;
    console.log(decode(authResult.idToken));
    this.store.dispatch(actions.socialAuth(this.accessToken, this.userId, this.idToken, this.expiresAt, this.email));

  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}
 

export default Auth;
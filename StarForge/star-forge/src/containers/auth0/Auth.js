// src/Auth/Auth.js
import auth0 from 'auth0-js';
import {logout, resetCart, socialAuth} from '../../store/actions/index';
import decode from 'jwt-decode';
import newStore from '../../store.js';
import {fbAuth} from '../../Firebase';

class Auth {

  
  constructor() {
    this.accessToken = null;
    this.userId = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.email = null;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.setSession = this.setSession.bind(this);
    this.store = newStore;
  }

  auth0 = new auth0.WebAuth({
    domain: 'starforge.auth0.com',
    audience: 'https://starforge.auth0.com/userinfo',
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
    }, async (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
            const firebaseToken = await that.getFirebaseToken(authResult.idToken);
            if(firebaseToken.err !== undefined){
              that.logout();
              return;
            }
            await fbAuth.signInWithCustomToken(firebaseToken['firebaseToken']).catch(function(error) {
              // Handle Errors here.
              console.log(error.message)
              // ...
            });
            that.setSession(authResult, firebaseToken);
            typeof callback === 'function' && callback();
        } else if (err) {
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
        }
    });
  }

  getFirebaseToken = (token) => {
    const url = "https://us-central1-starforge-153cc.cloudfunctions.net/getFirebaseAuth?token=" + token;
    return new Promise( ( resolve, reject ) => {
        fetch(url)
            .then((response) => {
                resolve(response.json())
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        })
}

  getProfile = (idToken) => {
    this.email = decode(idToken).email;;
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.email = null;
    this.userId = null;
    this.fbToken = null;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('fbToken');
    localStorage.removeItem('fbExpiry');
    this.store.dispatch(logout());
    this.store.dispatch(resetCart());
    // navigate to the home route
  }



  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult, firebaseToken) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.fbToken = firebaseToken['firebaseToken'];
    let fbExpiry = new Date().getTime() + 3500000;
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    const decodedResult = decode(authResult.idToken);
    this.email = decodedResult.email;
    this.userId = decodedResult.sub;
    this.store.dispatch(socialAuth(this.accessToken, this.userId, this.idToken, this.expiresAt, this.email, this.fbToken, fbExpiry));
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
import {fbAuth} from '../../Firebase'
import {firebase} from '../../Firebase'
import {logout, resetCart, socialAuth, authOpenModal} from '../../store/actions/index';
import newStore from '../../store.js';
import decode from 'jwt-decode';

class FirebaseAuth {

    constructor() {
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.isAuthenticated = this.isAuthenticated.bind(this);
      this.getAccessToken = this.getAccessToken.bind(this);
      this.getIdToken = this.getIdToken.bind(this);
      this.renewSession = this.renewSession.bind(this);
      this.setSession = this.setSession.bind(this);
      this.store = newStore;
    }

    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
          ],
        callbacks:{
            signInSuccessWithAuthResult: (result, err) => {
                if (err === undefined && !!result.user) {
                    this.setSession(result);
                } else if (err) {
                  console.log(err);
                  alert(`Error: ${err.error}. Check the console for further details.`);
                }
            }
        }
    }

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (authResult) => {}
 
        );
    }
  
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    login = () => {
        this.store.dispatch(authOpenModal());
        this.store.getState().auth.firebaseUIWidget.start('#firebaseui_container', this.uiConfig)
        //typeof callback === 'function' && callback();
    }

    setSession(authResult) {
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');
    
        // Set the time that the access token will expire at
        let expiresAt = authResult.user.metadata.b
        let accessToken = authResult.credential.accessToken;
        let idToken = firebase.auth().currentUser.getIdToken(true);
        let email = authResult.user.email;
        let userId = authResult.user.uid;
        let refreshToken = authResult.user.refreshToken
        this.store.dispatch(socialAuth(accessToken, refreshToken, userId, idToken, expiresAt, email));
      }


    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');

        this.store.dispatch(logout());
        this.store.dispatch(resetCart());
        // navigate to the home route
    }
  
    getProfile = (idToken) => {
        this.email = decode(idToken).email;;
      }
    getAccessToken() {
      return this.accessToken;
    }
  
    getIdToken() {
      return this.idToken;
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
   
  
  export default FirebaseAuth;
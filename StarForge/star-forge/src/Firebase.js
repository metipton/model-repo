import firebase from 'firebase/app';

// import package
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

let config = {
    apiKey: "AIzaSyCFhZpMGAAUnjCqcziGL-Yh7TjXB37BPG0",
    authDomain: "starforge-153cc.firebaseapp.com",
    databaseURL: "https://starforge-153cc.firebaseio.com/",
    projectId: "starforge-153cc",
    storageBucket: "gs://starforge-153cc.appspot.com",
}


if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  
  const fbAuth = firebase.auth();
  const fbDatabase = firebase.database();
  const fbStorage = firebase.storage();
  
  export { firebase, fbAuth, fbDatabase, fbStorage };
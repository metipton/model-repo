const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp() } catch (e) { console.log(e) }



//Updates the total price in the cart whenever object added
exports = module.exports = functions.database
    .ref('/users/{userId}/Cart/Items/{cartNum}').onWrite((change, context) => {
        const userId = context.params.userId
        const original = change.after.val();

        if(original === null){
          return 0;
        }
        const email = change.after.val().email;
        const matType = original.matType;
        const shippingMode = original.shippingMode;

        let price;
        let shipping;
        if( matType === undefined ) {
          console.log("undefined material type")
          return 0;
        }

        if( shippingMode === undefined){
          console.log("undefined shipping mode")
          return 0;
        }

        return admin.database().ref(`/Prices`).once('value').then((snapshot) => {
          try{
            price = Number.parseFloat(snapshot.val()[matType]);
            shipping = Number.parseFloat(snapshot.val()['Shipping'][shippingMode]);
            admin.database().ref(`/users/${userId}/Cart/shippingMode`).set(shippingMode);
          } catch(error){
            admin.database().ref(`/users/${userId}/Cart/tamperedWith`).set(true);
            return 0;
          }

          return admin.database().ref(`/users/${userId}/Cart`).once('value');
        }).then((snapshot) => {
            const data = snapshot.val();
            const cNumItems = data['numItems'];
            const newItems = cNumItems + 1;
            const cCartTotal = Number.parseFloat(data['cartTotal']);
            const newTotal = cCartTotal + price;
            const date = new Date().toDateString();
            admin.database().ref(`/users/${userId}/Cart/numItems`).set(newItems);
            admin.database().ref(`/users/${userId}/Cart/email`).set(email);
            admin.database().ref(`/users/${userId}/Cart/date`).set(date);
            admin.database().ref(`/users/${userId}/Cart/shippingPrice`).set(shipping);
            return admin.database().ref(`/users/${userId}/Cart/cartTotal`).set(Number.parseFloat(newTotal).toFixed(2));
        })
      })

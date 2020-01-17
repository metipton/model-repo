
const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp() } catch (e) { console.log(e) }
var defaultStorage = admin.storage();

// Import GSC now
const gcs = require('@google-cloud/storage')();

// Than you can access the bucket
const bucket = gcs.bucket('starforge-153cc.appspot.com');

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports = module.exports = functions.database.ref('/users/{userId}/Cart/Items/{cartNum}')
    .onDelete((snap, context) => {
        const matType = snap.val().matType;
        const cartNumber = context.params.cartNum;
        const userId = context.params.userId;
        const folder = defaultStorage.bucket();
        let price;

        return admin.database().ref(`/users/${userId}/Cart/lastOrder`).once('value').then( async (snapshot) => {

            const destBucketName = 'Orders/' + userId + '/CompletedOrders/' + snapshot.val() ;
            const destFilenameSmThumb = '/screenshot-sm-' + cartNumber +  '.png';
            const destFilenameLgThumb = '/screenshot-lg-' + cartNumber +  '.png';
            const destFilenameModel= '/model-' + cartNumber + '.glb';
    
            const smThumb = folder.file('Carts/' + userId + '/CartItem' + cartNumber + '/screenshot-sm.png');
            const lgThumb = folder.file('Carts/' + userId + '/CartItem' + cartNumber + '/screenshot-lg.png');
            const model = folder.file('Carts/' + userId + '/CartItem' + cartNumber + '/model.glb');
    
            await smThumb.copy(bucket.file(destBucketName + destFilenameSmThumb));
            await lgThumb.copy(bucket.file(destBucketName + destFilenameLgThumb));
            await model.copy(bucket.file(destBucketName + destFilenameModel));
            
            model.delete();
            lgThumb.delete();
            smThumb.delete();
            return admin.database().ref(`/Prices`).once('value');
          }).then((snapshot) => {
            price = snapshot.val()[matType];
            return admin.database().ref(`/users/${userId}/Cart`).once('value');
          }).then((snapshot) => {
              const data = snapshot.val();
              const cNumItems = data['numItems'];
              let numItems = cNumItems - 1;
              const cCartTotal = data['cartTotal'];
              let newTotal = cCartTotal - price;
              if(newTotal < 0) {
                  newTotal = 0;
              }
              if(numItems < 0) {
                  numItems = 0;
              }
              admin.database().ref(`/users/${userId}/Cart/numItems`).set(numItems);
              return admin.database().ref(`/users/${userId}/Cart/cartTotal`).set(Number.parseFloat(newTotal).toFixed(2));
          })
    });
// [END chargecustomer]]
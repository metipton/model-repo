/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp() } catch (e) { console.log(e) }
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';


// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports = module.exports = functions.database.ref('/users/{userId}/charges/{id}')
    .onCreate((snap, context) => {
      const source = snap.val().source;
      let price;
      let shipping;
      let amount;
      //reset the shopping cart

      return admin.database().ref(`/users/${context.params.userId}/Cart`).once('value').then((snapshot) => {
        let data = snapshot.val();
        price = parseFloat(data['cartTotal']);
        console.log(price);
        shipping = parseFloat(data['shippingPrice']);
        console.log(shipping);
        amount =  Math.round((price + shipping) * 100);
        console.log(amount);
        // Look up the Stripe customer id written in createStripeCustomer
        return admin.database().ref(`/users/${context.params.userId}/customer_id`).once('value');
      }).then((snapshot) => {
          return snapshot.val();
      }).then((customer) => {
        // Create a charge using the pushId as the idempotency key
        // protecting against double charges
        const idempotencyKey = context.params.id;
        const charge = {amount, currency, customer};
        if (source !== null) {
          charge.source = source;
        }
        return stripe.charges.create(charge, {idempotency_key: idempotencyKey});
      }).then((response) => {
        if(response["status"] === 'succeeded'){
            return admin.database().ref(`/users/${context.params.userId}/Cart`).once('value').then((snapshot) => {
              console.log(response);
                let completedOrder = {
                  'Cart' : snapshot.val(),
                  'Info' : response,
                };
                admin.database().ref(`/users/${context.params.userId}/CompletedOrders/` + response["created"] + '/Cart').set(snapshot.val());
                admin.database().ref(`/users/${context.params.userId}/CompletedOrders/` + response["created"] + "/Info").push(response);

                admin.database().ref(`/Orders/${context.params.userId}/` + response["created"]).push(completedOrder);
                admin.database().ref(`/users/${context.params.userId}/Cart/Items`).set(null);
                admin.database().ref(`/users/${context.params.userId}/sources`).set(null);
                const reset = {
                  "lastOrder" : response["created"],
                  "cartTotal" : 0,
                  "numItems" : 0
                }
                return admin.database().ref(`/users/${context.params.userId}/Cart`).set(reset);
            }).catch((error) => {
              console.log(error);
            })
      }
        return snap.ref.set(response);
      }).catch((error) => {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with StackDriver
        console.log(error);
        return snap.ref.child('error').set(userFacingMessage(error));
      }).then((error) => {
        //reportError(error, {user: context.params.userId})
        return 0 ;
      });
      
    });
// [END chargecustomer]]
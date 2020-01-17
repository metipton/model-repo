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


// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports = module.exports = functions.database
    .ref('/users/{userId}/sources/{pushId}/token').onWrite((change, context) => {
      const source = change.after.val();
      if (source === null){
        return null;
      }
      return admin.database().ref(`/users/${context.params.userId}/customer_id`)
          .once('value').then((snapshot) => {
            return snapshot.val();
          }).then((customer) => {
            return stripe.customers.createSource(customer, {source});
          }).then((response) => {
            console.log(response);
            console.log(change.after.ref.parent);
            return change.after.ref.parent.set(response);
          }, (error) => {
            return change.after.ref.parent.child('error').set(userFacingMessage(error));
          }).then((error) => {
            //reportError(error, {user: context.params.userId})
            return 0 ;
          });
        });
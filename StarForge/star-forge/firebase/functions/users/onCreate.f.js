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


// When a user is created, register them with Stripe
exports = module.exports = functions.database.ref('/users/{userid}').onCreate((snapshot, context) => {
    const userData = snapshot.val();
    const email = userData.identity.email;
    const uid = context.params.userid;
    return stripe.customers.create({
      email: email,
    }).then((customer) => {
      return admin.database().ref(`/users/${uid}/customer_id`).set(customer.id);
    }).then(() => {
      admin.database().ref(`/users/${uid}/Cart/cartTotal`).set(0.00);
      return admin.database().ref(`/users/${uid}/Cart/numItems`).set(0);
    });
  });
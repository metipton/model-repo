
const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp() } catch (e) { console.log(e) }
var defaultStorage = admin.storage();

// Import GSC now
const gcs = require('@google-cloud/storage')();


// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports = module.exports = functions.database.ref('/users/{userId}/SavedModels/{timestamp}/')
    .onDelete((snap, context) => {
        const timestamp = context.params.timestamp
        const userId = context.params.userId;
        const folder = defaultStorage.bucket();

        const lgThumb = folder.file('Saved/' + userId + '/' + timestamp + '/screenshot-lg.png');
        return lgThumb.delete();
    });
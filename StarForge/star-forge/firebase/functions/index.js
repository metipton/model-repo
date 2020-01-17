'use strict'
/** EXPORT ALL FUNCTIONS
 *
 *   Loads all `.f.js` files
 *   Exports a cloud function matching the file name
 *
 *   Based on this thread:
 *     https://github.com/firebase/functions-samples/issues/170
 */
const glob = require('glob')
const camelCase = require('camelcase')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

const jwt = require('jsonwebtoken');
var rp = require('request-promise');

//const settings = { timestampsInSnapshots: true }

admin.initializeApp({
  credential: admin.credential.cert({ 
    type: "service_account",
    projectId: "starforge-153cc",
    privateKeyId: "84104855a675598f04b83cdea4761fae0fe0e464",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZVF5MGNCy9LgI\nlWRyzO1mz0S2mLUAmpgDi+/ofitRRNubBjcjIV1U5fcKZ1QTTEMiVf0+1jQeJPyv\n1D0HW/JaAPWbRdj4idBNt7eNjzMhHdO/9EiV8jRkjQ3zhaA0M1JzcvWdCommipbR\nR2kE0RwJ4PEoYV1JS3DCxLNgPsh6n7cPr3khiCLSIZH2xugtxH6EYBfI8zh6ZSOM\npdY9BHJfzsWfpU/TCgAVcI8fjE/ldyP38Hqge2kegRzUYKSKXjMiV55i3a2GqQ+i\nTps0C8jJ5aBvipIu2LYfYYBzIdNmH7SLz/rUSqkfK4/r1+i6qAWb6wXPjsHG0RdN\n/Ule0BRZAgMBAAECggEAK548GxK+IAKM7egtxJi2elZBOl6TsyHHV87xxyZJRVu8\ny0uH2OcPaWzoC54cZUb/HB/xJHSELAUimxRZ7iOCfIckV3EVyZJO3yUBwvP3PBcD\nm2ovUfSuYeJckyeyzNbCwFP2Oh/6y5VGVS+m2Pdxrf+/KtkT1Btxbv7M9na1ymf/\nQeEdjdZq+Tq6dFoxXVFtAC3jJ3/ODB26yZWPAGgjJCIR+TcCYMsLZBq3p5gqmCsg\nDrjflHtVYBWGmHFf2J5Zg/D1INl7pTHk687v6A3Yt90ABrfQr0KK5e36IRqeAShk\nZ1qWnA30AAU48RM6cxNC3bczFHkcLLl2q2JozNoJ9wKBgQDMPEOkQtymWA+kPwiR\n8yPpG/sxMroRym001VtAn/WyvXFLZyLVOXEjEyvMvq7omWvXjDZmlj0T3fmSOsKW\nt/hxmDDYSeNbYcL7DYmOf2hvG0tSSnHY7p1ic/gUxrY3lM46I4Biqm4SOmoZ9e+h\nQIr3zvcqKS8t2cJCTugGkvWnLwKBgQDAMRkbqYz1DLJ+SzWFkxEX/4XNo3e5YVbP\nd04zkoKSWDhOJWjeY2TOKcrwMg6l+BZ5A/CIVugb7ojBENjQMFu3cXE7Id/KwfbI\ncCn40N+CqQnfsajUETEklBA6Wzk/XiJriHaCbMRHAUzSDzK3ZZpVHVP3ZESkTYoJ\nrcIYN/8a9wKBgHQH1OIQfm0e4JwOl57bhM5d8ELOL/oFiC+Y+0Pm3N7UU/ZjvN1o\nygcEUED9ID/TUfpelVWJC2ArHyvdqEmacVKQBUgMClgTXYPl9/12Eu30ksFIvA9j\n2RRjEFE1Z7aCGvvayYjEjM5cU4U2PRLeqVUKR0+zoDMrYPrs+1Mo0NlPAoGAZatT\nefO2kod2ASNuG8xR1Z0hvkgEdLfOgY++eb++fQZYOtbFZCe2Uu1+4pPIdfoIgVoZ\nKza2MNh91YxA9dkvG5rSaJKh3ZPAJgZX3b05D9i2VXSZOB4kHhKJhyVs4l283Z/h\n+Vrqdhl09wZ9MNF51B7gpVWQjk5KgJY/wCoXNL8CgYBOr+QgtAQv2vngYp2CiKNT\nfP7ZyptaWMbG9NRTCm1F4f3i+Vj/R5fjqLiHuoSKzOOxKlI3XpjvMTr5Hsydn4xR\nBvHC2TZ/e87P7yZ3MUUXwbZ16hIPfrIjnAghGeH7N9Y2e9YGGEizgwqSgUc3eAUo\nvFpO7TFn5KwL6XfM5oQ5lg==\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-xkuqn@starforge-153cc.iam.gserviceaccount.com",
    clientId: "103647434460192715875",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xkuqn%40starforge-153cc.iam.gserviceaccount.com"}),
  databaseURL: `https://starforge-153cc.firebaseio.com`,
  storageBucket: "starforge-153cc.appspot.com"
});

//admin.firestore().settings(settings)

const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**' })
for (let f = 0, fl = files.length; f < fl; f++) {
  const file = files[f]
  const functionName = camelCase(file.slice(0, -5).split('/').join('_')) // Strip off '.f.js'
  if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
    exports[functionName] = require(file)
  }
}

exports.setShippingMode = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    const shippingMode = request.query.shippingMode;
    const userId = request.query.userId;
    let shipping;

    if( shippingMode === undefined){
      console.log("undefined shipping mode")
      return response.json({
        "shippingModeSet" : 'undefinedShippingMode'
      })
    }

    
    if( userId === undefined){
      console.log("undefined shipping mode")
      return response.json({
        "shippingModeSet" : 'undefinedUserId'
      })
    }

  return admin.database().ref(`/Prices`).once('value').then(async (snapshot) => {
    try{
      shipping = Number.parseFloat(snapshot.val()['Shipping'][shippingMode]);
      admin.database().ref(`/users/${userId}/Cart/shippingMode`).set(shippingMode);
      admin.database().ref(`/users/${userId}/Cart/shippingPrice`).set(shipping)

      return response.json({
        "shippingModeSet" : true
      })
    } catch(error){
      console.log(error);
      admin.database().ref(`/users/${userId}/Cart/tamperedWith`).set(true);
      return response.json({
        "error" : error
      })
    }
  })
});

exports.getCartNumber = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  
  admin.database().ref(`/users/${request.query.userid}/Cart/Items`).once('value').then((snapshot) => {
      
      const currentCartNums = [];
      snapshot.forEach((data) => {
        currentCartNums.push(data.val().cartNumber);
      })
      currentCartNums.sort();

      let cartNum = 0;
      for(var i = 0; i < currentCartNums.length; i++ ){
          if( cartNum !== currentCartNums[i]){
              break;
          }
          cartNum++;
      }
      return response.json({
        "cartNumber": cartNum,
      });
      }).catch((error) => {    
        response.json({
          error: error
        })
      });
});

exports.getFirebaseAuth = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    let sub;
    let id;
    var options = {
      url: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      method: 'GET',
      json: true // Automagically stringifies the body to JSON
    };

    try{
      const keySet = await rp(options);
      let pubkey = keySet['keys'][0]['x5c'][0];
  
      //annoyingly the certificate has to be modified slightly before jwt.verify() will work
      let secret = [
        '-----BEGIN CERTIFICATE-----',
        pubkey,
        '-----END CERTIFICATE-----'
        ].join('\n');
  
      var decoded = jwt.verify(request.query.token, secret, { issuer: `https://${process.env.AUTH0_DOMAIN}/`, algorithms: ['RS256'] });
      id = decoded['email'];
      sub = decoded['sub'];
      var additionalClaims = {
        email: id,
        identifier: id
      };
    } catch(error){
      console.log(error);
      return error;
    }

    try {
      const firebaseToken = await admin.auth().createCustomToken(sub, additionalClaims);
      return response.json({firebaseToken});
    } catch (err) {
      return response.status(500).send({
        message: 'Something went wrong acquiring a Firebase token.',
        error: err
      });
    }

});


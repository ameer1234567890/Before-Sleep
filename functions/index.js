'use strict';
/* jshint esversion: 6 */
/* jshint node: true */

const {
  dialogflow,
  Suggestions,
  MediaObject,
  Image,
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({debug: false});
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');

// Handle 'Default Welcome Intent'
app.intent('Default Welcome Intent', (conv) => {
  if (conv.user.verification === 'VERIFIED' && !conv.user.storage.uid) {
    let uid = uuidv4();
    let date = new Date();
    db.collection('users').doc(uid).set({ registered: date })
    .then(() => { return console.log('New user ID generated!'); })
    .catch((error) => { return console.error('Error writing new user ID: ', error); });
    conv.user.storage.uid = uid;
  } else if (conv.user.verification === 'VERIFIED' && conv.user.storage.uid) {
    let uid = conv.user.storage.uid;
    let date = new Date();
    db.collection('users').doc(uid).update({ last_accessed: date })
    .then(() => { return console.log('Saved last_accessed token!'); })
    .catch((error) => { return console.error('Error writing last_accessed token: ', error); });
    conv.user.storage.last_accessed = date;
  }
  conv.ask('Welcome to Before Sleep! Are you ready to sleep?');
  conv.ask(new Suggestions('Yes', 'No'));
});

// When 'Tell me a story' is said after the welcome intent or when 'yes' is answered
app.intent(['Default Welcome Intent - yes', 'start intent'], (conv) => {
  conv.ask('Okay! Let\'s start!');
  conv.ask(new MediaObject({
    name: 'Before Sleep',
    url: 'https://firebasestorage.googleapis.com/v0/b/before-sleep.appspot.com/o/Full.mp3?alt=media&token=243b7457-f83b-4846-afdd-e3b45fcb44b5',
    description: 'All duas',
    icon: new Image({
      url: 'https://firebasestorage.googleapis.com/v0/b/before-sleep.appspot.com/o/Icon.jpg?alt=media&token=d716f070-5a57-4cca-9e6b-435730eef8b2',
      alt: 'Icon',
    }),
  }));
  conv.ask(new Suggestions('Quit'));
});
  
// When there is no response
app.intent('actions_intent_NO_INPUT', (conv) => {
  // Close the app immediately
  conv.close('Good night and good bye!');
});

// Handle media intents
app.intent('actions_intent_MEDIA_STATUS', (conv) => {
  const mediaStatus = conv.arguments.get('MEDIA_STATUS');
  if (mediaStatus && mediaStatus.status === 'FINISHED') {
    // Right after playing all duas (MediaResponse)
    conv.close('Good night and good bye!');
  } else {
    conv.close('Good night and good bye!');
  }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

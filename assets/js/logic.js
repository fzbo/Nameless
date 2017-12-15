var firebase = require('firebase').initializeApp({
  "serviceAccount": "forkOff-83ae27da1054.json",
  "databaseURL": "https://forkoff-b5d5b.firebaseio.com"
});


var imageToUse = '5841762-image.jpg';

var ref = firebase.database().ref().child('node-client');
var logsRef= ref.child('images');
var messagesRef=ref.child('messages');


logsRef.child('TestingImage').set(imageToUse);
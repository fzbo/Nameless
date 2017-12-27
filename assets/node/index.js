const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.addMessage = functions.firebase.database().ref().child('node-client').child('images').child('TestingImage').on('value', function(snap) {

var ref = firebase.database().ref().child('node-client');
var logsRef= ref.child('images');
var messagesRef=ref.child('messages');
var imageToUse = snap.val();
watsoncheck(imageToUse);
console.log(imageToUse);
console.log('changed', snap.val());
});




function watsoncheck(images)
{
var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
  api_key: 'eccb86215ba03e3b5ff9877ce2b28b89c4ac1c57',
  //api_key: '6de8f853781dde067ae4c1ebde94f4579a4e8a6c', //Charlie
  version: 'v3',
  version_date: '2016-05-20'
});
   

var params = {
  parameters: {'url':images}
};


visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err); 
  else
    messageWatson = res;
console.log(messageWatson);
var message = {text: messageWatson}; //, timestamp: new Date().toString()
var ref = firebase.database().ref().child('node-client');
setMessages(message);
message = 0
});

}


function setMessages(message)
{
  ref.child('messages').update(message);
}

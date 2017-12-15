
var firebase = require('firebase').initializeApp({
  "serviceAccount": "forkOff-83ae27da1054.json",
  "databaseURL": "https://forkoff-b5d5b.firebaseio.com"
});

//
var messageWatson;
var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
  api_key: '3511cb92faf71512889a8004b4e0eea17618cdf8',
  version: 'v3',
  version_date: '2016-05-20'
});
var imageToUse = 'demo-image.jpg';
var params = {
  images_file: fs.createReadStream(imageToUse)
};

visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err); 
  else
    messageWatson = res;
console.log(messageWatson);
var message = {text: messageWatson, timestamp: new Date().toString()};
var ref = firebase.database().ref().child('node-client');
var logsRef= ref.child('images');
var messagesRef=ref.child('messages');
var messageRef = messagesRef.push(message);

logsRef.child(messageRef.key).set(imageToUse);

logsRef.orderByKey().limitToLast(1).on('child_added', function(snap) {
	console.log('added', snap.val());
});

logsRef.on('child_removed', function(snap) {
	console.log('removed', snap.val());
});

logsRef.on('child_changed', function(snap) {
	imageToUse = snap.val();
watsoncheck(imageToUse);

	console.log(imageToUse);

	console.log('changed', snap.val());
});
logsRef.on('value', function(snap) {
	console.log('value', snap.val());
});
});


//


function watsoncheck(images)
{
var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
  api_key: '3511cb92faf71512889a8004b4e0eea17618cdf8',
  version: 'v3',
  version_date: '2016-05-20'
});
var params = {
  images_file: fs.createReadStream(images)
};	
visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err); 
  else
    messageWatson = res;
console.log(messageWatson);
var message = {text: messageWatson, timestamp: new Date().toString()};
var ref = firebase.database().ref().child('node-client');
var logsRef= ref.child('images');
var messagesRef=ref.child('messages');
var messageRef = messagesRef.push(message);

logsRef.child(messageRef.key).set(images);
});

}




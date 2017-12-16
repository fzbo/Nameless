  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDjsbjIcD3GTuLS_1okzz-OGxDdJ3QNpcM",
    authDomain: "forkoff-b5d5b.firebaseapp.com",
    databaseURL: "https://forkoff-b5d5b.firebaseio.com",
    projectId: "forkoff-b5d5b",
    storageBucket: "forkoff-b5d5b.appspot.com",
    messagingSenderId: "182993753568"
  };
  firebase.initializeApp(config);




function drop_handler(ev) {
  console.log("Drop");
  ev.preventDefault();
  // If dropped items aren't files, reject them
  var dt = ev.dataTransfer;
  if (dt.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i=0; i < dt.items.length; i++) {
      if (dt.items[i].kind == "file") {
        var f = dt.items[i].getAsFile();
        console.log("1 file[" + i + "].name = " + f.name);



var imageToUse = f.name;

var ref = firebase.database().ref().child('node-client');
var logsRef= ref.child('images');
var messagesRef=ref.child('messages');


logsRef.child('TestingImage').set(imageToUse);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i=0; i < dt.files.length; i++) {
      console.log("2 file[" + i + "].name = " + dt.files[i].name);
    }  
  }
}

function dragover_handler(ev) {
  console.log("dragOver");
  // Prevent default select and drag behavior
  ev.preventDefault();
}

function dragend_handler(ev) {
  console.log("dragEnd");
  // Remove all of the drag data
  var dt = ev.dataTransfer;
  if (dt.items) {
    // Use DataTransferItemList interface to remove the drag data
    for (var i = 0; i < dt.items.length; i++) {
      dt.items.remove(i);
    }
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}



var ref = firebase.database().ref().child('node-client');
var logsRef1= ref.child('messages');
logsRef1.on('value', function(snap) {
  $("#postDataHere").html("");
  console.log(Object.values(snap.val()));
  var y = Object.values(snap.val());
  console.log("console.log this: " +y);
  y= Object.values(y[0])[1][0];
  y= Object.values(y)[0];
  y= Object.values(y)[0];
  lastLayer= Object.values(y)[0];
  console.log(lastLayer);
  for (var i = 0; i < lastLayer.length;i++)
  {
    var tag = "Keyword :";
    y=Object.values(lastLayer[i]);
    for (var j=0; j<2;j++)
    {
      console.log(Object.values(y)[j]);
      var goodData = Object.values(y)[j];
      $("#postDataHere").append("<p>"+ tag + goodData + "</p>"); 
      tag = "Score :"

    }
  }
});

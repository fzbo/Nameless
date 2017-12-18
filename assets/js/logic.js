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
  console.log(ev.dataTransfer.files);
  // If dropped items aren't files, reject them
  var dt = ev.dataTransfer.files;
  if (dt.length) 
  {
    // Use DataTransferItemList interface to access the file(s)
        console.log("imgur function");
        imgurUpload(dt);
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
      if (i === 0 && j=== 0)
      {
        console.log("here is the good date" + goodData);
        firebase.database().ref('node-client/yummly').set(goodData);
      }
    }
  }
});




function imgurUpload($files)
{

  console.log("$files is " + JSON.stringify($files));
  if ($files.length) 
  {
    // Reject big files
    if ($files[0].size > $(this).data("max-size") * 1024) 
    {
      console.log("Please select a smaller file");
      return false;
    }

    // Begin file upload
    console.log("Uploading file to Imgur..");

    // Replace ctrlq with your own API key
    var apiUrl = 'https://api.imgur.com/3/image';
    var apiKey = 'c70f5706c082422';

    var settings = {
      async: false,
      crossDomain: true,
      processData: false,
      contentType: false,
      type: 'POST',
      url: apiUrl,
      headers: {
        Authorization: 'Client-ID ' + apiKey,
        Accept: 'application/json'
      },
      mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", $files[0]);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function(response) {
      var str = JSON.parse(response).data.link; 
      //str = JSON.stringify(str); 
     // imageToUse = str.split("\/").pop();
      imageToUse = str;
      console.log(imageToUse);
      firebase.database().ref().child('node-client').child('images').child('TestingImage').set(imageToUse);
      console.log(JSON.parse(response).data.link);
    });
  }

}

function imgurUploadCamera($files)
{

  console.log("$files is " + JSON.stringify($files));


    // Begin file upload
    console.log("Uploading file to Imgur..");

    // Replace ctrlq with your own API key
    var apiUrl = 'https://api.imgur.com/3/image';
    var apiKey = 'c70f5706c082422';

    var settings = {
      async: false,
      crossDomain: true,
      processData: false,
      contentType: false,
      type: 'POST',
      url: apiUrl,
      headers: {
        Authorization: 'Client-ID ' + apiKey,
        Accept: 'application/json'
      },
      mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", $files);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function(response) {
      var str = JSON.parse(response).data.link; 
      //str = JSON.stringify(str); 
     // imageToUse = str.split("\/").pop();
      imageToUse = str;
      console.log(imageToUse);
      firebase.database().ref().child('node-client').child('images').child('TestingImage').set(imageToUse);
      console.log(JSON.parse(response).data.link);
    });
  

}


$("document").ready(function() {

  $('input[type=file]').on("change", function() {
    var files = $(this).get(0).files;
    console.log(files);
    imgurUpload(files);
  });
});


// ==================================CAMERA CAPTURE===================================//
  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const captureButton = document.getElementById('capture');

  const constraints = {
    video: true,
  };

  captureButton.addEventListener('click', () => {
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    dataURL = dataURL.replace(/data:image\/png;base64,/i, ''); // Use this line because imgur doesn't accet base64
    console.log(dataURL);
    imgurUploadCamera(dataURL);
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
  });

  // Attach the video stream to the video element and autoplay.
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
    });
//====================================CAMERA CAPTURE ENDS ===============================//



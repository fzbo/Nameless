var numOfIngredients = 0;  
var ingredientList;
var finalIngredientList = [];
var counter=0;
var counteroutside = 0;
var counterinside = 0;
var counterToAddData = 0; // this counter will prevent a duplicate value to fill the yummly database due the on("value") duplicate scans on database
var buttonColors = ["primary","secondary","success","danger","warning","info","light"]; // button colors from bootstrap layout
var color = 0;
var ingredientList = [];
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


function addYummly()
{
  var y = 0;
  console.log("checking how many times inside" + counterinside);
  var ref = firebase.database().ref().child('node-client');
  var logsRef1= ref.child('messages');
  var lastLayer;
  logsRef1.on('value', function(snap) 
  {
    ++counterToAddData;
    if (snap) //checking if snapshot is not null
    {
      console.log("checking how many times outside" + counteroutside);
      $("#postDataHere").html("");
      event.preventDefault();
      console.log(Object.values(snap.val()));
      y = Object.values(snap.val());
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
          console.log('counter to add data' + counterToAddData);
          if (i===0 && j===0 && counterToAddData===2)
          {
            addToDataBase(goodData, ref)
          }
          $("#postDataHere").append("<p>"+ tag + goodData + "</p>"); 
          tag = "Score :"
        }
      }
    }
  });

}


// this function will add the last uploaded ingredient to the database
function addToDataBase(goodData1, ref1)
{
  counter++;
  console.log("passed " + counter + " times in " + goodData1);
  console.log("here is the good date" + goodData1);
  ref1.child('yummly').once('value').then(function(snapshot){
  console.log("inside firebase" + snapshot.numChildren());
  numOfIngredients= snapshot.numChildren();
  ingredientList[numOfIngredients] =goodData1; // this line will add the ingredient to the array in the same position as in the database
  console.log("counter" + numOfIngredients);
  console.log(ingredientList);
  firebase.database().ref('node-client/yummly/' + "ingredient" + numOfIngredients).set(goodData1);
  addButton(goodData1);

  });        
}

// addButton will add a button when user add a picture.
function addButton(goodData2)
{

  var buttonName = goodData2;
 
  finalIngredientList.push(goodData2.replace(/_/g, '' )); // thia line is pushing the last scanned image keyword, the spaces will be replaced with a '_'
  
  console.log(" list of ingredients" + finalIngredientList);
  $("#ingredientList").append('<button'+ ' id="' + buttonName + '"' +' class="btn btn-' + buttonColors[color]+ ' m-3">' + buttonName +'</button>')
  color++;
  if (color === 7)
  {
    color=0;
  }
  wikipedia(goodData2); // this will send the search word to wikipedia API and display the information Properly
  mainYummly(finalIngredientList);

}

// function addShoppingList()
// {

//   $("#shoppingList").html()
// }

// imgurUpload will upload the image when submitted or drag and dropped or the picture taken 
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
  addYummly();

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
  
  addYummly();
}


$("document").ready(function() {
event.preventDefault();
  $('input[type=file]').on("change", function() {
    var files = $(this).get(0).files;
    console.log(files);
    imgurUpload(files);
    counterToAddData= 0;
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
    dataURL = dataURL.replace(/data:image\/png;base64,/i, ''); // Use this line because imgur doesn't accet base64 and we need for watson to work
    console.log(dataURL);
    imgurUploadCamera(dataURL);
   // addYummly(); // will add the resulting image keyword to yummly
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
  });

  // Attach the video stream to the video element and autoplay.
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
    });
//====================================CAMERA CAPTURE ENDS ===============================//




//==================================================================//
//==================================================================//
//==================================================================//

var holder = document.getElementById('holder'),
  tests = {
    filereader: typeof FileReader != 'undefined',
    dnd: 'draggable' in document.createElement('span'),
    formdata: !!window.FormData,
    progress: "upload" in new XMLHttpRequest
  },
  support = {
    filereader: document.getElementById('filereader'),
    formdata: document.getElementById('formdata'),
    progress: document.getElementById('progress')
  },
  acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
  },
  progress = document.getElementById('uploadprogress'),
  fileupload = document.getElementById('upload');

"filereader formdata progress".split(' ').forEach(function (api) {
if (tests[api] === false) {
  support[api].className = 'fail';
} else {
  support[api].className = 'hidden';
}
});

function previewfile(file) {
if (tests.filereader === true && acceptedTypes[file.type] === true) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var image = new Image();
    image.src = event.target.result;
    image.width = 250; // a fake resize
    holder.appendChild(image);
  };

  reader.readAsDataURL(file);
}  else {
  holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
  console.log(file);
}
}

function readfiles(files) {
  debugger;
  var formData = tests.formdata ? new FormData() : null;
  for (var i = 0; i < files.length; i++) {
    if (tests.formdata) formData.append('file', files[i]);
    previewfile(files[i]);
  }

  // now post a new XHR request
  if (tests.formdata) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/devnull.php');
    xhr.onload = function() {
      progress.value = progress.innerHTML = 100;
    };

    if (tests.progress) {
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var complete = (event.loaded / event.total * 100 | 0);
          progress.value = progress.innerHTML = complete;
        }
      }
    }

    xhr.send(formData);
  }
}

if (tests.dnd) {
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  readfiles(e.dataTransfer.files);

}
} else {
fileupload.className = 'hidden';
fileupload.querySelector('input').onchange = function () {
  readfiles(this.files);
};
}

function readURL(input) {
         if (input.files && input.files[0]) {
             var reader = new FileReader();

             reader.onload = function (e) {
                 $('#blah')
                     .attr('src', e.target.result);
             };

             reader.readAsDataURL(input.files[0]);
         }
     }


//==================================================================//
//==================================================================//
//==================================================================//




//==================================================================//
//==================== Beginning of Wikipedia API ==================//
//==================================================================//
function wikipedia(keyword)
{
  $.ajax({
  type: "GET",
  url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + keyword + "&callback=?",
  contentType: "application/json; charset=utf-8",
  async: false,
  dataType: "json",
  success: function (data, textStatus, jqXHR) {

      console.log(data);
      var markup = data.parse.text["*"];
      str= markup.replace(/\/\/upload/g, 'upload'); // ADDED THIS LINE TO REMOVE THE UPLOAD IMAGE ERROR
      str= str.replace(/http/g, 'https'); // ADDED THIS LINE TO HAVE THE CONTENT DISPLAYED SECURELY OVER HTTPS
      var blurb = $('<div></div>').html(str);

      // remove links
      blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
      // remove any references
      blurb.find('sup').remove();

      // remove cite error
      blurb.find('.mw-ext-cite-error').remove();
      $('#ingredientInfo').html($(blurb).find('p')); 
    },
    error: function (errorMessage) {
    }
  });  
}       
     


//==================================================================//
//==================================================================//
//==================================================================//


//==================================================================//
//====================== Beginning of Yummly API ===================//
//==================================================================//



function mainYummly(foodImageItem) 
{
  console.log("here inside");
  //clear the last recipes created 

  var finalQuery=[];
  for (var i=0;i<foodImageItem.length;i++)
  {
    var queryImageSearch = "&allowedIngredient[]=" + foodImageItem[i]; //search parameter + variable will be set by Watson API
    finalQuery+= queryImageSearch;
  }
  console.log(finalQuery);
  //*************************** 3 different searches ***************************
  var queryRecipe = "recipes?";
  // var queryIngredient = "metadata/ingredient?"; // Allowed ingredient and meta ingredient might not work together
  // var queryCuisine = "metadata/cuisine?";  // use Cuisine if we want to limit user query to specific  cuisine
  // *************************** important: need to hide in gitignore file ***************************
  var monkeyPaw = "_app_id=12dafe86&_app_key=ba62bbc8677a60fac1bc16abe00dbf86";
  //*************************** URL concatenation ***************************
  var queryURL = "https://api.yummly.com/v1/api/" + queryRecipe + monkeyPaw + finalQuery;
  // function imageSearchInfo(){} <<<<<<<<<< may need to put inside another function? <<<<<<<<<<
  $.ajax({ url: queryURL, method: "GET" }).done(function(response) 
  {
    var results = response;
    console.log(results);
    console.log(results.matches[0].ingredients);
    var ingLength = results.matches;
    for (var i=0; i<ingLength.length;i++)
    {
      var ingredients = results.matches[i].ingredients; // zero for first recipe only
      var recipePicture = results.matches[i].imageUrlsBySize[90];
      var title = results.matches[i].recipeName;
      var id = results.matches[i].id;
      console.log(recipePicture);
      createRecipeList(ingredients, recipePicture,title,id,i);
    }
  });
}


function createRecipeList(ingredients,recipePicture, title,id,counterForRecipe)
{
  //holder-recipe
  console.log("inside the method!!");
  var divToCreate = $("#yummlyIngredientList").append( "<div class='col-md-3 dup holderRecipe' id='recipe"+counterForRecipe+"'>"+
  "</div>"+
  "</div>"+
  "</div>");
  console.log(divToCreate);
  $("#recipe"+counterForRecipe).append("<H4>"+ title +"</H4>");
  $("#recipe"+counterForRecipe).append("<p>https://www.yummly.com/#recipe/"+ id +"</p>");
  $("#recipe"+counterForRecipe).append("<img src='"+recipePicture + "''>");
  for (var i =0;i< ingredients.length;i++)
  {
    $("#recipe"+counterForRecipe).append("<span>" +ingredients[i] +"</span> </br>");
  }
}

//==================================================================//
//==================================================================//
//==================================================================//




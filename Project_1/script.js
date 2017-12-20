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
        console.log("... file[" + i + "].name = " + f.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i=0; i < dt.files.length; i++) {
      console.log("... file[" + i + "].name = " + dt.files[i].name);
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



//yummly API
     $(document).ready(function(){

       $("#ingredient").on("click", function() {

         var foodImageItem = "kiwi"; //hardset variable until Watson API is ready set image-data
         //*************************** 3 different searches ***************************
         var queryRecipe = "recipes?";
         var queryIngredient = "metadata/ingredient?";
         var queryCuisine = "metadata/cuisine?";
         // *************************** important: need to hide in gitignore file ***************************
         var monkeyPaw = "_app_id=12dafe86&_app_key=ba62bbc8677a60fac1bc16abe00dbf86";
         var queryImageSearch = "&allowedIngredient[]=" + foodImageItem; //search parameter + variable will be set by Watson API
         //*************************** URL concatenation ***************************
         var queryURL = "https://api.yummly.com/v1/api/" + queryRecipe + monkeyPaw + queryImageSearch;

         // function imageSearchInfo(){} <<<<<<<<<< may need to put inside another function? <<<<<<<<<<

         $.ajax({
             url: queryURL,
             method: "GET",
             dataType: "JSON"

         }).done(function(response) {
             var results = response.matches;
             var recipeData = results[0].recipeName;
             var recipeRating = results[0].rating;
             var recipeImage = results[0].smallImageUrls[0];
             var ingredientItem= results[0].ingredients[0];
             var ingredientList = results[0].ingredients;
             var sourceCredit = results[0].sourceDisplayName;
             var prepTime = (results[0].totalTimeInSeconds) / 60;
             var multiOut;
             var multiArr;


             for(r=0;r<results.length;r++){
               results[r];
               // results[r].smallImageUrls;
               // results[r].ingredients[0];
               multiArr = results[r];
             };

             for(i=0;i<ingredientList.length;i++){
                   ingredientList[i];
                   multiArr.ingredients[i];
                   multiOut = multiArr.ingredients[i];
                 };

// **********************  console.log test calls  **********************

             console.log(ingredientItem); // used to link to Watson search-selected word(s)
             console.log(results); // all recipes found with specific ingredient (result of Watson identification)
             console.log(recipeData); // used to display recipe name to user
             console.log(recipeImage); // used to display image of recipe-selected to user (larger image is available)
             console.log("Recipe Rating: " + recipeRating); // used to display recipe rating to user
             console.log("Total Min: " + prepTime); // used to display recipe preparation time in minutes to user

             ingredientList.forEach(function(value){
               console.log(value);
             }); // used to display other ingredients to user (potential shopping list)

             console.log(ingredientList);

             console.log("Source: " + sourceCredit); // used to display source of recipe to user

             //*******************************************************

             console.log(multiOut); //hmmm?  iterates through all results and only displays last array's final value

             console.log(multiArr); //hmmm?  iterates through all results and only displays last recipe results


         });
       });
     });

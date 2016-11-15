var spellingList = ["fit",
  "mad",
  "bus",
  "dots",
  "spy",
  "job",
  "row",
  "tree",
  "ship",
  "name",
  "ears",
  "room",
  "case",
  "meal",
  "rang",
  "tile",
  "lost",
  "aim",
  "nest",
  "tiny",
  "need",
  "darts",
  "straw",
  "maybe",
  "cried",
  "shell",
  "wash",
  "chew",
  "start",
  "first",
  "picky",
  "claws",
  "great",
  "stage",
  "open",
  "sadly",
  "brush",
  "cross",
  "hugged",
  "trail",
  "butter",
  "sharp",
  "digging",
  "soap",
  "bones", //problem
  "small",
  "center", //or "centre"
  "lava",
  "monster", //problem
  "bathtub",
  "ivy",
  "nose",
  "tusk",
  "road",
  "oven",
  "news",
  "food",
  "rules",
  "braid",
  "miles",
  "folds",
  "pages",
  "boring",
  "corner", //problem
  "ferns",
  "elbow",
  "taxi",
  "stuck", //problem
  "grain",
  "float",
  "awake",
  "bird",
  "snack",
  "wear",
  "mane",
  "hardly",
  "shirts",
  "moody",
  "lawn",
  "branch",
  "pantry",
  "sandbox",
  "posters",
  "spider",
  "coast",
  "bother",
  "mouse",
  "swift",
  "restless",
  "parents",
  "beehive",
  "shopping",
  "artwork",
  "chance",
  "lookout",
  "stroller",
  "anyone",
  "thumb",
  "backdrop",
  "fuddy-duddy"
];

var problemList = [
  "bones",
  "monster",
  "corner",
  "stuck"
]

var hasTTS = true;

if ('speechSynthesis' in window) {
  //sweet.
} else {
  hasTTS = false;
  alert("I'm sorry, your browser doesn't support a text-to-speech feature, so some words will be skipped. To access all the words, try Chrome v 33 or higher, Firefox v 49 or higher,  Safari v 7 or higher, or Microsoft Edge v 38 or higher.");
}

var studyListArray = [];

if (!window.localStorage) {
  alert("Sorry, we can't remember which word you're on when you leave this page. The next time you come back or reload the page it will start from the beginning.");
} else if (localStorage.currentWordIndex === undefined) {
  localStorage.currentWordIndex = 0;
  localStorage.recordScore = 0;
}

if (window.localStorage) {
  if (!localStorage.studyListArray) {
    localStorage.studyListArray = "";
  } else if (localStorage.studyListArray.length > 0) {
    studyListArray = localStorage.studyListArray.split(",");
  }
}

var currentWordIndex = localStorage.currentWordIndex;
var word = "";
var tts;
var usingTTS = false;
var audio;
var audioURL = "";
var hintLetter = 1;
var loadaling;

var chip = {
    tag: 'chip content',
    id: 1, //optional
  };

function preloader() {
  $("#play").addClass("disabled").html('<div class="preloader-wrapper small active valign-wrapper"><div class="spinner-layer spinner valign"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
  loadaling = true;
}

function stopLoader() {
  $("#play").removeClass("disabled").html('<i class="large material-icons">play_arrow</i>');
  loadaling = false;
}

var updateWord = function() {
  preloader();
  word = spellingList[currentWordIndex];
  localStorage.currentWordIndex = currentWordIndex;
  hintLetter = 1;
}

function getMerriamWebster() {
  updateWord();
  usingTTS = false;
  var xhr = new XMLHttpRequest();
  var url = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + word + "?key=9ef9d420-7fba-449f-9167-bd807480798e";
  xhr.onload = function(data) {
    var audioFilename = $(data).find("hw:contains(" + word + ") ~ sound wav").html();
    console.log("wav =" + audioFilename);
    if (audioFilename === undefined || problemList.includes(word)) {
      if (hasTTS === false) {
        skipWord();
      } else {
        usingTTS = true;
        console.log("using TTS");
        tts = new SpeechSynthesisUtterance(word);
      }
    } else {
      var subdir = ""
      if (audioFilename.startsWith("bix")) {
        subdir = "bix/";
      } else if (audioFilename.startsWith("gg")) {
        subdir = "gg/"
      } else if (parseInt(audioFilename.charAt(0)) === "number") {
        subdir = "number/"
      } else {
        subdir = audioFilename.charAt(0) + "/";
      }
      audioURL = "http://media.merriam-webster.com/soundc11/" + subdir + audioFilename;
      console.log(audioURL);
      audio = new Audio(audioURL);
    }
    stopLoader();
  }

  xhr.send();

//   $.ajax({
//     url: "http://crossorigin.me/http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + word + "?key=9ef9d420-7fba-449f-9167-bd807480798e", //maybe remove the crossorigin once I get this off Codepen
//     type: "GET",
//     contentType: "text/plain",
//     xhrFields: {
//       withCredentials: false
//     },
//     dataType: "xml",
//     success: function(data) {
//       var audioFilename = $(data).find("hw:contains(" + word + ") ~ sound wav").html();
//       console.log("wav =" + audioFilename);
//       if (audioFilename === undefined || problemList.includes(word)) {
//         if (hasTTS === false) {
//           skipWord();
//         } else {
//           usingTTS = true;
//           console.log("using TTS");
//           tts = new SpeechSynthesisUtterance(word);
//         }
//       } else {
//         var subdir = ""
//         if (audioFilename.startsWith("bix")) {
//           subdir = "bix/";
//         } else if (audioFilename.startsWith("gg")) {
//           subdir = "gg/"
//         } else if (parseInt(audioFilename.charAt(0)) === "number") {
//           subdir = "number/"
//         } else {
//           subdir = audioFilename.charAt(0) + "/";
//         }
//         audioURL = "http://media.merriam-webster.com/soundc11/" + subdir + audioFilename;
//         console.log(audioURL);
//         audio = new Audio(audioURL);
//       }
//       stopLoader();
//     },
//     error: function() {
//       alert("I'm sorry, there was an error. Try reloading?");
//     }
//   });
// }
}

function updateRight() {
  var rightCount = $("#rightScore").html();
  rightCount++;
  $("#rightScore").html(rightCount);
}

function updateWrong() {
  var wrongCount = $("#wrongScore").html();
  wrongCount++;
  $("#wrongScore").html(wrongCount);
  if (studyListArray.includes(word)) {
    //do nuttin
  } else {
  studyListArray.push(word);
  localStorage.studyListArray = studyListArray;
  }
}

function updateRecord() {
  var recordCount = Number(localStorage.recordScore);
  recordCount++;
  $("#recordScore").html(recordCount);
  localStorage.recordScore = recordCount;
}

$("#play").click(function() {
  if (loadaling === false) {
    if (usingTTS === true) {
      window.speechSynthesis.speak(tts);
    } else {
      audio.play();
    }
    $("#responseText").focus();
  } else {
    //do nuttin
  }
});

$("#response").submit(function(event) {
  event.preventDefault();
  var response = $("#responseText").val();
  if (word === spellingList[spellingList.length - 1]) {
    Materialize.toast("Yay!! You made it to the end of the list! Now you can click the 'restart' button to start again at the beginning.", 4000, "rounded");
    updateRight();
    updateRecord();
  } else if (response === word) {
    Materialize.toast("That's right! You rock! Now click to hear the next word.", 4000, "rounded");
    $("#responseText").val("");
    updateRight();
    updateRecord();
    currentWordIndex++;
    getMerriamWebster();
  } else {
    Materialize.toast("Sorry, that's not right. Try again!", 4000, "rounded");
    updateWrong();
  }
});

$("#resetScore").click(function() {
  localStorage.recordScore = 0;
  $("#recordScore").html("0");
});

$("#hint").click(function() {
  Materialize.toast("It starts with: " + word.substring(0, hintLetter), 4000, "rounded");
  hintLetter++;
});

function skipWord() {
  currentWordIndex++;
  getMerriamWebster();
}

$("#skip").click(function() {
  studyListArray.push(word);
  localStorage.studyListArray = studyListArray;
  skipWord();
});

$("#restart").click(function() {
  currentWordIndex = 0;
  getMerriamWebster();
});

$("#random").click(function() {
  currentWordIndex = Math.floor((Math.random() * 100) + 1);
  getMerriamWebster();
});

$("#study").click(function() {
  for (var i = 0; i < studyListArray.length; i++) {
    if (studyListArray[i] === "undefined" || studyListArray[i].length < 1 || $("#studyListWords").find("#" + studyListArray[i]).length) {
      continue;
    } else {
      $("#studyListWords").append('<div id="' + studyListArray[i] + '" class="chip">' + studyListArray[i] + '<i class="close material-icons">close</i></div>');
    }
  }
  $('#studyList').openModal();
});

$("#studyListWords").on("click", ".chip", function() {
  studyListArray.splice(studyListArray.indexOf(this.id), 1);
  localStorage.studyListArray = studyListArray;
})

$("#studyClear").click(function() {
  studyListArray = []
  localStorage.studyListArray = "";
  $("#studyListWords").html("");
});

$(document).ready(getMerriamWebster());
$(document).ready(function() {
  recordCount = Number(localStorage.recordScore);
  $("#recordScore").html(recordCount);
  localStorage.recordScore = recordCount;
});

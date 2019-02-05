
function startTime() {
  var today = new Date();
  var hr = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
  hr = (hr == 0) ? 12 : hr;
  hr = (hr > 12) ? hr - 12 : hr;

  hr = checkTime(hr);
  min = checkTime(min);
  sec = checkTime(sec);
  document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;
  
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var curWeekDay = days[today.getDay()];
  var curDay = today.getDate();
  var curMonth = months[today.getMonth()];
  var curYear = today.getFullYear();
  var date = curWeekDay+", "+curMonth+" "+curDay+" "+curYear;
  document.getElementById("date").innerHTML = date;
  
  var time = setTimeout(function(){ startTime() }, 500);
}
function checkTime(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}

var config = {
    apiKey: "AIzaSyBOGO0exbuHQIBg4Q1Av_ktDnbLCUPGoLs",
    authDomain: "train-scheduler-1e0ed.firebaseapp.com",
    databaseURL: "https://train-scheduler-1e0ed.firebaseio.com",
    projectId: "train-scheduler-1e0ed",
    storageBucket: "train-scheduler-1e0ed.appspot.com",
    messagingSenderId: "295205294996"
  };

  firebase.initializeApp(config);

  var dataRef = firebase.database();

  var Train = "";
  var Destination = "";
  var firstTime = "";
  var Frequency = "";
  
  $("#add-train").on("click", function() {
  
  Train = $("#train-input").val().trim();
  Destination = $("#destination-input").val().trim();
  firstTime = moment($("#time-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
  Frequency = $("#frequency-input").val().trim();
  
  if (Train != '' && Destination != '' && firstTime != '' && Frequency != '') {
    dataRef.ref().push({
      Train: Train,
      Destination: Destination,
      firstTime: firstTime,
      Frequency: Frequency,
    });
  
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
  
    return false;
   } });
  
    dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    var tTrain = childSnapshot.val().Train;
    var tDestination = childSnapshot.val().Destination;
    var tFrequency = childSnapshot.val().Frequency;
    var tFirstTime = childSnapshot.val().firstTime;
  
  var tRemainder = moment().diff(moment.unix(tFirstTime), "minutes") % tFrequency;
  var tMinutes = tFrequency - tRemainder;
  
  var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  $("#Schedule > tbody").append("<tr><td>" + tTrain + "</td><td>" + tDestination + "</td><td>" + tFrequency + " min</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  
  });

  
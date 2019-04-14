$(document).ready(function() {

    


  
    var config = {
        apiKey: "AIzaSyBk4Biy-tIM5Zn1GzI8UVtTwayDyr3dwJ0",
        authDomain: "troystrainsched.firebaseapp.com",
        databaseURL: "https://troystrainsched.firebaseio.com",
        projectId: "troystrainsched",
        storageBucket: "troystrainsched.appspot.com",
        messagingSenderId: "145576592511"
  };

    firebase.initializeApp(config);

    var database = firebase.database();
    var minAway;
    var trnName;
    var trnDest;
    var dptTime;
    var trnFreq;
   
    $("button").on("click", function(){

        event.preventDefault();

        trnName = $("#frm_name").val();
        trnDest = $("#frm_dest").val();

        hour = $("#frm_depart").val();
        var str = hour.split(":");
        today = new Date();
        dptTime = today.setHours(str[0],str[1]);
        trnFreq = $("#frm_freq").val();
       
        database.ref().push({
            Train: trnName,
            Dest: trnDest,
            Depart: dptTime,
            Freq: trnFreq
        });


        $("#frm_name").val("");
        $("#frm_dest").val("");
        $("#frm_depart").val("");
        $("#frm_freq").val("");

    });



    database.ref().on("child_added", function(snapshot){

        trnName = snapshot.val().Train;
        trnDest = snapshot.val().Dest;
        dptTime= snapshot.val().Depart;
        trnFreq = snapshot.val().Freq;

        var getdate = moment();
        var currentDate = getdate.clone();
        currentDate = moment(currentDate).unix();
        dptTime = moment(dptTime).unix();
        var timeDiff = currentDate - dptTime;
        minAway = (timeDiff % (trnFreq*60))/60;
        minAway = parseInt(minAway);
        arrival = moment().add(minAway,`minutes`).format('LT');
        if (minAway === "0") {minAway = "Arriving";}
  
        newTrain = `
            <tr>
            <td>${trnName}</td>
            <td>${trnDest}</td>
            <td>${trnFreq}</td>
            <td>${arrival}</td>
            <td>${minAway}</td>
            </tr>
            `

        $("table").append(newTrain);

    });

});
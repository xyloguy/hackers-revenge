var ending = false;


function populateLB(data) {

	ending = (data.remaining_seconds < (10 * 60) && data.remaining_seconds > 1);
	var elements = $.map(data.leaders,
						 function(val, i) {

							 var status = "won";
							 if (val.winner == 0) {
								 status = "tied";
							 } else if (val.winner == -1) {
								 status = "lost";
							 }

							 var time = new Date(val.last_battle_timestamp).toLocaleTimeString();
							 var battle = status + " against '" + (ending ? "???????" : val.opponent_name) + "' at " + time;
							 var stats = "wins: " + val.wins + " ties: " + val.ties + " losses: " + val.losses;
							 var name = val.name;
							 if (!name.match(/^HCF/)) {
								 name = ending ? "???????????????" : val.name;
							 }

							 return "<tr><th>" + (i+1) + "</th><td>"+name+"<br/><div class='tally'>"+stats+"</div><div class='status'>" + battle + "</div></td><td>"+val.score*100+"</td>";
						 });
	$( "#lb-body" ).html(elements);
}

function populateContenders(data) {

	var elements = $.map(data,
						 function(val, i) {
							 if (val.last_battle_timestamp === null) {
								 return "<li><strong>"+val.name+"</strong> awaiting score."
							 }
							 else {
								 var score = ending ? "????" : (val.score * 100)
								 var time = new Date(val.last_battle_timestamp).toLocaleTimeString();
								 return "<li><strong>"+val.name+"</strong> scored " + score + " at " + time + "</li>";
							 }
						 });

	$( "#battle-body" ).html(elements);
}


function populateStatus(data) {

	if ("remaining_seconds" in data) {
		rem = data.remaining_seconds;

		if (rem < 0) {
			rem = 0
		}
		
		label = "" + rem + " s";
		
		if (rem > (60 * 60)) {
			hours = Math.floor(rem / (60 * 60));
			label = "" + hours + " hrs";
		}
		else if (rem > 60) {
			mins = Math.floor(rem / 60);
			label = "" + mins + " mins";
		}

		$( "#countdown" ).html(label);
	}

	if ("matches" in data) {
		$(" #queue-size" ).html("" + (data.matches.queued + data.matches.running));
	}
}

var t = {
	"leaders": [
		{
			"name": "Foo Bar",
			"score": 56,
			"last_battle_id": 327
		},
		{
			"name": "Bar Foo",
			"score": 49,
			"last_battle_id": 335
		}
	]
}


function getLB() {
	$.ajax({
		cache: false,
		dataType: 'json',
		url: "../api/leaderboard",
		success: function (data) {
			populateLB(data);
		}
	});
}

function getContenders() {
		$.ajax({
		cache: false,
		dataType: 'json',
		url: "../api/contenders",
		success: function (data) {
			populateContenders(data.contenders);
		}
	});
}


function getStatus() {
		$.ajax({
		cache: false,
		dataType: 'json',
		url: "../api/status",
		success: function (data) {
			populateStatus(data);
		}
	});
}



setInterval(getLB,20 * 1000);
setInterval(getContenders,10 * 1000);
setInterval(getStatus, 5 * 1000);

getLB();
getContenders();
getStatus();


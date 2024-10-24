var ending = false;

function populateLB(data) {

    ending = (data.remaining_seconds < (10 * 60) && data.remaining_seconds > 1);
    var total = 0;
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
            total += 1;

            return "<tr><th>" + (i+1) + "</th><td>"+name+"<br/><div class='tally'>"+stats+"</div><div class='status'>" + battle + "</div></td><td>"+val.score*100+"</td>";
        });


    $("#top").html("top " + String(total));
    $( "#lb-body" ).html(elements);
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

setInterval(getLB,30 * 10000);
getLB();

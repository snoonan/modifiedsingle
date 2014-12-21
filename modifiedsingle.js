// loser of winner1 to play loser1 cross to -match
// winner of loser3 play winner3 cross to match^1

var byeslots = [[16,8,12,4,14,6,10],   // 16 players
                [32,16,24,8,28,12,20,4,30,14,22,6,26,10,18]  // 32 players
               ];
var t_left = ["<td>",
              "<td>",
              "<td>",
              "<td>",
              "<td>",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge matchedge\"><span id=\"m_{slot}\" win=\"{winner}\">{slot}</span>",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td>",
              "<td>",
              "<td>"];

var t_center4 = [
"<td><td><td><td><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"a_{match}\">Player {slot}</span><td><td>",
"<td><td><td><td class=\"loseredge matchedge\"><span id=\"l_{match}\" class=\"a_{lmatch}\">&nbsp;&nbsp;</span><td><td class=\"winedge matchedge\"><span id=\"m_{match}\" class=\"a_{wmatch}\"></span><td>",
"<td><td><td class=\"loseredge\"><td class=\"loseredge\"><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"b_{match}\">Player {slot}</span><td class=\"winedge\"><td class=\"winedge\">",
"<td><td class=\"matchedge\"><span id=\"m_{lmatch}\" class=\"a_{lwmatch}\">{lmatch}</span><td class=\"loseredge matchedge\">&nbsp;&nbsp;<td><td><td><td class=\"winedge matchedge\"><span id=\"m_{wmatch}\" class=\"{half}_{wwmatch}\">{wmatch}</span>",
"<td class=\"loseredge matchedge\"><span id=\"m_{lwmatch}\" class=\"{half}_{lwwmatch}\">{lwmatch}</span><td><td class=\"loseredge\"><td><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"a_{match}\">Player {slot}</span><td><td class=\"winedge\">",
"<td class=\"loseredge\"><td class=\"matchedge\"><span id=\"l_{loserof}\" class=\"b_{lwmatch}\">loser of {loserof}</span><td class=\"loseredge\"><td class=\"loseredge matchedge\"><span id=\"l_{match}\" class=\"b_{lmatch}\">&nbsp;&nbsp;</span><td><td class=\"winedge matchedge\"><span id=\"m_{match}\" class=\"b_{wmatch}\"></span><td class=\"winedge\">",
"<td><td><td><td class=\"loseredge\"><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"b_{match}\">Player {slot}</span><td class=\"winedge\"><td>",
"<td><td><td><td><td><td><td>"];

var t_right = ["<td><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge matchedge\"><td class=\"matchedge\"><span id=\"m_{slot}\"  class=\"a_{winner}\" win=\"m_{winner}\">{slot}</span><td>",
               "<td class=\"winedge\"><td><td class=\"winedge matchedge\"><span id=\"m_{winner}\" class=\"{half}_{wwinner}\">{winner}</span>",
               "<td class=\"winedge\">&nbsp;&nbsp;<td class=\"matchedge\"><span id=\"w_{winnerof}\"  class=\"b_{winner}\" win=\"m_{winner}\">winner of {winnerof}</span><td class=\"winedge\">",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td><td><td>"];

var nextplayer = 0;
var maxplayer = 8;

function update_player()
{
   var player = document.getElementById("player");
   var pname = document.getElementById("newplayer");
   var prank = document.getElementById("newrank");

   pname.value = player.value;
   var rank = player.options[player.selectedIndex].innerText;
   rank = rank.split("(")[1];
   rank = rank.split(")")[0];

   var rankidx;
   for (rankidx = 0; rankidx < prank.options.length; rankidx++) {
      if (prank.options[rankidx].value == rank) {
         break;
      }
   }
   prank.selectedIndex = rankidx;

}

function addplayer()
{
   var slot;
   var element;
   var name;
   var rank;

   element = document.getElementById("newplayer");
   name = element.value;
   element = document.getElementById("newrank");
   rank = element.value;

   nextplayer += 1
   if (nextplayer > maxplayer) {
      maxplayer *= 2;
      moreboard(maxplayer);
   }

   slot = document.getElementById("players");
   element = document.createElement("span");
   element.innerText = name+" ("+rank+")";
   element.className += rank;
   slot.appendChild(element);
}

function match(matchid)
{
   var element;
   var player_a_id;
   var player_b_id;
   var player_a;
   var player_b;
   var rank;
   var rank_a;
   var rank_b;

   element = document.getElementById("m_"+matchid);
   if (element == undefined) {
      return;     // No match, must be the winner
   }
   player_a = document.getElementsByClassName("a_"+matchid)[0].children[0];
   if (player_a == undefined || player_a.localName != "span") {
      return;     // No opponent yet.
   }
   rank_a = player_a.className;

   player_b = document.getElementsByClassName("b_"+matchid)[0].children[0];
   if (player_b == undefined || player_b.localName != "span") {
      return;     // No opponent yet.
   }
   rank_b = player_b.className;


   var race;
   var race_str = "";
   race = races[rank_a][rank_b];
   if (race != undefined) {
      race_str = race[0]+"/"+race[1];
   }
   console.log("Newmatch "+matchid+": "+player_a.innerText+" vs "+player_b.innerText + race_str);
   /*
   element.innerHTML="<input id=\"m_"+matchid+"_a\" size=\"1\" value=\""+race[0]+"\">/"+
                     "<input id=\"m_"+matchid+"_b\" size=\"1\" value=\""+race[1]+"\">"+
                     "<select id=\"winner_"+matchid+"\" onchange=\"winner("+matchid+")\">"+
                     "<option value>Select winner"+
                     "<option value=\""+player_a.className+"\">"+player_a.innerHTML+
                     "<option value=\""+player_b.className+"\">"+player_b.innerHTML+
                     "</select>";
   */
   if (race != undefined) {
      element.innerHTML = race[0]+"/"+race[1];
   }
   var sel = document.createElement("select");
   sel.id = "winner_"+matchid;
   sel.onchange = function() { winner(matchid); };
   var opt;
   opt = document.createElement("option");
   opt.innerText = "Select winner";
   sel.appendChild(opt);
   opt = document.createElement("option");
   opt.value = player_a.className;
   if (rank_b == 'Bye') {
      opt.selected = true;
   }
   opt.appendChild(player_a.cloneNode(true));
   sel.appendChild(opt);
   opt = document.createElement("option");
   opt.value = player_b.className;
   opt.appendChild(player_b.cloneNode(true));
   if (rank_a == 'Bye') {
      opt.selected = true;
   }
   sel.appendChild(opt);
   opt = document.createElement("option");
   element.appendChild(sel);

   winner(matchid); // Test for automatic winner (bye)
}

function winner(matchid)
{
   var matchelem = document.getElementById("winner_"+matchid);

   if (matchelem.selectedIndex == 0) {
      return; // no winner selected
   }

   var winnerslot = document.getElementById("w_"+matchid);
   var loserslot = document.getElementById("l_"+matchid);
   var matchparent = matchelem.parentElement;

   var winneridx = matchelem.selectedIndex;;
   var loseridx = 1 + (2-winneridx); // 1 + (2-1) == 2  1 + (2-2) == 1
   var winnerelem = matchelem[winneridx].firstChild;
   var loserelem  = matchelem[loseridx].firstChild;

   matchparent.innerHTML = "";
   matchparent.appendChild(winnerelem.cloneNode(true));
   matchparent.firstChild.onclick = function() { match(matchid); };

   console.log("Match "+matchid+": "+winnerelem.innerText+" beat "+loserelem.innerText);

   if (loserslot) {
      loserslot.innerHTML = "";
      loserslot.appendChild(loserelem.cloneNode(true));
      console.log("Testing loser match "+loserslot.className.slice(2));
      match(loserslot.className.slice(2));
   }
   if (winnerslot) {
      winnerslot.innerHTML = "";
      winnerslot.appendChild(winnerelem.cloneNode(true));
   } else {
      winnerslot = matchparent;
   }

   console.log("Testing winner match "+winnerslot.className.slice(2));
   match(winnerslot.className.slice(2));
}

function seed_players()
{
   var max = maxplayer;
   var row;

   if (nextplayer < 8) {
      return; // not enough players.
   }
   document.getElementById("pregame").hidden = true;
   document.getElementById("board").hidden = false;

   // second round losers
   for(row = 0; row < max/4; row++) {
      var span = document.getElementById("l_"+String.fromCharCode(65+row));
      span.id = "l_"+(24+(max/4-row));
   }
   // loser side winners
   for(row = 0; row < max/8; row++) {
      var span = document.getElementById("w_"+String.fromCharCode(65+row));
      if (max == 8) {
         row = 1; // Cheat to get correct cross
      }
      span.id = "w_"+(45+(Math.floor(row/2))*2+(1-row%2));
   }
   var plist = document.getElementById("players").children;
   plist = [].slice.call(plist); // HtmlCollection to array
   plist.shuffle();
   var byes;
   if (max <= 8) {
      byes = []; // Minimum 8 players
   } else if (max <= 16) {
      byes = byeslots[0].slice(0,16-nextplayer);
   } else {
      byes = byeslots[1].slice(0,32-nextplayer);
   }

   var player = 0;
   for(row = 0; row < max; row ++) {
      var element;
      if (byes.indexOf(row+1) != -1) {
         element = document.createElement("span");
         element.innerText = "Bye";
         element.className = "Bye";
      } else {
         element = plist[player];
         player += 1;
      }
      var slot = document.getElementById("s_"+(row+1));
      slot.innerHTML = "";
      slot.appendChild(element);
   }
   for(row = 0; row < max/2; row++) {
      console.log("initial matches "+(row+1));
      match(row+1);
   }
}

function moreboard(max)
{
   var row;
   if (max == 8) {
      row = 0;
   } else if (max == 16) {
      row = 16;
   } else {
      row = 32;
   }

   // center column is name/blank/name/blank/...
   var table_node = document.getElementById("board");
   for (; row < max*2; row++) {
      var r;
      r = t_left[row%16].format({
         "slot": Math.floor(row/16)+45,
      });
      r +=t_center4[row%8].format({
         "slot": (row/2)+1,
         "half": "ab".charAt(Math.floor((row%16)/8)),
         "wmatch": Math.floor(row/8)+25,
         "wwmatch": Math.floor(row/16)+41,
         "lmatch": Math.floor(row/8)+17,
         "lwmatch":Math.floor(row/8)+33,
         "lwwmatch": Math.floor(row/16)+45,
         "match":  Math.floor(row/4)+1,
         "loserof":String.fromCharCode(65+Math.floor(row/8))
         });
      r += t_right[row%16].format({
         "slot":    Math.floor(row/16)+41,
         "winner":  Math.floor(row/16)+49,
         "half": "ab".charAt(Math.floor((row%32)/16)),
         "wwinner": Math.floor(row/32)+53,
         "winnerof":String.fromCharCode(65+Math.floor(row/16))
      });
      if (row%32 == 16) {
         r += "<td class=\"winedge16 matchedge16\"><span id=\"m_{slot}\" class=\"{half}_{next}\">{slot}</span>".format({"slot":Math.floor(row/32)+53,"next":Math.floor(row/64)+55,"half":"ab".charAt(Math.floor((row%64)/32))});
      }else if (row%32 > 8 && row%32 <= 24) {
         r += "<td class=\"winedge16\">";
      } else {
         r += "<td>";
      }
      if (row%64 == 32) {
         r += "<td class=\"winedge32 matchedge32\"><span id=\"m_{slot}\">{slot}</span>".format({"slot":Math.floor(row/64)+55});
      } else if (row%64 > 16 && row%64 <= 48) {
         r += "<td class=\"winedge32\">";
      } else {
         r += "<td>";
      }
      var child = document.createElement("tr");
      child.innerHTML = r;
      table_node.appendChild(child);
   }
   // second round losers
   for(row = 0; row < max/4; row++) {
      var span = document.getElementById("l_"+String.fromCharCode(65+row));
      span.innerText = "loser of "+(24+(max/4-row));
   }
   // loser side winners
   for(row = 0; row < max/8; row++) {
      var span = document.getElementById("w_"+String.fromCharCode(65+row));
      if (max == 8) {
         row = 1; // Cheat to get correct cross
      }
      span.innerText = "winner of "+(45+(Math.floor(row/2))*2+(1-row%2));
   }
   if (max >= 16) {
      var e;
      var x = document.getElementsByClassName("winedge16");
      // Work down as the list is live, and we are changing membership
      for (e=x.length-1; e >=0; e--) {
         x[e].className = x[e].className.replace(/16/g,"");
      }
   }
   if (max >= 32) {
      var e;
      var x = document.getElementsByClassName("winedge32");
      // Work down as the list is live, and we are changing membership
      for (e=x.length-1; e >=0; e--) {
         x[e].className = x[e].className.replace(/32/g,"");
      }
   }
}



if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}

function initranks(ranks)
{
   var sel = document.getElementById("newrank");
   var i;

   for (i=0; i < ranks.length; i++) {
      var e = document.createElement("option");
      e.value = ranks[i];
      e.innerText = ranks[i];
      sel.appendChild(e);
   }
}
function initplayers(players)
{
   var sel = document.getElementById("player");
   var i;

   for (i=0; i < players.length; i++) {
      var e = document.createElement("option");
      e.value = players[i].name;
      e.innerText = players[i].name+" ("+players[i].rank+")";
      sel.appendChild(e);
   }
}

//document.onready = function() {
if (1) {
   initranks(ranks);
   initplayers(players);
}

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
    while (s.length) this.push(s.pop());
    return this;
}

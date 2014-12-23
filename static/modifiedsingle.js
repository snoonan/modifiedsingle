// loser of winner1 to play loser1 cross to -match
// winner of loser3 play winner3 cross to match^1

var tourneydate;

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

// Config
var club;
var clubname;
var players;
// end config

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

   console.log("Match "+matchid+": "+winnerelem.innerText+" beat "+loserelem.innerText);
   var race = matchparent.innerText.split('/');
   var player_w = winnerelem.innerText.split('(')[0].trim();
   var rank_w = winnerelem.className;
   var target_w = race[winneridx-1];
   var player_l = loserelem.innerText.split('(')[0].trim();
   var rank_l = loserelem.className;
   var target_l = race[loseridx-1];
   submit_match(matchid, player_w, rank_w, target_w, player_l, rank_l, target_l );

   matchparent.innerHTML = "";
   matchparent.appendChild(winnerelem.cloneNode(true));
   matchparent.firstChild.onclick = function() { match(matchid); };

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

   tourneydate = Math.floor(Date.now()/1000);

   document.getElementById("pregame").hidden = true;
   generateboard(maxplayer);
   document.getElementById("board").hidden = false;
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

function generateboard(max)
{
   var row;
   // center column is name/blank/name/blank/...
   var table_node = document.getElementById("board");
   var loser1  = max/2
   var winner1 = loser1+max/4;
   var loser2  = winner1+max/4; // Fold loser of winner1
   var winner2 = loser2+max/4;
   var loser3  = winner2+max/8;
   var winner3 = loser3+max/8;  // Fold winner of loser bracket
   var winner4 = winner3+max/8;
   var winner5 = winner4+max/16;
   for (row = 0; row < max*2; row++) {
      var r;
      r = t_left[row%16].format({
         "slot": Math.floor(row/16)+loser3+1,
      });
      r +=t_center4[row%8].format({
         "slot": (row/2)+1,
         "half": "ab".charAt(Math.floor((row%16)/8)),
         "wmatch": Math.floor(row/8)+winner1+1,
         "wwmatch": Math.floor(row/16)+winner2+1,
         "lmatch": Math.floor(row/8)+loser1+1,
         "lwmatch":Math.floor(row/8)+loser2+1,
         "lwwmatch": Math.floor(row/16)+loser3+1,
         "match":  Math.floor(row/4)+1,
         "loserof":loser2 - Math.floor(row/8)      // loser2 is end of winner1
         });
      var winnerof = (Math.floor(row/32)*2+(1-(Math.floor((row%32)/16))+loser3+1)); // /32 toggle low bit, + loser3 (+1 bias)
      if (max == 8) {
         winnerof = loser3+1;    // 8 player only has one loser fold in
      }
      r += t_right[row%16].format({
         "slot":    Math.floor(row/16)+winner2+1,
         "winner":  Math.floor(row/16)+winner3+1,
         "half": "ab".charAt(Math.floor((row%32)/16)),
         "wwinner": Math.floor(row/32)+winner4+1,
         "winnerof":winnerof
      });
      var i;
      var base = winner4;
      for (i = 16; i <= max; i = i*2) {
         if (row % (i*2) == i) {
            r += "<td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">{slot}</span>".format({
                 "slot":Math.floor(row/(i*2))+base+1,
                 "next":Math.floor(row/(i*4))+base+(max/i)+1,
                 "half":"ab".charAt(Math.floor((row%(i*4))/i))
               });

         } else if ((row % (i*2) > i/2) && (row % (i*2) <= 3*i/2)) {
            r += "<td class=\"winedge\">";
         } else {
            r += "<td>";
         }
         base += max/i;
      }

      var child = document.createElement("tr");
      child.innerHTML = r;
      table_node.appendChild(child);
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
   load_config();
}

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
    while (s.length) this.push(s.pop());
    return this;
}

function load_config()
{

   var r = new XMLHttpRequest(); 
   r.open("GET", "Config/", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      console.log(r.responseText);
      eval(r.responseText);
      document.title = clubname;
      initranks(ranks);
      initplayers(players);
   };
   r.send();
}

function submit_match(matchid, player_w, rank_w, target_w, player_l, rank_l, target_l )
{
   var r = new XMLHttpRequest(); 
   r.open("POST", "Match/", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      console.log(r.responseText);
   };
   var f = new FormData();

   f.append("club",club);
   f.append("matchid",matchid);
   f.append("date",tourneydate);
   f.append("playerW",player_w);
   f.append("handicapW",rank_w);
   f.append("scoreW",0);
   f.append("targetW",target_w);
   f.append("playerL",player_l);
   f.append("handicapL",rank_l);
   f.append("scoreL",0);
   f.append("targetL",target_l);
   r.send(f);
}

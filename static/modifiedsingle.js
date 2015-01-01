// loser of winner1 to play loser1 cross to -match
// winner of loser3 play winner3 cross to match^1

var tourneydate;
var canupdate = false;

var t_left = ["<td>",
              "<td>",
              "<td>",
              "<td>",
              "<td>",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge matchedge\"><span id=\"m_{slot}\" win=\"{winner}\">#{slot}</span>",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td class=\"loseredge\">",
              "<td>",
              "<td>",
              "<td>"];

var t_center4 = [
"<td><td><td><td><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"a_{match}\"></span><td><td>",
"<td><td><td><td class=\"loseredge matchedge\"><span id=\"l_{match}\" class=\"a_{lmatch}\">&nbsp;&nbsp;</span><td><td class=\"winedge matchedge\"><span id=\"m_{match}\" class=\"a_{wmatch}\"></span><td>",
"<td><td><td class=\"loseredge\"><td class=\"loseredge\"><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"b_{match}\"></span><td class=\"winedge\"><td class=\"winedge\">",
"<td><td class=\"matchedge\"><span id=\"m_{lmatch}\" class=\"a_{lwmatch}\">#{lmatch}</span><td class=\"loseredge matchedge\">&nbsp;&nbsp;<td><td><td><td class=\"winedge matchedge\"><span id=\"m_{wmatch}\" class=\"{half}_{wwmatch}\">#{wmatch}</span>",
"<td class=\"loseredge matchedge\"><span id=\"m_{lwmatch}\" class=\"{half}_{lwwmatch}\">#{lwmatch}</span><td><td class=\"loseredge\"><td><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"a_{match}\"></span><td><td class=\"winedge\">",
"<td class=\"loseredge\"><td class=\"matchedge\"><span id=\"l_{loserof}\" class=\"b_{lwmatch}\">loser of #{loserof}</span><td class=\"loseredge\"><td class=\"loseredge matchedge\"><span id=\"l_{match}\" class=\"b_{lmatch}\">&nbsp;&nbsp;</span><td><td class=\"winedge matchedge\"><span id=\"m_{match}\" class=\"b_{wmatch}\"></span><td class=\"winedge\">",
"<td><td><td><td class=\"loseredge\"><td class=\"matchedge\"><span id=\"s_{slot}\" class=\"b_{match}\"></span><td class=\"winedge\"><td>",
"<td><td><td><td><td><td><td>"];

var t_right = ["<td><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge\"><td><td>",
               "<td class=\"winedge matchedge\"><td class=\"matchedge\"><span id=\"m_{slot}\"  class=\"a_{winner}\" win=\"m_{winner}\">#{slot}</span><td>",
               "<td class=\"winedge\"><td><td class=\"winedge matchedge\"><span id=\"m_{winner}\" class=\"{half}_{wwinner}\">#{winner}</span>",
               "<td class=\"winedge\">&nbsp;&nbsp;<td class=\"matchedge\"><span id=\"w_{winnerof}\"  class=\"b_{winner}\" win=\"m_{winner}\">winner of #{winnerof}</span><td class=\"winedge\">",
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

function match_results(matchid, player_a, rank_a, player_b, rank_b, winneridx)
{
   if (matchid <= maxplayers/2) {
      var slot,element;

      slot = document.getElementById("s_"+(((matchid-1)*2)+1));
      element = document.createElement("span");
      element.innerText = player_a;
      if (player_a != "Bye") {
         element.innerText += " ("+rank_a+")";
      }
      element.className += rank_a;
      slot.appendChild(element);
      slot = document.getElementById("s_"+(((matchid-1)*2)+2));
      element = document.createElement("span");
      element.innerText = player_b;
      if (player_b != "Bye") {
         element.innerText += " ("+rank_b+")";
      }
      element.className += rank_b;
      slot.appendChild(element);
      match(matchid);

   }
   if (winneridx > 0) {
      var matchelem = document.getElementById("winner_"+matchid);
      if (matchelem == undefined) {
         // Match must have already been decided.
         return;
      }

      matchelem.selectedIndex = winneridx;
      winner(matchid);
   }
}

/* Return true if match finished */
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
   sel.onchange = function() { winner(matchid); send_matches(); };
   var opt;
   opt = document.createElement("option");
   opt.innerText = "Select winner of #"+matchid;
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

   var playername_a = player_a.innerText.split('(')[0].trim();
   var playername_b = player_b.innerText.split('(')[0].trim();

   submit_match(matchid, playername_a, player_a.className, race[0], playername_b, player_b.className, race[1], 0 )
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
   var elem_a  = matchelem[1].firstChild;
   var elem_b  = matchelem[2].firstChild;

   console.log("Match "+matchid+": "+winnerelem.innerText+" beat "+loserelem.innerText);
   var race = matchparent.innerText.split('/');
   var player_a = elem_a.innerText.split('(')[0].trim();
   var rank_a = elem_a.className;
   var target_a = race[0];
   var player_b = elem_b.innerText.split('(')[0].trim();
   var rank_b = elem_b.className;
   var target_b = race[1];
   submit_match(matchid, player_a, rank_a, target_a, player_b, rank_b, target_b, winneridx );

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
            r += "<td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
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


//document.onready = function() {
if (1) {

}

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
    while (s.length) this.push(s.pop());
    return this;
}

var to_submit = {};
function submit_match(matchid, player_a, rank_a, target_a, player_b, rank_b, target_b, winner )
{
   if (canupdate == false) {
      return;
   }
   if (!to_submit.hasOwnProperty(matchid)) {
      to_submit[matchid] = {}
   }
   to_submit[matchid]["player_a"] = player_a;
   to_submit[matchid]["rank_a"] = rank_a;
   to_submit[matchid]["target_a"] = target_a;
   to_submit[matchid]["player_b"] = player_b;
   to_submit[matchid]["rank_b"] = rank_b;
   to_submit[matchid]["target_b"] = target_b;
   to_submit[matchid]["winner"] = winner;
   console.log("m:"+matchid+" w:"+winner);
}

function send_matches()
{
   for (var i in to_submit) {
      if (!to_submit.hasOwnProperty(i)) {
         continue;
      }
      _submit_match(i, to_submit[i]["player_a"],to_submit[i]["rank_a"],to_submit[i]["target_a"], to_submit[i]["player_b"],to_submit[i]["rank_b"],to_submit[i]["target_b"], to_submit[i]["winner"]);
   }
   to_submit = {};
}

function _submit_match(matchid, player_a, rank_a, target_a, player_b, rank_b, target_b, winner )
{
   var r = new XMLHttpRequest(); 
   r.open("POST", "/Match/", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      console.log(r.responseText);
   };
   var f = new FormData();

   f.append("club",club);
   f.append("matchid",matchid);
   f.append("tourney",tourneyname);
   f.append("playerA",player_a);
   f.append("handicapA",rank_a);
   f.append("scoreA",0);
   f.append("targetA",target_a);
   f.append("playerB",player_b);
   f.append("handicapB",rank_b);
   f.append("scoreB",0);
   f.append("targetB",target_b);
   f.append("winner",winner);
   console.log("!!m:"+matchid+" w:"+winner);
   r.send(f);
}


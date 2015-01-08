var tourneydate;
var canupdate = false;

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
   var openlist = document.getElementById("openmatches");
   var existing = document.getElementById("o_"+matchid);
   if (openlist && !existing) {
      var open = document.createElement("tr");
      open.id = 'o_'+matchid

      var td = document.createElement("td");
      td.innerText = "Assign ";

      var loc = document.createElement("input");
      loc.size = 3;
      loc.onblur = assigntable;
      loc.onkeypress = keypress;
      td.appendChild(loc);
      open.appendChild(td);

      td = document.createElement("td");
      td.innerText = '#'+matchid+' '+player_a.innerText+" vs "+player_b.innerText + ' '+race_str;
      open.appendChild(td);

      var child = openlist.children[0];

      while(child && +child.id.slice(2) < matchid) {
         child = child.nextSibling;
      }
      openlist.insertBefore(open, child);
   }

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

function keypress(e)
{
   console.log(e);
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
   var cancel = document.createElement("select");
   cancel.innerHTML = "<option><option>bump skill<option>lower skill<option>change winner";
   cancel.style.width="20px";
   cancel.onchange = function() { editplayer(matchparent.children[0]); };

   matchparent.appendChild(cancel);


   if (loserslot) {
      loserslot.innerHTML = "";
      loserslot.appendChild(loserelem.cloneNode(true));
      var cancel = document.createElement("select");
      cancel.innerHTML = "<option><option>bump skill<option>lower skill<option>change winner";
      cancel.style.width="20px";
      cancel.onchange = function() { editplayer(loserslot.children[0]); };

      loserslot.appendChild(cancel);
      console.log("Testing loser match "+loserslot.className.slice(2));
      match(loserslot.className.slice(2));
   }
   if (winnerslot) {
      winnerslot.innerHTML = "";
      winnerslot.appendChild(winnerelem.cloneNode(true));
      var cancel = document.createElement("select");
      cancel.innerHTML = "<option><option>bump skill<option>lower skill<option>change winner";
      cancel.style.width="20px";
      cancel.onchange = function() { editplayer(winnerslot.children[0]); };

      winnerslot.appendChild(cancel);
   } else {
      winnerslot = matchparent;
   }

   console.log("Testing winner match "+winnerslot.className.slice(2));
   match(winnerslot.className.slice(2));

   // Now remove the match info, and donate the table
   var open = document.getElementById('o_'+matchid);
   if (open) {
      var loc = open.children[0].innerText;
      var list = open.parentElement;
      list.removeChild(open);
      if (loc == "Assign ") {
         return;
      }
      loc = loc.split(":")[1].trim()
      var child = list.getElementsByTagName('input')[0];
      if (child) {
         child.focus();
         child.value = loc;
      }
   }
}

function editplayer(pinfo)
{
   var sel = pinfo.parentElement.children[1].selectedIndex;

   if (sel == 1) {
      var rank = pinfo.className;
      rank = ranks[ranks.indexOf(rank)-1];
      pinfo.className = rank;
      pinfo.innerText = pinfo.innerText.split('(')[0]+"("+rank+")";

      match(pinfo.parentElement.className.slice(2));
   } else if (sel == 2) {
      var rank = pinfo.className;
      rank = ranks[ranks.indexOf(rank)+1];
      pinfo.className = rank;
      pinfo.innerText = pinfo.innerText.split('(')[0]+"("+rank+")";

      match(pinfo.parentElement.className.slice(2));
   } else if (sel == 3) {
      var matchid = pinfo.parentElement.id.slice(2);
      match(matchid);
   }
}

function assigntable(e)
{
   var loc = e.target.value;
   if (loc.length) {
      e.target.parentElement.innerText = "Table: "+loc;
   }
}

var to_submit = {};
function submit_match(matchid, player_a, rank_a, target_a, player_b, rank_b, target_b, winner )
{
   canupdate = false;
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


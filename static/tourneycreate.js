// loser of winner1 to play loser1 cross to -match
// winner of loser3 play winner3 cross to match^1

var tourneydate;

// Config
var club;
var clubname;
var players;
// end config

var nextplayer = 0;
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

   slot = document.getElementById("players");
   element = document.createElement("span");
   element.innerText = name+" ("+rank+")";
   element.className += rank;
   var cancel = document.createElement("span");
   cancel.innerText = "x";
   cancel.className = "cancel";
   cancel.onclick = removeplayer;

   element.appendChild(cancel);
   slot.appendChild(element);
}

function removeplayer(e) {
   var name = document.getElementById("newplayer");
   var rank = document.getElementById("newrank");

   name.value = e.target.parentElement.innerText.split('(')[0].trim();
   rank.value = e.target.parentElement.innerText.split('(')[1].split(')')[0].trim();
   e.target.parentElement.parentElement.removeChild(e.target.parentElement);
}

function seed_players()
{

   var plist = document.getElementById("players").children;
   var nplayers = plist.length;
   var max = plist.length;
   // round down to power of two
   while(max&(max-1)) {
      max = max&(max-1);
   }
   // double in it was changed by rounding
   if (max != plist.length) {
      max *= 2;
   }
   if (nplayers < 8) {
      return; // not enough players.
   }
   var pre = document.getElementById("pregame");
   pre.hidden = true;
   var pre = document.getElementById("loading");
   pre.hidden = false;

   tourneydate = Math.floor(Date.now()/1000);
   var tname = document.getElementById("tname");

   var r = new XMLHttpRequest(); 
   r.open("POST", "/Tourney/"+club+"/create", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      setTimeout(fill_slots, 1000);
   };
   var f = new FormData();

   f.append("club",club);
   f.append("name",tname.value);
   f.append("date",tourneydate);
   f.append("size",max);
   r.send(f);

   tourneyname = tname.value.replace(/[^a-zA-Z0-9]/g, "-")

}

function fill_slots()
{
   var row;

   var plist = document.getElementById("players").children;
   var nplayers = plist.length;
   var max = plist.length;
   // round down to power of two
   while(max&(max-1)) {
      max = max&(max-1);
   }
   // double in it was changed by rounding
   if (max != plist.length) {
      max *= 2;
   }
   maxplayers = max; // update global
   plist = [].slice.call(plist); // HtmlCollection to array
   plist.shuffle();
   var byes = [1];

   for(var i = 1; i < max/2; i*=2) {
      var next = [];
      for(var b = 0; b < byes.length; b++) {
         next.push(byes[b]+i);
         next.push(byes[b]);
      }
      byes = next;
   }
   byes = byes.slice(0,max-nplayers);

   var slot = 0;
   var player_a;
   var rank_a;
   var player_b;
   var rank_b;



   while (slot < max) {
      var p = plist.pop();
      player_a = p.innerText.split('(')[0].trim();
      rank_a = p.className;
      if (byes.indexOf(slot/2+1) != -1) {
         player_b = "Bye";
         rank_b = "Bye";
      } else {
         p = plist.pop();
         player_b = p.innerText.split('(')[0].trim();
         rank_b = p.className;
      }
      slot += 2;
      submit_match(slot/2, player_a, rank_a, races[rank_a][rank_b][0], player_b, rank_b, races[rank_a][rank_b][1], 0 );
   }
   setTimeout(function () { window.location.pathname = "/Tourney/"+club+"/"+tourneyname; }, 5000);
}

//document.onready = function() {
if (1) {
   var tname = document.getElementById("tname");
   var tnow = new Date();
   tname.value = ""+(tnow.getMonth() + 1) + "-" + tnow.getDate() + "-" + tnow.getFullYear();

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
   r.open("GET", "/Config/"+club, true);
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

function submit_match(matchid, player_a, rank_a, target_a, player_b, rank_b, target_b, winner )
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
   r.send(f);
}

function adddummy() {
   var name = document.getElementById("newplayer");
   var rank = document.getElementById("newrank");

   for(var i = 0; i < 10; i++) {
      name.value = "Player_"+nextplayer;
      rank.value = ranks[nextplayer%ranks.length];
      addplayer();
   }
}

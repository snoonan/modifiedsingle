
function tname_set()
{
   var tname = document.getElementById("tname");
   document.title=tname
}

function newplayer()
{
   var element = document.getElementById("createplayer");
   element.hidden = false;
}

function  insert_player(name, rank)
{
   var slot;
   var element;

   slot = document.getElementById("players");
   element = document.createElement("div");
   element.innerText = name+" ("+rank+")";
   element.className += rank;
   var paid = document.createElement("span");
   paid.innerText = "$";
   paid.className = "unpaid";
   paid.onclick = playerpaid;
   element.insertBefore(paid, element.firstChild);
   if (slot.childElementCount%2 == 0) {
      var pad = document.createElement("span");
      pad.innerText = "  ";
      element.insertBefore(pad, element.firstChild);
   }
   var cancel = document.createElement("span");
   cancel.innerText = "x";
   cancel.className = "cancel";
   cancel.onclick = removeplayer;
   document.getElementById('start').disabled = true;

   element.appendChild(cancel);
   slot.appendChild(element);

   element = document.getElementById("player_count");
   element.innerText = slot.childElementCount;

}

function playerpaid(e)
{
   var i=0;

   if (e.target.parentElement.children[0].innerText[0] != '$') {
      i = 1;
   }
   if (e.target.parentElement.children[i].className == 'unpaid') {
      e.target.parentElement.children[i].className = 'paid';
   } else {
      e.target.parentElement.children[i].className = 'unpaid';
   }
   if (document.getElementsByClassName('unpaid').length == 0) {
      document.getElementById('start').disabled = false;
   } else {
      document.getElementById('start').disabled = true;
   }
}

function removeplayer(e) {
   var name = document.getElementById("newplayer");
   var rank = document.getElementById("newrank");

   name.value = e.target.parentElement.childNodes[1].data.split('(')[0].trim();
   rank.value = e.target.parentElement.childNodes[1].data.split('(')[1].split(')')[0].trim();
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

   tourneydate = Math.floor(Date.now()/1000);
   var tname = document.getElementById("tname");


   var r = new XMLHttpRequest(); 
   r.open("POST", "/Tourney/"+club+"/create", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      // Wait one second to let appengine have a chance of finding the record.
      // The price of eventualy-consistent.
      setTimeout(function () { fill_slots(max); }, 1000);
   };
   var f = new FormData();

   f.append("club",club);
   f.append("name",tname.value);
   f.append("date",tourneydate);
   f.append("size",max);
   r.send(f);

   tourneyname = tname.value.replace(/[^a-zA-Z0-9]/g, "-")

   // Move the url to the tourney address, let the back button work (but really it will not).
   history.pushState(undefined, tname, "/Tourney/"+club+"/"+tourneyname)
}

function fill_slots(max)
{
   var row;

   var plist = document.getElementById("players").children;
   var nplayers = plist.length;

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

   canupdate = true;
   generateboard(max);

   while (slot < max) {
      var p = plist.pop();
      player_a = p.childNodes[1].data.split('(')[0].trim();
      rank_a = p.className;
      if (byes.indexOf(slot/2+1) != -1) {
         player_b = "Bye";
         rank_b = "Bye";
      } else {
         p = plist.pop();
         player_b = p.childNodes[1].data.split('(')[0].trim();
         rank_b = p.className;
      }
      slot += 2;
      match_results(slot/2, player_a, rank_a, player_b, rank_b, 0 );
      submit_match(slot/2, player_a, rank_a, 0, player_b, rank_b, 0, undefined )
   }
   send_matches();
}

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
    while (s.length) this.push(s.pop());
    return this;
}

var tname = document.getElementById("tname");
var tnow = new Date();
tname.value = ""+(tnow.getMonth() + 1) + "-" + tnow.getDate() + "-" + tnow.getFullYear();


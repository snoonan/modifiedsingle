
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

function createplayer()
{
   var r = new XMLHttpRequest(); 
   var name  = document.getElementById("newplayer").value;
   var fname = document.getElementById("fname").value;
   var lname = document.getElementById("lname").value;
   var rank  = document.getElementById("newrank").value;

   if (fname == "") {
      fname = name;
   }

   r.open("POST", "/Player/"+club+"/"+name, true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return; 
      console.log(r.responseText);
   };
   var f = new FormData();
   f.append("club",club);
   f.append("name",name);
   f.append("fname",fname);
   f.append("lname",lname);
   f.append("rank",rank);
   f.append("op","update");
   r.send(f);
}

function addplayer()
{
   var slot;
   var element;
   var name;
   var rank;

   element = document.getElementById("createplayer");
   element.hidden = true;

   element = document.getElementById("newrank");
   rank = element.value;
   element = document.getElementById("newplayer");
   name = element.value;

   var found;
   var i;

   found = false;
   for (i in players) {
      if (name == players[i]["name"] ) {
         found = true;
         break;
      }
   }
   if (!found) {
      createplayer();
   }
   insert_player(name, rank);
}

function validate()
{
   var element;
   var name;
   var good;
   var i;

   element = document.getElementById("newplayer");
   name = element.value;
   good = document.getElementById("addplayer");
   good.disabled = false;
   element.className = "";
   for (i in players) {
      if (name == players[i]["name"] ) {
         good.disabled = true;
         element.className = 'cancel';
         return;
      }
   }
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

load_config();

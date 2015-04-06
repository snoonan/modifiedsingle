
function tname_set()
{
   var tname = document.getElementById("tname");
   document.title=tname.value

   var tname = document.getElementById("tname");
   tourneyname = tname.value.replace(/[^a-zA-Z0-9]/g, "-")
   tourneydate = Math.floor(Date.now()/1000);

   var r = new XMLHttpRequest(); 
   r.open("POST", "/Tourney/"+club+"/create", true);
   r.onreadystatechange = function () {
      if (r.status == 301 && r.responseText != "" && document.location.pathname != r.responseText) {
         document.location = r.responseText;
      }
      if (r.readyState != 4 || r.status != 200) return; 
      return;
   };
   var f = new FormData();

   f.append("club",club);
   f.append("name",tname.value);
   f.append("date",tourneydate);
   r.send(f);
}

function newplayer()
{
   var element = document.getElementById("createplayer");
   element.hidden = false;
}

var s = document.createElement("style");
s.innerHTML="#player option { display: block; }"
document.body.appendChild(s)

function  filter_players()
{
   var input = document.getElementById('newplayer');
   var filter = input.value;
   var cursor = input.selectionStart;
   filter = filter.slice(0,cursor);

   if (filter == "") {
      s.innerHTML="#player option { display: block; }";
      return;
   }

   s.innerHTML="#player option:not([value*='"+filter+"']) { display: none; }";
   var opts = document.querySelectorAll("#player option[value^='"+filter+"']");
   if (opts.length) {
      opts[0].selected = true;
      input.value = opts[0].value;
      update_player();
      input.selectionStart = cursor;
      input.selectionEnd = cursor;
   } else {
      input.value = filter;
      input.selectionStart = cursor;
      input.selectionEnd = cursor;
   }

}

function  insert_player(name, rank, markpaid)
{
   var slot;
   var element;

   s.innerHTML="#player { display: default }";
   slot = document.getElementById("winners");
   element = document.createElement("div");
   element.innerText = name+" ("+rank+")";
   element.className += rank;
   var place = document.createElement("select");
   place.innerHTML = "<option>1st<option>2nd<option>3rd/4th";
   place.className = "place";
   element.appendChild(place);
   var cancel = document.createElement("button");
   cancel.innerText = "x";
   cancel.className = "cancel";
   cancel.onclick = removeplayer;

   element.appendChild(cancel);
   slot.appendChild(element);

}

function removeplayer(e) {
   e.target.parentElement.parentElement.removeChild(e.target.parentElement);

   var name = document.getElementById("newplayer");
   var rank = document.getElementById("newrank");

   name.value = e.target.parentElement.childNodes[2].data.split('(')[0].trim();
   rank.value = e.target.parentElement.childNodes[2].data.split('(')[1].split(')')[0].trim();

   var r = new XMLHttpRequest(); 
   r.open("POST", "/Tourney/"+club+"/"+tourneyname+"/enter", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
      return;
   };
   var f = new FormData();

   f.append("pname",name.value);
   f.append("op","delete");
   r.send(f);
}

function place_players()
{
   var name,rank,place;
   var list = document.getElementById("players");
   var item;

   for(var item = 0; item < list.children.length; item++) {
   name = list.children[item].childNodes[0].data.split('(')[0].trim();
   rank = list.children[item].childNodes[0].data.split('(')[1].split(')')[0].trim();
   place = list.children[item].childNodes[1].selectedIndex;
   place = "WFS".charAt(place);

   place_player(name, rank, place);
   }
}

function place_player(name, rank, place)
{
   var r = new XMLHttpRequest(); 
   r.open("POST", "/Winner/", true);
   r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
      return;
   };
   var f = new FormData();

   f.append("tourney",tourneyname);
   f.append("club",club);
   f.append("pname",name);
   f.append("rank",rank);
   f.append("place", place)
   f.append("op","finish");
   r.send(f);
}

var tname = document.getElementById("tname");
if (tourneyname == undefined) {
   var tnow = new Date();
   tourneyname = ""+(tnow.getMonth() + 1) + "-" + tnow.getDate() + "-" + tnow.getFullYear();
}
tname.value = ""+(tnow.getMonth() + 1) + "-" + tnow.getDate() + "-" + tnow.getFullYear();
tname_set();

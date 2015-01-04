var wfoldin = 2; // After round n on of winners.
var lfoldin = 2; // Fold in n rounds of losses.

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
      var r = "";
      var base = max/2;
      var nextbase = base + 2*(max/2);
      for (i = 4; i <= Math.pow(2,wfoldin+1); i = i*2) {
         if (row % (i*2) == i) {
            console.log("slot",Math.floor(row/(i*2))+base+1," ",row," ",row/(i*2));
            r = "<td class=\"loseredge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
                 "slot":Math.floor(row/(i*2))+base+1,
                 "next":Math.floor(row/(i*4))+nextbase+1,
                 "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
               }) + r;
         } else if ((row % (i*2) > i/2) && (row % (i*2) <= 3*i/2)) {
            r = "<td class=\"loseredge\">" + r;
         } else {
            r = "<td>" + r;
         }
         base = nextbase;
         nextbase = 2*max/(i*2);
         nextbase += base;
      }

      if (row%4 == 2) {
               r += "<td class=\"loseredge matchedge\"><span id=\"l_{slot}\" class=\"{half}_{next}\"></span>".format({
                 "slot":Math.floor(row/4)+1,
                 "next":Math.floor(row/8)+(max/2)+1,
                 "half":"ab".charAt(Math.floor((row%8)/4))
                  });
      } else if (row%4 == 3) {
         r += "<td class=\"loseredge\">";
      } else {
         r += "<td>";
      }
      if (row%2 == 1) {
         r += "<td class=\"matchedge\"><span id=\"s_{slot}\" class=\"{half}_{next}\"></span>".format({
                 "slot":Math.floor(row/2)+1,
                 "next":Math.floor(row/4)+1,
                 "half":"ab".charAt(Math.floor((row%4)/2))
               });
      } else {
         r += "<td>";
      }
      var i;
      base = 0;
      nextbase = base + 1.5*(max/2);
      for (i = 2; i <= max; i = i*2) {
         if (row % (i*2) == i) {
            r += "<td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
                 "slot":Math.floor(row/(i*2))+base+1,
                 "next":Math.floor(row/(i*4))+nextbase+1,
                 "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
               });

         } else if ((row % (i*2) > i/2) && (row % (i*2) <= 3*i/2)) {
            r += "<td class=\"winedge\">";
         } else {
            r += "<td>";
         }
         base = nextbase;
         nextbase = max/(i*2);
         if (i == Math.pow(2,wfoldin)) {
            nextbase *= 2;
         } else if (i <= Math.pow(2,wfoldin)) {
            nextbase *= 1.5;
         }
         nextbase += base;
      }

      var child = document.createElement("tr");
      child.innerHTML = r;
      table_node.appendChild(child);
   }
   var open;
   if (window.location.hash.length == 2) {
      open = document.createElement("td");
      open.setAttribute("rowspan",max-2);
      table_node.children[0].appendChild(open)
   } else if (window.location.hash.length == 3) {
      open = document.createElement("div");
      document.body.appendChild(open)
   }
   if (open) {
   var tab;
   var sel,opt;
   opt = document.createElement("option");
   opt.innerText = 'new';
   sel = document.createElement("select");
   sel.appendChild(opt);
   sel.onselected = assigntable;
   sel.hidden = true;
   sel.id = 'select';
   open.appendChild(sel);
   tab = document.createElement("table");
   tab.id = "openmatches";
   open.appendChild(tab);
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

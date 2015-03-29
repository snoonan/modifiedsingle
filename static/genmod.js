var maxplayers;

function lreduce(base, nextbase, row, i, max, baroffset)
{
   var r = "";
   if (row % (i*2) == i) {
      r = "<td class=\"loseredge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
           "slot":Math.floor(row/(i*2))+base+1,
           "next":Math.floor(row/(i*4))+nextbase+1,
           "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
         }) + r;
   } else if ((row % (i*2) > i/2+baroffset) && (row % (i*2) <= 3*i/2+baroffset)) {
      r = "<td class=\"loseredge\">" + r;
   } else {
      r = "<td>" + r;
   }
   return r;
}

function lfold(base, foldbase, nextbase, row, i, max, baroffset)
{
   var r = "";

   if (row % (i*2) == i) {
      r = "<td><td class=\"matchedge\"><span id=\"m_{slot}\" class=\"a_{next}\">#{slot}</span><td class=\"loseredge matchedge\">".format({
        "slot":Math.floor(row/(i*2))+base+1,
        "next":Math.floor(row/(i*2))+foldbase+1
      }) +r;
   } else if ((row-1) % (i*2) == i) {
      r = "<td class=\"loseredge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span><td><td class=\"loseredge\">".format({
        "slot":Math.floor(row/(i*2))+foldbase+1,
        "next":Math.floor(row/(i*4))+nextbase+1,
        "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
      })+r;
   } else if ((row-2) % (i*2) == i) {
      var loserof = +(nextbase+"").split('_')[0];
      loserof -= Math.floor(row/(i*2));
      loserof -= 1;
      if ((i) != max) {
//         loserof ^= 1;
      }
      loserof += 1;
      r = "<td class=\"loseredge\"><td class=\"matchedge\"><span id=\"l_{slot}\" class=\"b_{next}\">#l_{slot}</span><td style=\"width:20px\" class=\"loseredge\">".format({
        "slot":loserof,
        "next":Math.floor(row/(i*2))+foldbase+1,
        "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
      })+r;
   } else if ((row % (i*2) > i/2+baroffset) && (row % (i*2) <= 3*i/2+baroffset)) {
      r = "<td><td><td class=\"loseredge\">"+r;
   } else {
      r = "<td><td><td>"+r;
   }
   return r;
}

function wreduce(base, nextbase, row, i, max, baroffset)
{
   var r = "";

   if (row % (i*2) == i) {
      r += "<td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
           "slot":Math.floor(row/(i*2))+base+1,
           "next":Math.floor(row/(i*4))+nextbase+1,
           "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
         });

   } else if ((row % (i*2) > i/2+baroffset) && (row % (i*2) <= 3*i/2+baroffset)) {
      r += "<td class=\"winedge\">";
   } else {
      r += "<td>";
   }
   return r;
}
function wfold(base, foldbase, nextbase, row, i, max, baroffset)
{
   var r = "";

   if (row % (i*2) == i) {
      r += "<td class=\"winedge matchedge\"><td class=\"matchedge\"><span id=\"m_{slot}\" class=\"a_{next}\">#{slot}</span><td>".format({
        "slot":Math.floor(row/(i*2))+base+1,
        "next":Math.floor(row/(i*2))+foldbase+1
      });
   } else if ((row-1) % (i*2) == i) {
      r += "<td class=\"winedge\"><td><td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
        "slot":Math.floor(row/(i*2))+foldbase+1,
        "next":Math.floor(row/(i*4))+nextbase+1,
        "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
      });
   } else if ((row-2) % (i*2) == i) {
      var winnerof = base - max/Math.pow(2,wfoldin);
      winnerof += Math.floor(row/(i*2));
      if (max != 8 && max != i) {
         winnerof ^= 1;
      }
      winnerof += 1;
      r += "<td style=\"width=20px\" class=\"winedge\"><td class=\"matchedge\"><span id=\"w_{slot}\" class=\"b_{next}\">#w_{slot}</span><td class=\"winedge\">".format({
        "slot":winnerof,
        "next":Math.floor(row/(i*2))+foldbase+1,
        "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
      });
   } else if ((row % (i*2) > i/2+baroffset) && (row % (i*2) <= 3*i/2+baroffset)) {
      r += "<td class=\"winedge\"><td><td>";
   } else {
      r += "<td><td><td>"
   }

   return r;
}
function generateboard(max)
{
   maxplayers = max;

   var row;
   if (wfoldin < 0) {
      wfoldin = Math.log2(max)+1+wfoldin;
   }
   if (lfoldin < 0) {
      lfoldin = Math.log2(max)+1+lfoldin;
   }
   var wfoldat = Math.pow(2, wfoldin);
   var lfoldat = Math.pow(2, lfoldin);
   // center column is name/blank/name/blank/...
   var table_node = document.getElementById("board");
   for (row = 0; row < max*2; row++) {
      var r = "";
      var base = (max/2);
      var nextbase;
      var foldbase;
      var baroffset = 0;
      for (i = 4; i <= wfoldat; i = i*2) {
         if (i >= lfoldat*2 ){
            nextbase = base+2*(max/i);
            if (i == wfoldat) {
               nextbase += "_unused";
            }
            r = lreduce(base, nextbase, row, i, max, baroffset) +r;
            baroffset = 0;
         } else {
            foldbase = base+(max/i);
            nextbase = foldbase+2*(max/i);
            if (i == wfoldat) {
               nextbase += "_unused";
            }
            r = lfold(base, foldbase, nextbase, row, i, max, baroffset) +r;
            baroffset = 1;
         }
         base = nextbase;
      }

      if (wfoldat != 1) {
         if (row%4 == 2) {
                  r += "<td class=\"loseredge matchedge\"><span id=\"l_{slot}\" class=\"{half}_{next}\">#l_{slot}</span>".format({
                    "slot":Math.floor(row/4)+1,
                    "next":Math.floor(row/8)+(max/2)+1,
                    "half":"ab".charAt(Math.floor((row%8)/4))
                     });
         } else if (row%4 == 3) {
            r += "<td class=\"loseredge\">";
         } else {
            r += "<td>";
         }
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
      nextbase = base + 2*(max/2);
      baroffset = 0;
      for (i = 2; i <= max; i = i*2) {
         if (i < lfoldat) {
            nextbase=base+2*max/i;
            r+= wreduce(base, nextbase, row, i, max, baroffset);
            baroffset=0;
         } else if (i < wfoldat) {
            nextbase=base+1.5*max/i;
            r+= wreduce(base, nextbase, row, i, max, baroffset);
            baroffset=0;
         } else if (i == wfoldat) {
            foldbase = base+max/i;
            nextbase = foldbase+max/i;
            r+= wfold(base, foldbase, nextbase, row, i, max, baroffset);
            baroffset=1;
         } else {
            nextbase=base+1*max/i;
            r+= wreduce(base, nextbase, row, i, max, baroffset);
            baroffset=0;
         }
         base = nextbase;
      }

      var child = document.createElement("tr");
      child.innerHTML = r;
      table_node.appendChild(child);
   }
   var open;
   if (window.location.hash.length == 3) {
      open = document.createElement("div");
      document.body.appendChild(open)
   } else {
      open = document.createElement("td");
      open.setAttribute("rowspan",max-2);
      table_node.children[0].appendChild(open)
   }
   if (open) {
   var tab;
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

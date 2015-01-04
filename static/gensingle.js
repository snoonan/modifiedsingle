function generateboard(max)
{
   var row;
   // center column is name/blank/name/blank/...
   var table_node = document.getElementById("board");


   for (row = 0; row < max*2; row++) {
      var r = "";
      if (row%2 == 1) {
         r += "<td class=\"matchedge\"><span id=\"s_{slot}\" class=\"{half}_{next}\"></span>".format({
                 "slot":Math.floor(row/2)+1,
                 "next":Math.floor(row/4)+1,
                 "half":"ab".charAt(Math.floor((row%4)/2))
               });
      } else {
         r += "<td>";
      }
      var base = 0;
      var i;
      for (i = 2; i <= max; i = i*2) {
         if (row % (i*2) == i) {
            r += "<td class=\"winedge matchedge\"><span id=\"m_{slot}\" class=\"{half}_{next}\">#{slot}</span>".format({
                 "slot":Math.floor(row/(i*2))+base+1,
                 "next":Math.floor(row/(i*4))+base+(max/i)+1,
                 "half":"ab".charAt(Math.floor((row%(i*4))/(i*2)))
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


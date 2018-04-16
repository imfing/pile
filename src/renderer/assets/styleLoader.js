// Load custom css

const fs = require('fs')

function injectCustomStyle(path) {
  if (fs.existsSync(path)) {
    var link = document.createElement("link");
    link.href = path;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

window.onload = function () {
  var customStylePath = require('electron').remote.getGlobal('userStylePath')
  injectCustomStyle(customStylePath)
}
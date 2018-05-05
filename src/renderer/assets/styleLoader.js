// Load custom css
const fs = require('fs')

function injectCustomStyle(path, type = 'css') {
  if (fs.existsSync(path)) {
    var link = document.createElement("link");
    link.href = path;
    if (type === 'css') {
      link.type = "text/css";
      link.rel = "stylesheet";
    } else if (type === 'less') {
      link.type = "text/css";
      link.rel = "stylesheet/less";
    }
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

function injectCustomScript(path) {
  const less = require('./less.min.js')
  if (fs.existsSync(path)) {
    var script = document.createElement("script");
    script.src = path;
    scipt.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
  }
}

window.onload = function () {
  var customStylePath = require('electron').remote.getGlobal('settings').userStylePath
  if (fs.existsSync(customStylePath)) {
    injectCustomStyle(customStylePath, 'less')
    injectCustomScript('/src/renderer/assets/less.min.js')
  }
}
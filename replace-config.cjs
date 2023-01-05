module.exports = {
  files: [
    './build/src/ReplApp.init.js', 
    './build/src/index.js'
  ],
  "from": /import (.*) from "(\.\/.*)";/g,
  "to": "import $1 from '$2.js';"
};
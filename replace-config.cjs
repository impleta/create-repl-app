module.exports = {
  files: './build/src/ReplApp.config.js',
  "from": /import (.*) from "(\.\/.*)";/g,
  "to": "import $1 from '$2.js';"
};
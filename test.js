freemarker = require('./freemarker');
fs = require('fs');

var template = fs.readFileSync(process.argv[2], "utf8"); // Get template
var context = require(process.argv[3]); // Get json context data

var text = freemarker.render(template, context);

console.log(text)


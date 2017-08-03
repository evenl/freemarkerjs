freemarker = require('./freemarker');
fs = require('fs');

var template = fs.readFileSync("./tests/test.ftl", "utf8"); // Get template
var context = require("./tests/test.json"); // Get json context data
var blueprint = fs.readFileSync("./tests/test_output.txt", "utf8");

var text = freemarker.render(template, context);

if (text == blueprint) {
	console.log("Output has not changed");
} else {
	console.log("Output is not the same as reference")
}

console.log(text)


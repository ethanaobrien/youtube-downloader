const UglifyJS = require("uglify-js");
const fs = require('fs');

var code = fs.readFileSync('main.js', 'utf8');

function minify(source){
    var ast = UglifyJS.parse(source); 
    return UglifyJS.minify(ast).code;
}
var min = encodeURI(minify(code));
var result = '<a href="javascript:(function(){;' + min + ';})()" class="btn" style="cursor: move;">Youtube downloader</a>';

fs.writeFileSync('out.html', result);

const express = require('express');
const app = express();
const port = 3000;
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/out.html');
})

app.listen(port, function() {
    console.log('Listening on port '+port);
})

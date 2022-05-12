const UglifyJS = require("uglify-js");
const fs = require('fs');
const prompt = require("prompt-sync")({sigint: true});
var cv = JSON.parse(fs.readFileSync('version.json', 'utf8'))['current_version'];
const version = prompt("enter the version we are building (currently on version "+cv+"): ");
if (isNaN(version)) {
    throw new Error("New version must be a number!");
}

var code = fs.readFileSync('main.js', 'utf8');

function minify(source){
    var ast = UglifyJS.parse(source); 
    return UglifyJS.minify(ast).code;
}
console.log('building...');
var min = encodeURIComponent(minify(code.replaceAll('{{VERSION}}', version)));
var result = '<!DOCTYPE HTML>\n<html><head><link id=\'icon\' rel="icon" href="/favicon.ico" type="image/icon type"><style>.btn{display:inline-block;font-size:48px;margin-bottom:3rem;color:#000;background-color:#fff;border-color:#000;border-style:solid;border-width:1px;border-radius:.3rem;transition:color .2s,background-color .2s,border-color .2s;padding:12px}span{background-color:#fff;padding:12px}</style><title>Youtube Downloader</title><meta charset=\'utf-8\'></head><body><center><br><br><a href="javascript:(function(){;' + min + ';})()" class="btn" style="cursor: move;">Youtube downloader</a><br><br><p>Youtube Downloader version '+version+'</p><br><p>Drag the button to the bookmark bar, open youtube, click a video, and click it</p><br><p><a href=\'https://github.com/ethanaobrien/youtube-downloader\'>View on github</a>    <a href=\'https://github.com/ethanaobrien/youtube-downloader/issues\'>Make an Issue</a></p></center></body></html>\n';

fs.writeFileSync('index.html', result);
fs.writeFileSync('version.json', '{"current_version": '+version+'}');
console.log('done!');

const express = require('express');
const app = express();
const port = 3000;
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
})

app.listen(port, function() {
    console.log('Listening on port '+port);
})

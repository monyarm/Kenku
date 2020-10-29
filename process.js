const readline = require('readline-sync')
var wget = require('wget');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg')();

var resFolder = __dirname + '/res/';
var srcFolder = __dirname + '/src/';


var data = require(__dirname + "/src.json");

function basename(str, sep = '/') {
    return str.substr(str.lastIndexOf(sep) + 1);
}

function strip_extension(str) {
    return str.substr(0,str.lastIndexOf('.'));
}

function pathTo(str, sep = '/') {
    return str.substring(0, str.lastIndexOf(sep));
}

function cutAudio(src, output, object) {
	ffmpeg.input(src);
    object.output.forEach( range => {
        var path = output+range.name + '/' + strip_extension(basename(object.path)) + '.wav';
        fs.mkdirSync(pathTo(path));
        ffmpeg.output(path);
        ffmpeg.seek(range.start);
        ffmpeg.duration(range.end);
    });
    
    ffmpeg.run();
}

data.forEach( x => {
    cutAudio(srcFolder + x.path, resFolder, x);
})


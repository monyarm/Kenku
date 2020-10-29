<<<<<<< HEAD
const readline = require('readline-sync')
=======
/* {
    "url":"",
    "path":"",
    "name":"",
    "ranges": [
        {
            "word":"",
            "from":"00:00",
            "to":"00:00"
        }
    ]
} */

const source = require("./source.json");
>>>>>>> 95e6e58aef83e0941d637b635ede109956abe572
var wget = require('wget');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg')();

var resFolder = __dirname + '/res/';
<<<<<<< HEAD
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

=======
var downloadFolder = __dirname + '/download/';


function downloadFileToRes(url,word,prefix) {
	output=resFolder+word+'/';
    if (!fs.existsSync(output)) fs.mkdirSync(output);
    output += prefix+" - "+word+'.wav';
	
    wget.download(url, output);
    console.log(prefix, word);

}

function downloadFile(url,word,prefix) {
	output=downloadFolder+prefix+" "+word+'.wav';
	
    wget.download(url, output);
    return output;

}

function cutAudio(src, output, ranges, folder) {
	fs.mkdirSync(output+folder+'/');
	ffmpeg.input(src)
	ranges.forEach(range => {
		ffmpeg.output(output+range.name);
		ffmpeg.seek(range.from);
		ffmpeg.duration(range.to);
	})
}

if (!fs.existsSync(resFolder)) fs.mkdirSync(resFolder);

if (!fs.existsSync(downloadFolder)) fs.mkdirSync(downloadFolder);

source.forEach(sound => {
    if(!sound.hasOwnProperty("ranges") && sound.hasOwnProperty("url")){
        downloadFileToRes(sound.url, sound.word, sound.prefix)
    }
});
>>>>>>> 95e6e58aef83e0941d637b635ede109956abe572

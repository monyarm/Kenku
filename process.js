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
var wget = require('wget');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg')();

var resFolder = __dirname + '/res/';
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
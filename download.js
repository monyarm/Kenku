const readline = require('readline-sync')
var wget = require('wget');
var fs = require('fs');
var path = require('path');
var ffmpeg = ('fluent-ffmpeg')();

var resFolder = __dirname + '/res/';

function downloadFile(src,folder,name,prefix) {
	output=resfolder
	fs.mkdirSync(output+folder+'/');
	wget.download(src+name, output+folder+'/'+prefix+' - '+name+'.wav');

}

function cutAudio(src, output, ranges, folder, prefix) {
	fs.mkdirSync(output+folder+'/');
	ffmpeg.input(src)
	ranges.forEach(range => {
		ffmpeg.output(output+range.name);
		ffmpeg.seek(range.seek);
		ffmpeg.duration(range.duration);
	})
}

var category = readline.question(`Choose a source:\n1: Websites\n2: Video Games\n`)



switch(category) {
		case "1":

			var site = readline.question(`Choose a Website:\n1: pacdv.com\n`)

			switch(site) {
				case "1":
				var pacdv = 'https://www.pacdv.com/sounds/voices/'
				downloadFile(pacdv, 'all the way','all-the-way','pacdv');
				downloadFile(pacdv, 'and','and-2','pacdv');
				downloadFile(pacdv, 'can you get it','can-you-get-it','pacdv');
				downloadFile(pacdv, 'can you keep a secret','can-you-keep-a-secret','pacdv');
				downloadFile(pacdv, 'come on','come on','pacdv');

				break;
			}
			break;
		case "2":
			break;
}


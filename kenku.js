var fs = require("fs");
var ffmpeg = require("fluent-ffmpeg")();
var path = require("path");

randomFile = function(dir = '.') {
    	const files = fs.readdirSync(dir)
        const rnd = Math.floor(Math.random() * files.length);
	return path.join( dir , files[rnd])
}

function findWav(name) {
	dir = __dirname + '/res/' + name;
	//console.log(path)
	if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory() && dir != __dirname + '/res/'){
		return [true, randomFile(dir)]
	}

	if (fs.existsSync(dir + 'wav')){
		return [false, dir + 'wav']
	}

	return [false, '']
}

var text = process.argv[2].replace(/[.,\/#!$%\^&*;:{}=\-_`~()\?]/g, '').replace(/\s{2,}/g," ").toLowerCase();
var splitText = text.split(" ")
var splitLength = splitText.length;

var audioArray = [];
restartLoop:
while (true){
for (i = 1; i <= splitLength; i++) {
	testText = splitText.slice(0, splitText.length  - i + 1).join(" ");
	//console.log(findWav(testText));
	wav = findWav(testText);
	if(wav[0]){
		//console.log(wav);
		audioArray.push(wav[1]);
		text = splitText.splice(splitText.length - i + 1, i - 1).join(" ");
		//console.log(text, splitText, splitText.length, i);
		splitText = text.split(" ");
		splitLength = splitText.length;
		//console.log(text,splitText,splitLength,i);
		console.log(testText);
		continue restartLoop;
	}
}
break;
}
audioArray.forEach(file =>  {
	ffmpeg.addInput(file)
})

ffmpeg
	.on('error', function(err) {console.log('An error occurred: ' + err.message);})
        .on('end', function() {console.log('Merging finished !');})
	.mergeToFile(__dirname + '/result.wav');

console.log(audioArray);

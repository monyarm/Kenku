const fs = require("fs");
const path = require("path");
const util = require("util");
const { execSync } = require("child_process");


const resdir = __dirname + '/res/'
const tmpdir = __dirname + '/tmp/'

const dictionary = fs.readdirSync(resdir).map(x => x.split(' ')).sort(function(a, b){
  return b.length - a.length;
});


function find_csa(arr, subarr, from_index) {
    var i = from_index >>> 0,
        sl = subarr.length,
        l = arr.length + 1 - sl;

    loop: for (; i<l; i++) {
        for (var j=0; j<sl; j++)
            if (arr[i+j] !== subarr[j])
                continue loop;
        return i;
    }
    return -1;
}

function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

var seed = xmur3("apples" + Math.random());
var rand = mulberry32(seed());

for (var i = 0; i < 15; i++) rand();

randomFile = function(dir = '.') {
    	const files = fs.readdirSync(dir)
        const rnd = Math.floor(rand() * files.length);
	return path.join( dir , files[rnd])
}

function findWav(name) {
	dir = resdir + name;
	return randomFile(dir)
}

function generateWav(word) {
	if (fs.existsSync(tmpdir + word + '.flac')){
		return tmpdir + word + '.flac'
	}
	console.log("Generating audio for " + word)
	var p = tmpdir + word;
	execSync("espeak " + word  + " -w " + "\"" + p + ".wav" + "\"")
	execSync("ffmpeg -loglevel panic  -i \"" + p + ".wav\" -c:a flac -af aformat=s16:44100 -ac 1 \"" + p  + ".flac\"")
	fs.unlinkSync(p + ".wav")
	return p + ".flac";

}

if (!fs.existsSync(tmpdir)) {
	fs.mkdirSync(tmpdir)
}

var text = (" " + process.argv[2] + " " )
.replace(/[.,\/#!%\^&*;:{}=\-_`~()\?"’”–“‘\'\[\]]+/g, '')
.replace(/\s{2,}/g," ").toLowerCase()
.replace(/ will not /g, " wont ")
.replace(/ i will /g, " ill ")
.replace(/ do not /g, " dont ")
.replace(/ ya /g, " yeah ")
.replace(/ know /g, " no ")
.replace(/ run away /g, " runaway ")
.replace(/ shoe string /g, " shoestring ")
.replace(/ banned /g, " band ")
.replace(/ it is /g, " its ")
.replace(/ phew /g, " few ")
.replace(/ eye /g, " i ")
.replace(/ okay /g, " ok ")
.replace(/ damnit /g, " damn it ")
.trim();

var audioArray = text.split(' ')
for (i = 0; i < dictionary.length; i++) {
	const phrase = dictionary[i]
	var pos = find_csa(audioArray, phrase)
	if (pos == -1) {continue;}
	while ( true )
	{
		audioArray.splice(pos, phrase.length, findWav(phrase.join(' ').trim()))
		pos = find_csa(audioArray, phrase)
		if ( pos == -1) {break;}
	}
}
audioArray = audioArray.map(x => {
	return x.includes("/res/") ? x : generateWav(x)
})
audioArrayArray = chunkArrayInGroups(audioArray, 128)
for (i = 0; i < audioArrayArray.length; i++) {
	execSync("sox \"" + audioArrayArray[i].join("\" \"") + "\" tmp/_result" + i.toString().padStart(2, '0') + ".flac")
}

execSync("sox tmp/_result*.flac result.flac silence 1 0.1 0.1% -1 0.1 0.1%")

//fs.unlinkSync(tmpdir + "_result.flac")
fs.readdirSync(tmpdir)
    .filter(f => /_result.*\.flac/.test(f))
    .map(f => fs.unlink(tmpdir + f, () => {}))


audioArray.forEach(file =>  {
        console.log("\x1b[32m",file)
})

console.log('Merging finished !')


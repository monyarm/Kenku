shopt -s dotglob nullglob globstar extglob nocaseglob
prefix=0

for i in "$1"/**/*.{wav,ogg,flac,mp3};
do
	killall mpv &> /dev/null
	echo "Playing $(basename "$i")"
	mpv "$i" &> /dev/null &
	echo "[P] to play again, [R] to rename, [X] to delete, [S] to split"
        while : ; do
                read -rsn1 input
                if [ "$input" = "p" ]; then
			killall mpv &> /dev/null
                        mpv "$i" &> /dev/null &
                fi
                if [ "$input" = "r" ]; then
			ffmpeg -i "$i" -ar 16000 -ac 1 -loglevel panic vosk.wav
			detected="$(python text.py vosk.wav 2>/dev/null  | tr -d '[:punct:]' )"
			read -p "Input filename: " -e -i "$detected" word
			mkdir -p "../res/$word"
			while [ -e "../res/$word/$prefix$(basename "$i")" ];
			do
				prefix=$(( ext + 1 ))
			done
			bn=$(basename "$i")
			ffmpeg -loglevel panic -i "$i" -c:a flac -af aformat=s16:44100 -ac 1  "../res/$word/$prefix${bn%.*}.flac"
			rm -rf "$i"
                	rm -rf vosk.wav
			break
		fi
		if [ "$input" = "x" ]; then
			rm -rf "$i"
			break
		fi
                if [ "$input" = "s" ]; then
			defvolume="0.5"
			read -p "Volume Percentage: " -e -i "$defvolume" volume
                        ./split.sh "$i" "$volume"
			./$(basename $0) "$1"; exit
                fi

        done

done

rmdir "$1"
killall mpv &> /dev/null

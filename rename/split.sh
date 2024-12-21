sox "$1" "${1%.*}-out.wav" silence -l 0 1 0.2 "$2"% : newfile : restart
mkdir -p "split/$(dirname "$1")"
cp "$1" "split/$1"
rm -rf "$1"


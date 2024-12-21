dictionarySize="$(find res -maxdepth 1 -type d ! -iname "* *" | sed 's/res.//' | grep -v '\$' | wc -l)"
phraseSize="$(( $(find res -maxdepth 1 -type d | sed 's/res.//' | grep -v '\$' | wc -l) - $dictionarySize ))"
size="$(numfmt --to=iec --suffix=B "$(diskus res)")"
missingwords="$(node kenku.js "$(cat sample.txt)" | grep tmp | wc -l)"

spacing=50

printf "%${spacing}s %s\n" "Word Count: " $dictionarySize
printf "%${spacing}s %s\n" "Phrase Count: " $phraseSize
printf "%${spacing}s %s\n" "Disk Space: " $size
printf "%${spacing}s %s\n" "Missing words in sample text:" $missingwords
printf "%${spacing}s %s\n" "Top 20 most common words or phrases:" ""

for d in ./res/*/ ; do printf "%${spacing}s %s\n" "$d" $(ls "$d" | wc -l); done | rev | sort -n -k1 | rev | tail -20  | tac | sed 's/res//' | sed 's/\.\///' | sed 's/\///'| sed 's/\///'


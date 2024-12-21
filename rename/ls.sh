#!/usr/bin/env bash


for i in */; do
	name="${i%/}"
	if [ "$name" =  "model" ] || [ "$name" = "split" ]; then
		continue
	fi
	count="$(find "$name" -printf x | wc -c)"
	echo "$name"	[$count]
done |
sort -k2 -t'[' -n
#awk '{print $NF,$0}' | sort -n | cut -f2- -d' '

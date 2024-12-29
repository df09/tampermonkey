#!/bin/bash

dir="."
repo="df09/tempermonkey"

find "$dir" -type f -name "*.js" \
  ! -path "*/.*/*" \
  ! -path "*/__pycache__/*" \
  | while read -r filename; do
  echo '>>> $filename:' $filename

  # Get version
  version_old=$(grep -Po '^//\s*@version\s+\K[0-9]+' "$filename")
  if [[ -z "$version_old" ]]; then
    # Create version
    echo "@version: NONE -> v$version_new"
    sed -i '/^\/\/\s*@version/d' "$filename" # delete old line
    line=$(grep "^// @description" "$filename")
    if [[ -n "$line" ]]; then
      prefix_length=$(echo "$line" | grep -oP "^// @description\s*" | wc -c)
      version_line=$(printf "// @version%s1" "$(printf '%*s' $((prefix_length - 12)) '')")
      sed -i "/^\/\/ @description/a $version_line" "$filename"
    else
      echo "// @version 1" >> "$filename"
    fi
  else
    # Update version
    version_new=$((version_old + 1))
    echo "@version: v$version_old -> v$version_new"
    sed -i "s|^\(//\s*@version\s\+\)$version_old|\1$version_new|" "$filename"
  fi

  # Update @require
  if grep -q "// @require\s\+https://raw\.githubusercontent\.com/$repo/" "$filename"; then
    echo "@require($repo): v$version_old -> v$version_new"
    sed -i "s|\(@require .*\.js\)\(\?v=[0-9]*\)*|\1?v=$version_new|g" "$filename"
  else
    echo "@require($repo): not found"
  fi
  echo
done

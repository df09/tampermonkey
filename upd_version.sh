#!/bin/bash

# Папка для поиска
SEARCH_DIR="."

# Поиск всех *.user.js файлов, исключая скрытые и специальные директории
find "$SEARCH_DIR" -type f -name "*.user.js" \
  ! -path "*/.*/*" \
  ! -path "*/__pycache__/*" \
  | while read -r SCRIPT_FILE; do
    echo "Processing $SCRIPT_FILE"

    # Извлечение текущей версии
    CURRENT_VERSION=$(grep -Po '(?<=@version\s+)[0-9]+' "$SCRIPT_FILE")

    # Обновление версии
    if [[ -z "$CURRENT_VERSION" ]]; then
      echo "No @version found in $SCRIPT_FILE. Adding @version 1."
      sed -i '/@version/d' "$SCRIPT_FILE" # Удаляем старую строку @version, если есть
      sed -i '/@name/a // @version      1' "$SCRIPT_FILE" # Добавляем новую версию после @name
    else
      # Увеличиваем версию на 1
      NEW_VERSION=$((CURRENT_VERSION + 1))
      echo "Updating version in $SCRIPT_FILE: $CURRENT_VERSION -> $NEW_VERSION"
      sed -i "s/@version\s\+$CURRENT_VERSION/@version      $NEW_VERSION/" "$SCRIPT_FILE"
    fi

    # Обновление параметра 'v' в @require
    if grep -q '@require ' "$SCRIPT_FILE"; then
      echo "Updating @require parameters in $SCRIPT_FILE with 'v' parameter: $NEW_VERSION"
      sed -i "s|\(@require .*\.js\)\(\?v=[0-9]*\)*|\1?v=$NEW_VERSION|" "$SCRIPT_FILE"
    else
      echo "No @require found in $SCRIPT_FILE. Skipping @require update."
    fi
done

echo "@version and @require update completed for all scripts."

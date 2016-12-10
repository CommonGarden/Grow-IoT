#!/bin/bash
# Clean bower install.

if [ $# -ne 0 ]; then
  if bower $@; then
    echo "successful"
  else
    echo "command failed"
    exit 1
  fi
  read -p "Remove demo,test folders & files from bower dir. (y/n)?" CONT
  if [ "$CONT" = "y" ]; then
    folders=( "demo" "test" "bower_components" )
    for i in "${folders[@]}"
    do
      find ./imports/ui/bower_components/* -depth -name $i -exec rm -rf "{}" \;
    done
    files=( "demo" "test" )
    for i in "${files[@]}"
    do
      find ./imports/ui/bower_components/* -depth -name "${i}.*" -type f|xargs rm -f
    done
    echo "Cleanup Successful.!";
  else
    echo "Cleanup Cancelled";
  fi
  echo "${green}component installed. Add it to imports/ui/imports.html.${reset}"
else
  echo "no arguments supplied"
fi

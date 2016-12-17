#!/bin/bash
# Build meteor polymer project.
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
echo "Installing bower components."
if bower install; then
  echo "Installed bower components."
else
  echo "${red}Bower installation failed.!${reset}" 1>&2
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
echo "Installing npm packages."
if meteor npm install; then
  echo "Installed npm packages.${reset}"
else
  echo "${red}NPM installation failed.!${reset}" 1>&2
  exit 1
fi
echo "${green}build complete. run meteor.!${reset}"

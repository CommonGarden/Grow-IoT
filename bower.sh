#!/bin/bash
# Clean bower install.
red=`tput setaf 1`
green=`tput setaf 2`
blue=`tput setaf 4`
reset=`tput sgr0`
if [ $# -ne 0 ]; then
  if bower $@; then
    echo "${green}bower install successful${reset}"
  else
    echo "${red}command failed${reset}"
    exit 1
  fi
  read -p "${blue}Remove demo,test folders & files from bower dir. (y/n)?${reset}" CONT
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
  read -p "${blue}Enter the component name to import as example-component/example-component.html (press enter to skip)?${reset}" CONT
  if [ "$CONT" ]; then
    echo -en "<link rel='import' href='bower_components/$CONT/$CONT.html'>" >> ./imports/ui/imports.html
  echo "${green}component $CONT installed.${reset}"
  else
    echo "Skipped. Manually add component to imports/ui/imports.html";
  fi
else
  echo "${red}Failed. reason - no arguments supplied${reset}"
fi

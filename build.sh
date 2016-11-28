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
read -p "Remove demo,test folders from bower_components dir. (y/n)?" CONT
if [ "$CONT" = "y" ]; then
  find imports/ui/bower_components/* -depth -name "demo" -exec rm -rf "{}" \;
  find imports/ui/bower_components/* -depth -name "test" -exec rm -rf "{}" \;
  find imports/ui/bower_components/* -depth -name "bower_components" -exec rm -rf "{}" \;
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

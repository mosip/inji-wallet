#!/bin/bash

#Move to correct folder
cd ..

#Install bundler using Gem
yes | sudo gem install bundler

#Install plugins for fastlane 
yes | sudo fastlane install_plugins

#Run Fastlane 
bundle exec fastlane android_build
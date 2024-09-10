#As react-native/location npm package is old, We need to run this to map androidX source code

APPLICATION_TYPE=$1

(cd ../../ && npx jetify)

cd ..

yes | sudo gem install bundler

yes | sudo fastlane install_plugins

if [ "$APPLICATION_TYPE" == "debug" ]; then
  bundle exec fastlane android_build_debug
else
  bundle exec fastlane android_build_release
fi
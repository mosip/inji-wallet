#As react-native/location npm package is old, We need to run this to map androidX source code
(cd ../../ && npx jetify)

cd ..

yes | sudo gem install bundler

yes | sudo fastlane install_plugins

bundle exec fastlane android_build_upload && android_build_internal

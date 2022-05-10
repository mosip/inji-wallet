# inji
MOSIP citizen app.

## Dependencies

Be sure to have the following build tools installed before proceeding:

- [Gradle](https://gradle.org/install/)
- [Java 8](https://www.oracle.com/ph/java/technologies/javase/javase8-archive-downloads.html)
- [Expo](https://docs.expo.dev/get-started/installation/)
- [Android SDK](https://developer.android.com/)


## Generate keystore for APK signing
```shell
keytool \
 -genkey -v \
 -storetype PKCS12 \
 -keyalg RSA \
 -keysize 2048 \
 -validity 10000 \
 -storepass 'android' \
 -keypass 'android' \
 -alias androidreleasekey \
 -keystore android/app/release.keystore \
 -dname "CN=io.mosip.residentapp,OU=,O=,L=,S=,C=US"
```

## Running the app

```shell
# Install all dependencies
npm install
# run dev client
npm start
# run Inji directly to connected emulator or device (Default)
npm run android:newlogic
# run Inji Philippines directly to connected emulator or device
npm run android:ph
```

# Building from Source

## Build via Android Studio

The app is available in this repository's `frontend/android` directory. Open this directory in Android Studio (version 4.1 and above) and the app can be built and run from there.

More info here: [Build your app using Android Studio](https://developer.android.com/studio/run)

## Build via command line
You need Android SDK CLI to build APK.

```shell
# 1. Install dependencies
npm install

# Setup the environment variable for keystore
export RELEASE_KEYSTORE=release.keystore
export RELEASE_KEYSTORE_ALIAS=androidreleasekey
export RELEASE_KEYSTORE_PASSWORD=android
# https://hostname/residentmobileapp is the Mimoto service url
export BACKEND_SERVICE_URL=https://hostname/residentmobileapp

# Use DEBUG_KEYSTORE, DEBUG_KEYSTORE_ALIAS, DEBUG_KEYSTORE_PASSWORD for debug build

# Use one of following command to build the flavor you need.
# Build for Mosip Philippines test
npm run build:android:ph

# Build for Newlogic test
npm run build:android:newlogic
```

More info here: [Build your app from the command line](https://developer.android.com/studio/build/building-cmdline)

## Build using github actions
One can clone the repo and run the build via github actions as shown below. <TODO add screenshot>

## Credits
Credits listed [here](/Credits.md)

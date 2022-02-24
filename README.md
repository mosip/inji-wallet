# inji
MOSIP citizen app.

## Dependencies

Be sure to have the following build tools installed before proceeding:

- [Gradle](https://gradle.org/install/)
- [Java 8](https://www.oracle.com/ph/java/technologies/javase/javase8-archive-downloads.html)
- [Expo](https://docs.expo.dev/get-started/installation/)

## Running the app

```bash
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

1. Build for Mosip Philippines test
```bash
npm run build:android:ph
```

2. Build for Newlogic test

```bash
npm run build:android:newlogic
```

Note for release builds you will need to have a keystore: [Create a Keystore](https://medium.com/@tom.truyen/create-an-android-keystore-using-keytool-commandline-10399a62e774)

More info here: [Build your app from the command line](https://developer.android.com/studio/build/building-cmdline)

## Credits
Credit list at https://github.com/inji/blob/develop/Credits.md

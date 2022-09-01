# inji

MOSIP citizen app.

## Dependencies

Be sure to have the following build tools installed before proceeding:

- [Gradle](https://gradle.org/install/)
- [Java 8](https://www.oracle.com/ph/java/technologies/javase/javase8-archive-downloads.html)
- [Expo](https://docs.expo.dev/get-started/installation/)
- [Android SDK](https://developer.android.com/)
- [XCode](https://developer.apple.com/xcode/)

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

### Android

```shell
# install all dependencies
npm install

# run Inji Newlogic directly to connected emulator or device (Default)
npm run android:newlogic

# run Inji Mosip directly to connected emulator or device
npm run android:mosip

# run Inji Philippines directly to connected emulator or device
npm run android:ph
```

### iOS

```shell
# install all dependencies
npm install
npx pod-install

# run Metro bundler in the background
npm start

# run Inji app directly to a connected device
npm run ios -- --device
```

# Developing Android

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

# Use DEBUG_KEYSTORE, DEBUG_KEYSTORE_ALIAS, DEBUG_KEYSTORE_PASSWORD for debug build

# Use one of following command to build the flavor you need.
# Build for Mosip Philippines test
npm run build:android:ph

# Build for Newlogic test
npm run build:android:newlogic

# Build for MOSIP test
npm run build:android:mosip
```

More info here: [Build your app from the command line](https://developer.android.com/studio/build/building-cmdline)

# Developing iOS

## Setup Google Nearby Messages API key

In `shared/constants.ts`:

```js
export const GNM_API_KEY = '<YOUR_API_KEY>';
```

In `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data android:name="com.google.android.nearby.messages.API_KEY" android:value="<YOUR_API_KEY>" />
```

More info here: [Get Started with Google Nearby Messages](https://developers.google.com/nearby/messages/android/get-started)

## Build for TestFlight

1. Install all dependencies
   - `npm install`
   - `npx pod-install`
2. Open the `ios/` directory in XCode
3. Set the build target to "Any iOS device (arm64)"
4. Use an Apple Developer account that can provision builds for release/TestFlight

![Screen Shot 2022-09-01 at 10 34 45 AM](https://user-images.githubusercontent.com/1631922/187820476-52111665-d6b9-447c-953d-c6451d66b634.png)

5. Don't forget to bump the version number when creating an archive

6. Open the Product menu and from there click Archive

7. Once done you can follow the dialog wizard to distribute the app to TestFlight

![Screen Shot 2022-09-01 at 1 08 34 PM](https://user-images.githubusercontent.com/1631922/187836055-617fbba8-2eca-4ad3-805b-9627b925f0df.png)

8. Go to your [App Store Connect](https://appstoreconnect.apple.com/) dashboard to manage the newly-uploaded build.

More info here:

- [React Native - Publishing to the App Store](https://reactnative.dev/docs/publishing-to-app-store)
- [Apple Developer - Distributing Your App for Beta Testing and Releases](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)

## Credits

Credits listed [here](/Credits.md)

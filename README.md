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
 # Generate and use Debug keystore for development and testing purposes
keytool \
 -genkey -v \
 -storetype PKCS12 \
 -keyalg RSA \
 -keysize 2048 \
 -validity 10000 \
 -storepass 'android' \
 -keypass 'android' \
 -alias androiddebugkey \
 -keystore android/app/debug.keystore \
 -dname "CN=io.mosip.residentapp,OU=,O=,L=,S=,C=US"
```

```shell
 # Generate and use Release keystore for Publishing to Play store
 keytool \
 -genkey -v \
 -storetype PKCS12 \
 -keyalg RSA \
 -keysize 2048 \
 -validity 10000 \
 -storepass '<USE-YOUR-RELEASE-PASSWORD-HERE>' \
 -keypass '<USE-YOUR-RELEASE-PASSWORD-HERE>' \
 -alias androidreleasekey \
 -keystore android/app/release.keystore \
 -dname "CN=io.mosip.residentapp,OU=,O=,L=,S=,C=US"
```

## Running the app

### Prepare environment

Create a `.env.local` file using `.env` as your template:

```
MIMOTO_HOST=
```

And `android/local.properties`:

More info here: [Setup Google Nearby Messages in React](https://github.com/mrousavy/react-native-google-nearby-messages#usage)

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

# 2. Setup the environment variables for the keystore

# Debug keystore
export DEBUG_KEYSTORE_ALIAS=androiddebugkey
export DEBUG_KEYSTORE_PASSWORD=android

# Release keystore
export RELEASE_KEYSTORE_ALIAS=androidreleasekey
export RELEASE_KEYSTORE_PASSWORD=<USE-YOUR-RELEASE-PASSWORD-HERE>

# https://hostname/residentmobileapp is the Mimoto service url
export BACKEND_SERVICE_URL=https://hostname/residentmobileapp

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

## View the complete DB :

1. Connect your phone to the laptop and open Android Studio.
2. On the bottom right vertical tab you will find a `Device File Explorer` button. Click on it and select you phone.
3. Navigate to `data -> data -> io.mosip.residentapp ->databases`. You will find a file named `RKStorage` in it. Download it.
4. Download [DB Browser for SQLite](https://sqlitebrowser.org/dl/) .
5. Open the file in this application. Click on `Browse Data` button and select `catalystLocalStorage` table. Now you should be able to view the entire DB of Inji.

## Credits

Credits listed [here](/Credits.md)

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


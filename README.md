# Inji

Inji Mobile Wallet is a mobile application specifically created to streamline all types of identification and credentials into one digital wallet.
It offers a secure, trustworthy, and dependable mobile Verifiable Credentials wallet designed to fulfil the following functions

- Download and store Verifiable Credentials
- Share Verifiable Credentials
- Enable users to log in to relying parties with their credential
- Generate a QR code for the credential to be shared offline with relying parties.

for more details refer [here](https://docs.mosip.io/inji/inji-wallet/overview)

## Setup PreRequisites

Be sure to have the following build tools installed before proceeding:

- [React Native 0.71.8](https://reactnative.dev/docs/0.71/getting-started)
  - Hermes Engine enabled
- [Expo 49.0.23](https://docs.expo.dev/get-started/installation/)
- [node v16.19.0](https://nodejs.org/en/blog/release/v16.19.0)
- [npm 8.19.3](https://www.npmjs.com/package/npm/v/8.19.3)

### Android

- [Java 17](https://openjdk.org/projects/jdk/17/)
- [Gradle 7.5.1](https://gradle.org/install/)
- [Android SDK](https://developer.android.com/)
- minSdkVersion = 24
- compileSdkVersion = 34
- targetSdkVersion = 34
- ndkVersion = 21.4.7075529
- kotlinVersion = 1.9.0

### iOS

- [XCode](https://developer.apple.com/xcode/) = >15
- Minimum Deployment Target = 13.0
- cocoapods > 1.12
- Ruby >= 2.6.10

## Configuring the Environment

If you ever want to use something in your local environment based on your customization and in need of using environment files other than default (.env), you can add some variables to your .env.local file. 
Create a `.env.local` file using `.env` as your template in your root directory :

```
# Mimoto Server
MIMOTO_HOST =  https://api.collab.mosip.net/

# ESignet Server
ESIGNET_HOST =  https://esignet.collab.mosip.net/

# Telemetry Server
OBSRV_HOST = https://dataset-api.obsrv.mosip.net
Telemetry Dashboard = https://druid.obsrv.mosip.net/unified-console.html#workbench

#Application Theme can be ( grdaient | purple ), defaults to grdaient theme
APPLICATION_THEME=grdaient

#environment can be changed if it is toggled
CREDENTIAL_REGISTRY_EDIT=true

#Inji Wallet CLIENT ID for Data backup & Restore
GOOGLE_ANDROID_CLIENT_ID='<client_id>'
```

for more information on the backend services
refer [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/backend-services).

## Building & Running for Android

Refer to the documentation of Inji Wallet's [build and deployment android section](https://docs.mosip.io/inji/inji-wallet/build-and-deployment#android-build-and-run) for the steps build the android application.

Note: Alternative to building and running app via react native CLI, it can be built via Android Studio. The app is available in this repository's `./android` directory. Open this directory in Android Studio (version  
4.1 and above) and the app can be built and run from there.

More info here:
- [Build your app using Android Studio](https://developer.android.com/studio/run)


## Building & Running for iOS

Refer to the documentation of Inji Wallet's [build and deployment iOS section](https://docs.mosip.io/inji/inji-wallet/build-and-deployment#ios-build-and-run) for the steps build the iOS application.

More info here:

- [React Native - Publishing to the App Store](https://reactnative.dev/docs/publishing-to-app-store)
- [Apple Developer - Distributing Your App for Beta Testing and Releases](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)

## Contributions

Please refer [here](https://docs.mosip.io/inji/inji-mobile-wallet/contribution) for contributing to Inji

## Credits

Credits listed [here](/Credits.md)

## Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
this project runtime can be debugged using [Flipper](https://fbflipper.com/).

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup
  your  
  environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for  
  React Native.

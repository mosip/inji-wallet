# **Inji Wallet Components**

<!-- TOC -->

- [**Inji Wallet Components**](#inji-wallet-components)
_ [**Inji Wallet UI**](#inji-wallet-ui)
[**Mimoto**](#mimoto)
_ [**Native Components**](#native-components)
<!-- TOC -->

### **Inji Wallet UI**

This is a mobile application for Android and iOS developed in react native.

- It offers a secure, trustworthy, and dependable mobile Verifiable Credentials wallet designed to fulfil the following functions
  - Download and store Verifiable Credentials
  - Share Verifiable Credentials
  - Enable users to log in to relying parties with their credential
  - Generate a QR code for the credential to be shared offline with relying parties.

### **Mimoto**

Mimoto is a BFF(Backend for Frontend) for Inji Wallet. It's being used to serve default configuration, list of trusted issuers and few other services as mentioned below:

- Gives default properties needed by Inji Wallet
- Gives the list of issuers supported by the Inji Wallet through mimoto-issuers-config.json
- Gives access token based on authorization code to download credential
- Allows wallet binding so that user can log in to relying party

### **Native Components**

There are many components which are being used to build Inji wallet. Each of these components supports some specification or use-cases required by Inji Wallet.

- **Secure-Keystore** is a module to create and store keys in android hardware keystore and helps to do encryption, decryption, and hmac calculation. Please find more details [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/components#id-3.-secure-keystore)
- **Tuvali** is a module for the OpenID for Verifiable Presentations over BLE implementation to support sending vc/vp using Bluetooth Low Energy local channel. Please find more details [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/components#id-1.-tuvali-sharing-via-ble)
- **Pixelpass** is a module to generate QR code from VC data and decode from QR to get VC data. Please find more details [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/components#id-5.-pixelpass)
- **VCI client** is a module to support OpenId4VCI specification for downloading the credential. Please find more details [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/components#id-5.-pixelpass)
- **Face Match** is a module which supports offline face verification. Please find more details [here](https://docs.mosip.io/inji/inji-wallet/technical-overview/components#id-2.-face-match)

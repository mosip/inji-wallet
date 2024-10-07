# **Inji Wallet Components**

<!-- TOC -->

- [**Inji Wallet Components**](#inji-wallet-components)
_ [**Inji Wallet**](#inji-wallet)
_ [**Mimoto**](#mimoto)
_ [**Inji Verify**](#inji-verify)
_ [**Inji Certify**](#inji-certify)
_ [**Data Share**](#data-share)
_ [**ESignet**](#esignet) \* [\*\*Native Libraries](#native-libraries)
<!-- TOC -->

### **Inji Wallet**

- The Inji Wallet is a mobile application for Android and iOS developed in react native.
- It offers a secure, trustworthy, and dependable mobile Verifiable Credentials wallet designed to fulfil the following functions
  - Download and store Verifiable Credentials
  - Conduct offline face verification
  - Share Verifiable Credentials
  - Enable users to log in to relying parties with their credential
  - Generate a QR code for the credential to be shared offline or with other application.

### **Mimoto**

- Mimoto is a BFF(Backend for Frontend) for Inji Wallet. It's being used to get default configuration, list of trusted issuers and few other services as mentioned below:
  - Gives default properties needed by Inji Wallet
  - Gives the List of Issuers Supported by the Inji Wallet through mimoto-issuers-config.json
  - Gives access token based on authorization code to download credential
  - Allows to wallet binding so that user can log in to relying party

### **Inji Verify**

- **Inji Verify** stands out as a robust verification tool specifically designed to validate the verifiable credentials encoded in QR codes through an intuitive web portal interface.
- Inji Verify can verify the Credential either via Scan or Upload Functionality
- Inji Verify supports the QR code generated in VC to verify

### **Inji Certify**

- Inji Certify lets organizations issue and manage verifiable credentials, empowering users with greater control over their data and access to services.
- Inji Certify Integrate with specific plugins to retrieve the data from the registry and convert the raw Data into verifiable Credential and Issues them to wallet to manage it.

### **eSignet**

- **eSignet** strives to provide a user-friendly and effective method for individuals to authenticate themselves and utilize online services while also having the option to share their profile information. Moreover, eSignet supports multiple modes of identity verification to ensure inclusivity and broaden access, thereby reducing potential digital barriers.
- eSignet Allows us to perform the authorization of the resident on the portal before downloading the credential

### **Native Libraries**

- **Secure-Keystore** is a module to create and store keys in android hardware keystore and helps to do encryption, decryption, and hmac calculation
- **Tuvali** is a module for the OpenID for Verifiable Presentations over BLE implementation to support sending vc/vp using Bluetooth Low Energy local channel
- **Pixelpass** is a module to generate QR code from VC data and decode from QR to get VC data
- **VCI client** is a module to support OpenId4VCI specification for downloading the credential

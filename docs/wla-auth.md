# WLA Auth

Inji Wallet enables seamless authentication to online portals using verifiable credentials. Through a QR code-based deep-linking technique, users can authenticate biometrically via their mobile wallet and securely grant data sharing permissions to access online services.

## Wallet Local Authentication - Sequence Diagram

Actors Involved

- Inji Wallet (Mobile App)
- User
- Authorization Server
- Online Portal

```mermaid
sequenceDiagram
    participant User as User
    participant Wallet as Wallet<br/>(Downloaded and binded VC)
    participant Online Portal as Online Portal
    participant Authorization Server as Authorization Server

    User -->> Online Portal: Opens online portal in mobile
    Note over Online Portal: Display the Sign-In options
    User -->> Online Portal: Clicks on Sign-in with Authorization Server
    Online Portal -->> Authorization Server: Redirects to Authorization Server
    Note over Authorization Server: Displays options to login
    User -->> Authorization Server: Clicks on Login with Wallet
    Note over Authorization Server: Generates QR code with token<br/>and redirect scheme
    User -->> Authorization Server: Clicks on the QR Code
    Authorization Server -->> Wallet: Checks the redirect scheme and<br/>launches the correct activity

    Note over User,Authorization Server: Authentication and Consent Flow
    Wallet -->> User: Prompts for biometric authentication
    User -->> Wallet: Provides biometric authentication
    Wallet -->> Authorization Server: Sends authentication confirmation
    Authorization Server -->> Wallet: Requests consent for data sharing
    Wallet -->> User: Displays consent screen with requested permissions
    User -->> Wallet: Reviews and grants consent
    Wallet -->> Authorization Server: Sends consent confirmation

    Authorization Server -->> Online Portal: Logged in Successfully
```

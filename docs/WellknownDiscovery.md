# Well-known Discovery

Inji Wallet fetches well known response directly by hitting the endpoint url constructed using Credential Issuer by appending `/.well-known/openid-credential-issuer`

## Specifications supported

- The implementation follows OpenID for Verifiable Credential Issuance. [Specification](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-issuer-metadata-).
- Steps involved in the Well-known discovery from Inji Wallet,
  - Inji wallet sends request to Mimoto for fetching Issuers Configurations.
  - Each Issuers has the parameter `credential_issuer_host`.
  - Once Issuers Configurations are fetched, append `/.well-known/openid-credential-issuer` to `credential_issuer_host` and construct the Well-known end point.
  - Invoke the End point URL directly from Inji Wallet to get the Wellknown Response which will be in json format.

```mermaid
sequenceDiagram
    participant Inji Wallet
    participant Mimoto
    participant Inji Certify

    Inji Wallet->>Mimoto: Request for Credential Issuer Host
    Mimoto-->>Inji Wallet: Returns Credential Issuer Host
    Inji Wallet-->>Inji Wallet: Construct Wellknown End point by appending `/.well-known/openid-credential-issuer` to the host
    Inji Wallet->>Inji Certify: Request for Well Known with constructed wellknown end point URL
    Inji Certify-->>Inji Wallet: Returns Wellknown Json
```

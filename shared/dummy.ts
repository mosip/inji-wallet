export const VID_ITEM_DUMMY = {
  tag: "",
  generatedOn: "2022-03-30T05:22:39.877Z",
  credential: {
    biometrics: "",
    province: [{ language: "eng", value: "Kenitra" }],
    phone: "0987654321",
    city: [{
        language: "eng",
        value: "Kenitra"
    }],
    postalCode: 14053,
    addressLine1: [{
        language: "eng",
        value: "AMCO LAYOUT, RAJIVGANDHI NAGAR"
    }],
    fullName: "Dummy Fullname",
    addressLine2: [{
        language: "eng",
        value: "KODIGEHALLI"
    }],
    addressLine3: [{
        language: "eng",
        value: "SAHAKARANAGAR POST"
    }],
    region: [{
      language: "eng",
      value: "Rabat Sale Kenitra"
    }]
  },
  verifiableCredential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://qa-triple-rc2.mosip.net/.well-known/mosip-context.json",
      {
        sec: "https://w3id.org/security#"
      }
    ],
    credentialSubject: {
      UIN: "5511223344",
      addressLine1: [
        {
          language: "eng",
          value: "AMCO LAYOUT, RAJIVGANDHI NAGAR"
        }
      ],
      addressLine2: [
        {
          language: "eng",
          value: "KODIGEHALLI"
        }
      ],
      addressLine3: [
        {
          language: "eng",
          value: "Dummy Fullname"
        }
      ],
      biometrics: "",
      city: [
        {
          language: "eng",
          value: "Kenitra"
        }
      ],
      dateOfBirth: "1990",
      email: "test@newlogic.com",
      fullName: "Madhu Nagesh",
      gender: [
        {
          language: "eng",
          value: "Female"
        }
      ],
      id: "https://qa-triple-rc2.mosip.net/credentials/5511223344",
      phone: "09876543221",
      postalCode: "14053",
      province: [
        {
          language: "eng",
          value: "Kenitra"
        }
      ],
      region: [
        {
          language: "eng",
          value: "Rabat Sale Kenitra"
        }
      ],
      vcVer: "VC-V1"
    },
    id: "https://qa-triple-rc2.mosip.net/credentials/00000000-0000-0000-0000-000000000000",
    issuanceDate: "2022-03-30T05:22:28.222Z",
    issuer: "https://qa-triple-rc2.mosip.net/.well-known/controller.json",
    proof: {
      created: "2022-03-30T05:22:28Z",
      jws: "eyJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdLCJhbGciOiJQUzI1NiJ9..Q4tGI63zyGxXImv4KXaMKZJeRB7S3ADJKFPZw9rJObw6YkrV7TX6By500N9Xi0eW6mqIyq6D_EzoNq2Acg9uTfC8j0dcztsetRyAA6USS3H3GzmzC4cWd-rUFiCzhse7GHIZ4M3REmyMD7pWG4zIjvWuzDbq9oqpUEzJDE6uIGvHxBDlVhNOJnlgRX72foKKycV_etR9p6m9dCgQRs8qlvJShkh6rmT4a_0qJnNmY1vuk7b_hPUKbm8EgFwOdomAgQHrAMvWqmftmDssKi66IU6GJ-1rcpwtJFVdyWArlD_k-ltwrPTKZFVQTt0ZzGCvA1RP7q2a5bv2Am3tR5mF1w",
      proofPurpose: "assertionMethod",
      type: "RsaSignature2018",
      verificationMethod: "https://qa-triple-rc2.mosip.net/.well-known/public-key.json"
    },
    type: [
      "VerifiableCredential",
      "MOSIPVerifiableCredential"
    ]
  },
  serviceRefs: {
    activityLog: {
      id: "activityLog"
    },
    auth: {
      id: "auth"
    },
    request: {
      id: "request"
    },
    scan: {
      id: "scan"
    },
    settings: {
      id: "settings"
    },
    store: {
      id: "store"
    },
    vid: {
      id: "vid"
    }
  },
  id: 5511223344,
  idType: "UIN",
  requestId: "00000000-0000-0000-0000-000000000000"
}
jest.mock("../shared/cryptoutil/cryptoUtil", () => (
        {
            generateKeyPairRSA: jest.fn(() => Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),
            generateKeyPairECK1: jest.fn(()=> Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),
            generateKeyPairECR1: jest.fn(()=> Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),
            generateKeyPairED: jest.fn(()=> Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),
            generateKeyPair: jest.fn(()=> Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),
            fetchKeyPair: jest.fn(()=> Promise.resolve({
                publicKey: "keyPair.public",
                privateKey: "keyPair.private",
            })),

            checkAllKeyPairs: jest.fn(),
            generateKeyPairsAndStoreOrder: jest.fn(),

            isHardwareKeystoreExists: true,

            getJWT: jest.fn(()=> "header.payload.sign"),
            createSignature: jest.fn(()=> "sign"),
            createSignatureRSA: jest.fn(()=> "sign"),
            createSignatureECK1: jest.fn(()=> "sign"),
            createSignatureED: jest.fn(()=> "sign"),
            createSignatureECR1: jest.fn(()=> "sign"),

            replaceCharactersInB64: jest.fn(()=> "base64"),
            encodeB64: jest.fn(()=> "base64"),

            encryptJson: jest.fn(()=> "encrypted"),
            decryptJson: jest.fn(()=> "decrypted"),
        }
    )
);
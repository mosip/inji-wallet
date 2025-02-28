const mockEd25519 = () => ({
    signAsync: jest.fn(async (message, privateKey) => {
        return new Uint8Array([11, 22, 33, 44]); // Mocked signature
    }),
    getPublicKey: jest.fn(async (privateKey) => {
        return new Uint8Array([55, 66, 77, 88]); // Mocked public key
    }),
    utils: {
        randomPrivateKey: jest.fn(() => new Uint8Array([99, 100, 101, 102])) // Mocked private key
    },
    etc: {
        sha512Sync: jest.fn((data) => new Uint8Array([201, 202, 203, 204])), // Mocked hash
        sha512Async: jest.fn(async (data) => new Uint8Array([205, 206, 207, 208])), // Mocked async hash
        concatBytes: jest.fn((...arrays) => {
            return Uint8Array.from(arrays.flatMap(arr => [...arr])); // Concatenates arrays
        }),
    }
});

jest.mock('@noble/ed25519', () => mockEd25519);

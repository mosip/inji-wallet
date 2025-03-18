jest.mock('react-native-base64', () => ({
    encode: jest.fn((input) => `mockEncoded(${input})`),
    decode: jest.fn((input) => `mockDecoded(${input})`),
}));

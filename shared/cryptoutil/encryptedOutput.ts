export class EncryptedOutput {
  encryptedData: string;
  iv: string;
  salt: string;

  static ENCRYPTION_DELIMITER = '_';

  constructor(encryptedData: string, iv: string, salt: string) {
    this.encryptedData = encryptedData;
    this.iv = iv;
    this.salt = salt;
  }

  static fromString(encryptedOutput: string): EncryptedOutput {
    const split = encryptedOutput.split(EncryptedOutput.ENCRYPTION_DELIMITER);
    const iv = split[0];
    const salt = split[1];
    const encryptedData = split[2];

    return new EncryptedOutput(encryptedData, iv, salt);
  }

  toString(): string {
    return (
      this.iv +
      EncryptedOutput.ENCRYPTION_DELIMITER +
      this.salt +
      EncryptedOutput.ENCRYPTION_DELIMITER +
      this.encryptedData
    );
  }
}

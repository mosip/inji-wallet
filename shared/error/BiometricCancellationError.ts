export class BiometricCancellationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BiometricCancellationError';
  }
}

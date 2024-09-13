export class UnsupportedVcFormat extends Error {
  constructor(format: string) {
    super(format);
    this.name = 'UnsupportedVcFormat';
  }
}

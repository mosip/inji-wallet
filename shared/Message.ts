export class Message<T> {
  constructor(public type: string, public data?: T) {}

  static fromString<T>(json: string) {
    const [type, data] = json.split('\n');
    return new Message<T>(type, data ? JSON.parse(data) : undefined);
  }

  toString() {
    return this.data ? this.type + '\n' + JSON.stringify(this.data) : this.type;
  }
}

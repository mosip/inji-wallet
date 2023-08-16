export class __AppId {
  private static value: string;

  public static getValue(): string {
    return __AppId.value;
  }

  public static setValue(value: string) {
    this.value = value;
  }
}

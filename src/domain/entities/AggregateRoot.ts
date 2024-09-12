export abstract class AggregateRoot<T> {
  private _uuid: string;

  constructor(uuid: string) {
    this._uuid = uuid;
  }
  getUuid(): string {
    return this._uuid;
  }

  public abstract toJSON(): T;
}

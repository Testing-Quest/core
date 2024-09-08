export abstract class AggregateRoot {
  private _uuid: string;

  constructor(uuid: string) {
    this._uuid = uuid;
  }
  getUuid(): string {
    return this._uuid;
  }
}

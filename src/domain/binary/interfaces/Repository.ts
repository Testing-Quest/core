export interface BinaryRepo {
  save(quest: any): Promise<any>;
  get(uuid: string): Promise<any>;
  delete(uuid: string): Promise<void>;
}

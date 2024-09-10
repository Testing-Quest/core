import { ItemsType } from "../items";

export type multiItemsType = ItemsType & {
  conflict: boolean[];
  choice: string[];
  difficulty: number[];
  altDiscrimination: { [key: string]: number[] };
}

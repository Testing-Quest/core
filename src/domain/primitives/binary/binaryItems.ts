import { ItemsType } from "../items";

export type binaryItemsType = ItemsType & {
  conflict: boolean[];
  choice: string[];
  difficulty: number[];
  altDiscrimination: { [key: string]: number[] };
}

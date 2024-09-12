import { ItemsType } from "../items";

export type binaryItemsType = ItemsType & {
  conflict: boolean[];
  choice: boolean[];
  difficulty: number[];
  altDiscrimination: { [key: string]: number[] };
}

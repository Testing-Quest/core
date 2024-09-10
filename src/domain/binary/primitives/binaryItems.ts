import { ItemsType } from "../../primitives/items";

export type binaryItemsType = ItemsType & {
  conflict: boolean[];
  choice: string[];
  difficulty: number[];
  altDiscrimination: { [key: string]: number[] };
}

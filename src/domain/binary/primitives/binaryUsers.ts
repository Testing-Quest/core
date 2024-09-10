import { UsersType } from "../../primitives/users";

export type binaryUsersType = UsersType & {
  weightedScore: number[];
  coherence: number[];
  mci: number[];
}

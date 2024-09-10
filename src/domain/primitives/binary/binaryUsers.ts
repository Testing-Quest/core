import { UsersType } from "../users";

export type binaryUsersType = UsersType & {
  weightedScore: number[];
  coherence: number[];
  mci: number[];
}

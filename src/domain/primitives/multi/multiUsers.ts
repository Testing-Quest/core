import { UsersType } from "../users";

export type multiUsersType = UsersType & {
  weightedScore: number[];
  coherence: number[];
  mci: number[];
}

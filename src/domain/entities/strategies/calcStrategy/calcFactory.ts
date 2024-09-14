import { QuestTypes } from "../../../primitives";
import { CalcStrategy} from "./CalcStrategy";
import { CalcStrategyBinary } from "./CalcStrategyBinary";
import { CalcStrategyGradu } from "./CalcStrategyGradu";
import { CalcStrategyMulti } from "./CalcStrategyMulti";

export function calcFactory<Q extends QuestTypes>(type: Q["type"]): CalcStrategy<Q> {
  switch (type) {
    case 'gradu':
      return new CalcStrategyGradu();
    case 'multi':
      return new CalcStrategyMulti();
    case 'binary':
      return new CalcStrategyBinary();
    default:
      throw new Error('Invalid calc type');
  }
}

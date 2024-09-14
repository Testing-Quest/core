import { QuestTypes } from "../../../primitives";
import { CalcStrategy} from "./CalcStrategy";
import { CalcStrategyBinary } from "./CalcStrategyBinary";
import { CalcStrategyGradu } from "./CalcStrategyGradu";
import { CalcStrategyMulti } from "./CalcStrategyMulti";

export function calcFactory<Q extends QuestTypes>(type: 'gradu' | 'multi' | 'binary'): CalcStrategy<Q> {
  switch (type) {
    case 'gradu':
      return new CalcStrategyGradu() as CalcStrategy<Q>;
    case 'multi':
      return new CalcStrategyMulti() as CalcStrategy<Q>;
    case 'binary':
      return new CalcStrategyBinary() as CalcStrategy<Q>;
    default:
      throw new Error('Invalid calc type');
  }
}

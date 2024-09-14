import { QuestTypes } from "../../../primitives";
import { PlotStrategy } from "./PlotStrategy";
import { PlotStrategyBinary } from "./PlotStrategyBinary";
import { PlotStrategyGradu } from "./PlotStrategyGradu";
import { PlotStrategyMulti } from "./PlotStrategyMulti";



export function plotFactory<Q extends QuestTypes>(type: Q["type"]): PlotStrategy<Q> {
  switch (type) {
    case 'gradu':
      return new PlotStrategyGradu() as PlotStrategy<Q>;
    case 'multi':
      return new PlotStrategyMulti() as PlotStrategy<Q>;
    case 'binary':
      return new PlotStrategyBinary() as PlotStrategy<Q>;
    default:
      throw new Error('Invalid calc type');
  }
}

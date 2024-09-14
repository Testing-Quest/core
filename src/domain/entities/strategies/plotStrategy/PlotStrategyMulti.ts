import { MultiQuestType } from "../../../primitives";
import { dataPoint } from "../../Quest";
import { PlotStrategyBase } from "./PlotStrategy";

export class PlotStrategyMulti extends PlotStrategyBase<MultiQuestType> {

  public getDirectWeight(attrs: MultiQuestType): dataPoint[] {
    const weight = attrs.calculations.users.weightedScore;
    const direct = attrs.calculations.users.directScore;
    return weight.map((w, i) => ({ x: direct[i], y: w }));
  }

  public getDirectCohrency(attrs: MultiQuestType): dataPoint[] {
    const coherence = attrs.calculations.users.coherence;
    const direct = attrs.calculations.users.directScore;
    return coherence.map((c, i) => ({ x: direct[i], y: c }));
  }

  public getDirectMci(attrs: MultiQuestType): dataPoint[] {
    const mci = attrs.calculations.users.mci;
    const direct = attrs.calculations.users.directScore;
    return mci.map((m, i) => ({ x: direct[i], y: m }));
  }
}

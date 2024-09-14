import { QuestTypes } from "../../../primitives";
import { dataPoint } from "../../Quest";

const ERROR_MESSAGE = 'Not implemented for Quest Type: '


export interface PlotStrategy<Q extends QuestTypes> {
  getReliability(attrs: Q): dataPoint[];
  getItemsMap(attrs: Q): dataPoint[];
  getDirectBlank(attrs: Q): dataPoint[];
  getDirectWeight(attrs: Q): dataPoint[];
  getDirectCohrency(attrs: Q): dataPoint[];
  getDirectMci(attrs: Q): dataPoint[];
  getScoreDistribution(attrs: Q): dataPoint[];
  getItemFrequency(attrs: Q): dataPoint[];
  getItemDiscrimination(attrs: Q): dataPoint[] | null;
  getItemProfile(attrs: Q): { [profile: string]: dataPoint[] };
}

export abstract class PlotStrategyBase<Q extends QuestTypes> implements PlotStrategy<Q> {

  public getReliability(attrs: Q): dataPoint[] {
    const alpha = attrs.calculations.health.cronbachAlpha;
    return Array.from({ length: 11 }, (_, i) => {
      const x = 0.5 + i * 0.1;
      const y = (x * alpha) / (1 + (x - 1) * alpha);
      return { x, y };
    });
  }

  public getItemsMap(attrs: Q): dataPoint[] {
    const disc = attrs.calculations.items.discrimination;
    const diff = attrs.calculations.items.difficulty;
    return disc.map((d, i) => ({ x: diff[i], y: d }));
  }

  public getDirectBlank(attrs: Q): dataPoint[] {
    const blank = attrs.calculations.users.blankAnswer;
    const direct = attrs.calculations.users.directScore;
    return blank.map((b, i) => ({ x: direct[i], y: b }));
  }

  public getScoreDistribution(attrs: Q): dataPoint[] {
    const direct = attrs.calculations.users.directScore;
    const min = Math.min(...direct);
    const max = Math.max(...direct);
    const range = max - min;
    const binSize = range / 23;

    const bins: number[] = Array.from({ length: 24 }, (_, i) => min + i * binSize);

    const binCounts = Array(23).fill(0);

    for (const value of direct) {
      const binIndex = Math.min(Math.floor((value - min) / binSize), 22);
      binCounts[binIndex]++;
    }

    const data: dataPoint[] = binCounts.map((count, i) => ({
      x: bins[i],
      y: (count / direct.length) * 100
    }));
    return data;
  }
  public getDirectWeight(attrs: Q): dataPoint[] { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
  public getDirectCohrency(attrs: Q): dataPoint[] { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
  public getDirectMci(attrs: Q): dataPoint[] { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
  public getItemFrequency(attrs: Q): dataPoint[] { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
  public getItemDiscrimination(attrs: Q): dataPoint[] | null { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
  public getItemProfile(attrs: Q): { [profile: string]: dataPoint[] } { throw new Error(ERROR_MESSAGE.concat(attrs.type)) };
}

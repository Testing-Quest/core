import type { QuestTypesMap } from '../../../primitives'
import type { dataPoint } from '../../Quest'

const ERROR_MESSAGE = 'Not implemented for Quest Type: '

export type PlotStrategy<T extends keyof QuestTypesMap> = {
  getReliability(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getItemsMap(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getDirectBlank(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getDirectWeight(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getDirectCohrency(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getDirectMci(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): dataPoint[]
  getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): dataPoint[]
  getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): dataPoint[] | null
  getItemProfile(attrs: QuestTypesMap[T]['calcs'], id: number): Record<string, dataPoint[]>
}

export abstract class PlotStrategyBase<T extends keyof QuestTypesMap> implements PlotStrategy<T> {
  public getReliability(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    const alpha = attrs.health.cronbachAlpha
    return Array.from({ length: 11 }, (_, i) => {
      const x = 0.5 + i * 0.1
      const y = (x * alpha) / (1 + (x - 1) * alpha)
      return { x, y }
    })
  }

  public getItemsMap(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    const disc = attrs.items.discrimination
    const diff = attrs.items.difficulty
    return disc.map((d, i) => ({ x: diff[i], y: d }))
  }

  public getDirectBlank(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    const blank = attrs.users.blankAnswer
    const direct = attrs.users.directScore
    return blank.map((b, i) => ({ x: direct[i], y: b }))
  }

  public getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    const direct = attrs.users.directScore
    const min = Math.min(...direct)
    const max = Math.max(...direct)
    const range = max - min
    const binSize = range / 23

    const bins: number[] = Array.from({ length: 24 }, (_, i) => min + i * binSize)

    const binCounts = Array(23).fill(0)

    for (const value of direct) {
      const binIndex = Math.min(Math.floor((value - min) / binSize), 22)
      binCounts[binIndex]++
    }

    const data: dataPoint[] = binCounts.map((count, i) => ({
      x: bins[i],
      y: (count / direct.length) * 100,
    }))
    return data
  }
  public getDirectWeight(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    throw new Error(ERROR_MESSAGE)
  }
  public getDirectCohrency(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    throw new Error(ERROR_MESSAGE)
  }
  public getDirectMci(attrs: QuestTypesMap[T]['calcs']): dataPoint[] {
    throw new Error(ERROR_MESSAGE)
  }
  public getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): dataPoint[] {
    throw new Error(ERROR_MESSAGE)
  }
  public getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): dataPoint[] | null {
    throw new Error(ERROR_MESSAGE)
  }
  public getItemProfile(attrs: QuestTypesMap[T]['calcs'], id: number): Record<string, dataPoint[]> {
    throw new Error(ERROR_MESSAGE)
  }
}

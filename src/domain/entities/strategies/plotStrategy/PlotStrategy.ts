import { alternatives, type QuestTypesMap } from '../../../primitives'
import type { DataPoint, StringDataPoint } from '../../Quest'

export type PlotStrategy<T extends keyof QuestTypesMap> = {
  getReliability(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getItemsMap(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getDirectBlank(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getDirectWeight(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getDirectCohrency(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getDirectMci(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
  getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
  getItemProfile(attrs: QuestTypesMap[T], id: number): Record<string, DataPoint[]>
}

export abstract class PlotStrategyBase<T extends keyof QuestTypesMap> implements PlotStrategy<T> {
  public getReliability(attrs: QuestTypesMap[T]['calcs']): DataPoint[] {
    const alpha = attrs.health.cronbachAlpha
    return Array.from({ length: 11 }, (_, i) => {
      const x = 0.5 + i * 0.1
      const y = (x * alpha) / (1 + (x - 1) * alpha)
      return { x, y }
    })
  }

  public getItemsMap(attrs: QuestTypesMap[T]['calcs']): DataPoint[] {
    const disc = attrs.items.discrimination
    const diff = attrs.items.difficulty
    return disc.map((d, i) => ({ x: diff[i], y: d }))
  }

  public getDirectBlank(attrs: QuestTypesMap[T]['calcs']): DataPoint[] {
    const blank = attrs.users.blankAnswer
    const direct = attrs.users.directScore
    return blank.map((b, i) => ({ x: direct[i], y: b }))
  }

  public getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): DataPoint[] {
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

    const data: DataPoint[] = binCounts.map((count, i) => ({
      x: bins[i],
      y: (count / direct.length) * 100,
    }))
    return data
  }

  public getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[] {
    const numUsers = attrs.correctMatrix.length

    return Array.from(Object.entries(attrs.items.altDifficulty)).map(([key, value]): StringDataPoint => {
      return {
        x: key.split(' ')[1],
        y: value[id] * numUsers,
      }
    })
  }

  public getItemProfile(attrs: QuestTypesMap[T], id: number): Record<string, DataPoint[]> {
    const groupCount = 5
    const itemResponses = attrs.matrix.map(row => row[id])
    const min = Math.min(...attrs.calcs.users.directScore)
    const max = Math.max(...attrs.calcs.users.directScore)
    const range = max - min || 1
    const validAlternatives = [...alternatives.slice(0, attrs.alternatives), 'X']

    const usersGroups = attrs.calcs.users.directScore.map(score =>
      Math.min(groupCount - 1, Math.floor(((score - min) / range) * groupCount)),
    )

    return Object.fromEntries(
      validAlternatives.map(key => {
        const dataPoints = Array.from({ length: groupCount }, (_, group) => ({
          x: group,
          y: itemResponses.filter((response, index) => response === key && usersGroups[index] === group).length,
        }))
        return [key, dataPoints]
      }),
    )
  }

  public abstract getDirectWeight(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  public abstract getDirectCohrency(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  public abstract getDirectMci(attrs: QuestTypesMap[T]['calcs']): DataPoint[]
  public abstract getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
}

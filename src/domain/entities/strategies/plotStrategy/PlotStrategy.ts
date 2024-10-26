import type { QuestTypesMap } from '../../../primitives'
import type { MatrixType } from '../../../primitives/quest'
import type { DataPoint, SimpleDataPoint, StringDataPoint } from '../../Quest'

export type PlotStrategy<T extends keyof QuestTypesMap> = {
  getReliability(attrs: QuestTypesMap[T]['calcs']): SimpleDataPoint[]
  getItemsMap(attrs: QuestTypesMap[T]['calcs'], items: boolean[]): DataPoint[]
  getDirectBlank(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  getDirectWeight(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  getDirectCohrency(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  getDirectMci(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): SimpleDataPoint[]
  getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
  getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
  getItemProfile(
    attrs: { matrix: MatrixType; alternatives: number; calcs: QuestTypesMap[T]['calcs'] },
    id: number,
  ): Record<string, SimpleDataPoint[]>
}

export abstract class PlotStrategyBase<T extends keyof QuestTypesMap> implements PlotStrategy<T> {
  public getReliability(attrs: QuestTypesMap[T]['calcs']): SimpleDataPoint[] {
    const alpha = attrs.health.cronbachAlpha
    return Array.from({ length: 11 }, (_, i) => {
      const x = 0.5 + i * 0.1
      const y = (x * alpha) / (1 + (x - 1) * alpha)
      return { x, y }
    })
  }

  public getItemsMap(attrs: QuestTypesMap[T]['calcs'], items: boolean[]): DataPoint[] {
    const disc = attrs.items.discrimination
    const diff = attrs.items.difficulty
    const activeUsers = items.map((u, i) => (u ? i + 1 : -1)).filter(u => u !== -1)
    return disc.map((d, i) => ({ x: diff[i], y: d, hover: activeUsers[i] }))
  }

  public getDirectBlank(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[] {
    const blank = attrs.users.blankAnswer
    const direct = attrs.users.directScore
    const activeUsers = users.map((u, i) => (u ? i + 1 : -1)).filter(u => u !== -1)
    return blank.map((b, i) => ({ x: direct[i], y: b, hover: activeUsers[i] }))
  }

  public getScoreDistribution(attrs: QuestTypesMap[T]['calcs']): SimpleDataPoint[] {
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

    const data: SimpleDataPoint[] = binCounts.map((count, i) => ({
      x: bins[i],
      y: (count / direct.length) * 100,
    }))
    return data
  }

  public getItemFrequency(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[] {
    return Array.from(Object.entries(attrs.items.altDifficulty)).map(([key, value]): StringDataPoint => {
      return {
        x: key.split(' ')[1],
        y: value[id],
      }
    })
  }

  public sharedItemProfile(
    attrs: { matrix: MatrixType; alternatives: number; calcs: QuestTypesMap[T]['calcs'] },
    groupCount: number,
  ): [Record<number, number>, number[]] {
    const min = Math.min(...attrs.calcs.users.directScore)
    const max = Math.max(...attrs.calcs.users.directScore)
    const range = max - min || 1
    const usersGroups = attrs.calcs.users.directScore.map(score =>
      Math.min(groupCount - 1, Math.floor(((score - min) / range) * groupCount)),
    )

    const totalResponsesByGroup = usersGroups.reduce(
      (acc, group) => {
        acc[group] = (acc[group] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    return [totalResponsesByGroup, usersGroups]
  }

  public abstract getItemProfile(
    attrs: { matrix: MatrixType; alternatives: number; calcs: QuestTypesMap[T]['calcs'] },
    id: number,
  ): Record<string, SimpleDataPoint[]>
  public abstract getDirectWeight(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  public abstract getDirectCohrency(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  public abstract getDirectMci(attrs: QuestTypesMap[T]['calcs'], users: boolean[]): DataPoint[]
  public abstract getItemDiscrimination(attrs: QuestTypesMap[T]['calcs'], id: number): StringDataPoint[]
}

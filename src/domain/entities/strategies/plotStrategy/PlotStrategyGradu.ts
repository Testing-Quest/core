import type { GraduCalcsType } from '../../../primitives/calcs/calcs'
import type { DataPoint, StringDataPoint } from '../../Quest'
import { PlotStrategyBase } from './PlotStrategy'

export class PlotStrategyGradu extends PlotStrategyBase<'gradu'> {
  public getDirectWeight(attrs: GraduCalcsType): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getDirectCohrency(attrs: GraduCalcsType): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getDirectMci(attrs: GraduCalcsType): DataPoint[] {
    throw new Error('Not implemented')
  }
  public getItemDiscrimination(attrs: GraduCalcsType, id: number): StringDataPoint[] {
    throw new Error('Not implemented')
  }
}

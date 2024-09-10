export type ItemsType = {
  ids: number[];
  enabled: boolean[];
  keys: string[];
  originalKeys: string[];

  variance: number[];
  discrimination: number[];
  corrDiscrimination: number[];
  altDifficulty: { [key: string]: number[] };
};

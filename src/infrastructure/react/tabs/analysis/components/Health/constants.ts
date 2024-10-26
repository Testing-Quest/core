export const PERCENTAGE_PROPERTIES = [
  'choice',
  'keyConflict',
  'reliability',
  'discrimination',
  'variability',
  'coherency',
  'difficulty',
  'testHealth',
]

const COMMON_HEALTH_PROPERTIES: Record<string, string> = {
  cronbachAlpha: 'Cronbach Alpha',
  sem: 'SEM',
  mean: 'Mean',
  variance: 'Variance',
  standardDeviation: 'Standard Deviation',
  reliability: 'Reliability',
  discrimination: 'Discrimination',
  testHealth: 'Test Health',
}

const MULTI_QUEST_PROPERTIES: Record<string, string> = {
  ...COMMON_HEALTH_PROPERTIES,
  keyConflict: 'Key Conflict',
  choice: 'Choice',
  coherency: 'Coherency',
  difficulty: 'Difficulty',
}

const GRADU_QUEST_PROPERTIES: Record<string, string> = {
  ...COMMON_HEALTH_PROPERTIES,
  score: 'Score',
  variability: 'Variability',
}

const BINARY_QUEST_PROPERTIES: Record<string, string> = {
  ...COMMON_HEALTH_PROPERTIES,
  coherency: 'Coherency',
  difficulty: 'Difficulty',
}

export const PROPERTY_MAP: Record<string, Record<string, string>> = {
  multi: MULTI_QUEST_PROPERTIES,
  gradu: GRADU_QUEST_PROPERTIES,
  binary: BINARY_QUEST_PROPERTIES,
}

export const BINARY_PIE_CHART_PROPERTIES: Record<string, string> = {
  reliability: 'Reliability',
  discrimination: 'Discrimination',
  coherency: 'Coherency',
}

export const MULTI_PIE_CHART_PROPERTIES: Record<string, string> = {
  reliability: 'Reliability',
  discrimination: 'Discrimination',
  coherency: 'Coherency',
  keyConflict: 'Key Conflict',
  choice: 'Choice',
}

export const GRADU_PIE_CHART_PROPERTIES: Record<string, string> = {
  reliability: 'Reliability',
  discrimination: 'Discrimination',
  variability: 'Variability',
}

export const PIE_CHART_PROPERTY_MAP: Record<string, Record<string, string>> = {
  multi: MULTI_PIE_CHART_PROPERTIES,
  gradu: GRADU_PIE_CHART_PROPERTIES,
  binary: BINARY_PIE_CHART_PROPERTIES,
}

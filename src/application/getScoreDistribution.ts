import type { Repository } from '../domain/repository'
import type { GetScoreDistributionRequest } from './requests/getScoreDistributionRequest'
import type { GetScoreDistributionResponse } from './responses/getScoreDistributionResponse'

async function _process(
  payload: GetScoreDistributionRequest,
  repository: Repository,
): Promise<GetScoreDistributionResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getScoreDistribution(), error: null }
}

export async function getScoreDistribution(
  payload: GetScoreDistributionRequest,
  repository: Repository,
): Promise<GetScoreDistributionResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

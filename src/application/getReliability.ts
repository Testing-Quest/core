import type { Repository } from '../domain/repository'
import type { GetReliabilityRequest } from './requests/getReliabilityRequest'
import type { GetReliabilityResponse } from './responses/getReliabilityResponse'

async function _getReliability(
  payload: GetReliabilityRequest,
  repository: Repository,
): Promise<GetReliabilityResponse> {
  const quest = await repository.get(payload.uuid)
  return { reliability: quest.getReliability(), error: null }
}

export async function getReliability(
  payload: GetReliabilityRequest,
  repository: Repository,
): Promise<GetReliabilityResponse> {
  try {
    return await _getReliability(payload, repository)
  } catch (error: unknown) {
    return {
      reliability: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

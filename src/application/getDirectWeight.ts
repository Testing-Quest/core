import type { Repository } from '../domain/repository'
import type { GetDirectWeightRequest } from './requests/getDirectWeightRequest'
import type { GetDirectWeightResponse } from './responses/getDirectWeightResponse'

async function _process(payload: GetDirectWeightRequest, repository: Repository): Promise<GetDirectWeightResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getDirectWeight(), error: null }
}

export async function getDirectWeight(
  payload: GetDirectWeightRequest,
  repository: Repository,
): Promise<GetDirectWeightResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

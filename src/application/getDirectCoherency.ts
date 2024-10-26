import type { Repository } from '../domain/repository'
import type { GetDirectCoherencyRequest } from './requests/getDirectCoherencyRequest'
import type { GetDirectCoherencyResponse } from './responses/getDirectCoherencyResponse'

async function _process(
  payload: GetDirectCoherencyRequest,
  repository: Repository,
): Promise<GetDirectCoherencyResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getDirectCohrency(), error: null }
}

export async function getDirectCoherency(
  payload: GetDirectCoherencyRequest,
  repository: Repository,
): Promise<GetDirectCoherencyResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

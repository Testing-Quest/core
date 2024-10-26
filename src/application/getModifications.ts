import type { Repository } from '../domain/repository'
import type { GetModificationsRequest } from './requests/getModificationsRequest'
import type { GetModificatinosResponse } from './responses/getModificationsResponse'

async function _process(payload: GetModificationsRequest, repository: Repository): Promise<GetModificatinosResponse> {
  const quest = await repository.get(payload.uuid)
  return { response: quest.getModifications(), error: null }
}

export async function getModifications(
  payload: GetModificationsRequest,
  repository: Repository,
): Promise<GetModificatinosResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      response: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

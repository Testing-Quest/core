import type { Repository } from '../domain/repository'
import type { GetItemProfileRequest } from './requests/getItemProfileRequest'
import type { GetItemProfileResponse } from './responses/getItemProfileResponse'

async function _process(payload: GetItemProfileRequest, repository: Repository): Promise<GetItemProfileResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getItemProfile(payload.id), error: null }
}

export async function getItemProfile(
  payload: GetItemProfileRequest,
  repository: Repository,
): Promise<GetItemProfileResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

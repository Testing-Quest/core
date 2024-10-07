import type { Repository } from '../domain/repository'
import type { GetItemDiscriminationRequest } from './requests/getItemDiscriminationRequest'
import type { GetItemDiscriminationResponse } from './responses/getItemDiscriminationResponse'

async function _process(
  payload: GetItemDiscriminationRequest,
  repository: Repository,
): Promise<GetItemDiscriminationResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getItemDiscrimination(payload.id), error: null }
}

export async function getItemDiscrimination(
  payload: GetItemDiscriminationRequest,
  repository: Repository,
): Promise<GetItemDiscriminationResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

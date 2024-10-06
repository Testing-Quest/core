import type { Repository } from '../domain/repository'
import type { GetItemMapRequest } from './requests/getItemMapRequest'
import type { GetItemMapResponse } from './responses/getItemMapResponse'

async function _getItemMap(payload: GetItemMapRequest, repository: Repository): Promise<GetItemMapResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getItemsMap(), error: null }
}

export async function getItemMap(payload: GetItemMapRequest, repository: Repository): Promise<GetItemMapResponse> {
  try {
    return await _getItemMap(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

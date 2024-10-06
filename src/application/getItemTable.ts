import type { Repository } from '../domain/repository'
import type { GetItemTableRequest } from './requests/getItemTableRequest'
import type { GetItemTableResponse } from './responses/getItemTableResponse'

async function _process(payload: GetItemTableRequest, repository: Repository): Promise<GetItemTableResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getItemsTable(), error: null }
}

export async function getItemTable(
  payload: GetItemTableRequest,
  repository: Repository,
): Promise<GetItemTableResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

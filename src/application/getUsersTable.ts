import type { Repository } from '../domain/repository'
import type { GetUsersTableRequest } from './requests/getUsersTableRequest'
import type { GetUsersTableResponse } from './responses/getUsersTableResponse'

async function _process(payload: GetUsersTableRequest, repository: Repository): Promise<GetUsersTableResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getUsersTable(), error: null }
}

export async function getUsersTable(
  payload: GetUsersTableRequest,
  repository: Repository,
): Promise<GetUsersTableResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

import type { Repository } from '../domain/repository'
import type { GetHealthRequest } from './requests/getHealthRequest'
import type { GetHealthResponse } from './responses/getHealthResponse'

async function _getHealth(payload: GetHealthRequest, repository: Repository): Promise<GetHealthResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getHealth(), error: null }
}

export async function getHealth(payload: GetHealthRequest, repository: Repository): Promise<GetHealthResponse> {
  try {
    return await _getHealth(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

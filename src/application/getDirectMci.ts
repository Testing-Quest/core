import type { Repository } from '../domain/repository'
import type { GetDirectMciRequest } from './requests/getDirectMciRequest'
import type { GetDirectMciResponse } from './responses/getDirectMciResponse'

async function _process(payload: GetDirectMciRequest, repository: Repository): Promise<GetDirectMciResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getDirectMci(), error: null }
}

export async function getDirectMci(
  payload: GetDirectMciRequest,
  repository: Repository,
): Promise<GetDirectMciResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

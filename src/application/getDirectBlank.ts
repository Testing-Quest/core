import type { Repository } from '../domain/repository'
import type { GetDirectBlankRequest } from './requests/getDirectBlankRequest'
import type { GetDirectBlankResponse } from './responses/getDirectBlankResponse'

async function _process(payload: GetDirectBlankRequest, repository: Repository): Promise<GetDirectBlankResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getDirectBlank(), error: null }
}

export async function getDirectBlanck(
  payload: GetDirectBlankRequest,
  repository: Repository,
): Promise<GetDirectBlankResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

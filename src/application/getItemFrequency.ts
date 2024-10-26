import type { Repository } from '../domain/repository'
import type { GetItemFrequencyRequest } from './requests/getItemFrequencyRequest'
import type { GetItemFrequencyResponse } from './responses/getItemFrequencyResponse'

async function _process(payload: GetItemFrequencyRequest, repository: Repository): Promise<GetItemFrequencyResponse> {
  const quest = await repository.get(payload.uuid)
  return { data: quest.getItemFrequency(payload.id), error: null }
}

export async function getItemFrequency(
  payload: GetItemFrequencyRequest,
  repository: Repository,
): Promise<GetItemFrequencyResponse> {
  try {
    return await _process(payload, repository)
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

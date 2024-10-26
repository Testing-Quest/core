import type { Repository } from '../domain/repository'
import type { UpdateRequest } from './requests/updateRequest'
import type { UpdateResponse } from './responses/updateResponse'

async function _process(payload: UpdateRequest, repository: Repository): Promise<void> {
  const quest = await repository.get(payload.uuid)
  quest.update(payload.data)
  await repository.save(quest)
}

export async function updateQuest(payload: UpdateRequest, repository: Repository): Promise<UpdateResponse> {
  try {
    await _process(payload, repository)
    return { status: true, error: null }
  } catch (error: unknown) {
    return {
      status: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

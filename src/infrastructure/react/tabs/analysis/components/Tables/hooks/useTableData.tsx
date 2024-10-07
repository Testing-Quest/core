import { useState, useCallback, useEffect } from 'react'
import type { DomainTable, ItemState } from '../types'
import type { Client } from '../../../../../../Client'

export const useTableData = (client: Client, fetchMethod: 'getUsersTable' | 'getItemsTable') => {
  const [data, setData] = useState<DomainTable | null>(null)
  const [loading, setLoading] = useState(true)
  const [states, setStates] = useState<ItemState[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await client[fetchMethod]()
      setData(response.data ?? null)
      if (response.data && response.data.Deactivate) {
        setStates(
          response.data.Deactivate.map((value: string | number | boolean) => ({
            deactivated: !value,
            changed: false,
          })),
        )
      }
    } catch (error) {
      console.error(`Error fetching ${fetchMethod} data:`, error)
    } finally {
      setLoading(false)
    }
  }, [client, fetchMethod])

  useEffect(() => {
    fetchData()
  }, [fetchData, refreshTrigger])

  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return { data, loading, states, setStates, refreshData }
}

// No changes needed for types.ts and utils/columnCreator.ts

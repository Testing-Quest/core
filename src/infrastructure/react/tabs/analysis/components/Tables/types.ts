import React from 'react'

export type TableRow = {
  key: number
  [key: string]: string | number | boolean | React.ReactNode
}

export type DomainTable = Record<string, (string | number | boolean)[]>

export type ItemState = {
  deactivated: boolean
  changed: boolean
}

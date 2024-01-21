export interface IEnqueueOptions {
  // job options
  priority?: number
  startAfter?: number | string | Date
  singletonKey?: string
  useSingletonQueue?: boolean
  singletonSeconds?: number
  singletonMinutes?: number
  singletonHours?: number
  singletonNextSlot?: boolean

  // expire options
  expireInSeconds?: number
  expireInMinutes?: number
  expireInHours?: number

  // retention options
  retentionSeconds?: number
  retentionMinutes?: number
  retentionHours?: number
  retentionDays?: number

  // retry options
  retryLimit?: number
  retryDelay?: number
  retryBackoff?: boolean

  // complete options
  onComplete?: boolean
}

export interface IBulkEnqueueOptions {
  // job options
  priority?: number
  startAfter?: Date | string
  singletonKey?: string

  // retry options
  retryLimit?: number
  retryDelay?: number
  retryBackoff?: boolean

  // expire options
  expireInSeconds?: number
  keepUntil?: Date | string

  // complete options
  onComplete?: boolean
}

export interface IJob<T = object> {
  id: string // job id
  name: string // queue name
  data: T // data
}

export interface IWorkOptions {
  // job fetch options
  teamSize?: number
  teamConcurrency?: number
  teamRefill?: boolean
  includeMetadata?: boolean
  enforceSingletonQueueActiveLimit?: boolean

  // job polling options
  newJobCheckInterval?: number
  newJobCheckIntervalSeconds?: number
}

export interface ICompletedJob<INPUT, OUTPUT> {
  id: string
  data: {
    state: 'completed' | 'failed'
    request: {
      id: string
      data: INPUT
    }
    response: OUTPUT
  }
}

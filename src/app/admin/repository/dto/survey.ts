import { BaseDTO, VersionableDTO } from './base_dto'
import { Section } from './section'
import { DateRange } from './date_range'

export enum SurveyStatus {
  PUBLISHED = 'PUBLISHED',
  READY = 'READY',
  DRAFT = 'DRAFT',
  STOPPED = 'STOPPED',
  EXPIRED = 'EXPIRED',
}

export type Survey = BaseDTO &
  VersionableDTO & {
    createdAt: Date
    dateRange?: DateRange
    status: SurveyStatus
    sections: Array<Section>
    results: any[]
    structureType: string
  }

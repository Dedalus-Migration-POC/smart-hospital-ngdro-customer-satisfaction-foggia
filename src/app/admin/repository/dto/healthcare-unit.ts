export type HealthcareUnit = {
  id: number
  type: HealthcareUnitType
  name: string
  departments: Array<HealthcareUnitStructure>
  haveQuestionary?: boolean
}

export type HealthcareUnitType = 'SC' | 'SS' | 'SSD'
export type HealthcareUnitStructure = 'DEPARTMENT' | 'AMBULATORY'

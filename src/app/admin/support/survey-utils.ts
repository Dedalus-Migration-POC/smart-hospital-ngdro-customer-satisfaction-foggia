import { Survey } from '../repository/dto/survey'

export const SurveyUtils = {
  getNameAndVersion: (sections: Array<Survey>, section: Survey): string =>
    sections?.filter(({ name }) => name === section.name).length > 1
      ? `${section.name} (v${section.version})`
      : section.name,
}

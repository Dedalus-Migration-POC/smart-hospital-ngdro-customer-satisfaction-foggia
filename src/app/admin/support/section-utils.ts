import {Section} from "../repository/dto/section";

export const SectionUtils = {
  getNameAndVersion: (sections: Array<Section>, section: Section): string =>
    sections.filter(({name}) => name === section.name).length > 1
      ? `${section.name} (v${section.version})`
      : section.name
}

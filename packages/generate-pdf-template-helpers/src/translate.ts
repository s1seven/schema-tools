import { ExternalStandards, ExternalStandardsTranslations, Translation, Translations } from './types';

export class Translate<
  T = Translations,
  t = Translation,
  E = ExternalStandardsTranslations,
  // e = CoACampusTranslations,
> {
  constructor(readonly translations: T, readonly extraTranslations: E, readonly languages: string[] = ['EN']) {}
  /*
  t is [group: string]: Record<string, string>;

  G extends keyof t = keyof t
  G is a group, refers to the keys of t - [group: string]

  P extends keyof t[G]
  P is a phrase, refers to the values of t - Record<string, string>

  */
  getField<G extends keyof t = keyof t, P extends keyof t[G] = keyof t[G]>(language: string, group: G, phrase: P) {
    const translations = this.translations;
    if (language in translations && group in translations[language] && phrase in translations[language][group]) {
      return translations[language][group][phrase];
    }
    return '';
  }

  getTranslation<G extends keyof t = keyof t, P extends keyof t[G] = keyof t[G]>(group: G, phrase: P) {
    return this.languages.map((language) => this.getField(language, group, phrase)).join(' / ');
  }

  translate<G extends keyof t = keyof t, P extends keyof t[G] = keyof t[G]>(phrase: P, group: G) {
    // specific to EN10168
    if (group === 'certificateFields') {
      return `${phrase} ${this.getTranslation(group, phrase)}`;
    }
    return this.getTranslation(group, phrase);
  }

  extraTranslate(
    propertiesStandard: ExternalStandards | undefined,
    propertyId: string, // how can I enforce that this is a key of E?
    property: 'Property' | 'TestConditions',
    defaultValue: string,
  ) {
    return this.getExtraTranslation(propertiesStandard, propertyId, property, defaultValue);
  }

  getExtraTranslation<S extends keyof E = keyof E, P extends keyof t[G] = keyof t[G]>(
    propertiesStandard: S,
    propertyId: string,
    property: string,
    defaultValue: string,
  ) {
    const translatedFields = this.languages.map(
      (language) => this.getExtraField(propertiesStandard, language, propertyId, property) || defaultValue,
    );

    return translatedFields[0] === translatedFields[1] ? translatedFields[0] : translatedFields.join(' / ');
  }

  getExtraField<S extends keyof E = keyof E, L extends string, P extends keyof t[G] = keyof t[G]>(
    propertiesStandard: E | undefined,
    language: string,
    propertyId: string,
    property: string,
  ) {
    const extraTranslations = this.extraTranslations;

    if (
      propertiesStandard &&
      language in extraTranslations[propertiesStandard] &&
      propertyId in extraTranslations[propertiesStandard][language] &&
      property in extraTranslations[propertiesStandard][language][propertyId]
    ) {
      return extraTranslations[propertiesStandard][language][propertyId][property];
    }
    return '';
  }
}

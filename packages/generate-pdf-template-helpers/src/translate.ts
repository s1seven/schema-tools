import { ExternalStandardsTranslations, Languages } from '@s1seven/schema-tools-types';

import { Translations } from './types';

type ValueOf<T> = T[keyof T];

export class Translate<T = Translations, E = ExternalStandardsTranslations> {
  constructor(readonly translations: T, readonly extraTranslations: E, readonly languages: Languages[] = ['EN']) {}
  /*
  t is [group: string]: Record<string, string>;

  G extends keyof t = keyof t
  G is a group, refers to the keys of t - [group: string]

  P extends keyof t[G]
  P is a phrase, refers to the values of t - Record<string, string>

  */
  getField<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    language: Languages,
    group: G,
    phrase: P,
  ) {
    const translations = this.translations;
    if (language in translations && group in translations[language] && phrase in translations[language][group]) {
      return translations[language][group][phrase];
    }
    return '';
  }

  getTranslation<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    group: G,
    phrase: P,
  ) {
    return this.languages.map((language) => this.getField(language, group, phrase)).join(' / ');
  }

  translate<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    phrase: P,
    group: G,
  ) {
    // specific to EN10168
    if (group === 'certificateFields') {
      return `${phrase} ${this.getTranslation(group, phrase)}`;
    }
    return this.getTranslation(group, phrase);
  }

  extraTranslate<S extends keyof E = keyof E, R extends ValueOf<E[S]> = ValueOf<E[S]>, P extends keyof R = keyof R>(
    externalStandard: S | undefined,
    propertyId: P,
    property: keyof R[P],
    defaultValue: string,
  ) {
    return this.getExtraTranslation(externalStandard, propertyId, property, defaultValue);
  }

  getExtraTranslation<
    S extends keyof E = keyof E,
    R extends ValueOf<E[S]> = ValueOf<E[S]>,
    P extends keyof R = keyof R,
  >(externalStandard: S | undefined, propertyId: P, property: keyof R[P], defaultValue: string) {
    const translatedFields = this.languages.map(
      (language) => this.getExtraField(externalStandard, language, propertyId, property) || defaultValue,
    );

    return translatedFields[0] === translatedFields[1] ? translatedFields[0] : translatedFields.join(' / ');
  }

  getExtraField<S extends keyof E = keyof E, R extends ValueOf<E[S]> = ValueOf<E[S]>, P extends keyof R = keyof R>(
    externalStandard: S | undefined,
    language: Languages,
    propertyId: P,
    property: keyof R[P],
  ) {
    const extraTranslations = this.extraTranslations;

    if (
      externalStandard &&
      language in extraTranslations[externalStandard] &&
      propertyId in extraTranslations[externalStandard][language] &&
      property in extraTranslations[externalStandard][language][propertyId]
    ) {
      return extraTranslations[externalStandard][language][propertyId][property];
    }
    return '';
  }
}

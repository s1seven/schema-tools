import type {
  ExternalStandardsTranslations,
  LanguageFontMap,
  Languages,
  Translations,
  TranslationWithFont,
} from '@s1seven/schema-tools-types';

type ValueOf<T> = T[keyof T];

export class Translate<T = Translations, E = ExternalStandardsTranslations> {
  constructor(
    readonly translations: T,
    readonly extraTranslations: E,
    readonly languages: Languages[] = ['EN'],
    readonly languageFontMap: LanguageFontMap = {},
  ) {}

  getField<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    language: Languages,
    group: G,
    phrase: P,
  ): string {
    const translations = this.translations;
    if (
      typeof translations === 'object' &&
      language in translations &&
      group in translations[language] &&
      phrase in translations[language][group]
    ) {
      return translations[language][group][phrase];
    }
    return '';
  }

  getTranslation<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    group: G,
    phrase: P,
  ): TranslationWithFont[] {
    return this.languages.map((language, index) => {
      const font = this.languageFontMap[language];
      const field = this.getField(language, group, phrase);
      return { text: index === 0 && this.languages.length > 1 ? `${field} / ` : field, font };
    });
  }

  translate<G extends keyof ValueOf<T> = keyof ValueOf<T>, P extends keyof ValueOf<T>[G] = keyof ValueOf<T>[G]>(
    phrase: P,
    group: G,
  ): TranslationWithFont[] {
    // specific to EN10168
    if (group === 'certificateFields') {
      return [{ text: `${phrase as string} ` }, ...this.getTranslation(group, phrase)];
    }
    return this.getTranslation(group, phrase);
  }

  extraTranslate<S extends keyof E = keyof E, R extends ValueOf<E[S]> = ValueOf<E[S]>, P extends keyof R = keyof R>(
    externalStandard: S | undefined,
    propertyId: P,
    property: keyof R[P],
    defaultValue: string,
  ): TranslationWithFont[] {
    return this.getExtraTranslation(externalStandard, propertyId, property, defaultValue);
  }

  getExtraTranslation<
    S extends keyof E = keyof E,
    R extends ValueOf<E[S]> = ValueOf<E[S]>,
    P extends keyof R = keyof R,
  >(externalStandard: S | undefined, propertyId: P, property: keyof R[P], defaultValue: string): TranslationWithFont[] {
    const translatedFields = this.languages.map((language) => {
      const font = this.languageFontMap[language];
      const text = this.getExtraField(externalStandard, language, propertyId, property) || defaultValue;
      return { text, font };
    });

    if (
      translatedFields[0]?.text === translatedFields[1]?.text ||
      (translatedFields[0]?.text && !translatedFields[1]?.text)
    ) {
      return [translatedFields[0]];
    }

    translatedFields[0].text += ' / ';
    return translatedFields;
  }

  private isExtraTranslation(
    externalStandard: unknown,
    language: string,
    propertyId: unknown,
    property: unknown,
    extraTranslations: unknown,
  ): extraTranslations is ExternalStandardsTranslations {
    return (
      externalStandard &&
      typeof externalStandard === 'string' &&
      typeof extraTranslations === 'object' &&
      extraTranslations !== null &&
      extraTranslations[externalStandard] &&
      typeof extraTranslations[externalStandard] === 'object' &&
      extraTranslations[externalStandard] !== null &&
      language in extraTranslations[externalStandard] &&
      propertyId &&
      typeof propertyId === 'string' &&
      typeof extraTranslations[externalStandard][language] === 'object' &&
      extraTranslations[externalStandard][language] !== null &&
      propertyId in extraTranslations[externalStandard][language] &&
      property &&
      typeof property === 'string' &&
      typeof extraTranslations[externalStandard][language][propertyId] === 'object' &&
      extraTranslations[externalStandard][language][propertyId] !== null &&
      property in extraTranslations[externalStandard][language][propertyId]
    );
  }

  getExtraField<S extends keyof E = keyof E, R extends ValueOf<E[S]> = ValueOf<E[S]>, P extends keyof R = keyof R>(
    externalStandard: S | undefined,
    language: Languages,
    propertyId: P,
    property: keyof R[P],
  ): string {
    if (this.isExtraTranslation(externalStandard, language, propertyId, property, this.extraTranslations)) {
      return this.extraTranslations[externalStandard][language][propertyId][property];
    }
    return '';
  }
}

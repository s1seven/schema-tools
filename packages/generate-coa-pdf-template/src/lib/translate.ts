import { TranslationGroups, Translations } from '../types';

export class Translate {
  constructor(readonly translations: Translations, readonly languages: string[] = ['EN']) {}

  getField(language: string, group: TranslationGroups, phrase: string) {
    const translations = this.translations;
    if (language in translations && group in translations[language] && phrase in translations[language][group]) {
      return this.translations[language][group][phrase];
    }
    return '';
  }

  getTranslation(group: TranslationGroups, phrase: string) {
    return this.languages.map((language) => this.getField(language, group, phrase)).join(' / ');
  }

  translate(phrase: string, group: TranslationGroups) {
    return this.getTranslation(group, phrase);
  }
}

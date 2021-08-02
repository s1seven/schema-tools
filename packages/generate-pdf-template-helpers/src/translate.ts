import { Translations } from './types';

export class Translate {
  constructor(readonly translations: Translations, readonly languages: string[] = ['EN']) {}

  getField(language: string, group: string, phrase: string) {
    const translations = this.translations;
    if (language in translations && group in translations[language] && phrase in translations[language][group]) {
      return translations[language][group][phrase];
    }
    return '';
  }

  getTranslation(group: string, phrase: string) {
    return this.languages.map((language) => this.getField(language, group, phrase)).join(' / ');
  }

  translate(phrase: string, group: string) {
    // specific to EN10168
    if (group === 'certificateFields') {
      return `${phrase} ${this.getTranslation(group, phrase)}`;
    }
    return this.getTranslation(group, phrase);
  }
}

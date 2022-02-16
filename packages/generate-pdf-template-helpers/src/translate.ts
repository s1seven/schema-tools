import { Translations } from './types';

export class Translate<T = Translations> {
  constructor(readonly translations: T, readonly languages: string[] = ['EN']) {}

  getField<G extends keyof T = keyof T, P extends keyof T[G] = keyof T[G]>(language: string, group: G, phrase: P) {
    const translations = this.translations;
    if (language in translations && group in translations[language] && phrase in translations[language][group]) {
      return translations[language][group][phrase];
    }
    return '';
  }

  getTranslation<G extends keyof T = keyof T, P extends keyof T[G] = keyof T[G]>(group: G, phrase: P) {
    return this.languages.map((language) => this.getField(language, group, phrase)).join(' / ');
  }

  translate<G extends keyof T = keyof T, P extends keyof T[G] = keyof T[G]>(phrase: P, group: G) {
    // specific to EN10168
    if (group === 'certificateFields') {
      return `${phrase} ${this.getTranslation(group, phrase)}`;
    }
    return this.getTranslation(group, phrase);
  }
}

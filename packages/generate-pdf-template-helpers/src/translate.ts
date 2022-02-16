import { Translation, Translations } from './types';

export class Translate<T = Translations, t = Translation> {
  constructor(readonly translations: T, readonly languages: string[] = ['EN']) {}

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
}

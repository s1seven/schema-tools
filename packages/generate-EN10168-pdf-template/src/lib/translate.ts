export class Translate {
  languages = ['EN'];
  translations: Record<string, unknown>;

  constructor(_translations: Record<string, unknown>) {
    this.languages = Object.keys(_translations);
    this.translations = _translations;
  }

  translate(phrase: string, group: 'certificateFields' | 'certificateGroups' | 'otherFields') {
    if (group === 'certificateFields') {
      return `${phrase} ${this.languages.map((language) => this.translations[language][group][phrase]).join(' / ')}`;
    }
    return this.languages.map((language) => this.translations[language][group][phrase]).join(' / ');
  }
}

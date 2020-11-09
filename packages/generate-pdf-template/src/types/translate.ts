export interface Translate {
    translate(phrase: string, group: 'certificateFields' | 'certificateGroups' | 'otherFields'): string;
}
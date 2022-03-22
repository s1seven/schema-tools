import { Margins, Table, TableLayout } from 'pdfmake/interfaces';

export interface TableElement {
  style: string;
  table: Table;
  layout: TableLayout;
  margin?: Margins;
  id?: string;
}

export interface Translation {
  [group: string]: Record<string, string>;
}

export interface Translations {
  [ln: string]: Translation;
}

export type Languages = `${CertificateLanguages}`;

export enum CertificateLanguages {
  CN = 'CN',
  DE = 'DE',
  EN = 'EN',
  ES = 'ES',
  FR = 'FR',
  PL = 'PL',
  RU = 'RU',
  IT = 'IT',
  TR = 'TR',
}

export type CampusTranslations = {
  [key in Languages]?: { [Id: string]: { Property: string; TestConditions: string } };
};

export type ExternalStandardsTranslations = {
  [ExternalStandardsEnum.CAMPUS]?: CampusTranslations;
};

export enum ExternalStandardsEnum {
  CAMPUS = 'CAMPUS',
}

export type ExternalStandards = `${ExternalStandardsEnum}`;

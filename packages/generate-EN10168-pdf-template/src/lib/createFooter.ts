import { tableLayout } from './helpers';
import { TableElement } from '../types';

export function createFooter(RefSchemaUrl: string): TableElement {
  return {
    style: 'table',
    table: {
      widths: [32, 250, 200],
      body: [
        [
          { text: 'Powered by ', style: 'small', margin: [0, 0, 0, 0] },
          {
            text: 'en10204',
            style: 'small',
            color: 'blue',
            margin: [0, 0, 0, 0],
            link: 'https://en10204.io',
          },
          { text: RefSchemaUrl, style: 'small', color: '#D3D3D3', alignment: 'right' },
        ],
      ],
    },
    layout: tableLayout,
  };
}

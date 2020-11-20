import { tableLayout } from './helpers';
import { TableElement } from '../types';

export function createFooter(RefSchemaUrl: string): TableElement {
  return {
    style: 'table',
    margin: [0, 50, 0, 0],
    table: {
      widths: [280, 250],
      body: [
        [
          {
            text: [
              {
                text: 'Powered by ',
                style: 'small',
                margin: [0, 0, 0, 0],
              },
              {
                text: 'en10204.io',
                style: 'small',
                color: 'blue',
                margin: [0, 0, 0, 0],
                decoration: 'underline',
                link: 'https://en10204.io',
              },
            ],
          },
          { text: RefSchemaUrl, style: 'small', color: '#D3D3D3', margin: [0, 0, 0, 0], alignment: 'right' },
        ],
      ],
    },
    layout: tableLayout,
  };
}

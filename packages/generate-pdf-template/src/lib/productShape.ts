import { Translate } from '../../utils/translate';

import {ProductShape} from '../types';

export function productShape(productShape: ProductShape, i18n: Translate) {
    if (productShape === undefined) return [];
    const header = [{text: i18n.translate('B09', 'certificateFields'), style: 'p', colSpan: 4}, {}, {}, {}]
    
    const content = Object.keys(productShape).map(key => [{text: i18n.translate(key, 'otherFields'), style: 'p', colSpan: 3}, {}, {}, productShape[key]])
    return [header, ...content];
}
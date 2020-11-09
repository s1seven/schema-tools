import { expect } from 'chai';

import { Translate } from '../utils/translate';

describe('Translate', () => {
    it('correctly translate certificateFields into 2 languages', () => {
        const i18n = new Translate(['DE', 'EN']);
        const translation = i18n.translate('A01', 'certificateFields');
        expect(translation).to.be.equal("A01 Herstellerwerk / Manufacturer's plant");
    });
    it('correctly translate certificateGroups into 2 languages', () => {
        const i18n = new Translate(['DE', 'FR']);
        const translation = i18n.translate('ProductDescription', 'certificateGroups');
        expect(translation).to.be.equal("Beschreibung des Erzeugnisses / Description du produit");
    });
    it('correctly translate certificateGroups into 1 language', () => {
        const i18n = new Translate(['FR']);
        const translation = i18n.translate('ChemicalComposition', 'otherFields');
        expect(translation).to.be.equal("Composition chimique");
    });
});
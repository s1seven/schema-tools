import { expect } from 'chai';

import { Translate } from '../utils/translate';
import { supplementaryInformation } from '../src/lib/supplementaryInformation';

describe('Rendering supplementary information', () => {
  it('does not render header when no supplementary inforamtion is given', () => {
    const i18n = new Translate(['EN', 'DE']);
    expect(supplementaryInformation({}, i18n)).to.be.eql([])
  });
  it('correctly renders header in one language', () => {
    const suppInfo = {
      "A11": {
        "Key": "First Supplementary Information Commercial Transaction",
        "Value": "1.0",
        "Unit": "Apples"
      },
    }
    const i18n = new Translate(['EN']);
    expect(supplementaryInformation(suppInfo, i18n)[0]).to.be.eql([
      { text: 'Supplementary information', style: 'h2', colSpan: 3 }, {}, {},
    ])
  });
  it('correctly renders header in two languages', () => {
    const suppInfo = {
      "A11": {
        "Key": "First Supplementary Information Commercial Transaction",
        "Value": "1.0",
        "Unit": "Apples"
      },
    }
    const i18n = new Translate(['EN', 'DE']);
    expect(supplementaryInformation(suppInfo, i18n)[0]).to.be.eql([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h2', colSpan: 3 }, {}, {},
    ])
  });
  it('correctly renders supplementary information', () => {
    const suppInfo = {
      "A11": {
        "Key": "First Supplementary Information Commercial Transaction",
        "Value": "1.0",
        "Unit": "Apples"
      },
      "A96": {
        "Key": "Last Supplementary Information Commercial Transaction",
        "Value": "A96"
      }
    }
    const i18n = new Translate(['EN', 'DE']);
    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n);
    expect(supplementarInforamtion.length).to.be.equal(3);
    expect(supplementarInforamtion[0]).to.be.eql([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h2', colSpan: 3 }, {}, {},
    ]);
    expect(supplementarInforamtion[1]).to.be.eql([
      { text: 'First Supplementary Information Commercial Transaction', style: 'p', colSpan: 1 }, {text: "1.0 Apples", colSpan: 2},
    ]);
    expect(supplementarInforamtion[2]).to.be.eql([
      { text: 'Last Supplementary Information Commercial Transaction', style: 'p', colSpan: 1 }, {text: "A96 ", colSpan: 2},
    ]);
  });
  it('correctly renders supplementary information for colSpan = 4', () => {
    const suppInfo = {
      "A11": {
        "Key": "First Supplementary Information Commercial Transaction",
        "Value": "1.0",
        "Unit": "Apples"
      },
    }
    const i18n = new Translate(['EN', 'DE']);
    const supplementarInforamtion = supplementaryInformation(suppInfo, i18n, 4);
    expect(supplementarInforamtion.length).to.be.equal(2);
    expect(supplementarInforamtion[0]).to.be.eql([
      { text: 'Supplementary information / Ergänzende Angaben', style: 'h2', colSpan: 4 }, {}, {}, {},
    ]);
    expect(supplementarInforamtion[1]).to.be.eql([
      { text: 'First Supplementary Information Commercial Transaction', style: 'p', colSpan: 2 }, {}, {text: "1.0 Apples", colSpan: 2},
    ]);
  });
})

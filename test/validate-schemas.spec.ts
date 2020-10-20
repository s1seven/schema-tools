import { expect } from 'chai';
import { validate } from '../src/validate-schemas';

const schemaPath = `https://raw.githubusercontent.com/s1seven/schemas/main/EN10168-v1.0.schema.json`;

describe('ValidateSchema', () => {
  it('should validate valid example certificate', async () => {
    expect(
      await validate(
        schemaPath,
        `${__dirname}/../fixtures/EN10168/valid_en10168_test.json`
      )
    ).to.deep.equal({});
  });

  it('should validate invalid example certificate', async () => {
    expect(
      await validate(
        schemaPath,
        `${__dirname}/../fixtures/EN10168/invalid_en10168_test.json`
      )
    ).to.deep.equal({
      EN10168: [
        {
          path: 'invalid_en10168_test.json.Certificate.ProductDescription.B02',
          root: 'EN10168',
          keyword: 'type',
          schemaPath: '#/properties/B02/type',
          expected: 'should be object',
        },
      ],
    });
  });
});

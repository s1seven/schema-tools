import { expect } from 'chai';
import { readFile } from '../src/utils';
import { validate } from '../src/validate-schemas';

describe('ValidateSchema', () => {
  it('should validate valid example certificate using certificate path (string)', async () => {
    expect(
      await validate(`${__dirname}/../fixtures/EN10168/valid_en10168_test.json`)
    ).to.deep.equal({});
  });

  it('should validate valid example certificate using certificate (object) ', async () => {
    const schema = JSON.parse(
      (await readFile(
        `${__dirname}/../fixtures/EN10168/valid_en10168_test.json`,
        'utf8'
      )) as string
    );
    expect(await validate(schema)).to.deep.equal({});
  });

  it('should validate invalid example certificate using certificate path (string)', async () => {
    expect(
      await validate(
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

  it('should validate invalid example certificate using certificate (object)', async () => {
    const schema = JSON.parse(
      (await readFile(
        `${__dirname}/../fixtures/EN10168/invalid_en10168_test.json`,
        'utf8'
      )) as string
    );
    expect(await validate(schema)).to.deep.equal({
      ['v0.0.2-1']: [
        {
          path: 'schema.json.Certificate.ProductDescription.B02',
          root: 'v0.0.2-1',
          keyword: 'type',
          schemaPath: '#/properties/B02/type',
          expected: 'should be object',
        },
      ],
    });
  });
});

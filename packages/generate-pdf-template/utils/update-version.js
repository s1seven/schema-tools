import {generate} from '@s1seven/schema-tools-generate-interfaces';
import schema from './schema.json';

async function createInterfaces() {
    const interfaces = await generate(schema, './types/schemaTypes.ts');
    console.log(interfaces);
}
createInterfaces();
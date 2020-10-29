import { RuntimeOptions } from 'handlebars';
interface MJMLParsingOpts {
    fonts?: {
        [key: string]: string;
    };
    keepComments?: boolean;
    beautify?: boolean;
    minify?: boolean;
    validationLevel?: 'strict' | 'soft' | 'skip';
    filePath?: string;
}
export declare type SchemaPath = {
    baseUrl: string;
    schemaType: string;
    version: string;
};
export declare type Translations = {
    [key: string]: any;
};
export declare type GenerateHtmlOptions = {
    handlebars?: RuntimeOptions;
    mjml?: MJMLParsingOpts;
    templateType?: 'hbs' | 'mjml';
    schemaPath?: SchemaPath;
    templatePath?: string;
    translations?: Translations;
};
export declare function generateHtml(certificateInput: string | object, options?: GenerateHtmlOptions): Promise<string>;
export {};

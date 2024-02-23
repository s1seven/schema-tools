import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

import { readFile } from '@s1seven/schema-tools-utils';

export const PROFILE_TYPE = 'ICCBased';
export const PROFILE_N = 3;
export const OUTPUT_INTENTS = 'OutputIntents';
export const OUTPUT_INTENT_TYPE = 'OutputIntent';
export const OUTPUT_INTENT_S = 'GTS_PDFA1'; // <- `GTS_PDFA3` does not exist
export const OUTPUT_INTENT_OUTPUT_CONDITION_IDENTIFIER = PDFString.of('sRGB');
export const OUTPUT_INTENT_INFO = 'sRGB IEC61966-2.1';

/**
 * Set the color profile of a PDF document.
 * @param doc
 * @param iccFilePath
 * @param profileType
 * @param profileN
 */
export const setColorProfile = async (
  doc: PDFDocument,
  iccFilePath: string,
  profileType = PROFILE_TYPE,
  profileN = PROFILE_N,
): Promise<void> => {
  const iccProfileBuffer = await readFile(iccFilePath);
  const profileStream = doc.context.stream(iccProfileBuffer, {
    Type: profileType,
    N: profileN,
  });
  const profileStreamRef = doc.context.register(profileStream);
  const outputIntent = doc.context.obj({
    Type: OUTPUT_INTENT_TYPE,
    S: OUTPUT_INTENT_S,
    OutputConditionIdentifier: OUTPUT_INTENT_OUTPUT_CONDITION_IDENTIFIER,
    Info: OUTPUT_INTENT_INFO,
    DestOutputProfile: profileStreamRef,
  });
  const outputIntentRef = doc.context.register(outputIntent);
  doc.catalog.set(PDFName.of(OUTPUT_INTENTS), doc.context.obj([outputIntentRef]));
};

import crypto from 'crypto';
import { PDFDocument, PDFHexString, PDFName } from 'pdf-lib';

export interface XmpMetadataParams {
  documentId: string;
  title: string;
  author: string;
  creator: string;
  producer: string;
  date?: Date;
  part?: number;
  conformance?: string;
}

/**
 * Attach the XMP metadata required for PDF/A-3a to a document.
 */
export const addXMPMetadata = (pdfDoc: PDFDocument, params: Omit<XmpMetadataParams, 'documentId'>): void => {
  const documentId = crypto.randomBytes(16).toString('hex');

  // The file trailer dictionary shall contain the ID keyword whose value shall be File Identifiers
  // as defined in ISO 32000-1:2008, 14.4
  // https://github.com/veraPDF/veraPDF-validation-profiles/wiki/PDFA-Parts-2-and-3-rules#rule-613-1
  const id = PDFHexString.of(documentId);
  pdfDoc.context.trailerInfo.ID = pdfDoc.context.obj([id, id]);

  const xmpMetadata = getXmpMetadata({
    ...params,
    documentId,
  });

  const metadataStream = pdfDoc.context.stream(xmpMetadata, {
    Type: 'Metadata',
    Subtype: 'XML',
    Length: xmpMetadata.length,
  });

  const metadataStreamRef = pdfDoc.context.register(metadataStream);
  pdfDoc.catalog.set(PDFName.of('Metadata'), metadataStreamRef);
};

/**
 * Get the XMP metadata for a PDF/A-3a document.
 */
const getXmpMetadata = ({
  documentId,
  title,
  author,
  creator,
  producer,
  date = new Date(),
  part = 3,
  conformance = 'A',
}: XmpMetadataParams) => `<?xpacket begin="" id="${documentId}"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.2-c001 63.139439, 2010/09/27-13:37:26">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:format>application/pdf</dc:format>
      <dc:creator>
        <rdf:Seq>
          <rdf:li>${author}</rdf:li>
        </rdf:Seq>
      </dc:creator>
      <dc:title>
        <rdf:Alt>
          <rdf:li xml:lang="x-default">${title}</rdf:li>
        </rdf:Alt>
      </dc:title>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreatorTool>${creator}</xmp:CreatorTool>
      <xmp:CreateDate>${formatDate(date)}</xmp:CreateDate>
      <xmp:ModifyDate>${formatDate(date)}</xmp:ModifyDate>
      <xmp:MetadataDate>${formatDate(date)}</xmp:MetadataDate>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <pdf:Producer>${producer}</pdf:Producer>
    </rdf:Description>
    <!--
    The PDF/A version and conformance level of a file shall be specified using the PDF/A
    Identification extension schema.
    https://github.com/veraPDF/veraPDF-validation-profiles/wiki/PDFA-Parts-2-and-3-rules#rule-664-1
    -->
    <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>${part}</pdfaid:part>
      <pdfaid:conformance>${conformance}</pdfaid:conformance>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

function formatDate(date: any) {
  return date.toISOString().split('.')[0] + 'Z';
}

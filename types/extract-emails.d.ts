export interface PartyEmail {
    emails: string[];
    role: string;
    name: string;
    purchaseOrderNumber?: string;
    purchaseOrderPosition?: string;
}
export declare function extractEmails(certificateInput: string | object): Promise<PartyEmail[] | null>;

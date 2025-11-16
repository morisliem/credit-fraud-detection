export class CreateDocumentDto {
    userId?: string;
    title?: string;
    originalFilename: string;
    storagePath: string;
    docType: 'BANK_STATEMENT' | 'INVOICE' | 'PAYSLIP'
    sourceDataset?: 'BANK_TEMPLATE' | 'SROIE' | 'FUNDS' | 'SYNTHETIC'
}
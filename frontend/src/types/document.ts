export type DocumentType = 'BANK_STATEMENT' | 'INVOICE' | 'PAYSLIP' | 'OTHER'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | null

export interface DocumentSummary {
    id: string
    title: string | null
    originalFilename: string
    docType: DocumentType
    sourceDataset: string | null
    uploadedAt: string
    parsedAt: string | null
    overallRisk: RiskLevel
}
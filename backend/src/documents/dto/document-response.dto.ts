import { DocumentType, RiskLevel, SourceDataset } from "generated/prisma/enums";

export class DocumentResponseDto {
    id: string;
    title: string | null;
    originalFilename: string;
    docType: DocumentType;
    sourceDataset: SourceDataset | null;
    uploadedAt: Date;
    parsedAt: Date | null;
    overallRisk: RiskLevel | null;

    constructor(doc: any) {
        this.id = doc.id;
        this.title = doc.title;
        this.originalFilename = doc.originalFilename;
        this.docType = doc.docType;
        this.sourceDataset = doc.sourceDataset;
        this.uploadedAt = doc.uploadedAt;
        this.parsedAt = doc.parsedAt;
        this.overallRisk = doc.riskSummary?.overallRisk ?? null;
    }
}
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentType, SourceDataset } from "generated/prisma/enums";

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name)
    constructor(private readonly prisma: PrismaService) { }

    async createFromUpload(params: {
        file: Express.Multer.File,
        docType?: DocumentType,
        userId?: string,
        sourceDataset?: SourceDataset
    }) {
        const { file, docType = 'OTHER', userId, sourceDataset } = params
        this.logger.log(`Creating document from upload: ${file.originalname}`)
        const storagePath = file.path
        const data: any = {
            originalFilename: file.originalname,
            storagePath,
            docType
        }

        if (userId) data.userId = userId
        if (sourceDataset) data.sourceDataset = sourceDataset

        return this.prisma.document.create({ data })
    }

    async findAll() {
        const docs = await this.prisma.document.findMany({
            orderBy: { uploadedAt: 'desc' },
            include: {
                riskSummary: true,
            }
        })

        return docs
    }

    async findById(id: string) {
        return this.prisma.document.findUnique({
            where: { id },
            include: {
                riskSummary: true
            }
        })
    }
}
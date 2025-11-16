import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, NotFoundException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { DocumentsService } from "./documents.service";
import { DocumentResponseDto } from "./dto/document-response.dto";

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, join(process.cwd(), 'uploads', 'documents'))
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                    cb(null, uniqueSuffix + extname(file.originalname))
                }
            }),
            limits: {
                fileSize: 10 * 1024 * 1024 // 10 MB
            }
        })
    )
    async uploadDocument(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required')
        }

        const doc = await this.documentsService.createFromUpload({
            file,
            docType: 'OTHER'
        })

        return new DocumentResponseDto({
            ...doc,
            riskSummary: null
        })
    }

    @Get()
    async findAll() {
        const docs = await this.documentsService.findAll()
        return docs.map((doc) => new DocumentResponseDto(doc))
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const doc = await this.documentsService.findById(id)
        if (!doc) {
            throw new NotFoundException('File not found')
        }

        return new DocumentResponseDto(doc)
    }
}
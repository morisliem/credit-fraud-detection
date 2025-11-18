import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(username: string, email: string, password: string) {
        return this.prisma.user.create({
            data: { username, email, password }
        })
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        })
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return users
    }
}
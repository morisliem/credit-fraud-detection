import { Controller, Get, Post, Param, BadRequestException, NotFoundException, Body } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserResponseDto } from "./dto/user-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    async createUser(@Body() body: CreateUserDto) {
        if (!body) {
            throw new BadRequestException('Body is required')
        }

        const user = await this.userService.createUser(
            body.username,
            body.email,
            body.password
        )

        return new UserResponseDto(user)
    }

    @Get()
    async findAll() {
        const users = await this.userService.findAll()
        return users.map((user) => new UserResponseDto(user))
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const user = await this.userService.findById(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return new UserResponseDto(user)
    }
}
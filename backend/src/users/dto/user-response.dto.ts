export class UserResponseDto {
    userId: string
    email: string
    username: string
    createdAt: Date

    constructor(user: any) {
        this.userId = user.id
        this.email = user.email
        this.username = user.username
        this.createdAt = user.createdAt
    }
}
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}

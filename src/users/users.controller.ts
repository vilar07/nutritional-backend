import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    @Get()
    getUsers(){}

    @Post()
    createUser(){}

}

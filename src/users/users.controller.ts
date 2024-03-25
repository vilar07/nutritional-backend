import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body, ValidationPipe, Param } from '@nestjs/common';
import { AssociateCharacteristicsDto, CreateUserDto } from './dtos/users.dto';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly usersService: UsersService){}

    // Endpoint para obter a matriz de associação entre usuários e características
    @Get('/characteristic-matrix')
    async getUserCharacteristicMatrix() {
        return await this.usersService.generateUserCharacteristicMatrix();
    }

    //Calculate Similarities between one user and the others
    @Get('/similarity/:email')
    async calculateSimilarities(
        @Param('email') email: string
    ) {
        return await this.usersService.calculateUserSimilarities(email);
    }

    //Get all users
    @Get()
    @ApiOperation({ summary: 'Get All Users' })
    async getUsers() {
        return await this.usersService.getUsers();
    }

    //Get a user by email
    @Get('/:email')
    @ApiOperation({ summary: 'Get an User by email' })
    async getUserByEmail(
        @Param('email') email: string
    ) {
        return await this.usersService.getUserByEmail(email);
    }

    //Create a user
    @Post()
    @ApiOperation({ summary: 'Create an User' })
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return await this.usersService.createUser(createUserDto);
    }
    
    //Delete a user
    @Delete('/:email')
    @ApiOperation({ summary: 'Delete an User' })
    async deleteUser(
        @Param('email') email: string
    ) {
        return await this.usersService.deleteUser(email);
    }

    //Get characteristics of an User
    @Get('/characteritics/:email')
    @ApiOperation({ summary: 'Get Characteristics of an User' })
    async getUserCharacteristics(
        @Param('email') email: string
    ) {
        return await this.usersService.getUserCharacteristics(email);
    }

    //Associate Characteristics to an User
    @Post('/characteritics/:email')
    @ApiOperation({ summary: 'Associate Characteristics to an User' })
    async associateCharacteristics(
        @Param('email') email: string,
        @Body() associations: AssociateCharacteristicsDto 
    ){
        return await this.usersService.associateCharacteristics(email, associations);
    }

    
}

import { Body, Controller, Post, Get, Put, Logger, Param, Query, ValidationPipe, Delete } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import {  CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto, GetOptionsIdDto, CharacteristicsPossibleOptionsDto
,  CreateCharacteristicsDto, GetCharacteristicsByNameDto, GetOptionsByCharacteristicsNameDto
, CreateCharacteristicsPossibleOptionsByNameDto, UpdateCharacteristicsTypeDto, DeleteCharacteristicsTypeDto
, UpdatePossibleOptionsDto,
CharacteristicsTypeDto,
UpdateCharacteristicsDto} from './dtos/characteristics.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Characteristics')
@Controller('characteristics')
export class CharacteristicsController {
    private readonly logger = new Logger(CharacteristicsController.name);
    constructor(private readonly characteristicsService: CharacteristicsService){}

    // Get all characteristics types
    @Get('types')
    async getCharacteristicsTypes() {
        return await this.characteristicsService.getCharacteristicsTypes();
    }

    // Create characteristics type
    @Post('type')
    async createCharacteristicsType(@Body(new ValidationPipe()) createCharacteristicsTypeDto: CreateCharacteristicsTypeDto) {
        return await this.characteristicsService.createCharacteristicsType(createCharacteristicsTypeDto);
    }

    // Update characteristics type
    @Put('type/:typeName')
    async updateCharacteristicsType(@Param() params: CharacteristicsTypeDto, @Body() dto: UpdateCharacteristicsTypeDto) {
        return await this.characteristicsService.updateCharacteristicsType(params, dto);
    }

    // Delete characteristics type and associated characteristics
    @Delete('type/:typeName')
    async deleteCharacteristicsType(@Param() params: DeleteCharacteristicsTypeDto) {
        return await this.characteristicsService.deleteCharacteristicsType(params);
    }

    // Get all profile characteristics types
    @Get('profileTypes')
    async getProfileCharacteristicsTypes() {
        return await this.characteristicsService.getProfileCharacteristicsTypes();
    }
    
    // Create profile characteristics type
    @Post('profileType')
    async createProfileCharacteristicsType(@Body(new ValidationPipe()) createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto){
        return await this.characteristicsService.createProfileCharacteristicsType(createProfileCharacteristicsTypeDto);
    }  

    // Update profile characteristics type
    @Put('profileType/:typeName')
    async updateProfileCharacteristicsType(@Param() params: CharacteristicsTypeDto, @Body() dto: UpdateCharacteristicsTypeDto) {
        return await this.characteristicsService.updateProfileCharacteristicsType(params, dto);
    }
    
    // Delete characteristics type and associated characteristics
    @Delete('profileType/:typeName')
    async deleteProfileCharacteristicsType(@Param() params: DeleteCharacteristicsTypeDto) {
        return await this.characteristicsService.deleteProfileCharacteristicsType(params);
    }

     // Get all possible options
     @Get('possibleOptions')
     async getAllPossibleOptions() {
         return await this.characteristicsService.getAllPossibleOptions();
     } 

     // Get Options based on characteristicTypeName and  profileCharacteristicTypeName
     @Get('possibleOptionsNameBased/:characteristicsTypeName/:profileCharacteristicsTypeName')
     async getOptionsByCharacteristicsName(
         @Param() params: GetOptionsByCharacteristicsNameDto,
     ) {
         return await this.characteristicsService.getOptionsByCharacteristicsName(params);
     }
 
     //Options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions
     @Get('possibleOptionsId')
     async getOptionsByIds(@Query() params: GetOptionsIdDto) {
         return await this.characteristicsService.getOptionsId(params);
     }

    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    @Post('possibleOptionsNameBased')
    async createPossibleOptionsNameBased(@Body(new ValidationPipe()) createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto) {
        return await this.characteristicsService.createCharacteristicsPossibleOptionsNameBased(createOptionsDto);
    }

    // Update possible options
    @Put('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions')
    async updatePossibleOptions(@Param() params: CharacteristicsPossibleOptionsDto, @Body() updateOptionsDto: UpdatePossibleOptionsDto) {
        return await this.characteristicsService.updatePossibleOptions(params, updateOptionsDto);
    }

    // Delete possible options
    @Delete('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions')
    async deletePossibleOptions(@Param() params: CharacteristicsPossibleOptionsDto) {
        return await this.characteristicsService.deletePossibleOptions(params);
    }

    // Get all characteristics
    @Get('characteristics')
    async getAllCharacteristics(){
        return this.characteristicsService.getAllCharacteristics();
    }

    // Get characteristics by name
    @Get('characteristics/:name')
    async getCharacteristicsByName(
        @Param() params: GetCharacteristicsByNameDto,
    ) {
        return await this.characteristicsService.getCharacteristicsByName(params);
    }

    // Create characteristics
    @Post('characteristics')
    async createCharacteristics(@Body() createCharacteristicsDto: CreateCharacteristicsDto) {
        return await this.characteristicsService.createCharacteristics(createCharacteristicsDto);
    }

    // Update characteristics
    @Put('characteristics/:name')
    async updateCharacteristics(@Param() params: GetCharacteristicsByNameDto, @Body() dto: UpdateCharacteristicsDto) {
        return await this.characteristicsService.updateCharacteristics(params, dto);
    }

    // Delete characteristics
    @Delete('characteristics/:name')
    async deleteCharacteristics(@Param() params: GetCharacteristicsByNameDto) {
        return await this.characteristicsService.deleteCharacteristics(params);
    }
    

}

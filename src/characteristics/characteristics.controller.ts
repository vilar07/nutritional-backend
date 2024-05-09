import { Body, Controller, Post, Get, Put, Logger, Param, Query, ValidationPipe, Delete } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import {  CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto, GetOptionsIdDto, CharacteristicsPossibleOptionsDto
,  CreateCharacteristicsDto, GetCharacteristicsByNameDto, GetOptionsByCharacteristicsNameDto
, CreateCharacteristicsPossibleOptionsByNameDto, UpdateCharacteristicsTypeDto, DeleteCharacteristicsTypeDto
, UpdatePossibleOptionsDto,
CharacteristicsTypeDto,
UpdateCharacteristicsDto} from './dtos/characteristics.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Characteristics')
@Controller('characteristics')
export class CharacteristicsController {
    private readonly logger = new Logger(CharacteristicsController.name);
    constructor(private readonly characteristicsService: CharacteristicsService){}

    // Get all characteristics types
    @Get('types')
    @ApiOperation({ summary: 'Get all characteristic types' })
    async getCharacteristicsTypes() {
        return await this.characteristicsService.getCharacteristicsTypes();
    }

    // Create characteristics type
    @Post('type')
    @ApiOperation({ summary: 'Create a characteristic type' })
    async createCharacteristicsType(@Body(new ValidationPipe()) createCharacteristicsTypeDto: CreateCharacteristicsTypeDto) {
        return await this.characteristicsService.createCharacteristicsType(createCharacteristicsTypeDto);
    }

    // Update characteristics type
    @Put('type/:typeName')
    @ApiOperation({ summary: 'Update a characteristic type' })
    async updateCharacteristicsType(@Param() params: CharacteristicsTypeDto, @Body() dto: UpdateCharacteristicsTypeDto) {
        return await this.characteristicsService.updateCharacteristicsType(params, dto);
    }

    // Delete characteristics type and associated characteristics
    @Delete('type/:typeName')
    @ApiOperation({ summary: 'Delete a characteristic type' })
    async deleteCharacteristicsType(@Param() params: DeleteCharacteristicsTypeDto) {
        return await this.characteristicsService.deleteCharacteristicsType(params);
    }

    // Get all profile characteristics types
    @Get('profileTypes')
    @ApiOperation({ summary: 'Get all profile characteristic types' })
    async getProfileCharacteristicsTypes() {
        return await this.characteristicsService.getProfileCharacteristicsTypes();
    }
    
    // Create profile characteristics type
    @Post('profileType')
    @ApiOperation({ summary: 'Create a profile characteristic type' })
    async createProfileCharacteristicsType(@Body(new ValidationPipe()) createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto){
        return await this.characteristicsService.createProfileCharacteristicsType(createProfileCharacteristicsTypeDto);
    }  

    // Update profile characteristics type
    @Put('profileType/:typeName')
    @ApiOperation({ summary: 'Update a profile characteristic type' })
    async updateProfileCharacteristicsType(@Param() params: CharacteristicsTypeDto, @Body() dto: UpdateCharacteristicsTypeDto) {
        return await this.characteristicsService.updateProfileCharacteristicsType(params, dto);
    }
    
    // Delete characteristics type and associated characteristics
    @Delete('profileType/:typeName')
    @ApiOperation({ summary: 'Delete a profile characteristic type' })
    async deleteProfileCharacteristicsType(@Param() params: DeleteCharacteristicsTypeDto) {
        return await this.characteristicsService.deleteProfileCharacteristicsType(params);
    }

     // Get all possible options
     @Get('possibleOptions')
     @ApiOperation({ summary: 'Get all possible options' })
     async getAllPossibleOptions() {
         return await this.characteristicsService.getAllPossibleOptions();
     } 

     // Get Options based on characteristicTypeName and  profileCharacteristicTypeName
     @Get('possibleOptionsNameBased/:characteristicsTypeName/:profileCharacteristicsTypeName')
     @ApiOperation({ summary: 'Get possible options based on characteristicTypeName and  profileCharacteristicTypeName' })
     async getOptionsByCharacteristicsName(
         @Param() params: GetOptionsByCharacteristicsNameDto,
     ) {
         return await this.characteristicsService.getOptionsByCharacteristicsName(params);
     }
 
     //Options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions
     @Get('possibleOptionsId')
     @ApiOperation({ summary: 'Get possible options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions' })
     async getOptionsByIds(@Query() params: GetOptionsIdDto) {
         return await this.characteristicsService.getOptionsId(params);
     }

    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    @Post('possibleOptionsNameBased')
    @ApiOperation({ summary: 'Create possible options and associate them with a characteristicsType and a profileCharacteristicsType' })
    async createPossibleOptionsNameBased(@Body(new ValidationPipe()) createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto) {
        return await this.characteristicsService.createCharacteristicsPossibleOptionsNameBased(createOptionsDto);
    }

    // Update possible options
    @Put('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions')
    @ApiOperation({ summary: 'Update possible options' })
    async updatePossibleOptions(@Param() params: CharacteristicsPossibleOptionsDto, @Body() updateOptionsDto: UpdatePossibleOptionsDto) {
        return await this.characteristicsService.updatePossibleOptions(params, updateOptionsDto);
    }

    // Delete possible options
    @Delete('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions')
    @ApiOperation({ summary: 'Delete possible options' })
    async deletePossibleOptions(@Param() params: CharacteristicsPossibleOptionsDto) {
        return await this.characteristicsService.deletePossibleOptions(params);
    }

    // Get all characteristics
    @Get('characteristics')
    @ApiOperation({ summary: 'Get all characteristics' })
    async getAllCharacteristics(){
        return this.characteristicsService.getAllCharacteristics();
    }

    // Get characteristics by name
    @Get('characteristics/:name')
    @ApiOperation({ summary: 'Get characteristics by name' })
    async getCharacteristicsByName(
        @Param() params: GetCharacteristicsByNameDto,
    ) {
        return await this.characteristicsService.getCharacteristicsByName(params);
    }

    // Create characteristics
    @Post('characteristics')
    @ApiOperation({ summary: 'Create characteristics' })
    async createCharacteristics(@Body() createCharacteristicsDto: CreateCharacteristicsDto) {
        return await this.characteristicsService.createCharacteristics(createCharacteristicsDto);
    }

    // Update characteristics
    @Put('characteristics/:name')
    @ApiOperation({ summary: 'Update characteristics' })
    async updateCharacteristics(@Param() params: GetCharacteristicsByNameDto, @Body() dto: UpdateCharacteristicsDto) {
        return await this.characteristicsService.updateCharacteristics(params, dto);
    }

    // Delete characteristics
    @Delete('characteristics/:name')
    @ApiOperation({ summary: 'Delete characteristics' })
    async deleteCharacteristics(@Param() params: GetCharacteristicsByNameDto) {
        return await this.characteristicsService.deleteCharacteristics(params);
    }
    

}

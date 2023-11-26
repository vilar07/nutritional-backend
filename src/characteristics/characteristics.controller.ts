import { Body, Controller, Post, Get, Logger, Param } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicsPossibleOptionsDto, CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto
, GetOptionsByCharacteristicsDto, CreateCharacteristicsDto } from './dtos/characteristics.dto';

@Controller('characteristics')
export class CharacteristicsController {
    private readonly logger = new Logger(CharacteristicsController.name);
    constructor(private readonly characteristicsService: CharacteristicsService){}

    // Create characteristics type
    @Post('type')
    async createCharacteristicsType(@Body() createCharacteristicsTypeDto: CreateCharacteristicsTypeDto){
        return await this.characteristicsService.createCharacteristicsType(createCharacteristicsTypeDto);
    }

    // Get all characteristics types
    @Get('types')
    async getCharacteristicsTypes() {
        return await this.characteristicsService.getCharacteristicsTypes();
    }

    // Create profile characteristics type
    @Post('profileType')
    async createProfileCharacteristicsType(@Body() createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto){
        return await this.characteristicsService.createProfileCharacteristicsType(createProfileCharacteristicsTypeDto);
    }    

    // Get all profile characteristics types
    @Get('profileTypes')
    async getProfileCharacteristicsTypes() {
        return await this.characteristicsService.getProfileCharacteristicsTypes();
    }

    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    @Post('possibleOptions')
    async createPossibleOptions(@Body() createOptionsDto: CreateCharacteristicsPossibleOptionsDto) {
        return await this.characteristicsService.createCharacteristicsPossibleOptions(createOptionsDto);
    }

    // Get all possible options
    @Get('possibleOptions')
    async getAllPossibleOptions() {
        return await this.characteristicsService.getAllPossibleOptions();
    } 
    
    // Get Options based on characteristicTypeID and  profileCharacteristicTypeID
    @Get('possibleOptions/:characteristicsTypeId/:profileCharacteristicsTypeId')
    async getOptionsByCharacteristics(
        @Param() params: GetOptionsByCharacteristicsDto,
    ) {
        return await this.characteristicsService.getOptionsByCharacteristics(params);
    }

    // Create characteristics
    @Post('characteristics')
    async createCharacteristics(@Body() createCharacteristicsDto: CreateCharacteristicsDto) {
        return await this.characteristicsService.createCharacteristics(createCharacteristicsDto);
    }

    // Get all characteristics
    @Get('characteristics')
    async getAllCharacteristics(){
        return this.characteristicsService.getAllCharacteristics();
    }

}

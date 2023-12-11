import { Body, Controller, Post, Get, Logger, Param, Query } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicsPossibleOptionsDto, CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto
, GetOptionsByCharacteristicsDto, CreateCharacteristicsDto, GetCharacteristicsByNameDto, GetOptionsByCharacteristicsNameDto
, CreateCharacteristicsPossibleOptionsByNameDto,GetOptionsIdDto } from './dtos/characteristics.dto';

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

    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    @Post('possibleOptionsNameBased')
    async createPossibleOptionsNameBased(@Body() createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto) {
    return await this.characteristicsService.createCharacteristicsPossibleOptionsNameBased(createOptionsDto);
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

    // Get Options based on characteristicTypeName and  profileCharacteristicTypeName
    @Get('possibleOptionsNameBased/:characteristicsTypeName/:profileCharacteristicsTypeName')
    async getOptionsByCharacteristicsName(
        @Param() params: GetOptionsByCharacteristicsNameDto,
    ) {
        return await this.characteristicsService.getOptionsByCharacteristicsName(params);
    }

    // Options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions
    @Get('possibleOptionsId')
    async getOptionsByIds(@Query() params: GetOptionsIdDto) {
        return await this.characteristicsService.getOptionsId(params);
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

    // Get characteristics by name
    @Get('characteristics/:name')
    async getCharacteristicsByName(
        @Param() params: GetCharacteristicsByNameDto,
    ) {
        return await this.characteristicsService.getCharacteristicsByName(params);
    }

}

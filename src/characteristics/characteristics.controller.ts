import { Body, Controller, Post, Get } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicsPossibleOptionsDto, CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto } from './dtos/characteristics.dto';

@Controller('characteristics')
export class CharacteristicsController {
    constructor(private readonly characteristicsService: CharacteristicsService){}

    @Post('type')
    async createCharacteristicsType(@Body() createCharacteristicsTypeDto: CreateCharacteristicsTypeDto){
        return await this.characteristicsService.createCharacteristicsType(createCharacteristicsTypeDto);
    }

    @Get('types')
    async getCharacteristicsTypes() {
        return await this.characteristicsService.getCharacteristicsTypes();
    }

    @Post('profileType')
    async createProfileCharacteristicsType(@Body() createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto){
        return await this.characteristicsService.createProfileCharacteristicsType(createProfileCharacteristicsTypeDto);
    }    

    @Get('profileTypes')
    async getProfileCharacteristicsTypes() {
        return await this.characteristicsService.getProfileCharacteristicsTypes();
    }

    @Post('possibleOptions')
    async createPossibleOptions(@Body() createOptionsDto: CreateCharacteristicsPossibleOptionsDto) {
        return await this.characteristicsService.createCharacteristicsPossibleOptions(createOptionsDto);
    }

}

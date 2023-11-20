import { Module } from '@nestjs/common';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicsType } from './entities/CharacteristicsType';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { Characteristics } from './entities/Characteristics';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CharacteristicsType,
      ProfileCharacteristicsType,
      // ... include other entities here
      CharacteristicsPossibleOptions,
      Characteristics,
    ]),
  ],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
})
export class CharacteristicsModule {}

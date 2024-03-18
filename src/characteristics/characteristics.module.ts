import { Module } from '@nestjs/common';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicsType } from './entities/CharacteristicsType';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { Characteristics } from './entities/Characteristics';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';
import { ObjectCharacteristicsAssociation } from 'src/objects/entities/ObjectCharacteristicsAssociation';
import { UserCharacteristicAssociation } from 'src/users/entities/UserCharacteristicAssociation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CharacteristicsType,
      ProfileCharacteristicsType,
      // ... include other entities here
      CharacteristicsPossibleOptions,
      Characteristics,
      ObjectCharacteristicsAssociation,
      UserCharacteristicAssociation,
    ]),
  ],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
})
export class CharacteristicsModule {}

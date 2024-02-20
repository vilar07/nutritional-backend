import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ActivateUntil } from './entities/ActivateUntil';
import { ActivateWhen } from './entities/ActivateWhen';
import { Articles } from './entities/Articles';
import { Calculators } from './entities/Calculators';
import { Carousels } from './entities/Carousels';
import { Forms } from './entities/Forms';
import { MealCards } from './entities/MealCards';
import { ObjectCharacteristicsAssociation } from './entities/ObjectCharacteristicsAssociation';
import { Characteristics } from 'src/characteristics/entities/Characteristics';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivateUntil,
      ActivateWhen,
      Articles,
      Calculators,
      Carousels,
      Forms,
      MealCards,
      ObjectCharacteristicsAssociation,
      Characteristics
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService]
})
export class ObjectsModule {}

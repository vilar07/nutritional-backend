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
import { UserCharacteristicAssociation } from 'src/users/entities/UserCharacteristicAssociation';
import { CarouselItem } from './entities/CarouselItem';


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
      Characteristics,
      UserCharacteristicAssociation,
      CarouselItem,
    ]),
    ObjectsModule, // Importe e adicione o ObjectsModule aqui
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService], // Exporte o ObjectsService, se necessário
})
export class ObjectsModule {}

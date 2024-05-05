import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/User';
import { UserCharacteristicAssociation } from './entities/UserCharacteristicAssociation';
import { Characteristics } from 'src/characteristics/entities/Characteristics';
import { ObjectCharacteristicsAssociation } from 'src/objects/entities/ObjectCharacteristicsAssociation';
import { ObjectsModule } from 'src/objects/objects.module'; // Importe o ObjectsModule aqui
import { ObjectRatings } from 'src/objects/entities/ObjectRatings';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserCharacteristicAssociation,
      Characteristics,
      ObjectCharacteristicsAssociation,
      ObjectRatings,
    ]),
    ObjectsModule, // Importe e adicione o ObjectsModule aqui
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

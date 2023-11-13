import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/User';
import { UsersModule } from './users/users.module';
import { Characteristics } from './characteristics/entities/Characteristics';
import { CharacteristicsType } from './characteristics/entities/CharacteristicsType';
import { CharacteristicsModule } from './characteristics/characteristics.module';
import { ProfileCharacteristicsType } from './characteristics/entities/ProfileCharacteristicsType';
import { CharacteristicsPossibleOptions } from './characteristics/entities/CharacteristicsPossibleOptions';
import { ObjectsModule } from './objects/objects.module';
import { ActivateWhen } from './objects/entities/ActivateWhen';
import { ActivateUntil } from './objects/entities/ActivateUntil';
import { Articles } from './objects/entities/Articles';
import { Calculators } from './objects/entities/Calculators';
import { Carousels } from './objects/entities/Carousels';
import { Forms } from './objects/entities/Forms';
import { MealCards } from './objects/entities/MealCards';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: "root",
      password: "vilarinho08",
      database: "nutritionalService",
      entities: [User, Characteristics, ProfileCharacteristicsType, CharacteristicsType, CharacteristicsPossibleOptions,
      ActivateWhen, ActivateUntil, Articles, Calculators, Carousels, Forms, MealCards
      ],
      synchronize: true,
    }),
    UsersModule,
    CharacteristicsModule,
    ObjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

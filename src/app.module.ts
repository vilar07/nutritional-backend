import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/User';
import { UsersModule } from './users/users.module';
import { Variables } from './variables/entities/Variables';
import { VariableType } from './variables/entities/VariableType';
import { VariablesModule } from './variables/variables.module';
import { VariableProfile } from './variables/entities/VariableProfile';
import { VariablePossibleOptions } from './variables/entities/VariablePossibleOptions';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: "root",
      password: "vilarinho08",
      database: "nutritionalService",
      entities: [User, Variables, VariableProfile, VariableType, VariablePossibleOptions],
      synchronize: true,
    }),
    UsersModule,
    VariablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

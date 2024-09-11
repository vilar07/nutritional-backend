"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./users/entities/User");
const users_module_1 = require("./users/users.module");
const Characteristics_1 = require("./characteristics/entities/Characteristics");
const CharacteristicsType_1 = require("./characteristics/entities/CharacteristicsType");
const characteristics_module_1 = require("./characteristics/characteristics.module");
const ProfileCharacteristicsType_1 = require("./characteristics/entities/ProfileCharacteristicsType");
const CharacteristicsPossibleOptions_1 = require("./characteristics/entities/CharacteristicsPossibleOptions");
const objects_module_1 = require("./objects/objects.module");
const ActivateWhen_1 = require("./objects/entities/ActivateWhen");
const ActivateUntil_1 = require("./objects/entities/ActivateUntil");
const Articles_1 = require("./objects/entities/Articles");
const Calculators_1 = require("./objects/entities/Calculators");
const Carousels_1 = require("./objects/entities/Carousels");
const Forms_1 = require("./objects/entities/Forms");
const MealCards_1 = require("./objects/entities/MealCards");
const ObjectCharacteristicsAssociation_1 = require("./objects/entities/ObjectCharacteristicsAssociation");
const UserCharacteristicAssociation_1 = require("./users/entities/UserCharacteristicAssociation");
const CarouselItem_1 = require("./objects/entities/CarouselItem");
const ObjectRatings_1 = require("./objects/entities/ObjectRatings");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: "root",
                password: "vilarinho08",
                database: "nutritionalService",
                entities: [User_1.User, Characteristics_1.Characteristics, ProfileCharacteristicsType_1.ProfileCharacteristicsType, CharacteristicsType_1.CharacteristicsType, CharacteristicsPossibleOptions_1.CharacteristicsPossibleOptions,
                    ActivateWhen_1.ActivateWhen, ActivateUntil_1.ActivateUntil, Articles_1.Articles, Calculators_1.Calculators, Carousels_1.Carousels, Forms_1.Forms, MealCards_1.MealCards, ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation,
                    UserCharacteristicAssociation_1.UserCharacteristicAssociation, CarouselItem_1.CarouselItem, ObjectRatings_1.ObjectRatings,
                ],
                synchronize: false,
                logging: true,
            }),
            users_module_1.UsersModule,
            characteristics_module_1.CharacteristicsModule,
            objects_module_1.ObjectsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
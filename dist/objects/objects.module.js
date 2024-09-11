"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const objects_controller_1 = require("./objects.controller");
const objects_service_1 = require("./objects.service");
const ActivateUntil_1 = require("./entities/ActivateUntil");
const ActivateWhen_1 = require("./entities/ActivateWhen");
const Articles_1 = require("./entities/Articles");
const Calculators_1 = require("./entities/Calculators");
const Carousels_1 = require("./entities/Carousels");
const Forms_1 = require("./entities/Forms");
const MealCards_1 = require("./entities/MealCards");
const ObjectCharacteristicsAssociation_1 = require("./entities/ObjectCharacteristicsAssociation");
const Characteristics_1 = require("../characteristics/entities/Characteristics");
const UserCharacteristicAssociation_1 = require("../users/entities/UserCharacteristicAssociation");
const CarouselItem_1 = require("./entities/CarouselItem");
const ObjectRatings_1 = require("./entities/ObjectRatings");
const User_1 = require("../users/entities/User");
let ObjectsModule = class ObjectsModule {
};
exports.ObjectsModule = ObjectsModule;
exports.ObjectsModule = ObjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ActivateUntil_1.ActivateUntil,
                ActivateWhen_1.ActivateWhen,
                Articles_1.Articles,
                Calculators_1.Calculators,
                Carousels_1.Carousels,
                Forms_1.Forms,
                MealCards_1.MealCards,
                ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation,
                Characteristics_1.Characteristics,
                UserCharacteristicAssociation_1.UserCharacteristicAssociation,
                CarouselItem_1.CarouselItem,
                ObjectRatings_1.ObjectRatings,
                User_1.User,
            ]),
            ObjectsModule,
        ],
        controllers: [objects_controller_1.ObjectsController],
        providers: [objects_service_1.ObjectsService],
        exports: [objects_service_1.ObjectsService],
    })
], ObjectsModule);
//# sourceMappingURL=objects.module.js.map
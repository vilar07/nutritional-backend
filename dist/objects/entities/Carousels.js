"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carousels = void 0;
const typeorm_1 = require("typeorm");
const ActivateWhen_1 = require("../entities/ActivateWhen");
const ActivateUntil_1 = require("../entities/ActivateUntil");
const ObjectCharacteristicsAssociation_1 = require("./ObjectCharacteristicsAssociation");
const CarouselItem_1 = require("./CarouselItem");
const ObjectRatings_1 = require("./ObjectRatings");
let Carousels = class Carousels {
};
exports.Carousels = Carousels;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Carousels.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Carousels.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Carousels.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Carousels.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Carousels.prototype, "season_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Carousels.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CarouselItem_1.CarouselItem, item => item.carousel),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Carousels.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateWhen_1.ActivateWhen, activateWhen => activateWhen.carousels),
    __metadata("design:type", Array)
], Carousels.prototype, "activate_whens", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateUntil_1.ActivateUntil, activateUntil => activateUntil.carousels),
    __metadata("design:type", Array)
], Carousels.prototype, "activate_untils", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.carousels),
    __metadata("design:type", Array)
], Carousels.prototype, "objectCharacteristicsAssociations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectRatings_1.ObjectRatings, objectRating => objectRating.carousels),
    __metadata("design:type", Array)
], Carousels.prototype, "ratings", void 0);
exports.Carousels = Carousels = __decorate([
    (0, typeorm_1.Entity)('carousels')
], Carousels);
//# sourceMappingURL=Carousels.js.map
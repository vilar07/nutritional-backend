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
exports.Forms = void 0;
const typeorm_1 = require("typeorm");
const ActivateWhen_1 = require("./ActivateWhen");
const ActivateUntil_1 = require("./ActivateUntil");
const ObjectCharacteristicsAssociation_1 = require("./ObjectCharacteristicsAssociation");
const ObjectRatings_1 = require("./ObjectRatings");
let Forms = class Forms {
};
exports.Forms = Forms;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Forms.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Forms.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Forms.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Forms.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Forms.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Forms.prototype, "season_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Forms.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateWhen_1.ActivateWhen, activateWhen => activateWhen.forms),
    __metadata("design:type", Array)
], Forms.prototype, "activate_whens", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateUntil_1.ActivateUntil, activateUntil => activateUntil.forms),
    __metadata("design:type", Array)
], Forms.prototype, "activate_untils", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.forms),
    __metadata("design:type", Array)
], Forms.prototype, "objectCharacteristicsAssociations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectRatings_1.ObjectRatings, objectRating => objectRating.forms),
    __metadata("design:type", Array)
], Forms.prototype, "ratings", void 0);
exports.Forms = Forms = __decorate([
    (0, typeorm_1.Entity)("forms")
], Forms);
//# sourceMappingURL=Forms.js.map
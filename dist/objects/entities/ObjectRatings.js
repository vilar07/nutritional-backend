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
exports.ObjectRatings = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../users/entities/User");
const Articles_1 = require("./Articles");
const Calculators_1 = require("./Calculators");
const Carousels_1 = require("./Carousels");
const MealCards_1 = require("./MealCards");
const Forms_1 = require("./Forms");
let ObjectRatings = class ObjectRatings {
};
exports.ObjectRatings = ObjectRatings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ObjectRatings.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ObjectRatings.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User, user => user.ratings),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Articles_1.Articles, article => article.ratings, { nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Calculators_1.Calculators, calculator => calculator.ratings, { nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "calculators", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Carousels_1.Carousels, carousel => carousel.ratings, { nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "carousels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => MealCards_1.MealCards, mealCard => mealCard.ratings, { nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "mealCards", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Forms_1.Forms, form => form.ratings, { nullable: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ObjectRatings.prototype, "forms", void 0);
exports.ObjectRatings = ObjectRatings = __decorate([
    (0, typeorm_1.Entity)("ObjectRatings")
], ObjectRatings);
//# sourceMappingURL=ObjectRatings.js.map
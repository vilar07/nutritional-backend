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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ObjectsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectsController = void 0;
const common_1 = require("@nestjs/common");
const objects_service_1 = require("./objects.service");
const objects_dto_1 = require("./dtos/objects.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
let ObjectsController = ObjectsController_1 = class ObjectsController {
    constructor(objectsService) {
        this.objectsService = objectsService;
        this.logger = new common_1.Logger(ObjectsController_1.name);
    }
    async getCharacteristics(objectType) {
        return await this.objectsService.getCharacteristics(objectType);
    }
    async getObjects(objectType, characteristic, optionSelected, order_by, recommendedCharacteristics) {
        try {
            if (recommendedCharacteristics && recommendedCharacteristics.length > 0) {
                const parsedCharacteristics = JSON.parse(recommendedCharacteristics);
                return await this.objectsService.getObjectsByRecommendedCharacteristics(parsedCharacteristics, objectType, order_by);
            }
            else {
                if (!objectType) {
                    throw new common_2.BadRequestException('Object type must be provided');
                }
                return await this.objectsService.getObjects(objectType, characteristic, optionSelected, order_by);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getObject(params) {
        return await this.objectsService.getObject(params);
    }
    async createObject(objectType, images, req) {
        let createObjectDTO;
        switch (objectType) {
            case 'article':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'calculator':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'carousel':
                createObjectDTO = {
                    title: req.body.title,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance,
                    itemTitle: req.body.itemTitle,
                    itemSubtitle: req.body.itemSubtitle,
                    itemDescription: req.body.itemDescription,
                    itemLink: req.body.itemLink,
                    itemButtonText: req.body.itemButtonText
                };
                break;
            case 'mealCard':
                createObjectDTO = {
                    title: req.body.title,
                    price: req.body.price,
                    category: req.body.category,
                    description: req.body.description,
                    number_ingridients: req.body.number_ingridients,
                    image: req.body.image,
                    link: req.body.link,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            default:
                throw new common_2.BadRequestException('Invalid object type');
        }
        return await this.objectsService.createObject(objectType, createObjectDTO, images);
    }
    async updateObject(objectType, id, images, carouselItems, req) {
        let updateObjectDTO;
        switch (objectType) {
            case 'article':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'calculator':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'carousel':
                updateObjectDTO = {
                    title: req.body.title,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance,
                    itemID: req.body.itemID,
                    itemTitle: req.body.itemTitle,
                    itemSubtitle: req.body.itemSubtitle,
                    itemDescription: req.body.itemDescription,
                    itemLink: req.body.itemLink,
                    itemButtonText: req.body.itemButtonText
                };
                break;
            case 'mealCard':
                updateObjectDTO = {
                    title: req.body.title,
                    price: req.body.price,
                    category: req.body.category,
                    description: req.body.description,
                    number_ingridients: req.body.number_ingridients,
                    image: req.body.image,
                    link: req.body.link,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            default:
                throw new common_2.BadRequestException('Invalid object type');
        }
        return await this.objectsService.updateObject(objectType, id, updateObjectDTO, images);
    }
    async deleteObject(objectType, id, carouselItemID) {
        return await this.objectsService.deleteObject(objectType, id, carouselItemID);
    }
    async associateObject(params, associations) {
        return await this.objectsService.associateObject(params, associations);
    }
    async updateAssociations(params, associations) {
        return await this.objectsService.updateAssociations(params, associations);
    }
    async incrementViews(objectType, id) {
        return await this.objectsService.incrementViews(objectType, id);
    }
    async getUserRatings(objectType, id, email) {
        return await this.objectsService.getUserRatings(objectType, id, email);
    }
    async getRatings(objectType, id) {
        return await this.objectsService.getRatings(objectType, id);
    }
    async postRating(objectType, id, email, rating) {
        return await this.objectsService.postRating(email, objectType, id, rating);
    }
    async updateRating(objectType, id, email, rating) {
        return await this.objectsService.updateRating(email, objectType, id, rating);
    }
    async deleteRating(objectType, id, email) {
        return await this.objectsService.deleteRating(email, objectType, id);
    }
};
exports.ObjectsController = ObjectsController;
__decorate([
    (0, common_1.Get)('characteristics/:objectType'),
    (0, swagger_2.ApiOperation)({ summary: 'Get all characteristics and its selected options depending on the object type' }),
    __param(0, (0, common_1.Param)('objectType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "getCharacteristics", null);
__decorate([
    (0, common_1.Get)(':objectType?'),
    (0, swagger_2.ApiOperation)({ summary: 'Get all objects, optionally by: object Type, ordered by (Most Recent, Most Popular, Best Rating), certain recommended characteristics, certain characteristic and option selected' }),
    (0, swagger_2.ApiParam)({ name: 'objectType', description: 'Type of object', required: false }),
    (0, swagger_2.ApiQuery)({ name: 'characteristic', required: false, description: 'Characteristic' }),
    (0, swagger_2.ApiQuery)({ name: 'option_selected', required: false, description: 'Selected option' }),
    (0, swagger_2.ApiQuery)({ name: 'order_by', required: false, description: 'Order by' }),
    (0, swagger_2.ApiQuery)({ name: 'recommendedCharacteristics', required: false, description: 'Recommended Characteristics' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Query)('characteristic')),
    __param(2, (0, common_1.Query)('option_selected')),
    __param(3, (0, common_1.Query)('order_by')),
    __param(4, (0, common_1.Query)('recommendedCharacteristics')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "getObjects", null);
__decorate([
    (0, common_1.Get)(':objectType/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Get an object by id' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [objects_dto_1.GetObjectByIDdto]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "getObject", null);
__decorate([
    (0, common_1.Post)(':objectType'),
    (0, swagger_2.ApiOperation)({ summary: 'Create an Object' }),
    (0, swagger_2.ApiConsumes)('multipart/form-data'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5)),
    (0, swagger_2.ApiParam)({ name: 'objectType', description: 'Type of object' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_2.UploadedFiles)()),
    __param(2, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "createObject", null);
__decorate([
    (0, common_1.Put)(':objectType/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Update an Object' }),
    (0, swagger_2.ApiConsumes)('multipart/form-data'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5)),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_2.UploadedFiles)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Array, Array, Object]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "updateObject", null);
__decorate([
    (0, common_1.Delete)(':objectType/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Delete an Object' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('carouselItemID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "deleteObject", null);
__decorate([
    (0, common_1.Post)('associate/:objectType/:title'),
    (0, swagger_2.ApiOperation)({ summary: 'Associate characteristics with an object' }),
    (0, swagger_2.ApiBody)({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    characteristic: { type: 'string' },
                    options: { type: 'array', items: { type: 'string' } }
                },
                required: ['characteristic', 'options']
            }
        }
    }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [objects_dto_1.UpdateAssociationDTO, Array]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "associateObject", null);
__decorate([
    (0, common_1.Put)('associate/:objectType/:title'),
    (0, swagger_2.ApiOperation)({ summary: 'Update associations with an object' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [objects_dto_1.UpdateAssociationDTO, Array]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "updateAssociations", null);
__decorate([
    (0, common_1.Put)('views/:objectType/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Incrementhe number of views of an object when clicked by the user' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "incrementViews", null);
__decorate([
    (0, common_1.Get)('ratings/:objectType/:id/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Get ratings that a user has on an object, given the user email, object type and object id' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "getUserRatings", null);
__decorate([
    (0, common_1.Get)('ratings/:objectType/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Get ratings of an object given the id and object type' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "getRatings", null);
__decorate([
    (0, common_1.Post)('ratings/:objectType/:id/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Post a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('email')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "postRating", null);
__decorate([
    (0, common_1.Put)('ratings/:objectType/:id/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Update a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('email')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "updateRating", null);
__decorate([
    (0, common_1.Delete)('ratings/:objectType/:id/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Delete a rating on an object, where the user email, object type and object id are provided' }),
    __param(0, (0, common_1.Param)('objectType')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], ObjectsController.prototype, "deleteRating", null);
exports.ObjectsController = ObjectsController = ObjectsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Objects'),
    (0, common_1.Controller)('objects'),
    __metadata("design:paramtypes", [objects_service_1.ObjectsService])
], ObjectsController);
//# sourceMappingURL=objects.controller.js.map
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
var ObjectsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Articles_1 = require("./entities/Articles");
const ObjectCharacteristicsAssociation_1 = require("./entities/ObjectCharacteristicsAssociation");
const Characteristics_1 = require("../characteristics/entities/Characteristics");
const common_2 = require("@nestjs/common");
const fs = require("fs-extra");
const cloudinary_config_1 = require("../cloudinary.config");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const Calculators_1 = require("./entities/Calculators");
const Carousels_1 = require("./entities/Carousels");
const CarouselItem_1 = require("./entities/CarouselItem");
const MealCards_1 = require("./entities/MealCards");
const ObjectRatings_1 = require("./entities/ObjectRatings");
const User_1 = require("../users/entities/User");
let ObjectsService = ObjectsService_1 = class ObjectsService {
    constructor(articlesRepository, calculatorsRepository, objectCharacteristicsAssociationRepository, characteristicRepository, carouselsRepository, carouselItemRepository, mealCardsRepository, objectRatingsRepository, userRepository) {
        this.articlesRepository = articlesRepository;
        this.calculatorsRepository = calculatorsRepository;
        this.objectCharacteristicsAssociationRepository = objectCharacteristicsAssociationRepository;
        this.characteristicRepository = characteristicRepository;
        this.carouselsRepository = carouselsRepository;
        this.carouselItemRepository = carouselItemRepository;
        this.mealCardsRepository = mealCardsRepository;
        this.objectRatingsRepository = objectRatingsRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(ObjectsService_1.name);
    }
    async getObjectsByRecommendedCharacteristics(recommendedCharacteristics, objectType, order_by) {
        try {
            let objects = {};
            let addedObjectIDs = {};
            if (objectType) {
                objects[objectType] = [];
                addedObjectIDs[objectType] = new Set();
            }
            else {
                objects = { articles: [], calculators: [], carousels: [] };
                addedObjectIDs = { articles: new Set(), calculators: new Set(), carousels: new Set() };
            }
            for (const characteristic of recommendedCharacteristics) {
                const [category, option] = characteristic.split(':').map(str => str.trim());
                let result;
                if (objectType) {
                    result = await this.getObjects(objectType, category, option, order_by);
                    if (Array.isArray(result)) {
                        for (const obj of result) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs[objectType].has(obj.ID)) {
                                objects[objectType].push({ ...obj });
                                addedObjectIDs[objectType].add(obj.ID);
                            }
                        }
                    }
                    if (order_by) {
                        switch (order_by) {
                            case 'Most Recent':
                                console.log(objects[objectType]);
                                objects[objectType].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                                break;
                            case 'Most Popular':
                                objects[objectType].sort((a, b) => b.views - a.views);
                                break;
                            case 'Best Rating':
                                objects[objectType].sort((a, b) => b.avg_rating - a.avg_rating);
                                break;
                            default:
                                throw new common_4.BadRequestException('Invalid order_by value');
                        }
                    }
                }
                else {
                    const articles = await this.getObjects('articles', category, option);
                    const calculators = await this.getObjects('calculators', category, option);
                    const carousels = await this.getObjects('carousels', category, option);
                    if (Array.isArray(articles)) {
                        for (const obj of articles) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.articles.has(obj.ID)) {
                                objects.articles.push({ ...obj });
                                addedObjectIDs.articles.add(obj.ID);
                            }
                        }
                    }
                    if (Array.isArray(calculators)) {
                        for (const obj of calculators) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.calculators.has(obj.ID)) {
                                objects.calculators.push({ ...obj });
                                addedObjectIDs.calculators.add(obj.ID);
                            }
                        }
                    }
                    if (Array.isArray(carousels)) {
                        for (const obj of carousels) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.carousels.has(obj.ID)) {
                                objects.carousels.push({ ...obj });
                                addedObjectIDs.carousels.add(obj.ID);
                            }
                        }
                    }
                }
            }
            return objects;
        }
        catch (error) {
            throw new Error('Error getting objects by recommended characteristics');
        }
    }
    async getObjects(objectType, characteristic, optionSelected, order_by, recommendedCharacteristics) {
        try {
            if (!recommendedCharacteristics || recommendedCharacteristics.length === 0) {
                if (!objectType) {
                    throw new common_4.BadRequestException('Object type must be provided');
                }
            }
            if (recommendedCharacteristics && recommendedCharacteristics.length > 0) {
                return await this.getObjectsByRecommendedCharacteristics(recommendedCharacteristics, objectType);
            }
            else {
                switch (objectType) {
                    case 'articles':
                        if (characteristic && optionSelected) {
                            return await this.getArticlesByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        else if (characteristic) {
                            return await this.getArticlesByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getArticles(order_by);
                    case 'calculators':
                        if (characteristic && optionSelected) {
                            return await this.getCalculatorsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        else if (characteristic) {
                            return await this.getCalculatorsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getCalculators(order_by);
                    case 'carousels':
                        if (characteristic && optionSelected) {
                            return await this.getCarouselsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        else if (characteristic) {
                            return await this.getCarouselsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getCarousels(order_by);
                    case 'mealCards':
                        if (characteristic && optionSelected) {
                            return await this.getMealCardsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        else if (characteristic) {
                            return await this.getMealCardsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getMealCards(order_by);
                    default:
                        throw new common_4.BadRequestException('Invalid object type');
                }
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting objects');
            }
            else {
                throw error;
            }
        }
    }
    async getArticles(order_by) {
        if (await this.articlesRepository.count() === 0) {
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'No articles found',
            };
        }
        let articles;
        if (order_by === 'Most Recent') {
            articles = await this.articlesRepository.find({
                order: {
                    created_at: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Most Popular') {
            articles = await this.articlesRepository.find({
                order: {
                    views: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Best Rating') {
            articles = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('articles.*')
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                .leftJoin('objectRating.articles', 'articles')
                .leftJoin('articles.ratings', 'ratings')
                .where('articles.ID IS NOT NULL')
                .groupBy('articles.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            articles.forEach((article) => {
                article.avg_rating = parseFloat(article.avg_rating);
            });
            return articles;
        }
        else {
            articles = await this.articlesRepository.find({
                relations: ['ratings']
            });
        }
        const articlesWithAvgRating = articles.map(article => {
            if (article.ratings && article.ratings.length > 0) {
                const totalRating = article.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / article.ratings.length;
                return {
                    ...article,
                    avg_rating: avgRating
                };
            }
            else {
                return {
                    ...article,
                    avg_rating: 0
                };
            }
        });
        return articlesWithAvgRating;
    }
    async getArticlesByCharacteristic(characteristic, optionSelected, order_by) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new common_3.HttpException(`Characteristic "${characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
            }
            let associations;
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['articles'],
                });
            }
            else {
                console.log('Characteristic entity:', characteristicEntity);
                console.log("Order by:", order_by);
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: { characteristics: characteristicEntity },
                    relations: ['articles'],
                });
            }
            if (associations.every(association => association.articles.length === 0)) {
                console.log('No articles found for the given characteristic.');
                return [];
            }
            const articlesIDs = associations
                .filter(association => association.articles.length > 0)
                .map(association => association.articles[0].ID);
            if (articlesIDs.length === 0) {
                console.log('No articles found for the given characteristic.');
                return [];
            }
            let articles;
            if (order_by === 'Most Recent') {
                articles = await this.articlesRepository.find({
                    where: { ID: (0, typeorm_2.In)(articlesIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Most Popular') {
                articles = await this.articlesRepository.find({
                    where: { ID: (0, typeorm_2.In)(articlesIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Best Rating') {
                articles = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('articles.*')
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                    .leftJoin('objectRating.articles', 'articles')
                    .leftJoin('articles.ratings', 'ratings')
                    .where('articles.ID IS NOT NULL')
                    .andWhere('articles.ID IN (:...articleIds)', { articleIds: articlesIDs })
                    .groupBy('articles.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                articles.forEach((article) => {
                    article.avg_rating = parseFloat(article.avg_rating);
                });
                return articles;
            }
            else {
                articles = await this.articlesRepository.find({
                    where: { ID: (0, typeorm_2.In)(articlesIDs) },
                    relations: ['ratings']
                });
            }
            const articlesWithAvgRating = articles.map(article => {
                if (article.ratings && article.ratings.length > 0) {
                    const totalRating = article.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / article.ratings.length;
                    return {
                        ...article,
                        avg_rating: avgRating
                    };
                }
                else {
                    return {
                        ...article,
                        avg_rating: 0
                    };
                }
            });
            return articlesWithAvgRating;
        }
        catch (error) {
            if (error instanceof common_3.HttpException) {
                throw error;
            }
            else {
                console.error('Error getting articles by characteristic:', error);
                throw new Error('Error getting articles by characteristic');
            }
        }
    }
    async getCalculators(order_by) {
        if (await this.calculatorsRepository.count() === 0) {
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'No calculators found',
            };
        }
        let calculators;
        if (order_by === 'Most Recent') {
            calculators = await this.calculatorsRepository.find({
                order: {
                    created_at: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Most Popular') {
            calculators = await this.calculatorsRepository.find({
                order: {
                    views: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Best Rating') {
            calculators = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('calculators.*')
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                .leftJoin('objectRating.calculators', 'calculators')
                .leftJoin('calculators.ratings', 'ratings')
                .where('calculators.ID IS NOT NULL')
                .groupBy('calculators.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            calculators.forEach((calculator) => {
                calculator.avg_rating = parseFloat(calculator.avg_rating);
            });
            return calculators;
        }
        else {
            calculators = await this.calculatorsRepository.find({ relations: ['ratings'] });
        }
        const calculatorsWithAvgRating = calculators.map(calculator => {
            if (calculator.ratings && calculator.ratings.length > 0) {
                const totalRating = calculator.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / calculator.ratings.length;
                return {
                    ...calculator,
                    avg_rating: avgRating
                };
            }
            else {
                return {
                    ...calculator,
                    avg_rating: 0
                };
            }
        });
        return calculatorsWithAvgRating;
    }
    async getCalculatorsByCharacteristic(characteristic, optionSelected, order_by) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new common_3.HttpException(`Characteristic "${characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
            }
            let associations;
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['calculators'],
                });
            }
            else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['calculators'],
                });
            }
            if (associations.length === 0) {
                console.log('No calculators found for the given characteristic.');
                return [];
            }
            if (associations.every(association => association.calculators.length === 0)) {
                console.log('No calculators found for the given characteristic.');
                return [];
            }
            const calculatorsIDs = associations
                .filter(association => association.calculators.length > 0)
                .map(association => association.calculators[0].ID);
            if (calculatorsIDs.length === 0) {
                console.log('No calculators found for the given characteristic.');
                return [];
            }
            let calculators;
            if (order_by === 'Most Recent') {
                calculators = await this.calculatorsRepository.find({
                    where: { ID: (0, typeorm_2.In)(calculatorsIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Most Popular') {
                calculators = await this.calculatorsRepository.find({
                    where: { ID: (0, typeorm_2.In)(calculatorsIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Best Rating') {
                calculators = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('calculators.*')
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                    .leftJoin('objectRating.calculators', 'calculators')
                    .leftJoin('calculators.ratings', 'ratings')
                    .where('calculators.ID IS NOT NULL')
                    .andWhere('calculators.ID IN (:...calculatorIds)', { calculatorIds: calculatorsIDs })
                    .groupBy('calculators.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                calculators.forEach((calculator) => {
                    calculator.avg_rating = parseFloat(calculator.avg_rating);
                });
                return calculators;
            }
            else {
                calculators = await this.calculatorsRepository.find({ where: { ID: (0, typeorm_2.In)(calculatorsIDs) }, relations: ['ratings'] });
            }
            const calculatorsWithAvgRating = calculators.map(calculator => {
                if (calculator.ratings && calculator.ratings.length > 0) {
                    const totalRating = calculator.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / calculator.ratings.length;
                    return {
                        ...calculator,
                        avg_rating: avgRating
                    };
                }
                else {
                    return {
                        ...calculator,
                        avg_rating: 0
                    };
                }
            });
            return calculatorsWithAvgRating;
        }
        catch (error) {
            if (error instanceof common_3.HttpException) {
                throw error;
            }
            else {
                console.error('Error getting calculators by characteristic:', error);
                throw new Error('Error getting calculators by characteristic');
            }
        }
    }
    async getCarousels(order_by) {
        if (await this.carouselsRepository.count() === 0) {
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'No carousels found',
            };
        }
        let carousels;
        if (order_by === 'Most Recent') {
            carousels = await this.carouselsRepository.find({
                relations: ['items', 'ratings'],
                order: {
                    created_at: 'DESC',
                },
            });
        }
        else if (order_by === 'Most Popular') {
            carousels = await this.carouselsRepository.find({
                relations: ['items', 'ratings'],
                order: {
                    views: 'DESC',
                },
            });
        }
        else if (order_by === 'Best Rating') {
            carousels = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('carousels.*')
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                .leftJoin('objectRating.carousels', 'carousels')
                .leftJoin('carousels.ratings', 'ratings')
                .leftJoin('carousels.items', 'items')
                .where('carousels.ID IS NOT NULL')
                .groupBy('carousels.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            carousels.forEach((carousel) => {
                carousel.avg_rating = parseFloat(carousel.avg_rating);
            });
            return carousels;
        }
        else {
            carousels = await this.carouselsRepository.find({ relations: ['items', 'ratings'] });
        }
        const carouselsWithAvgRating = carousels.map(carousel => {
            if (carousel.ratings && carousel.ratings.length > 0) {
                const totalRating = carousel.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / carousel.ratings.length;
                return {
                    ...carousel,
                    avg_rating: avgRating
                };
            }
            else {
                return {
                    ...carousel,
                    avg_rating: 0
                };
            }
        });
        return carouselsWithAvgRating;
    }
    async getCarouselsByCharacteristic(characteristic, optionSelected, order_by) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new common_3.HttpException(`Characteristic "${characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
            }
            let associations;
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['carousels'],
                });
            }
            else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['carousels'],
                });
            }
            if (associations.length === 0) {
                console.log('No carousels found for the given characteristic.');
                return [];
            }
            if (associations.every(association => association.carousels.length === 0)) {
                console.log('No carousels found for the given characteristic.');
                return [];
            }
            const carouselIDs = associations
                .filter(association => association.carousels.length > 0)
                .map(association => association.carousels[0].ID);
            if (carouselIDs.length === 0) {
                console.log('No carousels found for the given characteristic.');
                return [];
            }
            let carousels;
            if (order_by === 'Most Recent') {
                carousels = await this.carouselsRepository.find({
                    where: { ID: (0, typeorm_2.In)(carouselIDs) },
                    relations: ['items', 'ratings'],
                    order: {
                        created_at: 'DESC',
                    },
                });
            }
            else if (order_by === 'Most Popular') {
                carousels = await this.carouselsRepository.find({
                    where: { ID: (0, typeorm_2.In)(carouselIDs) },
                    relations: ['items', 'ratings'],
                    order: {
                        views: 'DESC',
                    },
                });
            }
            else if (order_by === 'Best Rating') {
                carousels = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('carousels.*')
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                    .leftJoin('objectRating.carousels', 'carousels')
                    .leftJoin('carousels.ratings', 'ratings')
                    .leftJoin('carousels.items', 'items')
                    .where('carousels.ID IS NOT NULL')
                    .andWhere('carousels.ID IN (:...carouselIds)', { carouselIds: carouselIDs })
                    .groupBy('carousels.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                carousels.forEach((carousel) => {
                    carousel.avg_rating = parseFloat(carousel.avg_rating);
                });
                return carousels;
            }
            else {
                carousels = await this.carouselsRepository.find({ relations: ['items', 'ratings'], where: { ID: (0, typeorm_2.In)(carouselIDs) } });
            }
            const carouselsWithAvgRating = carousels.map(carousel => {
                if (carousel.ratings && carousel.ratings.length > 0) {
                    const totalRating = carousel.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / carousel.ratings.length;
                    return {
                        ...carousel,
                        avg_rating: avgRating
                    };
                }
                else {
                    return {
                        ...carousel,
                        avg_rating: 0
                    };
                }
            });
            return carouselsWithAvgRating;
        }
        catch (error) {
            if (error instanceof common_3.HttpException) {
                throw error;
            }
            else {
                console.error('Error getting carousels by characteristic:', error);
                throw new Error('Error getting carousels by characteristic');
            }
        }
    }
    async getMealCards(order_by) {
        if (await this.mealCardsRepository.count() === 0) {
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'No meal cards found',
            };
        }
        let mealCards;
        if (order_by === 'Most Recent') {
            mealCards = await this.mealCardsRepository.find({
                order: {
                    created_at: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Most Popular') {
            mealCards = await this.mealCardsRepository.find({
                order: {
                    views: 'DESC',
                },
                relations: ['ratings']
            });
        }
        else if (order_by === 'Best Rating') {
            mealCards = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('mealCards.*')
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                .leftJoin('objectRating.mealCards', 'mealCards')
                .leftJoin('mealCards.ratings', 'ratings')
                .where('mealCards.ID IS NOT NULL')
                .groupBy('mealCards.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            mealCards.forEach((mealCard) => {
                mealCard.avg_rating = parseFloat(mealCard.avg_rating);
            });
            return mealCards;
        }
        else {
            mealCards = await this.mealCardsRepository.find({ relations: ['ratings'] });
        }
        const mealCardsWithAvgRating = mealCards.map(mealCard => {
            if (mealCard.ratings && mealCard.ratings.length > 0) {
                const totalRating = mealCard.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / mealCard.ratings.length;
                return {
                    ...mealCard,
                    avg_rating: avgRating
                };
            }
            else {
                return {
                    ...mealCard,
                    avg_rating: 0
                };
            }
        });
        return mealCardsWithAvgRating;
    }
    async getMealCardsByCharacteristic(characteristic, optionSelected, order_by) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new common_3.HttpException(`Characteristic "${characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
            }
            let associations;
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['mealCards'],
                });
            }
            else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['mealCards'],
                });
            }
            if (associations.length === 0) {
                console.log('No meal cards found for the given characteristic.');
                return [];
            }
            if (associations.every(association => association.mealCards.length === 0)) {
                console.log('No meal cards found for the given characteristic.');
                return [];
            }
            const mealCardsIDs = associations
                .filter(association => association.mealCards.length > 0)
                .map(association => association.mealCards[0].ID);
            if (mealCardsIDs.length === 0) {
                console.log('No meal cards found for the given characteristic.');
                return [];
            }
            let mealCards;
            if (order_by === 'Most Recent') {
                mealCards = await this.mealCardsRepository.find({
                    where: { ID: (0, typeorm_2.In)(mealCardsIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Most Popular') {
                mealCards = await this.mealCardsRepository.find({
                    where: { ID: (0, typeorm_2.In)(mealCardsIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            }
            else if (order_by === 'Best Rating') {
                mealCards = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('mealCards.*')
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating')
                    .leftJoin('objectRating.mealCards', 'mealCards')
                    .leftJoin('mealCards.ratings', 'ratings')
                    .where('mealCards.ID IS NOT NULL')
                    .andWhere('mealCards.ID IN (:...mealCardIds)', { mealCardIds: mealCardsIDs })
                    .groupBy('mealCards.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                mealCards.forEach((mealCard) => {
                    mealCard.avg_rating = parseFloat(mealCard.avg_rating);
                });
                return mealCards;
            }
            else {
                mealCards = await this.mealCardsRepository.find({ relations: ['ratings'], where: { ID: (0, typeorm_2.In)(mealCardsIDs) } });
            }
            const mealCardsWithAvgRating = mealCards.map(mealCard => {
                if (mealCard.ratings && mealCard.ratings.length > 0) {
                    const totalRating = mealCard.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / mealCard.ratings.length;
                    return {
                        ...mealCard,
                        avg_rating: avgRating
                    };
                }
                else {
                    return {
                        ...mealCard,
                        avg_rating: 0
                    };
                }
            });
            return mealCardsWithAvgRating;
        }
        catch (error) {
            if (error instanceof common_3.HttpException) {
                throw error;
            }
            console.error('Error getting meal cards by characteristic:', error);
            throw new Error('Error getting meal cards by characteristic');
        }
    }
    async getObject(params) {
        switch (params.objectType) {
            case 'article':
                const article = await this.articlesRepository.findOne({
                    where: { ID: params.id },
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                });
                if (!article) {
                    return {
                        status: common_2.HttpStatus.NOT_FOUND,
                        message: 'Article not found',
                    };
                }
                return article;
            case 'calculator':
                const calculator = await this.calculatorsRepository.findOne({
                    where: { ID: params.id },
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                });
                if (!calculator) {
                    return {
                        status: common_2.HttpStatus.NOT_FOUND,
                        message: 'Calculator not found',
                    };
                }
                return calculator;
            case 'carousel':
                const carousel = await this.carouselsRepository.findOne({
                    where: { ID: params.id },
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics', 'items'],
                });
                if (!carousel) {
                    return {
                        status: common_2.HttpStatus.NOT_FOUND,
                        message: 'Carousel not found',
                    };
                }
                return carousel;
            case 'mealCard':
                const mealCard = await this.mealCardsRepository.findOne({
                    where: { ID: params.id },
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                });
                if (!mealCard) {
                    return {
                        status: common_2.HttpStatus.NOT_FOUND,
                        message: 'Meal Card not found',
                    };
                }
                return mealCard;
            default:
                return {
                    status: common_2.HttpStatus.NOT_FOUND,
                    message: 'Object type not found',
                };
        }
    }
    async createObject(objectType, objectData, images) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.createArticle(objectData, images[0]);
                case 'calculator':
                    return await this.createCalculator(objectData, images[0]);
                case 'carousel':
                    return await this.createCarousel(objectData, images[0]);
                case 'mealCard':
                    return await this.createMealCard(objectData);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error creating object');
            }
            else {
                throw error;
            }
        }
    }
    async createArticle(articleData, image) {
        try {
            const existingArticle = await this.articlesRepository.findOne({
                where: { title: articleData.title },
            });
            if (existingArticle) {
                const errorMessage = 'Article with that title already exists.';
                throw new common_3.HttpException(errorMessage, common_2.HttpStatus.CONFLICT);
            }
            const tempFilePath = './file.png';
            fs.writeFileSync(tempFilePath, image.buffer);
            const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                folder: 'articles',
            });
            const article = this.articlesRepository.create({
                title: articleData.title,
                subtitle: articleData.subtitle,
                description: articleData.description,
                time_of_day_relevance: articleData.time_of_day_relevance,
                season_relevance: articleData.season_relevance,
                image: result.secure_url,
            });
            await this.articlesRepository.save(article);
            fs.unlinkSync(tempFilePath);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Article created',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error creating article');
            }
            else {
                throw error;
            }
        }
    }
    async createCalculator(calculatorData, image) {
        try {
            const existingCalculator = await this.calculatorsRepository.findOne({
                where: { title: calculatorData.title },
            });
            if (existingCalculator) {
                const errorMessage = 'Calculator with that title already exists.';
                throw new common_3.HttpException(errorMessage, common_2.HttpStatus.CONFLICT);
            }
            if (image) {
                const tempFilePath = './file.png';
                fs.writeFileSync(tempFilePath, image.buffer);
                const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                    folder: 'calculators',
                });
                const calculator = this.calculatorsRepository.create({
                    title: calculatorData.title,
                    subtitle: calculatorData.subtitle,
                    description: calculatorData.description,
                    variable_to_calculate: calculatorData.variable_to_calculate,
                    equation: calculatorData.equation,
                    time_of_day_relevance: calculatorData.time_of_day_relevance,
                    season_relevance: calculatorData.season_relevance,
                    image: result.secure_url,
                });
                await this.calculatorsRepository.save(calculator);
                fs.unlinkSync(tempFilePath);
            }
            else {
                const calculator = this.calculatorsRepository.create({
                    title: calculatorData.title,
                    subtitle: calculatorData.subtitle,
                    description: calculatorData.description,
                    equation: calculatorData.equation,
                    variable_to_calculate: calculatorData.variable_to_calculate,
                    time_of_day_relevance: calculatorData.time_of_day_relevance,
                    season_relevance: calculatorData.season_relevance,
                });
                await this.calculatorsRepository.save(calculator);
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error creating calculator');
            }
            else {
                throw error;
            }
        }
    }
    async createCarousel(carouselData, image) {
        try {
            console.log('Carousel Data:', carouselData);
            const existingCarousel = await this.carouselsRepository.findOne({
                where: { title: carouselData.title },
            });
            let existingItem;
            if (existingCarousel) {
                existingItem = await this.carouselItemRepository.findOne({
                    where: {
                        title: carouselData.itemTitle,
                        carousel: { title: existingCarousel.title }
                    },
                });
            }
            console.log('Existing Carousel:', existingCarousel);
            console.log('Existing Item:', existingItem);
            if (existingCarousel && existingItem) {
                const errorMessage = 'Carousel with that title and item with that title already exists.';
                throw new common_3.HttpException(errorMessage, common_2.HttpStatus.CONFLICT);
            }
            else if (existingCarousel) {
                const tempFilePath = './file.png';
                fs.writeFileSync(tempFilePath, image.buffer);
                const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                    folder: 'carousels',
                });
                const item = this.carouselItemRepository.create({
                    title: carouselData.itemTitle,
                    subtitle: carouselData.itemSubtitle,
                    description: carouselData.itemDescription,
                    image: result.secure_url,
                    link: carouselData.itemLink,
                    buttonText: carouselData.itemButtonText,
                    carousel: existingCarousel
                });
                console.log('item:', item);
                await this.carouselItemRepository.save(item);
                return {
                    status: common_2.HttpStatus.CREATED,
                    message: 'Carousel item created',
                };
            }
            else {
                const carousel = this.carouselsRepository.create({
                    title: carouselData.title,
                    time_of_day_relevance: carouselData.time_of_day_relevance,
                    season_relevance: carouselData.season_relevance,
                });
                await this.carouselsRepository.save(carousel);
                console.log('Carousel:', carousel);
                console.log('image:', image);
                const tempFilePath = './file.png';
                fs.writeFileSync(tempFilePath, image.buffer);
                const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                    folder: 'carousels',
                });
                const item = this.carouselItemRepository.create({
                    title: carouselData.itemTitle,
                    subtitle: carouselData.itemSubtitle,
                    description: carouselData.itemDescription,
                    image: result.secure_url,
                    link: carouselData.itemLink,
                    buttonText: carouselData.itemButtonText,
                    carousel: carousel
                });
                console.log('item:', item);
                await this.carouselItemRepository.save(item);
                return {
                    status: common_2.HttpStatus.CREATED,
                    message: 'Carousel item created',
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    async createMealCard(mealCardData) {
        try {
            const existingMealCard = await this.mealCardsRepository.findOne({
                where: { title: mealCardData.title },
            });
            if (existingMealCard) {
                const errorMessage = 'Meal Card with that title already exists.';
                throw new common_3.HttpException(errorMessage, common_2.HttpStatus.CONFLICT);
            }
            const mealCard = this.mealCardsRepository.create({
                title: mealCardData.title,
                price: mealCardData.price,
                description: mealCardData.description,
                image: mealCardData.image,
                category: mealCardData.category,
                link: mealCardData.link,
                number_ingridients: mealCardData.number_ingridients,
                time_of_day_relevance: mealCardData.time_of_day_relevance,
                season_relevance: mealCardData.season_relevance
            });
            await this.mealCardsRepository.save(mealCard);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Meal Card created',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error creating meal card');
            }
            else {
                throw error;
            }
        }
    }
    async updateObject(objectType, id, objectData, images) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.updateArticle(id, objectData, images[0]);
                case 'calculator':
                    return await this.updateCalculator(id, objectData, images[0]);
                case 'carousel':
                    return await this.updateCarousel(id, objectData, images[0]);
                case 'mealCard':
                    return await this.updateMealCard(id, objectData);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating object');
            }
            else {
                throw error;
            }
        }
    }
    async updateArticle(id, articleData, image) {
        try {
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_4.NotFoundException('Article not found');
            }
            if (image) {
                const tempFilePath = './file.png';
                fs.writeFileSync(tempFilePath, image.buffer);
                const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                    folder: 'articles',
                });
                article.image = result.secure_url;
                fs.unlinkSync(tempFilePath);
            }
            if (articleData.title) {
                article.title = articleData.title;
            }
            if (articleData.subtitle) {
                article.subtitle = articleData.subtitle;
            }
            if (articleData.description) {
                article.description = articleData.description;
            }
            if (articleData.time_of_day_relevance) {
                article.time_of_day_relevance = articleData.time_of_day_relevance;
            }
            if (articleData.season_relevance) {
                article.season_relevance = articleData.season_relevance;
            }
            await this.articlesRepository.save(article);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Article updated',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating article');
            }
            else {
                throw error;
            }
        }
    }
    async updateCalculator(id, calculatorData, image) {
        try {
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_4.NotFoundException('Calculator not found');
            }
            if (image) {
                const tempFilePath = './file.png';
                fs.writeFileSync(tempFilePath, image.buffer);
                const result = await cloudinary_config_1.default.uploader.upload(tempFilePath, {
                    folder: 'calculators',
                });
                calculator.image = result.secure_url;
                fs.unlinkSync(tempFilePath);
            }
            if (calculatorData.title) {
                calculator.title = calculatorData.title;
            }
            if (calculatorData.subtitle) {
                calculator.subtitle = calculatorData.subtitle;
            }
            if (calculatorData.description) {
                calculator.description = calculatorData.description;
            }
            if (calculatorData.equation) {
                calculator.equation = calculatorData.equation;
            }
            if (calculatorData.variable_to_calculate) {
                calculator.variable_to_calculate = calculatorData.variable_to_calculate;
            }
            if (calculatorData.time_of_day_relevance) {
                calculator.time_of_day_relevance = calculatorData.time_of_day_relevance;
            }
            if (calculatorData.season_relevance) {
                calculator.season_relevance = calculatorData.season_relevance;
            }
            await this.calculatorsRepository.save(calculator);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Calculator updated',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating calculator');
            }
            else {
                throw error;
            }
        }
    }
    async updateCarousel(carouselId, carouselData, image) {
        try {
            const existingCarousel = await this.carouselsRepository.findOne({ where: { ID: carouselId } });
            if (!existingCarousel) {
                throw new common_4.NotFoundException('Carousel not found');
            }
            if (carouselData.time_of_day_relevance) {
                existingCarousel.time_of_day_relevance = carouselData.time_of_day_relevance;
            }
            if (carouselData.season_relevance) {
                existingCarousel.season_relevance = carouselData.season_relevance;
            }
            await this.carouselsRepository.save(existingCarousel);
            const existingItem = await this.carouselItemRepository.findOne({ where: { ID: carouselData.itemID }, relations: ['carousel'] });
            if (!existingItem && image) {
                this.createCarousel(carouselData, image);
            }
            if (existingItem) {
                if (carouselData.itemTitle) {
                    existingItem.title = carouselData.itemTitle;
                }
                if (carouselData.itemSubtitle) {
                    existingItem.subtitle = carouselData.itemSubtitle;
                }
                if (carouselData.itemDescription) {
                    existingItem.description = carouselData.itemDescription;
                }
                if (carouselData.itemLink) {
                    existingItem.link = carouselData.itemLink;
                }
                if (carouselData.itemButtonText) {
                    existingItem.buttonText = carouselData.itemButtonText;
                }
                console.log('Existing Item:', existingItem);
                await this.carouselItemRepository.save(existingItem);
            }
            return {
                status: common_2.HttpStatus.OK,
                message: 'Carousel item updated',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateMealCard(id, mealCardData) {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_4.NotFoundException('Meal Card not found');
            }
            if (mealCardData.title) {
                mealCard.title = mealCardData.title;
            }
            if (mealCardData.price) {
                mealCard.price = mealCardData.price;
            }
            if (mealCardData.description) {
                mealCard.description = mealCardData.description;
            }
            if (mealCardData.image) {
                mealCard.image = mealCardData.image;
            }
            if (mealCardData.category) {
                mealCard.category = mealCardData.category;
            }
            if (mealCardData.link) {
                mealCard.link = mealCardData.link;
            }
            if (mealCardData.number_ingridients) {
                mealCard.number_ingridients = mealCardData.number_ingridients;
            }
            if (mealCardData.time_of_day_relevance) {
                mealCard.time_of_day_relevance = mealCardData.time_of_day_relevance;
            }
            if (mealCardData.season_relevance) {
                mealCard.season_relevance = mealCardData.season_relevance;
            }
            await this.mealCardsRepository.save(mealCard);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Meal Card updated',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating meal card');
            }
            else {
                throw error;
            }
        }
    }
    async deleteObject(objectType, id, carouselItemID) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.deleteArticle(id);
                case 'calculator':
                    return await this.deleteCalculator(id);
                case 'carousel':
                    return await this.deleteCarousel(id, carouselItemID);
                case 'mealCard':
                    return await this.deleteMealCard(id);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting object');
            }
            else {
                throw error;
            }
        }
    }
    async deleteArticle(id) {
        try {
            const article = await this.articlesRepository.findOne({
                where: { ID: id },
                relations: ['objectCharacteristicsAssociations'],
            });
            if (!article) {
                throw new common_4.NotFoundException('Article not found');
            }
            await this.objectCharacteristicsAssociationRepository.remove(article.objectCharacteristicsAssociations);
            const articleToDelete = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!articleToDelete) {
                throw new common_4.NotFoundException('Article not found');
            }
            await this.articlesRepository.delete(articleToDelete);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Article deleted',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting article');
            }
            else {
                throw error;
            }
        }
    }
    async deleteCalculator(id) {
        try {
            const calculator = await this.calculatorsRepository.findOne({
                where: { ID: id },
                relations: ['objectCharacteristicsAssociations'],
            });
            if (!calculator) {
                throw new common_4.NotFoundException('Calculator not found');
            }
            await this.objectCharacteristicsAssociationRepository.remove(calculator.objectCharacteristicsAssociations);
            const calculatorToDelete = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculatorToDelete) {
                throw new common_4.NotFoundException('Calculator not found');
            }
            await this.calculatorsRepository.delete(calculatorToDelete);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Calculator deleted',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting calculator');
            }
            else {
                throw error;
            }
        }
    }
    async deleteCarousel(id, carouselItemID) {
        try {
            if (carouselItemID) {
                console.log('Carousel Item ID:', carouselItemID);
                const carouselItem = await this.carouselItemRepository.findOne({ where: { ID: carouselItemID } });
                console.log('Carousel Item:', carouselItem);
                if (!carouselItem) {
                    throw new common_4.NotFoundException('Carousel item not found');
                }
                await this.carouselItemRepository.delete(carouselItemID);
                return {
                    status: common_2.HttpStatus.OK,
                    message: 'Carousel item deleted',
                };
            }
            else {
                const carousel = await this.carouselsRepository.findOne({
                    where: { ID: id },
                    relations: ['objectCharacteristicsAssociations', 'items'],
                });
                if (!carousel) {
                    throw new common_4.NotFoundException('carousel not found');
                }
                await this.objectCharacteristicsAssociationRepository.remove(carousel.objectCharacteristicsAssociations);
                for (const item of carousel.items) {
                    await this.carouselItemRepository.delete(item.ID);
                }
                const carouselToDelete = await this.carouselsRepository.findOne({ where: { ID: id } });
                if (!carouselToDelete) {
                    throw new common_4.NotFoundException('Carousel not found');
                }
                await this.carouselsRepository.delete(carouselToDelete);
                return {
                    status: common_2.HttpStatus.OK,
                    message: 'Carousel deleted',
                };
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting carousel');
            }
            else {
                throw error;
            }
        }
    }
    async deleteMealCard(id) {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id }, relations: ['objectCharacteristicsAssociations'] });
            if (!mealCard) {
                throw new common_4.NotFoundException('Meal Card not found');
            }
            await this.objectCharacteristicsAssociationRepository.remove(mealCard.objectCharacteristicsAssociations);
            const mealCardToDelete = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCardToDelete) {
                throw new common_4.NotFoundException('MealCard not found');
            }
            await this.mealCardsRepository.delete(mealCardToDelete);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Meal Card deleted',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting meal card');
            }
            else {
                throw error;
            }
        }
    }
    async getCharacteristics(objectType) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.getArticleCharacteristics();
                case 'calculator':
                    return await this.getCalculatorCharacteristics();
                case 'carousel':
                    return await this.getCarouselCharacteristics();
                case 'mealCard':
                    return await this.getMealCardCharacteristics();
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting characteristics');
            }
            else {
                throw error;
            }
        }
    }
    getArticleCharacteristics() {
        return this.objectCharacteristicsAssociationRepository.find({
            relations: ['characteristics'],
        });
    }
    getCalculatorCharacteristics() {
        return this.objectCharacteristicsAssociationRepository.find({
            relations: ['characteristics'],
        });
    }
    getCarouselCharacteristics() {
        return this.objectCharacteristicsAssociationRepository.find({
            relations: ['characteristics'],
        });
    }
    getMealCardCharacteristics() {
        return this.objectCharacteristicsAssociationRepository.find({
            relations: ['characteristics'],
        });
    }
    async associateObject(params, associations) {
        try {
            switch (params.objectType) {
                case 'article':
                    const article = await this.articlesRepository.findOne({ where: { title: params.title } });
                    if (!article) {
                        throw new common_3.HttpException('Article with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const existingAssociation = await this.objectCharacteristicsAssociationRepository.findOne({
                                where: {
                                    characteristics: characteristic,
                                    articles: article,
                                    option_selected: optionName,
                                },
                                relations: ['characteristics', 'articles'],
                            });
                            if (existingAssociation) {
                                continue;
                            }
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                articles: [article],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                case "calculator":
                    const calculator = await this.calculatorsRepository.findOne({ where: { title: params.title } });
                    if (!calculator) {
                        throw new common_3.HttpException('Calculator with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const existingAssociation = await this.objectCharacteristicsAssociationRepository.findOne({
                                where: {
                                    characteristics: characteristic,
                                    calculators: calculator,
                                    option_selected: optionName,
                                },
                                relations: ['characteristics', 'calculators'],
                            });
                            if (existingAssociation) {
                                continue;
                            }
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                calculators: [calculator],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                case "carousel":
                    const carousel = await this.carouselsRepository.findOne({ where: { title: params.title } });
                    if (!carousel) {
                        throw new common_3.HttpException('Carousel with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const existingAssociation = await this.objectCharacteristicsAssociationRepository.findOne({
                                where: {
                                    characteristics: characteristic,
                                    carousels: carousel,
                                    option_selected: optionName,
                                },
                                relations: ['characteristics', 'carousels'],
                            });
                            if (existingAssociation) {
                                continue;
                            }
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                carousels: [carousel],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                case "mealCard":
                    const mealCard = await this.mealCardsRepository.findOne({ where: { title: params.title } });
                    if (!mealCard) {
                        throw new common_3.HttpException('Meal Card with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const existingAssociation = await this.objectCharacteristicsAssociationRepository.findOne({
                                where: {
                                    characteristics: characteristic,
                                    mealCards: mealCard,
                                    option_selected: optionName,
                                },
                                relations: ['characteristics', 'mealCards'],
                            });
                            if (existingAssociation) {
                                continue;
                            }
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                mealCards: [mealCard],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                default:
                    throw new common_3.HttpException('Object type not found', common_2.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error associating object');
            }
            else {
                throw error;
            }
        }
    }
    async updateAssociations(params, associations) {
        try {
            let associationsToDelete = [];
            switch (params.objectType) {
                case 'article':
                    const article = await this.articlesRepository.findOne({ where: { title: params.title } });
                    if (!article) {
                        throw new common_3.HttpException('Article with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { articles: article },
                    });
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully");
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                articles: [article],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                case 'calculator':
                    const calculator = await this.calculatorsRepository.findOne({ where: { title: params.title } });
                    if (!calculator) {
                        throw new common_3.HttpException('Calculator with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { calculators: calculator },
                    });
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully");
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                calculators: [calculator],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                case 'carousel':
                    const carousel = await this.carouselsRepository.findOne({ where: { title: params.title } });
                    if (!carousel) {
                        throw new common_3.HttpException('Carousel with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { carousels: carousel },
                    });
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully");
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                carousels: [carousel],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                case 'mealCard':
                    const mealCard = await this.mealCardsRepository.findOne({ where: { title: params.title } });
                    if (!mealCard) {
                        throw new common_3.HttpException('Meal Card with that title does not exist.', common_2.HttpStatus.NOT_FOUND);
                    }
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { mealCards: mealCard },
                    });
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully");
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new common_3.HttpException(`Characteristic "${association.characteristic}" does not exist.`, common_2.HttpStatus.NOT_FOUND);
                        }
                        for (const optionName of association.options) {
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                mealCards: [mealCard],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    return {
                        status: common_2.HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                default:
                    throw new common_3.HttpException('Object type not found', common_2.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating associations');
            }
            else {
                throw error;
            }
        }
    }
    async incrementViews(objectType, id) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.incrementArticleViews(id);
                case 'calculator':
                    return await this.incrementCalculatorViews(id);
                case 'carousel':
                    return await this.incrementCarouselViews(id);
                case 'mealCard':
                    return await this.incrementMealCardViews(id);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error incrementing views');
            }
            else {
                throw error;
            }
        }
    }
    async incrementArticleViews(id) {
        try {
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            article.views += 1;
            await this.articlesRepository.save(article);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Article views incremented',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error incrementing article views');
            }
            else {
                throw error;
            }
        }
    }
    async incrementCalculatorViews(id) {
        try {
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            calculator.views += 1;
            await this.calculatorsRepository.save(calculator);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Calculator views incremented',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error incrementing calculator views');
            }
            else {
                throw error;
            }
        }
    }
    async incrementCarouselViews(id) {
        try {
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            carousel.views += 1;
            await this.carouselsRepository.save(carousel);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Carousel views incremented',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error incrementing carousel views');
            }
            else {
                throw error;
            }
        }
    }
    async incrementMealCardViews(id) {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            mealCard.views += 1;
            await this.mealCardsRepository.save(mealCard);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Meal Card views incremented',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error incrementing meal card views');
            }
            else {
                throw error;
            }
        }
    }
    async getRatings(objectType, id) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.getArticleAverageRating(id);
                case 'calculator':
                    return await this.getCalculatorAverageRating(id);
                case 'carousel':
                    return await this.getCarouselAverageRating(id);
                case 'mealCard':
                    return await this.getMealCardAverageRating(id);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting average rating');
            }
            else {
                throw error;
            }
        }
    }
    async getArticleAverageRating(id) {
        try {
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.find({ where: { articles: article } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
            let averageRating;
            if (totalRating === 0) {
                averageRating = '0.0';
            }
            else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);
            return {
                status: common_2.HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting article average rating');
            }
            else {
                throw error;
            }
        }
    }
    async getCalculatorAverageRating(id) {
        try {
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.find({ where: { calculators: calculator } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
            let averageRating;
            if (totalRating === 0) {
                averageRating = '0.0';
            }
            else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);
            return {
                status: common_2.HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting calculator average rating');
            }
            else {
                throw error;
            }
        }
    }
    async getCarouselAverageRating(id) {
        try {
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.find({ where: { carousels: carousel } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
            let averageRating;
            if (totalRating === 0) {
                averageRating = '0.0';
            }
            else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);
            return {
                status: common_2.HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting carousel average rating');
            }
            else {
                throw error;
            }
        }
    }
    async getMealCardAverageRating(id) {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.find({ where: { mealCards: mealCard } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
            let averageRating;
            if (totalRating === 0) {
                averageRating = '0.0';
            }
            else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);
            return {
                status: common_2.HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting meal card average rating');
            }
            else {
                throw error;
            }
        }
    }
    async getUserRatings(objectType, id, userEmail) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.getUserArticleRatings(userEmail, id);
                case 'calculator':
                    return await this.getUserCalculatorRatings(userEmail, id);
                case 'carousel':
                    return await this.getUserCarouselRatings(userEmail, id);
                case 'mealCard':
                    return await this.getUserMealCardRatings(userEmail, id);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting user ratings');
            }
            else {
                throw error;
            }
        }
    }
    async getUserArticleRatings(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            console.log('Article:', article);
            console.log('User:', user);
            const ratings = await this.objectRatingsRepository.findOne({ where: { articles: { ID: article.ID }, users: user } });
            console.log('Ratings:', ratings);
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_2.HttpStatus.OK,
                ratings: ratings,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting user article ratings');
            }
            else {
                throw error;
            }
        }
    }
    async getUserCalculatorRatings(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.findOne({ where: { calculators: { ID: calculator.ID }, users: user } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_2.HttpStatus.OK,
                ratings: ratings,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting user calculator ratings');
            }
            else {
                throw error;
            }
        }
    }
    async getUserCarouselRatings(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.findOne({ where: { carousels: { ID: carousel.ID }, users: user } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_2.HttpStatus.OK,
                ratings: ratings,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting user carousel ratings');
            }
            else {
                throw error;
            }
        }
    }
    async getUserMealCardRatings(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            const ratings = await this.objectRatingsRepository.findOne({ where: { mealCards: { ID: mealCard.ID }, users: user } });
            if (!ratings) {
                throw new common_3.HttpException('Ratings not found', common_2.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_2.HttpStatus.OK,
                ratings: ratings,
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error getting user meal card ratings');
            }
            else {
                throw error;
            }
        }
    }
    async postRating(userEmail, objectType, id, rating) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.postArticleRating(userEmail, id, rating);
                case 'calculator':
                    return await this.postCalculatorRating(userEmail, id, rating);
                case 'carousel':
                    return await this.postCarouselRating(userEmail, id, rating);
                case 'mealCard':
                    return await this.postMealCardRating(userEmail, id, rating);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error posting rating');
            }
            else {
                throw error;
            }
        }
    }
    async postArticleRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            const existingRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user }, relations: ['articles', 'users'] });
            console.log('Existing Rating:', existingRating);
            if (existingRating) {
                throw new common_3.HttpException('User has already rated this article', common_2.HttpStatus.BAD_REQUEST);
            }
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user],
                articles: [article],
            });
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error posting article rating');
            }
            else {
                throw error;
            }
        }
    }
    async postCalculatorRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            const existingRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (existingRating) {
                throw new common_3.HttpException('User has already rated this calculator', common_2.HttpStatus.BAD_REQUEST);
            }
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user],
                calculators: [calculator],
            });
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error posting calculator rating');
            }
            else {
                throw error;
            }
        }
    }
    async postCarouselRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            const existingRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (existingRating) {
                throw new common_3.HttpException('User has already rated this carousel', common_2.HttpStatus.BAD_REQUEST);
            }
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user],
                carousels: [carousel],
            });
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error posting carousel rating');
            }
            else {
                throw error;
            }
        }
    }
    async postMealCardRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            const existingRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (existingRating) {
                throw new common_3.HttpException('User has already rated this meal card', common_2.HttpStatus.BAD_REQUEST);
            }
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user],
                mealCards: [mealCard],
            });
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error posting meal card rating');
            }
            else {
                throw error;
            }
        }
    }
    async updateRating(userEmail, objectType, id, rating) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.updateArticleRating(userEmail, id, rating);
                case 'calculator':
                    return await this.updateCalculatorRating(userEmail, id, rating);
                case 'carousel':
                    return await this.updateCarouselRating(userEmail, id, rating);
                case 'mealCard':
                    return await this.updateMealCardRating(userEmail, id, rating);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating rating');
            }
            else {
                throw error;
            }
        }
    }
    async updateArticleRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating article rating');
            }
            else {
                throw error;
            }
        }
    }
    async updateCalculatorRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating calculator rating');
            }
            else {
                throw error;
            }
        }
    }
    async updateCarouselRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating carousel rating');
            }
            else {
                throw error;
            }
        }
    }
    async updateMealCardRating(userEmail, id, rating) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error updating meal card rating');
            }
            else {
                throw error;
            }
        }
    }
    async deleteRating(userEmail, objectType, id) {
        try {
            switch (objectType) {
                case 'article':
                    return await this.deleteArticleRating(userEmail, id);
                case 'calculator':
                    return await this.deleteCalculatorRating(userEmail, id);
                case 'carousel':
                    return await this.deleteCarouselRating(userEmail, id);
                case 'mealCard':
                    return await this.deleteMealCardRating(userEmail, id);
                default:
                    throw new common_4.BadRequestException('Invalid object type');
            }
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting rating');
            }
            else {
                throw error;
            }
        }
    }
    async deleteArticleRating(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new common_3.HttpException('Article not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            await this.objectRatingsRepository.remove(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting article rating');
            }
            else {
                throw error;
            }
        }
    }
    async deleteCalculatorRating(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new common_3.HttpException('Calculator not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            await this.objectRatingsRepository.remove(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting calculator rating');
            }
            else {
                throw error;
            }
        }
    }
    async deleteCarouselRating(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new common_3.HttpException('Carousel not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            await this.objectRatingsRepository.remove(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting carousel rating');
            }
            else {
                throw error;
            }
        }
    }
    async deleteMealCardRating(userEmail, id) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new common_3.HttpException('Meal Card not found', common_2.HttpStatus.NOT_FOUND);
            }
            const objectRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (!objectRating) {
                throw new common_3.HttpException('Rating not found', common_2.HttpStatus.NOT_FOUND);
            }
            await this.objectRatingsRepository.remove(objectRating);
            return {
                status: common_2.HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error deleting meal card rating');
            }
            else {
                throw error;
            }
        }
    }
};
exports.ObjectsService = ObjectsService;
exports.ObjectsService = ObjectsService = ObjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Articles_1.Articles)),
    __param(1, (0, typeorm_1.InjectRepository)(Calculators_1.Calculators)),
    __param(2, (0, typeorm_1.InjectRepository)(ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation)),
    __param(3, (0, typeorm_1.InjectRepository)(Characteristics_1.Characteristics)),
    __param(4, (0, typeorm_1.InjectRepository)(Carousels_1.Carousels)),
    __param(5, (0, typeorm_1.InjectRepository)(CarouselItem_1.CarouselItem)),
    __param(6, (0, typeorm_1.InjectRepository)(MealCards_1.MealCards)),
    __param(7, (0, typeorm_1.InjectRepository)(ObjectRatings_1.ObjectRatings)),
    __param(8, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ObjectsService);
//# sourceMappingURL=objects.service.js.map
import {Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Articles } from './entities/Articles';
import { ObjectCharacteristicsAssociation } from './entities/ObjectCharacteristicsAssociation';
import { Characteristics } from 'src/characteristics/entities/Characteristics';
import { HttpStatus } from '@nestjs/common';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO, UpdateArticleDTO,
UpdateAssociationDTO, AssociationItemDTO } from './dtos/objects.dto';
import * as fs from 'fs-extra';
import cloudinary from 'src/cloudinary.config';
import { HttpException } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Calculators } from './entities/Calculators';
import { Carousels } from './entities/Carousels';
import { get } from 'http';
import { CarouselItem } from './entities/CarouselItem';
import { MealCards } from './entities/MealCards';
import { ObjectRatings } from './entities/ObjectRatings';
import { User } from 'src/users/entities/User';



@Injectable()
export class ObjectsService {
    private readonly logger = new Logger(ObjectsService.name);
    constructor(
        @InjectRepository(Articles)
        private readonly articlesRepository: Repository<Articles>,
        @InjectRepository(Calculators)
        private readonly calculatorsRepository: Repository<Calculators>,
        @InjectRepository(ObjectCharacteristicsAssociation)
        private readonly objectCharacteristicsAssociationRepository: Repository<ObjectCharacteristicsAssociation>,
        @InjectRepository(Characteristics)
        private readonly characteristicRepository: Repository<Characteristics>,
        @InjectRepository(Carousels)
        private readonly carouselsRepository: Repository<Carousels>,
        @InjectRepository(CarouselItem)
        private readonly carouselItemRepository: Repository<CarouselItem>,
        @InjectRepository(MealCards)
        private readonly mealCardsRepository: Repository<MealCards>,
        @InjectRepository(ObjectRatings)
        private readonly objectRatingsRepository: Repository<ObjectRatings>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}

    async getObjectsByRecommendedCharacteristics(recommendedCharacteristics: string[], objectType?: string, order_by?: string) {
        try {
            
    
            let objects: { [key: string]: any[] } = {};
            let addedObjectIDs: { [key: string]: Set<string> } = {};

            

            if (objectType) {
                // If objectType is provided, set objects and addedObjectIDs only for that type
                objects[objectType] = [];
                addedObjectIDs[objectType] = new Set();
            } else {
                // If objectType is not provided, set objects and addedObjectIDs for all types
                objects = { articles: [], calculators: [], carousels: [] };
                addedObjectIDs = { articles: new Set(), calculators: new Set(), carousels: new Set() };
            }

            for (const characteristic of recommendedCharacteristics) {
                const [category, option] = characteristic.split(':').map(str => str.trim());
                let result: any;
    
                if (objectType) {
                    // Retrieve objects only for the specified type
                    result = await this.getObjects(objectType, category, option, order_by);
                    if (Array.isArray(result)) {
                        for (const obj of result) {
                            // Check if the object ID is already added, if not, add it
                            if (typeof obj.ID === 'string' && !addedObjectIDs[objectType].has(obj.ID)) {
                                objects[objectType].push({ ...obj }); // Creating a shallow copy of the object
                                addedObjectIDs[objectType].add(obj.ID);
                            }
                        }
                    }
                    // Apply ordering if order_by is provided
                    if (order_by) {
                        switch (order_by) {
                            case 'Most Recent':
                                // Order by most recent logic
                                console.log(objects[objectType])
                                objects[objectType].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                                break;
                            case 'Most Popular':
                                // Order by most popular logic
                                objects[objectType].sort((a, b) => b.views - a.views);
                                break;
                            // Add more cases for other ordering options if needed
                            case 'Best Rating':
                                // Order by best rating logic
                                objects[objectType].sort((a, b) => b.avg_rating - a.avg_rating);
                                break;
                            default:
                                // Handle invalid order_by value
                                throw new BadRequestException('Invalid order_by value');
                        }
                    }
                } else {
                    // Retrieve all types of objects
                    const articles = await this.getObjects('articles', category, option);
                    const calculators = await this.getObjects('calculators', category, option);
                    const carousels = await this.getObjects('carousels', category, option);
    
                    // Push objects into respective arrays
                    if (Array.isArray(articles)) {
                        for (const obj of articles) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.articles.has(obj.ID)) {
                                objects.articles.push({ ...obj }); // Creating a shallow copy of the object
                                addedObjectIDs.articles.add(obj.ID);
                            }
                        }
                    }
                    if (Array.isArray(calculators)) {
                        for (const obj of calculators) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.calculators.has(obj.ID)) {
                                objects.calculators.push({ ...obj }); // Creating a shallow copy of the object
                                addedObjectIDs.calculators.add(obj.ID);
                            }
                        }
                    }
                    if (Array.isArray(carousels)) {
                        for (const obj of carousels) {
                            if (typeof obj.ID === 'string' && !addedObjectIDs.carousels.has(obj.ID)) {
                                objects.carousels.push({ ...obj }); // Creating a shallow copy of the object
                                addedObjectIDs.carousels.add(obj.ID);
                            }
                        }
                    }
                }
            }
    
            return objects;
        } catch (error) {
            throw new Error('Error getting objects by recommended characteristics');
        }
    }

    async getObjects(objectType?: string, characteristic?: string, optionSelected?: string, order_by?: string, recommendedCharacteristics?: string[]) {
        try {
            if (!recommendedCharacteristics || recommendedCharacteristics.length === 0) {
                // If no recommendedCharacteristics provided, objectType must be present
                if (!objectType) {
                    throw new BadRequestException('Object type must be provided');
                }
            }
    
            if (recommendedCharacteristics && recommendedCharacteristics.length > 0) {
                // If recommendedCharacteristics are provided, use them to filter objects
                return await this.getObjectsByRecommendedCharacteristics(recommendedCharacteristics, objectType);
            } else {
                // If no recommendedCharacteristics provided, proceed with regular fetching
                switch(objectType) {
                    case 'articles':
                        if (characteristic && optionSelected) {
                            return await this.getArticlesByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getArticlesByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getArticles(order_by);
                    case 'calculators':
                        if (characteristic && optionSelected) {
                            return await this.getCalculatorsByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getCalculatorsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getCalculators(order_by);
                    case 'carousels':
                        if (characteristic && optionSelected) {
                            return await this.getCarouselsByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getCarouselsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getCarousels(order_by);
                    case 'mealCards':
                        if (characteristic && optionSelected) {
                            return await this.getMealCardsByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getMealCardsByCharacteristic(characteristic, optionSelected, order_by);
                        }
                        return await this.getMealCards(order_by);
                    default:
                        throw new BadRequestException('Invalid object type');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting objects');
            } else {
                throw error;
            }
        }
    }

    async getArticles(order_by?: string) {
        if (await this.articlesRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No articles found',
            };
        }
        let articles: any;
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
        } else if (order_by === 'Best Rating') {
            articles = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('articles.*') // Select all columns from articles
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                .leftJoin('objectRating.articles', 'articles')
                .leftJoin('articles.ratings', 'ratings')
                .where('articles.ID IS NOT NULL') // Exclude records where article ID is null
                .groupBy('articles.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            // Assuming articles is an array of objects
            articles.forEach((article: any) => {
                article.avg_rating = parseFloat(article.avg_rating);
            });
            return articles;
        } else {
            articles = await this.articlesRepository.find({
                relations: ['ratings']
            });
        }
    
        // Calculate average rating for each article
        const articlesWithAvgRating = articles.map(article => {
            if (article.ratings && article.ratings.length > 0) {
                const totalRating = article.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / article.ratings.length;
                return {
                    ...article,
                    avg_rating: avgRating
                };
            } else {
                return {
                    ...article,
                    avg_rating: 0 // Default average rating if no ratings
                };
            }
        });
        return articlesWithAvgRating;
    }

    async getArticlesByCharacteristic(characteristic: string, optionSelected?: string, order_by?: string) {
        try {    
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
            }
    
            let associations: any[];
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['articles'],
                });
            } else {
                console.log('Characteristic entity:', characteristicEntity);
                console.log("Order by:", order_by);
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: { characteristics: characteristicEntity },
                    relations: ['articles'],
                });
            }
    
            // Check if all associations have no articles
            if (associations.every(association => association.articles.length === 0)) {
                console.log('No articles found for the given characteristic.');
                return []; // Return an empty array if no articles are found
            }
        
            // Filter associations with non-empty articles arrays and get article IDs
            const articlesIDs = associations
            .filter(association => association.articles.length > 0)
            .map(association => association.articles[0].ID);
    
            // Check if there are no articles found
            if (articlesIDs.length === 0) {
            console.log('No articles found for the given characteristic.');
            return []; // Return an empty array if no articles are found
            }

            let articles: any
            if (order_by === 'Most Recent') {
                articles = await this.articlesRepository.find({
                    where: { ID: In(articlesIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Most Popular') {
                articles = await this.articlesRepository.find({
                    where: { ID: In(articlesIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Best Rating') {
                articles = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('articles.*') // Select all columns from articles
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                    .leftJoin('objectRating.articles', 'articles')
                    .leftJoin('articles.ratings', 'ratings')
                    .where('articles.ID IS NOT NULL') // Exclude records where article ID is null
                    .andWhere('articles.ID IN (:...articleIds)', { articleIds: articlesIDs }) // Filter by article IDs
                    .groupBy('articles.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                // Assuming articles is an array of objects
                articles.forEach((article: any) => {
                    article.avg_rating = parseFloat(article.avg_rating);
                });
                return articles;
            } else {
                articles = await this.articlesRepository.find({
                    where: { ID: In(articlesIDs) },
                    relations: ['ratings']
                });
            }

            // Calculate average rating for each article
            const articlesWithAvgRating = articles.map(article => {
                if (article.ratings && article.ratings.length > 0) {
                    const totalRating = article.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / article.ratings.length;
                    return {
                        ...article,
                        avg_rating: avgRating
                    };
                } else {
                    return {
                        ...article,
                        avg_rating: 0 // Default average rating if no ratings
                    };
                }
            });
            return articlesWithAvgRating;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException without logging
            } else {
                console.error('Error getting articles by characteristic:', error);
                throw new Error('Error getting articles by characteristic');
            }
        }
    }

    async getCalculators(order_by?: string) {
        if (await this.calculatorsRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No calculators found',
            };
        }
        
        let calculators: any;
        if (order_by === 'Most Recent') {
            calculators = await this.calculatorsRepository.find({
                order: {
                    created_at: 'DESC',
                },
                relations: ['ratings']
            });
        } else if (order_by === 'Most Popular') {
            calculators = await this.calculatorsRepository.find({
                order: {
                    views: 'DESC',
                },
                relations: ['ratings']
            });
        } else if (order_by === 'Best Rating') {
            calculators = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('calculators.*') // Select all columns from articles
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                .leftJoin('objectRating.calculators', 'calculators')
                .leftJoin('calculators.ratings', 'ratings')
                .where('calculators.ID IS NOT NULL') // Exclude records where article ID is null
                .groupBy('calculators.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            // Assuming articles is an array of objects
            calculators.forEach((calculator: any) => {
                calculator.avg_rating = parseFloat(calculator.avg_rating);
            });
            return calculators;
        } else {
            calculators = await this.calculatorsRepository.find({relations: ['ratings']});
        }

        // Calculate average rating for each article
        const calculatorsWithAvgRating = calculators.map(calculator => {
            if (calculator.ratings && calculator.ratings.length > 0) {
                const totalRating = calculator.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / calculator.ratings.length;
                return {
                    ...calculator,
                    avg_rating: avgRating
                };
            } else {
                return {
                    ...calculator,
                    avg_rating: 0 // Default average rating if no ratings
                };
            }
        });
        return calculatorsWithAvgRating;
    }


    async getCalculatorsByCharacteristic(characteristic: string, optionSelected?: string, order_by?: string) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
            }
            let associations: any[];
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['calculators'],
                });
            } else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['calculators'],
                });
            }
        
            if (associations.length === 0) {
                console.log('No calculators found for the given characteristic.');
                return []; // Return an empty array if no calculators are found
            }
        
            // Check if all associations have no calculators
            if (associations.every(association => association.calculators.length === 0)) {
                console.log('No calculators found for the given characteristic.');
                return []; // Return an empty array if no calculators are found
            }
        
            // Filter associations with non-empty calculators arrays and get calculator IDs
            const calculatorsIDs = associations
            .filter(association => association.calculators.length > 0)
            .map(association => association.calculators[0].ID);
    
            // Check if there are no calculators found
            if (calculatorsIDs.length === 0) {
            console.log('No calculators found for the given characteristic.');
            return []; // Return an empty array if no calculators are found
            }

            let calculators: any;

            if (order_by === 'Most Recent') {
                calculators = await this.calculatorsRepository.find({
                    where: { ID: In(calculatorsIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Most Popular') {
                calculators = await this.calculatorsRepository.find({
                    where: { ID: In(calculatorsIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Best Rating') {
                calculators = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('calculators.*') // Select all columns from calculators
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                    .leftJoin('objectRating.calculators', 'calculators')
                    .leftJoin('calculators.ratings', 'ratings')
                    .where('calculators.ID IS NOT NULL') // Exclude records where calculator ID is null
                    .andWhere('calculators.ID IN (:...calculatorIds)', { calculatorIds: calculatorsIDs }) // Filter by calculator IDs
                    .groupBy('calculators.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                // Assuming articles is an array of objects
                calculators.forEach((calculator: any) => {
                    calculator.avg_rating = parseFloat(calculator.avg_rating);
                });
                return calculators;
            } else {
                calculators = await this.calculatorsRepository.find({ where: { ID: In(calculatorsIDs) }, relations: ['ratings']}); 
            }

        // Calculate average rating for each article
        const calculatorsWithAvgRating = calculators.map(calculator => {
            if (calculator.ratings && calculator.ratings.length > 0) {
                const totalRating = calculator.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / calculator.ratings.length;
                return {
                    ...calculator,
                    avg_rating: avgRating
                };
            } else {
                return {
                    ...calculator,
                    avg_rating: 0 // Default average rating if no ratings
                };
            }
        });
        return calculatorsWithAvgRating;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException without logging
            } else {
                console.error('Error getting calculators by characteristic:', error);
                throw new Error('Error getting calculators by characteristic');
            }
        }
    }

    async getCarousels(order_by?: string) {
        if (await this.carouselsRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No carousels found',
            };
        }

        let carousels: any;

        if (order_by === 'Most Recent') {
            carousels = await this.carouselsRepository.find({
                relations: ['items', 'ratings'],
                order: {
                    created_at: 'DESC',
                },
            });
        } else if (order_by === 'Most Popular') {
            carousels = await this.carouselsRepository.find({
                relations: ['items', 'ratings'],
                order: {
                    views: 'DESC',
                },
            });
        } else if (order_by === 'Best Rating') {
            carousels = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('carousels.*') // Select all columns from articles
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                .leftJoin('objectRating.carousels', 'carousels')
                .leftJoin('carousels.ratings', 'ratings')
                .leftJoin('carousels.items', 'items')
                .where('carousels.ID IS NOT NULL') // Exclude records where article ID is null
                .groupBy('carousels.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            // Assuming articles is an array of objects
            carousels.forEach((carousel: any) => {
                carousel.avg_rating = parseFloat(carousel.avg_rating);
            });
            return carousels;
        } else {
            carousels = await this.carouselsRepository.find({relations: ['items', 'ratings']});
        }
        // Calculate average rating for each article
        const carouselsWithAvgRating = carousels.map(carousel => {
            if (carousel.ratings && carousel.ratings.length > 0) {
                const totalRating = carousel.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / carousel.ratings.length;
                return {
                    ...carousel,
                    avg_rating: avgRating
                };
            } else {
                return {
                    ...carousel,
                    avg_rating: 0 // Default average rating if no ratings
                };
            }
        });
        return carouselsWithAvgRating;

    }

    async getCarouselsByCharacteristic(characteristic: string, optionSelected?: string, order_by?: string) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
            }
        
            let associations: any[];
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['carousels'],
                });
            } else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['carousels'],
                });
            }
        
            if (associations.length === 0) {
                console.log('No carousels found for the given characteristic.');
                return []; // Return an empty array if no carousels are found
            }
    
            // Check if all associations have no carousels
            if (associations.every(association => association.carousels.length === 0)) {
                console.log('No carousels found for the given characteristic.');
                return []; // Return an empty array if no carousels are found
            }
        
            // Filter associations with non-empty carousels arrays and get carousel IDs
            const carouselIDs = associations
            .filter(association => association.carousels.length > 0)
            .map(association => association.carousels[0].ID);
    
            // Check if there are no carousels found
            if (carouselIDs.length === 0) {
            console.log('No carousels found for the given characteristic.');
            return []; // Return an empty array if no carousels are found
            }
    
            let carousels: any;
            if (order_by === 'Most Recent') {
                carousels = await this.carouselsRepository.find({
                    where: { ID: In(carouselIDs) },
                    relations: ['items', 'ratings'],
                    order: {
                        created_at: 'DESC',
                    },
                });
            } else if (order_by === 'Most Popular') {
                carousels = await this.carouselsRepository.find({
                    where: { ID: In(carouselIDs) },
                    relations: ['items', 'ratings'],
                    order: {
                        views: 'DESC',
                    },
                });
            } else if (order_by === 'Best Rating') {
                carousels = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('carousels.*') // Select all columns from carousels
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                    .leftJoin('objectRating.carousels', 'carousels')
                    .leftJoin('carousels.ratings', 'ratings')
                    .leftJoin('carousels.items', 'items')
                    .where('carousels.ID IS NOT NULL') // Exclude records where carousel ID is null
                    .andWhere('carousels.ID IN (:...carouselIds)', { carouselIds: carouselIDs }) // Filter by carousel IDs
                    .groupBy('carousels.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                // Assuming articles is an array of objects
                carousels.forEach((carousel: any) => {
                    carousel.avg_rating = parseFloat(carousel.avg_rating);
                });
                return carousels;
            } else {
                carousels = await this.carouselsRepository.find({relations: ['items', 'ratings'], where: { ID: In(carouselIDs)}});
            }
            // Calculate average rating for each article
            const carouselsWithAvgRating = carousels.map(carousel => {
                if (carousel.ratings && carousel.ratings.length > 0) {
                    const totalRating = carousel.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / carousel.ratings.length;
                    return {
                        ...carousel,
                        avg_rating: avgRating
                    };
                } else {
                    return {
                        ...carousel,
                        avg_rating: 0 // Default average rating if no ratings
                    };
                }
            });
            return carouselsWithAvgRating;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException without logging
            } else {
                console.error('Error getting carousels by characteristic:', error);
                throw new Error('Error getting carousels by characteristic');
            }
        }
    }

    async getMealCards(order_by?: string) {
        if (await this.mealCardsRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No meal cards found',
            };
        }

        let mealCards: any;
        if (order_by === 'Most Recent') {
            mealCards = await this.mealCardsRepository.find({
                order: {
                    created_at: 'DESC',
                },
                relations: ['ratings']
            });
        } else if (order_by === 'Most Popular') {
            mealCards = await this.mealCardsRepository.find({
                order: {
                    views: 'DESC',
                },
                relations: ['ratings']
            });
        } else if (order_by === 'Best Rating') {
            mealCards = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                .select('mealCards.*') // Select all columns from articles
                .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                .leftJoin('objectRating.mealCards', 'mealCards')
                .leftJoin('mealCards.ratings', 'ratings')
                .where('mealCards.ID IS NOT NULL') // Exclude records where article ID is null
                .groupBy('mealCards.ID')
                .orderBy('avg_rating', 'DESC')
                .getRawMany();
            // Assuming articles is an array of objects
            mealCards.forEach((mealCard: any) => {
                mealCard.avg_rating = parseFloat(mealCard.avg_rating);
            });
            return mealCards;
        } else {
            mealCards = await this.mealCardsRepository.find({relations: ['ratings']});
        }

        // Calculate average rating for each article
        const mealCardsWithAvgRating = mealCards.map(mealCard => {
            if (mealCard.ratings && mealCard.ratings.length > 0) {
                const totalRating = mealCard.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avgRating = totalRating / mealCard.ratings.length;
                return {
                    ...mealCard,
                    avg_rating: avgRating
                };
            } else {
                return {
                    ...mealCard,
                    avg_rating: 0 // Default average rating if no ratings
                };
            }
        });
        return mealCardsWithAvgRating;
    }

    async getMealCardsByCharacteristic(characteristic: string, optionSelected?: string, order_by?: string) {
        try {
            const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
            if (!characteristicEntity) {
                throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
            }
        
            let associations: any[];
            if (optionSelected) {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                        option_selected: optionSelected,
                    },
                    relations: ['mealCards'],
                });
            } else {
                associations = await this.objectCharacteristicsAssociationRepository.find({
                    where: {
                        characteristics: characteristicEntity,
                    },
                    relations: ['mealCards'],
                });
            }
        
            if (associations.length === 0) {
                console.log('No meal cards found for the given characteristic.');
                return []; // Return an empty array if no meal cards are found
            }
    
            // Check if all associations have no meal cards
            if (associations.every(association => association.mealCards.length === 0)) {
                console.log('No meal cards found for the given characteristic.');
                return []; // Return an empty array if no meal cards are found
            }
        
            // Filter associations with non-empty meal cards arrays and get meal card IDs
            const mealCardsIDs = associations
            .filter(association => association.mealCards.length > 0)
            .map(association => association.mealCards[0].ID);
    
            // Check if there are no meal cards found
            if (mealCardsIDs.length === 0) {
            console.log('No meal cards found for the given characteristic.');
            return []; // Return an empty array if no meal cards are found
            }

            let mealCards: any;
            if (order_by === 'Most Recent') {
                mealCards = await this.mealCardsRepository.find({
                    where: { ID: In(mealCardsIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Most Popular') {
                mealCards = await this.mealCardsRepository.find({
                    where: { ID: In(mealCardsIDs) },
                    order: {
                        views: 'DESC',
                    },
                    relations: ['ratings']
                });
            } else if (order_by === 'Best Rating') {
                mealCards = await this.objectRatingsRepository.createQueryBuilder('objectRating')
                    .select('mealCards.*') // Select all columns from mealCards
                    .addSelect('ROUND(AVG(ratings.rating), 2)', 'avg_rating') // Calculate average rating and round it to two decimal places
                    .leftJoin('objectRating.mealCards', 'mealCards')
                    .leftJoin('mealCards.ratings', 'ratings')
                    .where('mealCards.ID IS NOT NULL') // Exclude records where mealCard ID is null
                    .andWhere('mealCards.ID IN (:...mealCardIds)', { mealCardIds: mealCardsIDs }) // Filter by mealCard IDs
                    .groupBy('mealCards.ID')
                    .orderBy('avg_rating', 'DESC')
                    .getRawMany();
                // Assuming articles is an array of objects
                mealCards.forEach((mealCard: any) => {
                    mealCard.avg_rating = parseFloat(mealCard.avg_rating);
                });
                return mealCards;
            } else {
                mealCards = await this.mealCardsRepository.find({relations: ['ratings'], where: { ID: In(mealCardsIDs) }});
            }
    
            // Calculate average rating for each article
            const mealCardsWithAvgRating = mealCards.map(mealCard => {
                if (mealCard.ratings && mealCard.ratings.length > 0) {
                    const totalRating = mealCard.ratings.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = totalRating / mealCard.ratings.length;
                    return {
                        ...mealCard,
                        avg_rating: avgRating
                    };
                } else {
                    return {
                        ...mealCard,
                        avg_rating: 0 // Default average rating if no ratings
                    };
                }
            });
            return mealCardsWithAvgRating;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException without logging
            }
            console.error('Error getting meal cards by characteristic:', error);
            throw new Error('Error getting meal cards by characteristic');
        }
    }

    async getObject(params: GetObjectByIDdto): Promise<any> {
        switch (params.objectType) {
            case 'article':
                const article = await this.articlesRepository.findOne({
                    where: {ID: params.id},
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                })
                
                if (!article) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Article not found',
                    };
                }
                return article;
            case 'calculator':
                const calculator = await this.calculatorsRepository.findOne({
                    where: {ID: params.id},
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                })
                if (!calculator) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Calculator not found',
                    };
                }
                return calculator;
            case 'carousel':
                const carousel = await this.carouselsRepository.findOne({
                    where: {ID: params.id},
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics', 'items'],
                })
                if (!carousel) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Carousel not found',
                    };
                }
                return carousel;
            case 'mealCard':
                const mealCard = await this.mealCardsRepository.findOne({
                    where: {ID: params.id},
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                })
                if (!mealCard) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Meal Card not found',
                    };
                }
                return mealCard;
            default:
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Object type not found',
                };
        }
        
    }

    async createObject(objectType: string, objectData: any, images: Array<Express.Multer.File>): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.createArticle(objectData, images[0]); // Assuming only one image is allowed for article
                case 'calculator':
                    return await this.createCalculator(objectData, images[0]); // Assuming only one image is allowed for calculator
                case 'carousel':
                    return await this.createCarousel(objectData, images[0]); // Handle creating carousel with multiple items
                // Add more cases for other object types as needed
                case 'mealCard':
                    return await this.createMealCard(objectData);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error creating object');
            } else {
                throw error;
            }
        }
    }

    async createArticle(articleData: CreateArticleDTO, image: Express.Multer.File): Promise<any> {
        try {

            const existingArticle = await this.articlesRepository.findOne({
                where: {title: articleData.title},
            });
            if (existingArticle) {
                const errorMessage = 'Article with that title already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }
            // Save the image buffer to a temporary file
            const tempFilePath = './file.png'; // Provide the path to a temporary file
            fs.writeFileSync(tempFilePath, image.buffer);
    
            // Upload the temporary file to Cloudinary
            const result = await cloudinary.uploader.upload(tempFilePath, {
                folder: 'articles', // Optional: specify a folder in Cloudinary
            });
    

            // Create article entity with Cloudinary image URL
            const article = this.articlesRepository.create({
                title: articleData.title,
                subtitle: articleData.subtitle,
                description: articleData.description,
                time_of_day_relevance: articleData.time_of_day_relevance,
                season_relevance: articleData.season_relevance,
                image: result.secure_url, // Use the Cloudinary image URL
            });
    
            // Save the article to the database
            await this.articlesRepository.save(article);
    
            // Delete the temporary file
            fs.unlinkSync(tempFilePath);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Article created',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error creating article');
            } else {
                throw error;
            }
        }
    }

    async createCalculator(calculatorData: any, image: Express.Multer.File): Promise<any> {
        try {
            const existingCalculator = await this.calculatorsRepository.findOne({
                where: {title: calculatorData.title},
            });
            if (existingCalculator) {
                const errorMessage = 'Calculator with that title already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }
            if(image) {
                // Save the image buffer to a temporary file
                const tempFilePath = './file.png'; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, image.buffer);
        
                // Upload the temporary file to Cloudinary
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'calculators', // Optional: specify a folder in Cloudinary
                });
        
                // Create calculator entity with Cloudinary image URL
                const calculator = this.calculatorsRepository.create({
                    title: calculatorData.title,
                    subtitle: calculatorData.subtitle,
                    description: calculatorData.description,
                    variable_to_calculate: calculatorData.variable_to_calculate,
                    equation: calculatorData.equation,
                    time_of_day_relevance: calculatorData.time_of_day_relevance,
                    season_relevance: calculatorData.season_relevance,
                    image: result.secure_url, // Use the Cloudinary image URL
                });
        
                // Save the calculator to the database
                await this.calculatorsRepository.save(calculator);
        
                // Delete the temporary file
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
        
                // Save the calculator to the database
                await this.calculatorsRepository.save(calculator);
            }
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error creating calculator');
            } else {
                throw error;
            }
        }
    }

    async createCarousel( carouselData: any, image: Express.Multer.File): Promise<any> {
        try {

            console.log('Carousel Data:', carouselData);
            //If carousel with that title and item with the item title exists, throw an error
            const existingCarousel = await this.carouselsRepository.findOne({
                where: {title: carouselData.title},
            });
            let existingItem: any;
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
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            } else if (existingCarousel) {

                // Save the image buffer to a temporary file
                const tempFilePath = './file.png'; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, image.buffer);
        
                // Upload the temporary file to Cloudinary
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'carousels', // Optional: specify a folder in Cloudinary
                });
        
                // Create carousel item entity
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

                // Save the carousel item to the database
                await this.carouselItemRepository.save(item);

                return {
                    status: HttpStatus.CREATED,
                    message: 'Carousel item created',
                };
            } else {
                // Create carousel entity
                const carousel = this.carouselsRepository.create({
                    title: carouselData.title,
                    time_of_day_relevance: carouselData.time_of_day_relevance,
                    season_relevance: carouselData.season_relevance,
                });

                // Save the new carousel to the database
                await this.carouselsRepository.save(carousel);

                console.log('Carousel:', carousel);
                console.log('image:', image);

                // Save the image buffer to a temporary file
                const tempFilePath = './file.png'; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, image.buffer);
        
                // Upload the temporary file to Cloudinary
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'carousels', // Optional: specify a folder in Cloudinary
                });

                // Create carousel item entity
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

                // Save the carousel item to the database
                await this.carouselItemRepository.save(item);

                return {
                    status: HttpStatus.CREATED,
                    message: 'Carousel item created',
                };
            }

        } catch (error) {
            throw error;
        }
    }

    async createMealCard(mealCardData: any): Promise<any> {
        try {
            const existingMealCard = await this.mealCardsRepository.findOne({
                where: {title: mealCardData.title},
            });
            if (existingMealCard) {
                const errorMessage = 'Meal Card with that title already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }
            // Create meal card entity
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
    
            // Save the meal card to the database
            await this.mealCardsRepository.save(mealCard);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Meal Card created',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error creating meal card');
            } else {
                throw error;
            }
        }
    }

    async updateObject(objectType: string, id: number, objectData: any, images: Array<Express.Multer.File>): Promise<any> {
        try {  
            switch(objectType) {
                case 'article':
                    return await this.updateArticle(id, objectData, images[0]);
                case 'calculator':
                    return await this.updateCalculator(id, objectData, images[0]);
                case 'carousel':
                    return await this.updateCarousel(id, objectData, images[0]);
                case 'mealCard':
                    return await this.updateMealCard(id, objectData);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating object');
            } else {
                throw error;
            }
        }
    }

    async updateArticle(id: number, articleData: UpdateArticleDTO, image: Express.Multer.File): Promise<any> {
        try {
            const article = await this.articlesRepository.findOne(
                {where: {ID: id}}
            );
            if (!article) {
                throw new NotFoundException('Article not found');
            }
    
            // If image is provided, update the image
            if (image) {
                // Save the new image buffer to a temporary file
                const tempFilePath = './file.png'; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, image.buffer);
    
                // Upload the temporary file to Cloudinary
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'articles', // Optional: specify a folder in Cloudinary
                });
    
                // Update article with new Cloudinary image URL
                article.image = result.secure_url;
    
                // Delete the temporary file
                fs.unlinkSync(tempFilePath);
            }
    
            // Update other fields if provided
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
    
            // Save the updated article to the database
            await this.articlesRepository.save(article);
    
            return {
                status: HttpStatus.OK,
                message: 'Article updated',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating article');
            } else {
                throw error;
            }
        }
    }

    async updateCalculator(id: number, calculatorData: any, image: Express.Multer.File): Promise<any> {
        try {
            const calculator = await this.calculatorsRepository.findOne(
                {where: {ID: id}}
            );
            if (!calculator) {
                throw new NotFoundException('Calculator not found');
            }
    
            // If image is provided, update the image
            if (image) {
                // Save the new image buffer to a temporary file
                const tempFilePath = './file.png'; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, image.buffer);
    
                // Upload the temporary file to Cloudinary
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'calculators', // Optional: specify a folder in Cloudinary
                });
    
                // Update calculator with new Cloudinary image URL
                calculator.image = result.secure_url;
    
                // Delete the temporary file
                fs.unlinkSync(tempFilePath);
            }
    
            // Update other fields if provided
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
    
            // Save the updated calculator to the database
            await this.calculatorsRepository.save(calculator);
    
            return {
                status: HttpStatus.OK,
                message: 'Calculator updated',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating calculator');
            } else {
                throw error;
            }
        }
    }

    async updateCarousel(carouselId: number, carouselData: any, image?: Express.Multer.File): Promise<any> {
        try {
            // Find the existing carousel in the carousel repository
            const existingCarousel = await this.carouselsRepository.findOne(
                {where: {ID: carouselId}},
            );
            if (!existingCarousel) {
                throw new NotFoundException('Carousel not found');
            }
            // Update time of day relevance if provided
            if (carouselData.time_of_day_relevance) {
                existingCarousel.time_of_day_relevance = carouselData.time_of_day_relevance;
            }
            // Update season relevance if provided
            if (carouselData.season_relevance) {
                existingCarousel.season_relevance = carouselData.season_relevance;
            }
            // Save the updated carousel to the database
            await this.carouselsRepository.save(existingCarousel);

            // Find the existing carousel item in the carousel item repository
            const existingItem = await this.carouselItemRepository.findOne(
                {where: {ID: carouselData.itemID}, relations: ['carousel']},
            );
    
            if (!existingItem && image) {
                 this.createCarousel(carouselData, image);
            }
    
            if (existingItem) {
                // Update the existing carousel item with the new data
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
                // Save the updated carousel item to the database
                await this.carouselItemRepository.save(existingItem);
            }
    
            return {
                status: HttpStatus.OK,
                message: 'Carousel item updated',
            };
        } catch (error) {
            throw error;
        }
    }

    async updateMealCard(id: number, mealCardData: any): Promise<any> {
        try {
            const mealCard = await this.mealCardsRepository.findOne(
                {where: {ID: id}}
            );
            if (!mealCard) {
                throw new NotFoundException('Meal Card not found');
            }
    
            // Update meal card fields if provided
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
    
            // Save the updated meal card to the database
            await this.mealCardsRepository.save(mealCard);
    
            return {
                status: HttpStatus.OK,
                message: 'Meal Card updated',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating meal card');
            } else {
                throw error;
            }
        }
    }

    async deleteObject(objectType: string, id: number, carouselItemID?: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.deleteArticle(id);
                case 'calculator':
                    return await this.deleteCalculator(id);
                case 'carousel':
                    return await this.deleteCarousel(id, carouselItemID);
                case 'mealCard':
                    return await this.deleteMealCard(id);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting object');
            } else {
                throw error;
            }
        }
    }

    async deleteArticle(id: number): Promise<any> {
        try {
            const article = await this.articlesRepository.findOne(
                {
                    where: {ID: id},
                    relations: ['objectCharacteristicsAssociations'],
                },
            );
            if (!article) {
                throw new NotFoundException('Article not found');
            }

            // Delete associations
            await this.objectCharacteristicsAssociationRepository.remove(article.objectCharacteristicsAssociations);

            const articleToDelete = await this.articlesRepository.findOne(
                {where: {ID: id}}
            );
            if (!articleToDelete) {
                throw new NotFoundException('Article not found');
            }
            await this.articlesRepository.delete(articleToDelete);
    
            return {
                status: HttpStatus.OK,
                message: 'Article deleted',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting article');
            } else {
                throw error;
            }
        }
    }

    async deleteCalculator(id: number): Promise<any> {
        try {
            const calculator = await this.calculatorsRepository.findOne(
                {
                    where: {ID: id},
                    relations: ['objectCharacteristicsAssociations'],
                },
            );
            if (!calculator) {
                throw new NotFoundException('Calculator not found');
            }

            // Delete associations
            await this.objectCharacteristicsAssociationRepository.remove(calculator.objectCharacteristicsAssociations);

            const calculatorToDelete = await this.calculatorsRepository.findOne(
                {where: {ID: id}}
            );
            if (!calculatorToDelete) {
                throw new NotFoundException('Calculator not found');
            }
            await this.calculatorsRepository.delete(calculatorToDelete);
    
            return {
                status: HttpStatus.OK,
                message: 'Calculator deleted',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting calculator');
            } else {
                throw error;
            }
        }
    }

    async deleteCarousel(id: number, carouselItemID: number): Promise<any> {
        try {
            // if carouselItemID is provided, delete the carousel item
            if (carouselItemID) {
                console.log('Carousel Item ID:', carouselItemID);
                const carouselItem = await this.carouselItemRepository.findOne(
                    {where: {ID: carouselItemID}}
                );
                console.log('Carousel Item:', carouselItem);
                if (!carouselItem) {
                    throw new NotFoundException('Carousel item not found');
                }
                await this.carouselItemRepository.delete(carouselItemID);
                return {
                    status: HttpStatus.OK,
                    message: 'Carousel item deleted',
                };
            } else {

                const carousel = await this.carouselsRepository.findOne(
                    {
                        where: {ID: id},
                        relations: ['objectCharacteristicsAssociations', 'items'],
                    },
                );
                if (!carousel) {
                    throw new NotFoundException('carousel not found');
                }

                // Delete associations
                await this.objectCharacteristicsAssociationRepository.remove(carousel.objectCharacteristicsAssociations);
                

                //Delete all items in the carousel
                for (const item of carousel.items) {
                    await this.carouselItemRepository.delete(item.ID);
                }

                //Delete the carousel
                const carouselToDelete = await this.carouselsRepository.findOne(
                    {where: {ID: id}}
                );
                if (!carouselToDelete) {
                    throw new NotFoundException('Carousel not found');
                }
                await this.carouselsRepository.delete(carouselToDelete);
        
                return {
                    status: HttpStatus.OK,
                    message: 'Carousel deleted',
                };
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting carousel');
            } else {
                throw error;
            }
        }
    }

    async deleteMealCard(id: number): Promise<any> {
        try {
            const mealCard = await this.mealCardsRepository.findOne(
                {where: {ID: id}, relations: ['objectCharacteristicsAssociations']}
            );
            if (!mealCard) {
                throw new NotFoundException('Meal Card not found');
            }

            // Delete associations
            await this.objectCharacteristicsAssociationRepository.remove(mealCard.objectCharacteristicsAssociations);

            const mealCardToDelete = await this.mealCardsRepository.findOne(
                {where: {ID: id}}
            );
            if (!mealCardToDelete) {
                throw new NotFoundException('MealCard not found');
            }
            await this.mealCardsRepository.delete(mealCardToDelete);
    
            return {
                status: HttpStatus.OK,
                message: 'Meal Card deleted',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting meal card');
            } else {
                throw error;
            }
        }
    }
        
    //Get all characteristics and its selected options depending on the object type
    async getCharacteristics(objectType: string): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.getArticleCharacteristics();
                case 'calculator':
                    return await this.getCalculatorCharacteristics();
                case 'carousel':
                    return await this.getCarouselCharacteristics();
                case 'mealCard':
                    return await this.getMealCardCharacteristics();
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting characteristics');
            } else {
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

    async associateObject(params: AssociateObjectDTO, associations: AssociationItemDTO[]): Promise<any> {
        try {
            switch (params.objectType) {
                case 'article':
                    const article = await this.articlesRepository.findOne({ where: { title: params.title } });
                    if (!article) {
                        throw new HttpException('Article with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
                   
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                                continue; // Skip if association already exists
                            }
                            
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                articles: [article],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
    
                    // Return a success message if all associations are created successfully
                    return {
                        status: HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                case "calculator":
                    const calculator = await this.calculatorsRepository.findOne({ where: { title: params.title } });
                    if (!calculator) {
                        throw new HttpException('Calculator with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
                   
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                                continue; // Skip if association already exists
                            }
                            
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                calculators: [calculator],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    // Return a success message if all associations are created successfully
                    return {
                        status: HttpStatus.CREATED,
                        message: 'All associations created',
                    };

                case "carousel":
                    const carousel = await this.carouselsRepository.findOne({ where: { title: params.title } });
                    if (!carousel) {
                        throw new HttpException('Carousel with that title does not exist.', HttpStatus.NOT_FOUND);
                    }

                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                                continue; // Skip if association already exists
                            }
                            
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                carousels: [carousel],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    // Return a success message if all associations are created successfully
                    return {
                        status: HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                case "mealCard":
                    const mealCard = await this.mealCardsRepository.findOne({ where: { title: params.title } });
                    if (!mealCard) {
                        throw new HttpException('Meal Card with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
                   
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                                continue; // Skip if association already exists
                            }
                            
                            const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                                option_selected: optionName,
                                characteristics: [characteristic],
                                mealCards: [mealCard],
                            });
                            await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                        }
                    }
                    // Return a success message if all associations are created successfully
                    return {
                        status: HttpStatus.CREATED,
                        message: 'All associations created',
                    };
                default:
                    throw new HttpException('Object type not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error associating object');
            } else {
                throw error;
            }
        }
    }

    async updateAssociations(params: UpdateAssociationDTO, associations: AssociationItemDTO[]): Promise<any> {
        try {
            let associationsToDelete = [];
            switch (params.objectType){
                case 'article':
                    const article = await this.articlesRepository.findOne({ where: { title: params.title } });
                    if (!article) {
                        throw new HttpException('Article with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
    
                    // Find the existing associations for the specified article
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { articles: article },
                    });

                    // Delete the existing associations
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully")
    
                    // Create new associations based on the provided associations
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                        status: HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                case 'calculator':
                    const calculator = await this.calculatorsRepository.findOne({ where: { title: params.title } });
                    if (!calculator) {
                        throw new HttpException('Calculator with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
    
                    // Find the existing associations for the specified calculator
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { calculators: calculator },
                    });

                    // Delete the existing associations
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully")
    
                    // Create new associations based on the provided associations
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                        status: HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                
                case 'carousel':
                    const carousel = await this.carouselsRepository.findOne({ where: { title: params.title } });
                    if (!carousel) {
                        throw new HttpException('Carousel with that title does not exist.', HttpStatus.NOT_FOUND);
                    }

                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { carousels: carousel },
                    });

                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully")

                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                        status: HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                case 'mealCard':
                    const mealCard = await this.mealCardsRepository.findOne({ where: { title: params.title } });
                    if (!mealCard) {
                        throw new HttpException('Meal Card with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
    
                    // Find the existing associations for the specified meal card
                    associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
                        where: { mealCards: mealCard },
                    });

                    // Delete the existing associations
                    await this.objectCharacteristicsAssociationRepository.remove(associationsToDelete);
                    console.log("existing associations deleted successfully")
    
                    // Create new associations based on the provided associations
                    for (const association of associations) {
                        const characteristic = await this.characteristicRepository.findOne({ where: { name: association.characteristic } });
                        if (!characteristic) {
                            throw new HttpException(`Characteristic "${association.characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
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
                        status: HttpStatus.OK,
                        message: 'Associations updated successfully',
                    };
                default:
                    throw new HttpException('Object type not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating associations');
            } else {
                throw error;
            }
        }
    }

    async incrementViews(objectType: string, id: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.incrementArticleViews(id);
                case 'calculator':
                    return await this.incrementCalculatorViews(id);
                case 'carousel':
                    return await this.incrementCarouselViews(id);
                case 'mealCard':
                    return await this.incrementMealCardViews(id);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error incrementing views');
            } else {
                throw error;
            }
        }
    }

    async incrementArticleViews(id: number): Promise<any> {
        try {
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }
    
            article.views += 1;
            await this.articlesRepository.save(article);
    
            return {
                status: HttpStatus.OK,
                message: 'Article views incremented',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error incrementing article views');
            } else {
                throw error;
            }
        }
    }

    async incrementCalculatorViews(id: number): Promise<any> {
        try {
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }
    
            calculator.views += 1;
            await this.calculatorsRepository.save(calculator);
    
            return {
                status: HttpStatus.OK,
                message: 'Calculator views incremented',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error incrementing calculator views');
            } else {
                throw error;
            }
        }
    }

    async incrementCarouselViews(id: number): Promise<any> {
        try {
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }
    
            carousel.views += 1;
            await this.carouselsRepository.save(carousel);
    
            return {
                status: HttpStatus.OK,
                message: 'Carousel views incremented',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error incrementing carousel views');
            } else {
                throw error;
            }
        }
    }

    async incrementMealCardViews(id: number): Promise<any> {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }
    
            mealCard.views += 1;
            await this.mealCardsRepository.save(mealCard);
    
            return {
                status: HttpStatus.OK,
                message: 'Meal Card views incremented',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error incrementing meal card views');
            } else {
                throw error;
            }
        }
    }

    //Get the average rating of an object given the object type and id
    async getRatings(objectType: string, id: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.getArticleAverageRating(id);
                case 'calculator':
                    return await this.getCalculatorAverageRating(id);
                case 'carousel':
                    return await this.getCarouselAverageRating(id);
                case 'mealCard':
                    return await this.getMealCardAverageRating(id);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting average rating');
            } else {
                throw error;
            }
        }
    }

    async getArticleAverageRating(id: number): Promise<any> {
        try {
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }
    
            const ratings = await this.objectRatingsRepository.find({ where: { articles: article } });
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
    
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
    
            //Calculate Average Rating but one decimal place like 0.0 or 4.5 etc
            
            let averageRating: any;
                if (totalRating === 0) {
                    averageRating = '0.0';
                } else {
                    averageRating = (totalRating / ratings.length).toFixed(1);
                }

            
            // Calculate percentage for each star rating
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);

            // Return Average Rating, each star average percentage, and total number of ratings
            return {
                status: HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };
            
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting article average rating');
            } else {
                throw error;
            }
        }
    }

    async getCalculatorAverageRating(id: number): Promise<any> {
        try {
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }
    
            const ratings = await this.objectRatingsRepository.find({ where: { calculators: calculator } });
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
    
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
    
            let averageRating: any;

            if (totalRating === 0) {
                averageRating = '0.0';
            } else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }

            // Calculate percentage for each star rating
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);

            // Return Average Rating, each star average percentage, and total number of ratings
            return {
                status: HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting calculator average rating');
            } else {
                throw error;
            }
        }
    }

    async getCarouselAverageRating(id: number): Promise<any> {
        try {
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }
    
            const ratings = await this.objectRatingsRepository.find({ where: { carousels: carousel } });
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
    
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
    
            let averageRating: any;
            if (totalRating === 0) {
                averageRating = '0.0';
            }
            else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }

            // Calculate percentage for each star rating
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);

            // Return Average Rating, each star average percentage, and total number of ratings
            return {
                status: HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting carousel average rating');
            } else {
                throw error;
            }
        }
    }

    async getMealCardAverageRating(id: number): Promise<any> {
        try {
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }
    
            const ratings = await this.objectRatingsRepository.find({ where: { mealCards: mealCard } });
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
    
            let totalRating = 0;
            for (const rating of ratings) {
                totalRating += rating.rating;
            }
    
            let averageRating: any;
            if (totalRating === 0) {
                averageRating = '0.0';
            } else {
                averageRating = (totalRating / ratings.length).toFixed(1);
            }

            // Calculate percentage for each star rating
            const ratingsCount = ratings.length;
            const oneStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 1).length / ratingsCount * 100);
            const twoStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 2).length / ratingsCount * 100);
            const threeStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 3).length / ratingsCount * 100);
            const fourStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 4).length / ratingsCount * 100);
            const fiveStarPercentage = ratingsCount === 0 ? 0 : (ratings.filter(rating => rating.rating === 5).length / ratingsCount * 100);

            // Return Average Rating, each star average percentage, and total number of ratings
            return {
                status: HttpStatus.OK,
                averageRating: averageRating,
                ratingsCount: ratingsCount,
                oneStarPercentage: oneStarPercentage,
                twoStarPercentage: twoStarPercentage,
                threeStarPercentage: threeStarPercentage,
                fourStarPercentage: fourStarPercentage,
                fiveStarPercentage: fiveStarPercentage,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting meal card average rating');
            } else {
                throw error;
            }
        }
    }

    //Get ratings that a user has on an object, given the user email, object type and object id
    async getUserRatings(objectType: string, id: number, userEmail: string): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.getUserArticleRatings(userEmail, id);
                case 'calculator':
                    return await this.getUserCalculatorRatings(userEmail, id);
                case 'carousel':
                    return await this.getUserCarouselRatings(userEmail, id);
                case 'mealCard':
                    return await this.getUserMealCardRatings(userEmail, id);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting user ratings');
            } else {
                throw error;
            }
        }
    }

    async getUserArticleRatings(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }

            console.log ('Article:', article);
            console.log ('User:', user);
    
            // const ratings = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user }});
            const ratings = await this.objectRatingsRepository.findOne({ where: { articles: { ID: article.ID }, users: user }});
            
            console.log('Ratings:', ratings);
            //if no ratings found, return a 404 error
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
            return {
                status: HttpStatus.OK,
                ratings: ratings,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting user article ratings');
            } else {
                throw error;
            }
        }
    }

    async getUserCalculatorRatings(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }
    
            //const ratings = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            const ratings = await this.objectRatingsRepository.findOne({ where: { calculators: { ID: calculator.ID }, users: user } });
    
            //if no ratings found, return a 404 error
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
            return {
                status: HttpStatus.OK,
                ratings: ratings,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting user calculator ratings');
            } else {
                throw error;
            }
        }
    }

    async getUserCarouselRatings(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }
    
            // const ratings = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            const ratings = await this.objectRatingsRepository.findOne({ where: { carousels: { ID: carousel.ID }, users: user } });
            //if no ratings found, return a 404 error
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
            return {
                status: HttpStatus.OK,
                ratings: ratings,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting user carousel ratings');
            } else {
                throw error;
            }
        }
    }

    async getUserMealCardRatings(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }
    
            // const ratings = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            const ratings = await this.objectRatingsRepository.findOne({ where: { mealCards: { ID: mealCard.ID }, users: user } });
            //if no ratings found, return a 404 error
            if (!ratings) {
                throw new HttpException('Ratings not found', HttpStatus.NOT_FOUND);
            }
            return {
                status: HttpStatus.OK,
                ratings: ratings,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting user meal card ratings');
            } else {
                throw error;
            }
        }
    }

    //Post a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided
    async postRating(userEmail: string, objectType: string, id: number, rating: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.postArticleRating(userEmail, id, rating);
                case 'calculator':
                    return await this.postCalculatorRating(userEmail, id, rating);
                case 'carousel':
                    return await this.postCarouselRating(userEmail, id, rating);
                case 'mealCard':
                    return await this.postMealCardRating(userEmail, id, rating);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error posting rating');
            } else {
                throw error;
            }
        }
    }

    async postArticleRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }

            //Check if the user has already rated the article
            const existingRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user }, relations: ['articles', 'users']});
            console.log('Existing Rating:', existingRating);
            if (existingRating) {
                throw new HttpException('User has already rated this article', HttpStatus.BAD_REQUEST);
            }
    
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user], // Wrap user in an array as it's Many-to-Many
                articles: [article], // Wrap article in an array as it's Many-to-Many
            });
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error posting article rating');
            } else {
                throw error;
            }
        }
    }

    async postCalculatorRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }

            //Check if the user has already rated the calculator
            const existingRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (existingRating) {
                throw new HttpException('User has already rated this calculator', HttpStatus.BAD_REQUEST);
            }
    
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user], // Wrap user in an array as it's Many-to-Many
                calculators: [calculator], // Wrap calculator in an array as it's Many-to-Many
            });
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error posting calculator rating');
            } else {
                throw error;
            }
        }
    }

    async postCarouselRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }

            //Check if the user has already rated the carousel
            const existingRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (existingRating) {
                throw new HttpException('User has already rated this carousel', HttpStatus.BAD_REQUEST);
            }
    
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user], // Wrap user in an array as it's Many-to-Many
                carousels: [carousel], // Wrap carousel in an array as it's Many-to-Many
            });
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error posting carousel rating');
            } else {
                throw error;
            }
        }
    }

    async postMealCardRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }

            //Check if the user has already rated the meal card
            const existingRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (existingRating) {
                throw new HttpException('User has already rated this meal card', HttpStatus.BAD_REQUEST);
            }
    
            const objectRating = this.objectRatingsRepository.create({
                rating: rating.rating,
                users: [user], // Wrap user in an array as it's Many-to-Many
                mealCards: [mealCard], // Wrap mealCard in an array as it's Many-to-Many
            });
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.CREATED,
                message: 'Rating posted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error posting meal card rating');
            } else {
                throw error;
            }
        }
    }

    //Update a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided
    async updateRating(userEmail: string, objectType: string, id: number, rating: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.updateArticleRating(userEmail, id, rating);
                case 'calculator':
                    return await this.updateCalculatorRating(userEmail, id, rating);
                case 'carousel':
                    return await this.updateCarouselRating(userEmail, id, rating);
                case 'mealCard':
                    return await this.updateMealCardRating(userEmail, id, rating);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating rating');
            } else {
                throw error;
            }
        }
    }

    async updateArticleRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating article rating');
            } else {
                throw error;
            }
        }
    }

    async updateCalculatorRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating calculator rating');
            } else {
                throw error;
            }
        }
    }

    async updateCarouselRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating carousel rating');
            } else {
                throw error;
            }
        }
    }

    async updateMealCardRating(userEmail: string, id: number, rating: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            objectRating.rating = rating.rating;
            await this.objectRatingsRepository.save(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating meal card rating');
            } else {
                throw error;
            }
        }
    }

    //Delete a rating on an object, where the user email, object type and object id are provided
    async deleteRating(userEmail: string, objectType: string, id: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.deleteArticleRating(userEmail, id);
                case 'calculator':
                    return await this.deleteCalculatorRating(userEmail, id);
                case 'carousel':
                    return await this.deleteCarouselRating(userEmail, id);
                case 'mealCard':
                    return await this.deleteMealCardRating(userEmail, id);
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting rating');
            } else {
                throw error;
            }
        }
    }

    async deleteArticleRating(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const article = await this.articlesRepository.findOne({ where: { ID: id } });
            if (!article) {
                throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { articles: article, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            await this.objectRatingsRepository.remove(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting article rating');
            } else {
                throw error;
            }
        }
    }

    async deleteCalculatorRating(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const calculator = await this.calculatorsRepository.findOne({ where: { ID: id } });
            if (!calculator) {
                throw new HttpException('Calculator not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { calculators: calculator, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            await this.objectRatingsRepository.remove(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting calculator rating');
            } else {
                throw error;
            }
        }
    }
    async deleteCarouselRating(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const carousel = await this.carouselsRepository.findOne({ where: { ID: id } });
            if (!carousel) {
                throw new HttpException('Carousel not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { carousels: carousel, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            await this.objectRatingsRepository.remove(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting carousel rating');
            } else {
                throw error;
            }
        }
    }

    async deleteMealCardRating(userEmail: string, id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
    
            const mealCard = await this.mealCardsRepository.findOne({ where: { ID: id } });
            if (!mealCard) {
                throw new HttpException('Meal Card not found', HttpStatus.NOT_FOUND);
            }
    
            const objectRating = await this.objectRatingsRepository.findOne({ where: { mealCards: mealCard, users: user } });
            if (!objectRating) {
                throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
            }
    
            await this.objectRatingsRepository.remove(objectRating);
    
            return {
                status: HttpStatus.OK,
                message: 'Rating deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting meal card rating');
            } else {
                throw error;
            }
        }
    }

}

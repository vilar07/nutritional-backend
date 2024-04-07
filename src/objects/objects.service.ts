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
                let result;
    
                if (objectType) {
                    // Retrieve objects only for the specified type
                    result = await this.getObjects(objectType, category, option);
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
                                console.log("Ordered", objects[objectType])
                                break;
                            case 'Most Popular':
                                // Order by most popular logic
                                objects[objectType].sort((a, b) => b.views - a.views);
                                break;
                            // Add more cases for other ordering options if needed
                            default:
                                // Handle invalid order_by value
                                throw new BadRequestException('Invalid order_by value');
                                break;
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
                            return await this.getArticlesByCharacteristic(characteristic, order_by);
                        }
                        return await this.getArticles(order_by);
                    case 'calculators':
                        if (characteristic && optionSelected) {
                            return await this.getCalculatorsByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getCalculatorsByCharacteristic(characteristic, order_by);
                        }
                        return await this.getCalculators(order_by);
                    case 'carousels':
                        if (characteristic && optionSelected) {
                            return await this.getCarouselsByCharacteristic(characteristic, optionSelected, order_by);
                        } else if (characteristic) {
                            return await this.getCarouselsByCharacteristic(characteristic, order_by);
                        }
                        return await this.getCarousels(order_by);
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
        //console.log('Order by:', order_by);
        if (order_by === 'Most Recent') {
            const articles = await this.articlesRepository.find({
                order: {
                    created_at: 'DESC',
                },
            });
            console.log('Ordered articles:', articles);
            return articles;
        }
        else if (order_by === 'Most Popular') {
            const articles = await this.articlesRepository.find({
                order: {
                    views: 'DESC',
                },
            });
            console.log('Ordered articles:', articles);
            return articles;
        }
    
        const articles = await this.articlesRepository.find();
        console.log('Unordered articles:', articles);
        return articles;
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
    
            if (order_by === 'Most Recent') {
                const articles = await this.articlesRepository.find({
                    where: { ID: In(articlesIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                });
                return articles;
            } else if (order_by === 'Most Popular') {
                const articles = await this.articlesRepository.find({
                    where: { ID: In(articlesIDs) },
                    order: {
                        views: 'DESC',
                    },
                });
                return articles;
            }

            // Retrieve articles by IDs
            return this.articlesRepository.find({
            where: { ID: In(articlesIDs) },
            });
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

        if (order_by === 'Most Recent') {
            return this.calculatorsRepository.find({
                order: {
                    created_at: 'DESC',
                },
            });
        } else if (order_by === 'Most Popular') {
            return this.calculatorsRepository.find({
                order: {
                    views: 'DESC',
                },
            });
        }

        return this.calculatorsRepository.find();
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

            if (order_by === 'Most Recent') {
                return this.calculatorsRepository.find({
                    where: { ID: In(calculatorsIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                });
            } else if (order_by === 'Most Popular') {
                return this.calculatorsRepository.find({
                    where: { ID: In(calculatorsIDs) },
                    order: {
                        views: 'DESC',
                    },
                });
            }
    
            // Retrieve calculators by IDs
            return this.calculatorsRepository.find({
            where: { ID: In(calculatorsIDs) },
            });
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

        if (order_by === 'Most Recent') {
            return this.carouselsRepository.find({
                order: {
                    created_at: 'DESC',
                },
            });
        } else if (order_by === 'Most Popular') {
            return this.carouselsRepository.find({
                order: {
                    views: 'DESC',
                },
            });
        }

        return this.carouselsRepository.find();
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
    
            if (order_by === 'Most Recent') {
                return this.carouselsRepository.find({
                    where: { ID: In(carouselIDs) },
                    order: {
                        created_at: 'DESC',
                    },
                });
            } else if (order_by === 'Most Popular') {
                return this.carouselsRepository.find({
                    where: { ID: In(carouselIDs) },
                    order: {
                        views: 'DESC',
                    },
                });
            }

            // Retrieve carousels by IDs
            return this.carouselsRepository.find({
            where: { ID: In(carouselIDs) },
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException without logging
            } else {
                console.error('Error getting carousels by characteristic:', error);
                throw new Error('Error getting carousels by characteristic');
            }
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
                    relations: ['objectCharacteristicsAssociations', 'objectCharacteristicsAssociations.characteristics'],
                })
                if (!carousel) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'Carousel not found',
                    };
                }
                return carousel;
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
                    return await this.createCarousel(objectData, images); // Handle creating carousel with multiple images
                // Add more cases for other object types as needed
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

    async createCarousel(carouselData: any, images: Array<Express.Multer.File>): Promise<any> {
        try {
            const existingCarousel = await this.carouselsRepository.findOne({
                where: {title: carouselData.title},
            });
            if (existingCarousel) {
                const errorMessage = 'Carousel with that title already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }
            // Save the image buffer to a temporary file
            const tempFilePaths = [];
            for (let i = 0; i < images.length; i++) {
                const tempFilePath = `./file${i}.png`; // Provide the path to a temporary file
                fs.writeFileSync(tempFilePath, images[i].buffer);
                tempFilePaths.push(tempFilePath);
            }
    
            // Upload the temporary files to Cloudinary
            const results = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(tempFilePaths[i], {
                    folder: 'carousels', // Optional: specify a folder in Cloudinary
                });
                results.push(result.secure_url);
            }
    
            // Create carousel entity with Cloudinary image URLs
            const carousel = this.carouselsRepository.create({
                title: carouselData.title,
                subtitle: carouselData.subtitle,
                description: carouselData.description,
                images: JSON.stringify(results), // Serialize the array of image URLs to a JSON string
            });
    
            // Save the carousel to the database
            await this.carouselsRepository.save(carousel);
    
            // Delete the temporary files
            for (let i = 0; i < images.length; i++) {
                fs.unlinkSync(tempFilePaths[i]);
            }
    
            return {
                status: HttpStatus.CREATED,
                message: 'Carousel created',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error creating carousel');
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
                    return await this.updateCarousel(id, objectData, images);
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

    async updateCarousel(id: number, carouselData: any, images: Array<Express.Multer.File>): Promise<any> {
        try {
            const carousel = await this.carouselsRepository.findOne(
                {where: {ID: id}}
            );
            if (!carousel) {
                throw new NotFoundException('Carousel not found');
            }
    
            // If images are provided, update the images
            if (images) {
                // Save the new image buffers to temporary files
                const tempFilePaths = [];
                for (let i = 0; i < images.length; i++) {
                    const tempFilePath = `./file${i}.png`; // Provide the path to a temporary file
                    fs.writeFileSync(tempFilePath, images[i].buffer);
                    tempFilePaths.push(tempFilePath);
                }
    
                // Upload the temporary files to Cloudinary
                const results = [];
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(tempFilePaths[i], {
                        folder: 'carousels', // Optional: specify a folder in Cloudinary
                    });
                    results.push(result.secure_url);
                }
    
                // Update carousel with new Cloudinary image URLs
                carousel.images = JSON.stringify(results); // Serialize the array of image URLs to a JSON string
    
                // Delete the temporary files
                for (let i = 0; i < images.length; i++) {
                    fs.unlinkSync(tempFilePaths[i]);
                }
            }
    
            // Update other fields if provided
            if (carouselData.title) {
                carousel.title = carouselData.title;
            }
            if (carouselData.subtitle) {
                carousel.subtitle = carouselData.subtitle;
            }
            if (carouselData.description) {
                carousel.description = carouselData.description;
            }
    
            // Save the updated carousel to the database
            await this.carouselsRepository.save(carousel);
    
            return {
                status: HttpStatus.OK,
                message: 'Carousel updated',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error updating carousel');
            } else {
                throw error;
            }
        }
    }

    async deleteObject(objectType: string, id: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.deleteArticle(id);
                case 'calculator':
                    return await this.deleteCalculator(id);
                case 'carousel':
                    return await this.deleteCarousel(id);
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

    async deleteCarousel(id: number): Promise<any> {
        try {
            const carousel = await this.carouselsRepository.findOne(
                {
                    where: {ID: id},
                    relations: ['objectCharacteristicsAssociations'],
                },
            );
            if (!carousel) {
                throw new NotFoundException('carousel not found');
            }

            // Delete associations
            await this.objectCharacteristicsAssociationRepository.remove(carousel.objectCharacteristicsAssociations);

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
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error deleting carousel');
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

}

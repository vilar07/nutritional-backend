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

    async getObjects(objectType: string, characteristic?: string, optionSelected?: string) {
        try {
            switch(objectType) {
                case 'articles':
                    if (characteristic && optionSelected) {
                        return await this.getArticlesByCharacteristic(characteristic, optionSelected);
                    }
                    return await this.getArticles();
                case 'calculators':
                    if (characteristic && optionSelected) {
                        return await this.getCalculatorsByCharacteristic(characteristic, optionSelected);
                    }
                    return await this.getCalculators();
                case 'carousels':
                    if (characteristic && optionSelected) {
                        return await this.getCarouselsByCharacteristic(characteristic, optionSelected);
                    }
                    return await this.getCarousels();
                default:
                    throw new BadRequestException('Invalid object type');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error getting objects');
            } else {
                throw error;
            }
        }
    }

    async getArticles() {
        if (await this.articlesRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No articles found',
            };
        }

        return this.articlesRepository.find();
    }

    async getArticlesByCharacteristic(characteristic: string, optionSelected: string) {
        const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
        if (!characteristicEntity) {
            throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
        }

        const associations = await this.objectCharacteristicsAssociationRepository.find({
            where: {
                characteristics: characteristicEntity,
                option_selected: optionSelected,
            },
            relations: ['articles'],
        });

        if (associations.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No articles found',
            };
        }

        const articleIDs = associations.map(association => association.articles[0].ID);
        return this.articlesRepository.find({
            where: { ID: In(articleIDs) },
        });
    }

    async getCalculators() {
        if (await this.calculatorsRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No calculators found',
            };
        }

        return this.calculatorsRepository.find();
    }

    async getCalculatorsByCharacteristic(characteristic: string, optionSelected: string) {
        const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
        if (!characteristicEntity) {
            throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
        }

        const associations = await this.objectCharacteristicsAssociationRepository.find({
            where: {
                characteristics: characteristicEntity,
                option_selected: optionSelected,
            },
            relations: ['calculators'],
        });

        if (associations.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No calculators found',
            };
        }

        const calculatorIDs = associations.map(association => association.calculators[0].ID);
        return this.calculatorsRepository.find({
            where: { ID: In(calculatorIDs) },
        });
    }

    async getCarousels() {
        if (await this.carouselsRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No carousels found',
            };
        }

        return this.carouselsRepository.find();
    }

    async getCarouselsByCharacteristic(characteristic: string, optionSelected: string) {
        const characteristicEntity = await this.characteristicRepository.findOne({ where: { name: characteristic } });
        if (!characteristicEntity) {
            throw new HttpException(`Characteristic "${characteristic}" does not exist.`, HttpStatus.NOT_FOUND);
        }

        const associations = await this.objectCharacteristicsAssociationRepository.find({
            where: {
                characteristics: characteristicEntity,
                option_selected: optionSelected,
            },
            relations: ['carousels'],
        });

        if (associations.length === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No carousels found',
            };
        }

        const carouselIDs = associations.map(association => association.carousels[0].ID);
        return this.carouselsRepository.find({
            where: { ID: In(carouselIDs) },
        });
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
                {where: {ID: id}}
            );
            
            if (!calculator) {
                throw new NotFoundException('Calculator not found');
            }

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
                {where: {ID: id}}
            );
            if (!carousel) {
                throw new NotFoundException('Carousel not found');
            }
            await this.carouselsRepository.delete(carousel);
    
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
                case "calculator":
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
                
                case "carousel":
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

}

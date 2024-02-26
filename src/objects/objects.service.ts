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

    ) {}

    async getObjects(objectType: string) {
        try {
            switch(objectType) {
                case 'articles':
                    return await this.getArticles();
                // case 'form':
                //     return await this.getForms();
                // // Add more cases for other object types as needed
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
            default:
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Object type not found',
                };
        }
        
    }

    async createObject(objectType: string, objectData: any, image: Express.Multer.File): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.createArticle(objectData, image);
                case 'calculator':
                    return await this.createCalculator(objectData, image);
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


    async updateObject(objectType: string, id: number, objectData: any, image: Express.Multer.File): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.updateArticle(id, objectData, image);
                case 'calculator':
                    return await this.updateCalculator(id, objectData, image);
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

    async deleteObject(objectType: string, id: number): Promise<any> {
        try {
            switch(objectType) {
                case 'article':
                    return await this.deleteArticle(id);
                case 'calculator':
                    return await this.deleteCalculator(id);
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
            switch (params.objectType){
                case 'article':
                    const article = await this.articlesRepository.findOne({ where: { title: params.title } });
                    if (!article) {
                        throw new HttpException('Article with that title does not exist.', HttpStatus.NOT_FOUND);
                    }
    
                    // Find the existing associations for the specified article
                    const associationsToDelete = await this.objectCharacteristicsAssociationRepository.find({
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

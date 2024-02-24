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
import { NotFoundException } from '@nestjs/common';



@Injectable()
export class ObjectsService {
    private readonly logger = new Logger(ObjectsService.name);
    constructor(
        @InjectRepository(Articles)
        private readonly articlesRepository: Repository<Articles>,
        @InjectRepository(ObjectCharacteristicsAssociation)
        private readonly objectCharacteristicsAssociationRepository: Repository<ObjectCharacteristicsAssociation>,
        @InjectRepository(Characteristics)
        private readonly characteristicRepository: Repository<Characteristics>,

    ) {}

    async getArticles() {
        if (await this.articlesRepository.count() === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No articles found',
            };
        }

        return this.articlesRepository.find();
    }

    async getArticle(params: GetObjectByIDdto): Promise<any> {
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

            // // Delete the article from the database
            await this.articlesRepository.remove(article);
    
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
            switch (params.objectType) {
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

import {Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Articles } from './entities/Articles';
import { ObjectCharacteristicsAssociation } from './entities/ObjectCharacteristicsAssociation';
import { Characteristics } from 'src/characteristics/entities/Characteristics';
import { HttpStatus } from '@nestjs/common';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO } from './dtos/objects.dto';
import { existsSync, mkdir,createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
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

    async associateObject(params: AssociateObjectDTO, option: AssociateObjectOptionDTO): Promise<any> {
        try{
            switch(params.objectType){
                case 'article':
                    const existingAssociationOption = await this.objectCharacteristicsAssociationRepository.findOne({
                        where: {
                            characteristics: {name: params.characteristic},
                            articles: {title: params.title},
                            option_selected: option.option,
                        },
                    });
                    if (existingAssociationOption) {
                        const errorMessage = 'Article already associated with that characteristic and option.';
                        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
                    }
                    const article = await this.articlesRepository.findOne({
                        where: {title: params.title},
                    });
                    if (!article) {
                        const errorMessage = 'Article with that title doesnt exist.';
                        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
                    }
                    const characteristic = await this.characteristicRepository.findOne({
                        where: {name: params.characteristic},
                    });
                    if (!characteristic) {
                        const errorMessage = 'Characteristic with that name doesnt exist.';
                        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
                    }
                    const objectCharacteristicsAssociation = this.objectCharacteristicsAssociationRepository.create({
                        option_selected: option.option,
                        characteristics: [characteristic],
                        articles: [article],
                    });
                    await this.objectCharacteristicsAssociationRepository.save(objectCharacteristicsAssociation);
                    return {
                        status: HttpStatus.CREATED,
                        message: 'Article associated',
                    };
                default:
                    const errorMessage = 'Object type not found';
                    throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error associating object');
            } else {
                throw error;
            }
        }
    }    

}

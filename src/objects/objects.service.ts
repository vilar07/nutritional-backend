import {Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Articles } from './entities/Articles';
import { HttpStatus } from '@nestjs/common';
import { GetObjectByIDdto, CreateArticleDTO } from './dtos/objects.dto';
import { existsSync, mkdir,createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs-extra';
import cloudinary from 'src/cloudinary.config';


@Injectable()
export class ObjectsService {
    private readonly logger = new Logger(ObjectsService.name);
    constructor(
        @InjectRepository(Articles)
        private readonly articlesRepository: Repository<Articles>,

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
            console.error('Error creating article:', error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create article',
            };
        }
    }
}

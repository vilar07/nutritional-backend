import {Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Articles } from './entities/Articles';
import { HttpStatus } from '@nestjs/common';
import { GetObjectByIDdto } from './dtos/objects.dto';



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
        return {
            status: HttpStatus.OK,
            data: await this.articlesRepository.find(),
        };
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
        return {
            status: HttpStatus.OK,
            data: article,
        };
    }


}

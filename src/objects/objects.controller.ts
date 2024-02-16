import { Controller, Get, Logger, Post, Param, Body } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, createArticleDTO } from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
    private readonly logger = new Logger(ObjectsController.name);
    constructor(private readonly objectsService: ObjectsService){}
    
    @Get('articles')
    async getArticles() {
        return await this.objectsService.getArticles();
    }
    
    @Get('article/:id')
    async getArticle(
        @Param() params: GetObjectByIDdto
    ) {
        return await this.objectsService.getArticle(params);
    }

    @Post('article')
    async createArticle(
        @Body() body: createArticleDTO
    )
    {
        return await this.objectsService.createArticle(body);
    }

}

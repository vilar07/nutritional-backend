import { Controller, Get, Logger, Post, Param, Body } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO } from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { Request } from 'express';
import { Req } from '@nestjs/common';

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
    @UseInterceptors(FileInterceptor('image')) // Use file interceptor for 'image' field
    async createArticle(@UploadedFile() image: Express.Multer.File, @Req() req: Request) {
        const createArticleDTO: CreateArticleDTO = {
            title: req.body.title, // Assuming title is sent in the form-data
            subtitle: req.body.subtitle, // Assuming subtitle is sent in the form-data
            description: req.body.description // Assuming description is also sent in the form-data
        };
        return await this.objectsService.createArticle(createArticleDTO, image);
    }

    @Post('associate/:objectType/:title/:characteristic')
    async associateArticle(@Param() params: AssociateObjectDTO, @Body() option: AssociateObjectOptionDTO ) {
        return await this.objectsService.associateObject(params, option);
    }

}

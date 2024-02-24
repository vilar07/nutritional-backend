import { Controller, Get, Logger, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO, UpdateArticleDTO,
UpdateAssociationDTO, AssociationItemDTO } from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
    private readonly logger = new Logger(ObjectsController.name);
    constructor(private readonly objectsService: ObjectsService){}
    
    @Get('articles')
    @ApiOperation({ summary: 'Get all articles' })
    async getArticles() {
        return await this.objectsService.getArticles();
    }
    
    @Get('article/:id')
    @ApiOperation({ summary: 'Get an article by id' })
    async getArticle(
        @Param() params: GetObjectByIDdto
    ) {
        return await this.objectsService.getArticle(params);
    }

    @Post('article')
    @ApiOperation({ summary: 'Create an article' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'The title of the article',
                },
                subtitle: {
                    type: 'string',
                    description: 'The subtitle of the article',
                },
                description: {
                    type: 'string',
                    description: 'The description of the article',
                },
                image: {
                    type: 'file',
                    description: 'The image of the article',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image')) // Use file interceptor for 'image' field
    async createArticle(@UploadedFile() image: Express.Multer.File, @Req() req: Request) {
        const createArticleDTO: CreateArticleDTO = {
            title: req.body.title, // Assuming title is sent in the form-data
            subtitle: req.body.subtitle, // Assuming subtitle is sent in the form-data
            description: req.body.description // Assuming description is also sent in the form-data
        };
        return await this.objectsService.createArticle(createArticleDTO, image);
    }

    @Put('article/:id')
    @ApiOperation({ summary: 'Update an article' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'The title of the article',
                },
                subtitle: {
                    type: 'string',
                    description: 'The subtitle of the article',
                },
                description: {
                    type: 'string',
                    description: 'The description of the article',
                },
                image: {
                    type: 'file',
                    description: 'The image of the article',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image')) // Use file interceptor for 'image' field
    async updateArticle(
        @Param('id') id: number,
        @UploadedFile() image: Express.Multer.File,
        @Req() req: Request
    ) {
        const updateArticleDTO: UpdateArticleDTO = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description
        };
        return await this.objectsService.updateArticle(id, updateArticleDTO, image);
    }

    @Delete('article/:id')
    @ApiOperation({ summary: 'Delete an article' })
    async deleteArticle(@Param('id') id: number) {
        return await this.objectsService.deleteArticle(id);
    }

    @Post('associate/:objectType/:title')
    @ApiOperation({ summary: 'Associate characteristics with an object' })
    async associateObject(
        @Param() params: AssociateObjectDTO,
        @Body() associations: AssociationItemDTO[]
    ) {
        return await this.objectsService.associateObject(params, associations);
    }

    @Put('associate/:objectType/:title')
    @ApiOperation({ summary: 'Update associations with an object' })
    async updateAssociations(
        @Param() params: UpdateAssociationDTO,
        @Body() associations: AssociationItemDTO[]
    ) {
        return await this.objectsService.updateAssociations(params, associations);
    }

}

import { Controller, Get, Logger, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO, UpdateArticleDTO,
UpdateAssociationDTO, AssociationItemDTO } from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, BadRequestException,Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';


@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
    private readonly logger = new Logger(ObjectsController.name);
    constructor(private readonly objectsService: ObjectsService){}
    
    @Get(':objectType')
    @ApiOperation({ summary: 'Get all Objects' })
    async getObjects(
        @Param('objectType') objectType: string,
    ) {
        return await this.objectsService.getObjects(objectType);
    }
    
    @Get(':objectType/:id')
    @ApiOperation({ summary: 'Get an object by id' })
    async getObject(
        @Param() params: GetObjectByIDdto
    ) {
        return await this.objectsService.getObject(params);
    }

    @Post(':objectType')
    @ApiOperation({ summary: 'Create an Object' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image')) // Use file interceptor for 'image' field
    async createObject(
        @Param('objectType') objectType: string,
        @UploadedFile() image: Express.Multer.File,
        @Req() req: Request
    ) {
        let createObjectDTO: any; // Define a variable to hold the DTO dynamically

        // Construct DTO based on the objectType
        switch(objectType) {
            case 'article':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                };
                break;
            case 'calculator':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation
                };
                break;
            // Add more cases for other object types as needed
            default:
                throw new BadRequestException('Invalid object type');
        }

        return await this.objectsService.createObject(objectType, createObjectDTO, image);
    }

    @Put(':objectType/:id')
    @ApiOperation({ summary: 'Update an Object' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image')) // Use file interceptor for 'image' field
    async updateObject(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @UploadedFile() image: Express.Multer.File,
        @Req() req: Request
    ) {
        let updateObjectDTO: any; // Define a variable to hold the DTO dynamically

        // Construct DTO based on the objectType
        switch(objectType) {
            case 'article':
                const updateObjectDTO: UpdateArticleDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                };
                break;
            // case 'form':
            //     updateObjectDTO = {
            //         // Define fields for the form DTO
            //     };
            //     break;
            // Add more cases for other object types as needed
            default:
                throw new BadRequestException('Invalid object type');
        }

        return await this.objectsService.updateObject(objectType, id, updateObjectDTO, image);
    }

    @Delete(':objectType/:id')
    @ApiOperation({ summary: 'Delete an Object' })
    async deleteObject(
        @Param('objectType') objectType: string,
        @Param('id') id: number
    ) {
        return await this.objectsService.deleteObject(objectType, id);
    }

    @Post('associate/:objectType/:title')
    @ApiOperation({ summary: 'Associate characteristics with an object' })
    @ApiBody({
    schema: {
        type: 'array',
        items: {
        type: 'object',
        properties: {
            characteristic: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } }
        },
        required: ['characteristic', 'options']
        }
    }
    })
    async associateObject(
        @Param() params: UpdateAssociationDTO,
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

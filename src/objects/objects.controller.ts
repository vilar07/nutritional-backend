import { Controller, Get, Logger, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO, UpdateArticleDTO,
UpdateAssociationDTO, AssociationItemDTO } from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, BadRequestException,Req, UploadedFiles } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiConsumes, ApiBody, ApiQuery, ApiParam} from '@nestjs/swagger';



@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
    private readonly logger = new Logger(ObjectsController.name);
    constructor(private readonly objectsService: ObjectsService){}

    //Get all characteristics and its selected options depending on the object type
    @Get('characteristics/:objectType')
    @ApiOperation({ summary: 'Get all characteristics and its selected options depending on the object type' })
    async getCharacteristics(
        @Param('objectType') objectType: string
    ) {
        return await this.objectsService.getCharacteristics(objectType);
    }

    //Get all recommended objects by characteristics
    @Get('recommended')
    async getRecommendedObjects(
        @Query('recommendedCharacteristics') recommendedCharacteristics: string, // Accepting query parameter
        @Query('objectType') objectType?: string
    ) {
        const parsedCharacteristics = JSON.parse(recommendedCharacteristics);
        return await this.objectsService.getObjectsByRecommendedCharacteristics(parsedCharacteristics, objectType);
    }
    
    @Get(':objectType')
    @ApiOperation({ summary: 'Get all Objects by object type and optionally by characteristic and selected option' })
    @ApiParam({ name: 'objectType', description: 'Type of object' })
    @ApiQuery({ name: 'characteristic', required: false, description: 'Characteristic' })
    @ApiQuery({ name: 'option_selected', required: false, description: 'Selected option' })
    @ApiQuery({ name: 'order_by', required: false, description: 'Order by' })
    async getObjects(
        @Param('objectType') objectType: string,
        @Query('characteristic') characteristic?: string,
        @Query('option_selected') optionSelected?: string,
        @Query('order_by') order_by?: string,
    ) {
        return await this.objectsService.getObjects(objectType, characteristic, optionSelected, order_by);
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
    @UseInterceptors(FilesInterceptor('images', 5)) // Use files interceptor for 'images' field with a limit of 5 files
    @ApiParam({ name: 'objectType', description: 'Type of object' })
    async createObject(
        @Param('objectType') objectType: string,
        @UploadedFiles() images: Array<Express.Multer.File>,
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
            case 'carousel':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                };
                break;
            // Add more cases for other object types as needed
            default:
                throw new BadRequestException('Invalid object type');
        }

        return await this.objectsService.createObject(objectType, createObjectDTO, images);
    }

    @Put(':objectType/:id')
    @ApiOperation({ summary: 'Update an Object' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images', 5)) // Use files interceptor for 'images' field with a limit of 5 files
    async updateObject(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Req() req: Request
    ) {
        let updateObjectDTO: any; // Define a variable to hold the DTO dynamically

        // Construct DTO based on the objectType
        switch(objectType) {
            case 'article':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                };
                break;
            case 'calculator':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation
                };
                break;
            case 'carousel':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                };
                break;
            default:
                throw new BadRequestException('Invalid object type');
        }

        return await this.objectsService.updateObject(objectType, id, updateObjectDTO, images);
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

    //Increment the number of views of an object when clicked by the user
    @Put('views/:objectType/:id')
    @ApiOperation({ summary: 'Incrementhe number of views of an object when clicked by the user' })
    async incrementViews(
        @Param('objectType') objectType: string,
        @Param('id') id: number
    ) {
        return await this.objectsService.incrementViews(objectType, id);
    }
    
    
    
    

}

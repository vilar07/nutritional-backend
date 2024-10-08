import { Controller, Get, Logger, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, CreateArticleDTO, AssociateObjectDTO, AssociateObjectOptionDTO, UpdateArticleDTO,
UpdateAssociationDTO, AssociationItemDTO, 
CreateCalculatorDTO} from './dtos/objects.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, BadRequestException,Req, UploadedFiles } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiConsumes, ApiBody, ApiQuery, ApiParam, ApiResponse} from '@nestjs/swagger';



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

    @Get(':objectType?') // Making objectType optional by adding a question mark after the parameter
    @ApiOperation({ summary: 'Get all objects, optionally by: object Type, ordered by (Most Recent, Most Popular, Best Rating), certain recommended characteristics, certain characteristic and option selected'})
    @ApiParam({ name: 'objectType', description: 'Type of object', required: false }) // Indicating that objectType is optional in the parameter description
    @ApiQuery({ name: 'characteristic', required: false, description: 'Characteristic' })
    @ApiQuery({ name: 'option_selected', required: false, description: 'Selected option' })
    @ApiQuery({ name: 'order_by', required: false, description: 'Order by' })
    @ApiQuery({ name: 'recommendedCharacteristics', required: false, description: 'Recommended Characteristics' })
    async getObjects(
        @Param('objectType') objectType?: string, // Making objectType optional
        @Query('characteristic') characteristic?: string,
        @Query('option_selected') optionSelected?: string,
        @Query('order_by') order_by?: string,
        @Query('recommendedCharacteristics') recommendedCharacteristics?: string
    ) {
        try {
            if (recommendedCharacteristics && recommendedCharacteristics.length > 0) {
                const parsedCharacteristics = JSON.parse(recommendedCharacteristics);
                return await this.objectsService.getObjectsByRecommendedCharacteristics(parsedCharacteristics, objectType, order_by);
            } else {
                // If no recommendedCharacteristics provided, proceed with regular fetching
                if (!objectType) {
                    throw new BadRequestException('Object type must be provided');
                }
                return await this.objectsService.getObjects(objectType, characteristic, optionSelected, order_by);
            }
        } catch (error) {
            throw error;
        }
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
    @UseInterceptors(FilesInterceptor('images', 5))
    @ApiParam({ name: 'objectType', description: 'Type of object' })
    async createObject(
        @Param('objectType') objectType: string,
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Req() req: Request
    ) {
        let createObjectDTO: any;
        switch (objectType) {
            case 'article':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'calculator':
                createObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'carousel':
                // Pass carousel title and carousel item data to the service
                createObjectDTO = {
                    title: req.body.title,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance,
                    itemTitle: req.body.itemTitle,
                    itemSubtitle: req.body.itemSubtitle,
                    itemDescription: req.body.itemDescription,
                    itemLink: req.body.itemLink,
                    itemButtonText: req.body.itemButtonText
                };
                break;
            case 'mealCard':
                createObjectDTO = {
                    title: req.body.title,
                    price: req.body.price,
                    category: req.body.category,
                    description: req.body.description,
                    number_ingridients: req.body.number_ingridients,
                    image: req.body.image,
                    link: req.body.link,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            default:
                throw new BadRequestException('Invalid object type');
        }

        return await this.objectsService.createObject(objectType, createObjectDTO, images);
    }

//     @Post(':objectType')
// @ApiOperation({ summary: 'Create an Object' })
// @ApiConsumes('multipart/form-data')
// @UseInterceptors(FilesInterceptor('images', 5))
// @ApiParam({ name: 'objectType', description: 'Type of object' })
// @ApiBody({ type: CreateCalculatorDTO }) // Use the DTO class to define the schema
// @ApiResponse({ status: 201, description: 'The object has been successfully created.' }) // Specify the success response
// @ApiResponse({ status: 400, description: 'Invalid request parameters.' }) // Specify the error response for invalid request parameters
// @ApiResponse({ status: 500, description: 'Internal server error.' }) // Specify the error response for internal server error
// @ApiResponse({ status: 401, description: 'Unauthorized.' }) // Specify the error response for unauthorized access
// @ApiResponse({ status: 403, description: 'Forbidden.' }) // Specify the error response for forbidden access
// async createObject(
//     @Param('objectType') objectType: string,
//     @UploadedFiles() images: Array<Express.Multer.File>,
//     @Body() createObjectDTO: CreateCalculatorDTO, // Use the DTO class here as well
//     @Req() req: Request
// ) {
//     // Your existing switch statement to handle different object types

//     return this.objectsService.createObject(objectType, createObjectDTO, images);
// }

    @Put(':objectType/:id')
    @ApiOperation({ summary: 'Update an Object' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images', 5)) // Use files interceptor for 'images' field with a limit of 5 files
    async updateObject(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() carouselItems: any[],
        @Req() req: Request
    ) {
        let updateObjectDTO: any; // Define a variable to hold the DTO dynamically

        // Construct DTO based on the objectType
        switch(objectType) {
            case 'article':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
            case 'calculator':
                updateObjectDTO = {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description,
                    variable_to_calculate: req.body.variable_to_calculate,
                    equation: req.body.equation,
                    time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
                };
                break;
                case 'carousel':
                    // Pass carousel title and carousel item data to the service
                    updateObjectDTO = {
                        title: req.body.title,
                        time_of_day_relevance: req.body.time_of_day_relevance,
                        season_relevance: req.body.season_relevance,
                        itemID: req.body.itemID,
                        itemTitle: req.body.itemTitle,
                        itemSubtitle: req.body.itemSubtitle,
                        itemDescription: req.body.itemDescription,
                        itemLink: req.body.itemLink,
                        itemButtonText: req.body.itemButtonText
                    };
                    break;
                case 'mealCard':
                    updateObjectDTO = {
                        title: req.body.title,
                        price: req.body.price,
                        category: req.body.category,
                        description: req.body.description,
                        number_ingridients: req.body.number_ingridients,
                        image: req.body.image,
                        link: req.body.link,
                        time_of_day_relevance: req.body.time_of_day_relevance,
                    season_relevance: req.body.season_relevance
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
        @Param('id') id: number,
        @Query('carouselItemID') carouselItemID?: number // Add query parameter to delete a carousel item
    ) {
        return await this.objectsService.deleteObject(objectType, id, carouselItemID);
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
    
    //Get ratings that a user has on an object, given the user email, object type and object id
    @Get('ratings/:objectType/:id/:email')
    @ApiOperation({ summary: 'Get ratings that a user has on an object, given the user email, object type and object id' })
    async getUserRatings(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @Param('email') email: string
    ) {
        return await this.objectsService.getUserRatings(objectType, id, email);
    }

    //Get ratings of an object given the id and object type
    @Get('ratings/:objectType/:id')
    @ApiOperation({ summary: 'Get ratings of an object given the id and object type'})
    async getRatings(
        @Param('objectType') objectType: string,
        @Param('id') id: number
    ) {
        return await this.objectsService.getRatings(objectType, id);
    }

    //Post a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided
    @Post('ratings/:objectType/:id/:email')
    @ApiOperation({ summary: 'Post a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided' })
    async postRating(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @Param('email') email: string,
        @Body() rating: number
    ) {
        return await this.objectsService.postRating(email, objectType, id,  rating);
    }


    //Update a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided
    @Put('ratings/:objectType/:id/:email')
    @ApiOperation({ summary: 'Update a rating on an object, where the rating is an integer from 1 to 5 and the user email, object type and object id are provided' })
    async updateRating(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @Param('email') email: string,
        @Body() rating: number
    ) {
        return await this.objectsService.updateRating(email, objectType, id, rating);
    }

    //Delete a rating on an object, where the user email, object type and object id are provided
    @Delete('ratings/:objectType/:id/:email')
    @ApiOperation({ summary: 'Delete a rating on an object, where the user email, object type and object id are provided' })
    async deleteRating(
        @Param('objectType') objectType: string,
        @Param('id') id: number,
        @Param('email') email: string
    ) {
        return await this.objectsService.deleteRating(email, objectType, id);
    }
}

/// <reference types="multer" />
import { ObjectsService } from './objects.service';
import { GetObjectByIDdto, UpdateAssociationDTO, AssociationItemDTO } from './dtos/objects.dto';
import { Request } from 'express';
export declare class ObjectsController {
    private readonly objectsService;
    private readonly logger;
    constructor(objectsService: ObjectsService);
    getCharacteristics(objectType: string): Promise<any>;
    getObjects(objectType?: string, characteristic?: string, optionSelected?: string, order_by?: string, recommendedCharacteristics?: string): Promise<any>;
    getObject(params: GetObjectByIDdto): Promise<any>;
    createObject(objectType: string, images: Array<Express.Multer.File>, req: Request): Promise<any>;
    updateObject(objectType: string, id: number, images: Array<Express.Multer.File>, carouselItems: any[], req: Request): Promise<any>;
    deleteObject(objectType: string, id: number, carouselItemID?: number): Promise<any>;
    associateObject(params: UpdateAssociationDTO, associations: AssociationItemDTO[]): Promise<any>;
    updateAssociations(params: UpdateAssociationDTO, associations: AssociationItemDTO[]): Promise<any>;
    incrementViews(objectType: string, id: number): Promise<any>;
    getUserRatings(objectType: string, id: number, email: string): Promise<any>;
    getRatings(objectType: string, id: number): Promise<any>;
    postRating(objectType: string, id: number, email: string, rating: number): Promise<any>;
    updateRating(objectType: string, id: number, email: string, rating: number): Promise<any>;
    deleteRating(objectType: string, id: number, email: string): Promise<any>;
}

import { User } from './entities/User';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { AssociateCharacteristicsDto, CreateUserDto } from './dtos/users.dto';
import { UserCharacteristicAssociation } from './entities/UserCharacteristicAssociation';
import { Characteristics } from 'src/characteristics/entities/Characteristics';
import { ObjectsService } from 'src/objects/objects.service';
import { ObjectRatings } from 'src/objects/entities/ObjectRatings';
export declare class UsersService {
    private readonly userRepository;
    private readonly userCharacteristicAssociationRepository;
    private readonly characteristicsRepository;
    private readonly objectsService;
    private readonly objectRatingsRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, userCharacteristicAssociationRepository: Repository<UserCharacteristicAssociation>, characteristicsRepository: Repository<Characteristics>, objectsService: ObjectsService, objectRatingsRepository: Repository<ObjectRatings>);
    getUsers(): Promise<{
        status: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        status: HttpStatus;
        data: User[];
        message?: undefined;
    }>;
    getUserByEmail(email: string): Promise<{
        status: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        status: HttpStatus;
        data: User;
        message?: undefined;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<any>;
    deleteUser(email: string): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    getUserCharacteristics(email: string): Promise<{
        status: HttpStatus;
        data: {};
    }>;
    getUsersCountByCharacteristic(characteristic: string): Promise<{
        status: HttpStatus;
        data: {};
    }>;
    associateCharacteristics(email: string, associations: AssociateCharacteristicsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    generateUserCharacteristicMatrix(): Promise<any>;
    cosineSimilarity(user1Id: number, user2Id: number, userMatrix: number[][]): Promise<number>;
    getRecommendations(userEmail: string): Promise<any>;
}

import { UsersService } from './users.service';
import { AssociateCharacteristicsDto, CreateUserDto } from './dtos/users.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    getUserCharacteristicMatrix(): Promise<any>;
    getUsers(): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: string;
        data?: undefined;
    } | {
        status: import("@nestjs/common").HttpStatus;
        data: import("./entities/User").User[];
        message?: undefined;
    }>;
    getUserByEmail(email: string): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: string;
        data?: undefined;
    } | {
        status: import("@nestjs/common").HttpStatus;
        data: import("./entities/User").User;
        message?: undefined;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<any>;
    deleteUser(email: string): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: string;
    }>;
    getUsersByCharacteristic(characteristic: string): Promise<{
        status: import("@nestjs/common").HttpStatus;
        data: {};
    }>;
    getUserCharacteristics(email: string): Promise<{
        status: import("@nestjs/common").HttpStatus;
        data: {};
    }>;
    associateCharacteristics(email: string, associations: AssociateCharacteristicsDto): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: string;
    }>;
    getRecommendations(email: string): Promise<any>;
}

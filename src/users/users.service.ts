import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User';
import { In, Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { AssociateCharacteristicsDto, CreateUserDto } from './dtos/users.dto';
import { UserCharacteristicAssociation } from './entities/UserCharacteristicAssociation';
import { HttpException } from '@nestjs/common';
import { Characteristics } from 'src/characteristics/entities/Characteristics';
import { NotFoundException } from '@nestjs/common';



@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserCharacteristicAssociation)
        private readonly userCharacteristicAssociationRepository: Repository<UserCharacteristicAssociation>,
        @InjectRepository(Characteristics)
        private readonly characteristicsRepository: Repository<Characteristics>,

    ) {}

    async getUsers() {
        const users = await this.userRepository.find();
        if (!users) {
            this.logger.error('No users found');
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'No users found',
            };
        }
        return {
            status: HttpStatus.OK,
            data: users,
        };
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            this.logger.error('User not found');
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
        }
        return {
            status: HttpStatus.OK,
            data: user,
        };
    }

    async createUser(createUserDto: CreateUserDto): Promise<any> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            this.logger.error('User already exists');
            return {
                status: HttpStatus.CONFLICT,
                message: 'User already exists',
            };
        }
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
        return {
            status: HttpStatus.CREATED,
            message: 'User created successfully',
        };
    }

    async deleteUser(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            this.logger.error('User not found');
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
        }
        await this.userRepository.delete({ email: email });
        return {
            status: HttpStatus.OK,
            message: 'User deleted successfully',
        };
    }

    async associateCharacteristics(email: string, associations: AssociateCharacteristicsDto) {
        try{
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            console.log(associations);

            console.log("Printing characteristics separately:");
            associations.characteristics.forEach(characteristic => {
                console.log(`Characteristic: ${characteristic.characteristic}`);
                console.log(`Option Selected: ${characteristic.option_selected}`);
            });

            // Go through each characteristic and its selected option and associate it to the user
            //Check if it already exists, and if yes update the trust level by 1
            for (let i = 0; i < associations.characteristics.length; i++) {
                const characteristic = await this.characteristicsRepository.findOne({ where: { name: associations.characteristics[i].characteristic } });
                if (!characteristic) {
                    throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
                }
                const userCharacteristicAssociation = await this.userCharacteristicAssociationRepository.findOne({ where: { option: associations.characteristics[i].option_selected, user: user, characteristics: characteristic } });
                console.log("existe a option:",userCharacteristicAssociation);
                if (userCharacteristicAssociation) {
                    userCharacteristicAssociation.trust_level = userCharacteristicAssociation.trust_level + 1;
                    await this.userCharacteristicAssociationRepository.save(userCharacteristicAssociation);
                } else {
                    const userCharacteristicAssociation = new UserCharacteristicAssociation();
                    userCharacteristicAssociation.user = [user];
                    userCharacteristicAssociation.characteristics = [characteristic];
                    userCharacteristicAssociation.option = associations.characteristics[i].option_selected;
                    userCharacteristicAssociation.trust_level = 1;
                    await this.userCharacteristicAssociationRepository.save(userCharacteristicAssociation);
                }
            }
            return {
                status: HttpStatus.OK,
                message: 'Characteristics associated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Error associating object');
            } else {
                throw error;
            }
        }
        
        
      }

    
}

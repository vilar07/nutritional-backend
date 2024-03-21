import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User';
import { In, Not, Repository } from 'typeorm';
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

    async getUserCharacteristics(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const userCharacteristics = await this.userCharacteristicAssociationRepository.find(
            { where: { user }, relations: ['characteristics']}
        );
        return {
            status: HttpStatus.OK,
            data: userCharacteristics,
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
            // Increase the trust levels for selected options
            for (const association of associations.characteristics) {
                const characteristic = await this.characteristicsRepository.findOne({ where: { name: association.characteristic } });
                if (!characteristic) {
                    throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
                }

                const optionSelected = association.option_selected;
                let userCharacteristicAssociation = await this.userCharacteristicAssociationRepository.findOne({ where: { option: optionSelected, user, characteristics: characteristic } });
                if (userCharacteristicAssociation) {
                    //if trust_level is 10, do not increase it
                    if(userCharacteristicAssociation.trust_level === 10){
                        continue;
                    }
                    userCharacteristicAssociation.trust_level++;
                } else {
                    userCharacteristicAssociation = new UserCharacteristicAssociation();
                    userCharacteristicAssociation.user = [user];
                    userCharacteristicAssociation.characteristics = [characteristic];
                    userCharacteristicAssociation.option = optionSelected;
                    userCharacteristicAssociation.trust_level = 1;
                }
                await this.userCharacteristicAssociationRepository.save(userCharacteristicAssociation);
            }

            // Decrease the trust levels for other options of the same characteristic
            const uniqueCharacteristics = new Set<string>();
            // Decrease the trust levels for other options of the same characteristic
            for (const association of associations.characteristics) {
                const characteristicName = association.characteristic;
                if (uniqueCharacteristics.has(characteristicName)) {
                    continue; // Skip if the characteristic has already been processed
                }
                
                uniqueCharacteristics.add(characteristicName);

                const characteristic = await this.characteristicsRepository.findOne({ where: { name: characteristicName } });
                if (!characteristic) {
                    throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
                }

                const optionsSelected = associations.characteristics
                    .filter(c => c.characteristic === characteristicName)
                    .map(c => c.option_selected);

                const otherAssociations = await this.userCharacteristicAssociationRepository.find({
                    where: { user, characteristics: characteristic, option: Not(In(optionsSelected)) },
                });

                for (const otherAssociation of otherAssociations) {
                    if (!optionsSelected.includes(otherAssociation.option)) {
                        // Decrease trust level by 1 only if the option is not selected
                        console.log(`Decreasing trust level for ${otherAssociation.option}`);
                        otherAssociation.trust_level = Math.max(0, otherAssociation.trust_level - 1);
                        await this.userCharacteristicAssociationRepository.save(otherAssociation);
                    }
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

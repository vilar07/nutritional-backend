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
import { ObjectsService } from 'src/objects/objects.service'; // Importe o ObjectsService aqui
import { ObjectRatings } from 'src/objects/entities/ObjectRatings';



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
        private readonly objectsService: ObjectsService, // Adicione o ObjectsService aqui
        @InjectRepository(ObjectRatings)
        private readonly objectRatingsRepository: Repository<ObjectRatings>,
        

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
        const existingUser = await this.userRepository.findOne({ 
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username }
            ]
        });
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
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['userCharacteristicAssociation']});
        if (!user) {
            this.logger.error('User not found');
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
        }
        //deletes all the user characteristics
        await this.userCharacteristicAssociationRepository.remove(user.userCharacteristicAssociation);

        //deletes all ratings of the user
        const userRatings = await this.objectRatingsRepository.find({ where: { users: user }});
        await this.objectRatingsRepository.remove(userRatings);


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

        const userCharacteristics = await this.userCharacteristicAssociationRepository.find({
        where: { user },
        relations: ['characteristics'],
        });


        if (!userCharacteristics || userCharacteristics.length === 0) {
        throw new HttpException('Characteristics not found', HttpStatus.NOT_FOUND);
        }

        // Grouping options by characteristic
        const groupedCharacteristics = userCharacteristics.reduce((acc, curr) => {
            const characteristicName = curr.characteristics[0].name;
            if (!acc[characteristicName]) {
                acc[characteristicName] = [];
            }
            //if trust level is 0, do not add it to the array
            if(curr.trust_level === 0){
                return acc;
            }
            acc[characteristicName].push({
                ID: curr.ID,
                option: curr.option,
                trust_level: curr.trust_level,
            });
            return acc;
        }, {});

        return {
        status: HttpStatus.OK,
        data: groupedCharacteristics,
        };
  
    }

    async getUsersCountByCharacteristic(characteristic: string) {
        const characteristicObject = await this.characteristicsRepository.findOne({ where: { name: characteristic } });
        if (!characteristicObject) {
            throw new NotFoundException('Characteristic not found');
        }

        const userAssociations = await this.userCharacteristicAssociationRepository.find({
            where: { characteristics: characteristicObject },
            relations: ['user'],
        });

        const counts = userAssociations.reduce((acc, curr) => {
            const option = curr.option;
            if (!acc[option]) {
                acc[option] = 0;
            }
            acc[option]++;
            return acc;
        }, {});

        return {
            status: HttpStatus.OK,
            data: counts,
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
            // Check if it already exists, and if yes update the trust level by 1
            // Increase the trust levels for selected options
            for (const association of associations.characteristics) {
                const characteristic = await this.characteristicsRepository.findOne({ where: { name: association.characteristic } });
                if (!characteristic) {
                    throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
                }

                const optionSelected = association.option_selected;
                let userCharacteristicAssociation = await this.userCharacteristicAssociationRepository.findOne({ where: { option: optionSelected, user: user, characteristics: characteristic } });
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

                //If chhacateristicName is 'Diets', 'Diseases' or 'Allergies', do not decrease trust level
                if(characteristicName === 'Diets' || characteristicName === 'Diseases' || characteristicName === 'Allergies'){
                    continue;
                }

                const characteristic = await this.characteristicsRepository.findOne({ where: { name: characteristicName } });
                if (!characteristic) {
                    throw new HttpException('Characteristic not found', HttpStatus.NOT_FOUND);
                }

                const optionsSelected = associations.characteristics
                    .filter(c => c.characteristic === characteristicName)
                    .map(c => c.option_selected);

                const otherAssociations = await this.userCharacteristicAssociationRepository.find({
                    where: { user: user, characteristics: characteristic, option: Not(In(optionsSelected)) },
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

      async generateUserCharacteristicMatrix(): Promise<any> {
        const users = await this.userRepository.find(); // Retrieve all users from the database
        let userAssociations = await this.userCharacteristicAssociationRepository.find({ relations: ['user', 'characteristics'] });
        // Filter out associations with trust_level 0 and delete them
        const deletionPromises = userAssociations
        .filter(userAssociation => userAssociation.trust_level === 0)
        .map(async (userAssociation) => {
            console.log('Deleting userAssociation with trust level 0:', userAssociation);
            await this.userCharacteristicAssociationRepository.remove(userAssociation);
        });

        // Wait for all deletion promises to complete
        await Promise.all(deletionPromises);

        // Re-fetch user associations after deletion
        userAssociations = await this.userCharacteristicAssociationRepository.find({ relations: ['user', 'characteristics'] });
        console.log(userAssociations);
        // Initialize the matrix with zeros
        const matrix: number[][] = [];
        const characteristicsLabels: string[] = [];
    
        // Create a map to store the index of each characteristic label
        const characteristicIndexMap: { [label: string]: number } = {};
    
        // Iterate over each user
        for (const user of users) {
            // Filter associations for the current user
            const userAssociationsFiltered = userAssociations.filter(association =>
                association.user.some(assocUser => assocUser.id === user.id)
            );
    
            // Create an array to store the trust levels for the current user
            const userTrustLevels: number[] = [];
    
            
            // Populate the trust levels array with trust levels
            userAssociationsFiltered.forEach(association => {
                const characteristicLabel = `${association.characteristics[0].name}: ${association.option}`;
                let characteristicIndex = characteristicIndexMap[characteristicLabel];
    
                if (characteristicIndex === undefined) {
                    // If the characteristic label is not found in the map, add it to the characteristicsLabels array
                    characteristicIndex = characteristicsLabels.length;
                    characteristicsLabels.push(characteristicLabel);
                    characteristicIndexMap[characteristicLabel] = characteristicIndex;
                }
    
                // Ensure the trust levels array is large enough to hold the trust level for this characteristic
                while (userTrustLevels.length <= characteristicIndex) {
                    userTrustLevels.push(0);
                }
    
                // Set the trust level for this characteristic
                userTrustLevels[characteristicIndex] = association.trust_level;
            });
    
            // Push the trust levels array to the matrix
            matrix.push(userTrustLevels);
        }
    
        // Fill the matrix with zeros for characteristics not associated with any user
        const maxCharacteristicsIndex = characteristicsLabels.length - 1;
        matrix.forEach(row => {
            while (row.length <= maxCharacteristicsIndex) {
                row.push(0);
            }
        });
    
        return {
            matrix,
            users: users.map(user => user.email),
            characteristics: characteristicsLabels
        };
    }

    async cosineSimilarity(user1Id: number, user2Id: number, userMatrix: number[][]): Promise<number> {
        const vector1 = userMatrix[user1Id];
        const vector2 = userMatrix[user2Id];
    
        // Calculate dot product, considering trust levels
        let dotProduct = 0;
        for (let i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i] * Math.min(vector1[i], vector2[i]); // Using minimum trust level
        }
    
        // Calculate magnitudes, considering trust levels
        let magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
        let magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));
    
        // Calculate cosine similarity
        const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);

    
        return cosineSimilarity;
    }

    async getRecommendations(userEmail: string): Promise<any> {
        try {
            // Encontre o usuário com o email fornecido
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                console.log(`User with email ${userEmail} not found.`);
                return;
            }
        
            // Gerar a matriz de características do usuário
            const matrixData = await this.generateUserCharacteristicMatrix();
            const { matrix, users, characteristics } = matrixData;
        
            // Encontre o índice do usuário na matriz
            const userIndex = users.findIndex((u: string) => u === user.email);
        
            // Encontre todos os outros usuários no banco de dados
            const otherUsers = await this.userRepository.find({ where: { email: Not(userEmail) } });
            console.log ('Other users:', otherUsers);

            //Se não houver mais que 2 outros utilizadores no banco de dados, não é possível calcular a similaridade
            // e retorna as características do próprio utilizador
            const recommendedCharacteristics: { user: string; characteristics: { [label: string]: number } }[] = [];
            if (otherUsers.length < 2) {
                console.log('Not enough users to calculate similarities.');
                
                // Retorna as características do próprio utilizador
                const userCharacteristics = matrix[userIndex];
                const userRecommendedCharacteristics: { [label: string]: number } = {};
                
                // Popula o objeto userRecommendedCharacteristics
                for (let i = 0; i < userCharacteristics.length; i++) {
                    const trustLevel = userCharacteristics[i];
                    userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                }
                
                console.log(`User ${userEmail} characteristics:`, userRecommendedCharacteristics);
                
                // Retornar as características do próprio utilizador e as características únicas recomendadas
                const uniqueCharacteristics: Set<string> = new Set();
                
                // Adicionar as características do usuário próprio com trust level maior que 0
                Object.keys(userRecommendedCharacteristics).forEach(label => {
                    if (userRecommendedCharacteristics[label] > 0) {
                        uniqueCharacteristics.add(label);
                    }
                });
                
                // Adicionar as características dos usuários recomendados com trust level maior que 0
                recommendedCharacteristics.forEach(rc => {
                    Object.keys(rc.characteristics).forEach(label => {
                        if (rc.characteristics[label] > 0) {
                            uniqueCharacteristics.add(label);
                        }
                    });
                });
                
                const uniqueCharacteristicsArray = Array.from(uniqueCharacteristics);
                console.log('Unique characteristics:', uniqueCharacteristicsArray);
                
                // Chame o método getObjectsByRecommendedCharacteristics com as características recomendadas
                // Aqui você precisará substituir o retorno pelo método que você deseja chamar
                return uniqueCharacteristicsArray;
            }
        
            // Calcular similaridades entre o usuário dado e todos os outros usuários
            const similarities: { user1: string; user2: string; similarity: number }[] = [];
            for (const otherUser of otherUsers) {
                // Encontre o índice do outro usuário na matriz
                const otherUserIndex = users.findIndex((u: string) => u === otherUser.email);
        
                // Calcule a similaridade do cosseno usando os índices
                const similarity = await this.cosineSimilarity(userIndex, otherUserIndex, matrix);
                similarities.push({ user1: user.email, user2: otherUser.email, similarity });
            }
            
        
            // Ordene as similaridades em ordem decrescente
            similarities.sort((a, b) => b.similarity - a.similarity);
            
            // Retorne os dois usuários mais similares
            const mostSimilarUsers = similarities.slice(0, 2);
        
            // Obtenha as características com os níveis de confiança mais altos dos dois usuários mais similares
            
            for (const similarUser of mostSimilarUsers) {
                console.log(`Similarity between ${similarUser.user1} and ${similarUser.user2}:`, similarUser.similarity);
                const similarUserIndex = users.findIndex((u: string) => u === similarUser.user2);
                const userCharacteristics = matrix[similarUserIndex];
                console.log(userCharacteristics);
        
                const userRecommendedCharacteristics: { [label: string]: number } = {};
                // Define the minimum trust level threshold
    
                const minTrustLevel = 3; // Adjust as needed
                // Populate the userRecommendedCharacteristics object
                for (let i = 0; i < userCharacteristics.length; i++) {
                    const trustLevel = userCharacteristics[i];
                    if (trustLevel > minTrustLevel) {
                        userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                    }
                }
                recommendedCharacteristics.push({ user: similarUser.user2, characteristics: userRecommendedCharacteristics });
            }
        
            console.log(`Two most similar users to ${userEmail}:`, mostSimilarUsers);
            console.log(`Recommended characteristics for user ${userEmail}:`, recommendedCharacteristics);
    
            const uniqueCharacteristics: Set<string> = new Set();
            recommendedCharacteristics.forEach(rc => {
                Object.keys(rc.characteristics).forEach(label => {
                    uniqueCharacteristics.add(label);
                });
            });
            const uniqueCharacteristicsArray = Array.from(uniqueCharacteristics);
            console.log('Unique characteristics:', uniqueCharacteristicsArray);
            // Chame o método getObjectsByRecommendedCharacteristics com as características recomendadas
            return uniqueCharacteristicsArray;
        } catch (error) {
            console.error('Error calculating user similarities:', error);
        }
    }

    
}
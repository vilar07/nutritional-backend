"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./entities/User");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const UserCharacteristicAssociation_1 = require("./entities/UserCharacteristicAssociation");
const common_3 = require("@nestjs/common");
const Characteristics_1 = require("../characteristics/entities/Characteristics");
const common_4 = require("@nestjs/common");
const objects_service_1 = require("../objects/objects.service");
const ObjectRatings_1 = require("../objects/entities/ObjectRatings");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, userCharacteristicAssociationRepository, characteristicsRepository, objectsService, objectRatingsRepository) {
        this.userRepository = userRepository;
        this.userCharacteristicAssociationRepository = userCharacteristicAssociationRepository;
        this.characteristicsRepository = characteristicsRepository;
        this.objectsService = objectsService;
        this.objectRatingsRepository = objectRatingsRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async getUsers() {
        const users = await this.userRepository.find();
        if (!users) {
            this.logger.error('No users found');
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'No users found',
            };
        }
        return {
            status: common_2.HttpStatus.OK,
            data: users,
        };
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            this.logger.error('User not found');
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
        }
        return {
            status: common_2.HttpStatus.OK,
            data: user,
        };
    }
    async createUser(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username }
            ]
        });
        if (existingUser) {
            this.logger.error('User already exists');
            return {
                status: common_2.HttpStatus.CONFLICT,
                message: 'User already exists',
            };
        }
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
        return {
            status: common_2.HttpStatus.CREATED,
            message: 'User created successfully',
        };
    }
    async deleteUser(email) {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['userCharacteristicAssociation'] });
        if (!user) {
            this.logger.error('User not found');
            return {
                status: common_2.HttpStatus.NOT_FOUND,
                message: 'User not found',
            };
        }
        await this.userCharacteristicAssociationRepository.remove(user.userCharacteristicAssociation);
        const userUpdated = await this.userRepository.findOne({ where: { email: email } });
        const userRatings = await this.objectRatingsRepository.find({ where: { users: userUpdated } });
        const ratingsDeleted = await this.objectRatingsRepository.remove(userRatings);
        if (ratingsDeleted) {
            await this.userRepository.delete({ email: email });
        }
        return {
            status: common_2.HttpStatus.OK,
            message: 'User deleted successfully',
        };
    }
    async getUserCharacteristics(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
        }
        const userCharacteristics = await this.userCharacteristicAssociationRepository.find({
            where: { user },
            relations: ['characteristics'],
        });
        if (!userCharacteristics || userCharacteristics.length === 0) {
            throw new common_3.HttpException('Characteristics not found', common_2.HttpStatus.NOT_FOUND);
        }
        const groupedCharacteristics = userCharacteristics.reduce((acc, curr) => {
            const characteristicName = curr.characteristics[0].name;
            if (!acc[characteristicName]) {
                acc[characteristicName] = [];
            }
            if (curr.trust_level === 0) {
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
            status: common_2.HttpStatus.OK,
            data: groupedCharacteristics,
        };
    }
    async getUsersCountByCharacteristic(characteristic) {
        const characteristicObject = await this.characteristicsRepository.findOne({ where: { name: characteristic } });
        if (!characteristicObject) {
            throw new common_4.NotFoundException('Characteristic not found');
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
            status: common_2.HttpStatus.OK,
            data: counts,
        };
    }
    async associateCharacteristics(email, associations) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new common_3.HttpException('User not found', common_2.HttpStatus.NOT_FOUND);
            }
            console.log(associations);
            console.log("Printing characteristics separately:");
            associations.characteristics.forEach(characteristic => {
                console.log(`Characteristic: ${characteristic.characteristic}`);
                console.log(`Option Selected: ${characteristic.option_selected}`);
            });
            for (const association of associations.characteristics) {
                const characteristic = await this.characteristicsRepository.findOne({ where: { name: association.characteristic } });
                if (!characteristic) {
                    throw new common_3.HttpException('Characteristic not found', common_2.HttpStatus.NOT_FOUND);
                }
                const optionSelected = association.option_selected;
                let userCharacteristicAssociation = await this.userCharacteristicAssociationRepository.findOne({ where: { option: optionSelected, user: user, characteristics: characteristic } });
                if (userCharacteristicAssociation) {
                    if (userCharacteristicAssociation.trust_level === 10) {
                        continue;
                    }
                    userCharacteristicAssociation.trust_level++;
                }
                else {
                    userCharacteristicAssociation = new UserCharacteristicAssociation_1.UserCharacteristicAssociation();
                    userCharacteristicAssociation.user = [user];
                    userCharacteristicAssociation.characteristics = [characteristic];
                    userCharacteristicAssociation.option = optionSelected;
                    userCharacteristicAssociation.trust_level = 1;
                }
                await this.userCharacteristicAssociationRepository.save(userCharacteristicAssociation);
            }
            const uniqueCharacteristics = new Set();
            for (const association of associations.characteristics) {
                const characteristicName = association.characteristic;
                if (uniqueCharacteristics.has(characteristicName)) {
                    continue;
                }
                uniqueCharacteristics.add(characteristicName);
                if (characteristicName === 'Diets' || characteristicName === 'Diseases' || characteristicName === 'Allergies') {
                    continue;
                }
                const characteristic = await this.characteristicsRepository.findOne({ where: { name: characteristicName } });
                if (!characteristic) {
                    throw new common_3.HttpException('Characteristic not found', common_2.HttpStatus.NOT_FOUND);
                }
                const optionsSelected = associations.characteristics
                    .filter(c => c.characteristic === characteristicName)
                    .map(c => c.option_selected);
                const otherAssociations = await this.userCharacteristicAssociationRepository.find({
                    where: { user: user, characteristics: characteristic, option: (0, typeorm_2.Not)((0, typeorm_2.In)(optionsSelected)) },
                });
                for (const otherAssociation of otherAssociations) {
                    if (!optionsSelected.includes(otherAssociation.option)) {
                        console.log(`Decreasing trust level for ${otherAssociation.option}`);
                        otherAssociation.trust_level = Math.max(0, otherAssociation.trust_level - 1);
                        await this.userCharacteristicAssociationRepository.save(otherAssociation);
                    }
                }
            }
            return {
                status: common_2.HttpStatus.OK,
                message: 'Characteristics associated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_4.NotFoundException) {
                throw new common_4.NotFoundException('Error associating object');
            }
            else {
                throw error;
            }
        }
    }
    async generateUserCharacteristicMatrix() {
        const users = await this.userRepository.find();
        let userAssociations = await this.userCharacteristicAssociationRepository.find({ relations: ['user', 'characteristics'] });
        const deletionPromises = userAssociations
            .filter(userAssociation => userAssociation.trust_level === 0)
            .map(async (userAssociation) => {
            console.log('Deleting userAssociation with trust level 0:', userAssociation);
            await this.userCharacteristicAssociationRepository.remove(userAssociation);
        });
        await Promise.all(deletionPromises);
        userAssociations = await this.userCharacteristicAssociationRepository.find({ relations: ['user', 'characteristics'] });
        console.log(userAssociations);
        const matrix = [];
        const characteristicsLabels = [];
        const characteristicIndexMap = {};
        for (const user of users) {
            const userAssociationsFiltered = userAssociations.filter(association => association.user.some(assocUser => assocUser.id === user.id));
            const userTrustLevels = [];
            userAssociationsFiltered.forEach(association => {
                const characteristicLabel = `${association.characteristics[0].name}: ${association.option}`;
                let characteristicIndex = characteristicIndexMap[characteristicLabel];
                if (characteristicIndex === undefined) {
                    characteristicIndex = characteristicsLabels.length;
                    characteristicsLabels.push(characteristicLabel);
                    characteristicIndexMap[characteristicLabel] = characteristicIndex;
                }
                while (userTrustLevels.length <= characteristicIndex) {
                    userTrustLevels.push(0);
                }
                userTrustLevels[characteristicIndex] = association.trust_level;
            });
            matrix.push(userTrustLevels);
        }
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
    async cosineSimilarity(user1Id, user2Id, userMatrix) {
        const vector1 = userMatrix[user1Id];
        const vector2 = userMatrix[user2Id];
        let dotProduct = 0;
        for (let i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i] * Math.min(vector1[i], vector2[i]);
        }
        let magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
        let magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));
        const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);
        return cosineSimilarity;
    }
    async getRecommendations(userEmail) {
        try {
            const user = await this.userRepository.findOne({ where: { email: userEmail } });
            if (!user) {
                console.log(`User with email ${userEmail} not found.`);
                return;
            }
            const matrixData = await this.generateUserCharacteristicMatrix();
            const { matrix, users, characteristics } = matrixData;
            const userIndex = users.findIndex((u) => u === user.email);
            const otherUsers = await this.userRepository.find({ where: { email: (0, typeorm_2.Not)(userEmail) } });
            console.log('Other users:', otherUsers);
            const recommendedCharacteristics = [];
            if (otherUsers.length < 2) {
                console.log('Not enough users to calculate similarities.');
                const userCharacteristics = matrix[userIndex];
                const userRecommendedCharacteristics = {};
                for (let i = 0; i < userCharacteristics.length; i++) {
                    const trustLevel = userCharacteristics[i];
                    userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                }
                console.log(`User ${userEmail} characteristics:`, userRecommendedCharacteristics);
                const uniqueCharacteristics = new Set();
                Object.keys(userRecommendedCharacteristics).forEach(label => {
                    if (userRecommendedCharacteristics[label] > 0) {
                        uniqueCharacteristics.add(label);
                    }
                });
                recommendedCharacteristics.forEach(rc => {
                    Object.keys(rc.characteristics).forEach(label => {
                        if (rc.characteristics[label] > 0) {
                            uniqueCharacteristics.add(label);
                        }
                    });
                });
                const uniqueCharacteristicsArray = Array.from(uniqueCharacteristics);
                console.log('Unique characteristics:', uniqueCharacteristicsArray);
                return uniqueCharacteristicsArray;
            }
            const similarities = [];
            for (const otherUser of otherUsers) {
                const otherUserIndex = users.findIndex((u) => u === otherUser.email);
                const similarity = await this.cosineSimilarity(userIndex, otherUserIndex, matrix);
                similarities.push({ user1: user.email, user2: otherUser.email, similarity });
            }
            similarities.sort((a, b) => b.similarity - a.similarity);
            const mostSimilarUsers = similarities.slice(0, 2);
            for (const similarUser of mostSimilarUsers) {
                console.log(`Similarity between ${similarUser.user1} and ${similarUser.user2}:`, similarUser.similarity);
                if (isNaN(similarUser.similarity)) {
                    continue;
                }
                const similarUserIndex = users.findIndex((u) => u === similarUser.user2);
                const userCharacteristics = matrix[similarUserIndex];
                const userRecommendedCharacteristics = {};
                const minTrustLevel = 3;
                for (let i = 0; i < userCharacteristics.length; i++) {
                    const trustLevel = userCharacteristics[i];
                    if (trustLevel > minTrustLevel) {
                        userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                    }
                }
                if (Object.keys(userRecommendedCharacteristics).length === 0) {
                    console.log('No characteristics with trust level greater than 3');
                    for (let i = 0; i < userCharacteristics.length; i++) {
                        const trustLevel = userCharacteristics[i];
                        if (trustLevel > 2) {
                            userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                        }
                    }
                }
                if (Object.keys(userRecommendedCharacteristics).length === 0) {
                    console.log('No characteristics with trust level greater than 2');
                    for (let i = 0; i < userCharacteristics.length; i++) {
                        const trustLevel = userCharacteristics[i];
                        if (trustLevel > 1) {
                            userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                        }
                    }
                }
                if (Object.keys(userRecommendedCharacteristics).length === 0) {
                    console.log('No characteristics with trust level greater than 1');
                    for (let i = 0; i < userCharacteristics.length; i++) {
                        const trustLevel = userCharacteristics[i];
                        if (trustLevel > 0) {
                            userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                        }
                    }
                }
                recommendedCharacteristics.push({ user: similarUser.user2, characteristics: userRecommendedCharacteristics });
            }
            console.log(`Two most similar users to ${userEmail}:`, mostSimilarUsers);
            console.log(`Recommended characteristics for user ${userEmail} from ${mostSimilarUsers[0].user2} and ${mostSimilarUsers[1].user2}:`, recommendedCharacteristics);
            const uniqueCharacteristics = new Set();
            const uniqueCharacteristicsArray = Array.from(uniqueCharacteristics);
            if (uniqueCharacteristics.size === 0) {
                const userCharacteristics = matrix[userIndex];
                const userRecommendedCharacteristics = {};
                for (let i = 0; i < userCharacteristics.length; i++) {
                    const trustLevel = userCharacteristics[i];
                    userRecommendedCharacteristics[characteristics[i]] = trustLevel;
                }
                const uniqueCharacteristics = new Set();
                Object.keys(userRecommendedCharacteristics).forEach(label => {
                    if (userRecommendedCharacteristics[label] > 0) {
                        uniqueCharacteristics.add(label);
                    }
                });
                recommendedCharacteristics.forEach(rc => {
                    Object.keys(rc.characteristics).forEach(label => {
                        if (rc.characteristics[label] > 0) {
                            uniqueCharacteristics.add(label);
                        }
                    });
                });
                const uniqueCharacteristicsArray = Array.from(uniqueCharacteristics);
                console.log(`All Recommended Characteristics based on predictions and ${userEmail} profile:`, uniqueCharacteristicsArray);
                return uniqueCharacteristicsArray;
            }
            return uniqueCharacteristicsArray;
        }
        catch (error) {
            console.error('Error calculating user similarities:', error);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(UserCharacteristicAssociation_1.UserCharacteristicAssociation)),
    __param(2, (0, typeorm_1.InjectRepository)(Characteristics_1.Characteristics)),
    __param(4, (0, typeorm_1.InjectRepository)(ObjectRatings_1.ObjectRatings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        objects_service_1.ObjectsService,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
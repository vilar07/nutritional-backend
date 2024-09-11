import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';
import { ActivateWhen } from '../../objects/entities/ActivateWhen';
import { ActivateUntil } from '../../objects/entities/ActivateUntil';
import { ObjectCharacteristicsAssociation } from '../../objects/entities/ObjectCharacteristicsAssociation';
import { UserCharacteristicAssociation } from 'src/users/entities/UserCharacteristicAssociation';
export declare class Characteristics {
    id: number;
    name: string;
    category: string | null;
    created_at: Date;
    characteristicsPossibleOptions: CharacteristicsPossibleOptions;
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
    userCharacteristicAssociation: UserCharacteristicAssociation[];
    activate_whens: ActivateWhen[];
    activate_untils: ActivateUntil[];
}

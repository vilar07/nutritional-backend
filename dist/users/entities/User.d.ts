import { UserCharacteristicAssociation } from "./UserCharacteristicAssociation";
import { ObjectRatings } from "../../objects/entities/ObjectRatings";
export declare class User {
    id: number;
    username: string;
    email: string;
    created_at: Date;
    userCharacteristicAssociation: UserCharacteristicAssociation[];
    ratings: ObjectRatings[];
}

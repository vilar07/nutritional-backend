import { User } from "./User";
import { Characteristics } from "../../characteristics/entities/Characteristics";
export declare class UserCharacteristicAssociation {
    ID: number;
    option: string;
    trust_level: number;
    user: User[];
    characteristics: Characteristics[];
}

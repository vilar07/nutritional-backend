import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable} from "typeorm";
import { User } from "./User";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { Min, Max } from 'class-validator';


@Entity('UserCharacteristicAssociation')
export class UserCharacteristicAssociation {
    
    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;

    @Column({ type: 'varchar' })
    option: string;

    //max number of trust level is 10
    @Column({ type: 'int', default: 0 })
    @Min(0, { message: 'Trust level cannot be less than 0' })
    @Max(10, { message: 'Trust level cannot be greater than 10' })
    trust_level: number;

    @ManyToMany(() => User, user => user.userCharacteristicAssociation, { nullable: true })
    @JoinTable({ name: 'user_id' })
    user: User[];

    @ManyToMany(() => Characteristics, characteristic => characteristic.objectCharacteristicsAssociations ,{ nullable: true })
    @JoinTable({ name: 'characteristics_user_id' })
    characteristics: Characteristics[];

}

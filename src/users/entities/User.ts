import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserCharacteristicAssociation } from "./UserCharacteristicAssociation";
import { ObjectRatings } from "../../objects/entities/ObjectRatings";

@Entity({name: 'users'}) //name of the table
export class User {

    @PrimaryGeneratedColumn({ type: 'bigint' }) // id auto increment
    id: number;

    @Column() 
    username: string;

    @Column()
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToMany(() => UserCharacteristicAssociation, userCharacteristicAssociation => userCharacteristicAssociation.user)
    userCharacteristicAssociation: UserCharacteristicAssociation[];

    @ManyToMany(() => ObjectRatings, objectRating => objectRating.users)
    ratings: ObjectRatings[];
}
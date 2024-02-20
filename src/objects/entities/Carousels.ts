import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";

@Entity('carousels')
export class Carousels{

    @PrimaryGeneratedColumn({type: 'bigint'})
    ID: number;

    @Column({ type: 'blob' })
    image_video: Buffer;

    @Column({ type: 'varchar' })
    link: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.carousels)
    activate_whens: ActivateWhen[];

    @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.carousels)
    activate_untils: ActivateUntil[];

    @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.carousels)
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}
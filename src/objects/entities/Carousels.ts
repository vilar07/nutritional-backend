import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";

@Entity('carousels')
export class Carousels{

    @PrimaryGeneratedColumn({type: 'bigint'})
    ID: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar' })
    subtitle: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text'})
    images: string;

    @Column({ type: 'int', default: 0 }) // Adicionando o campo de número de visualizações
    views: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.carousels)
    activate_whens: ActivateWhen[];

    @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.carousels)
    activate_untils: ActivateUntil[];

    @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.carousels)
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}
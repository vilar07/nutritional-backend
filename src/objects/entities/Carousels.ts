import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable} from "typeorm";
import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";
import { CarouselItem } from "./CarouselItem";

@Entity('carousels')
export class Carousels{

    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'int', default: 0 }) // Adicionando o campo de número de visualizações
    views: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @OneToMany(() => CarouselItem, item => item.carousel)
    @JoinTable()
    items: CarouselItem[];

    @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.carousels)
    activate_whens: ActivateWhen[];

    @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.carousels)
    activate_untils: ActivateUntil[];

    @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.carousels)
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}
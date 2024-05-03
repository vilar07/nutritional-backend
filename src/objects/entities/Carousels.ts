import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable} from "typeorm";
import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";
import { CarouselItem } from "./CarouselItem";
import { ObjectRatings } from "./ObjectRatings";

@Entity('carousels')
export class Carousels{

    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'int', default: 0 }) // Adicionando o campo de número de visualizações
    views: number;

    @Column({ type: 'varchar', nullable: true }) // Time of day relevance
    time_of_day_relevance: string;

    @Column({ type: 'varchar', nullable: true }) // Seasonal relevance
    season_relevance: string; // You can store seasons as strings, e.g., "spring", "summer", "fall", "winter"

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

    @ManyToMany(() => ObjectRatings, objectRating => objectRating.carousels)
    ratings: ObjectRatings[];
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Carousels } from "./Carousels";

@Entity('carousel_items')
export class CarouselItem {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar' })
    subtitle: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text' })
    image: string;

    @Column({ type: 'varchar' })
    link: string;

    @Column({ type: 'varchar' })
    buttonText: string;

    @ManyToOne(() => Carousels, carousels => carousels.items)
    carousel: Carousels;
}
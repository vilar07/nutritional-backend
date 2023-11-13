import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";

@Entity('carousels')
export class Carousels{

    @PrimaryGeneratedColumn({type: 'bigint'})
    ID: number;

    @Column({ type: 'blob' })
    image_video: Buffer;

    @Column({ type: 'varchar' })
    link: string;

    @ManyToMany(() => Characteristics, characteristics => characteristics.carousels)
    @JoinTable()
    characteristic_meaning_of_clicking: Characteristics[];

    @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.carousels)
    @JoinTable()
    activate_whens: ActivateWhen[];

    @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.carousels)
    @JoinTable()
    activate_untils: ActivateUntil[];
}
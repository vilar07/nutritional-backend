import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { Carousels } from "../entities/Carousels";
import { MealCards } from "../entities/MealCards";
import { Calculators } from "../entities/Calculators";
import { Articles } from "../entities/Articles";
import { Forms } from "../entities/Forms";

@Entity('activateUntil')
export class ActivateUntil{
    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;
  
    @Column({ type: 'datetime', nullable: true })
    datetime_value: Date;

    @ManyToMany(() => Characteristics, characteristics => characteristics.activate_untils)
    characteristics: Characteristics[];
    
    @ManyToMany(() => Carousels, carousels => carousels.activate_untils)
    carousels: Carousels[];

    @ManyToMany(() => MealCards, mealCards => mealCards.activate_untils)
    mealCards: MealCards[];

    @ManyToMany(() => Calculators, calculators => calculators.activate_untils)
    calculators: Calculators[];

    @ManyToMany(() => Articles, articles => articles.activate_untils)
    articles: Articles[];

    @ManyToMany(() => Forms, forms => forms.activate_untils)
    forms: Forms[];


}
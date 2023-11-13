import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Calculators } from "./Calculators";
import { Articles } from "./Articles";
import { Forms } from "./Forms";

@Entity('activateWhen')
export class ActivateWhen{
    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;
  
    @Column({ type: 'datetime', nullable: true })
    datetime_value: Date;
  
    @ManyToMany(() => Characteristics, characteristics => characteristics.activateWhens)
    @JoinTable()
    characteristics: Characteristics[]; 

    @ManyToMany(() => Carousels, carousels => carousels.activate_whens)
    carousels: Carousels[];

    @ManyToMany(() => MealCards, mealCards => mealCards.characteristic_meaning_of_clicking)
    mealCards: MealCards[];

    @ManyToMany(() => Calculators, calculators => calculators.characteristic_meaning_of_clicking)
    calculators: Calculators[];

    @ManyToMany(() => Articles, articles => articles.characteristic_meaning_of_clicking)
    articles: Articles[];

    @ManyToMany(() => Forms, forms => forms.characteristic_meaning_of_clicking)
    forms: Forms[];
}

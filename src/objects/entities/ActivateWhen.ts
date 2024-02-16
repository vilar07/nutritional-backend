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

    @ManyToMany(() => Characteristics, characteristics => characteristics.activate_whens)
    characteristics: Characteristics[];

    @ManyToMany(() => Carousels, carousels => carousels.activate_whens)
    carousels: Carousels[];

    @ManyToMany(() => MealCards, mealCards => mealCards.activate_whens)
    mealCards: MealCards[];

    @ManyToMany(() => Calculators, calculators => calculators.activate_whens)
    calculators: Calculators[];

    @ManyToMany(() => Articles, articles => articles.activate_whens)
    articles: Articles[];

    @ManyToMany(() => Forms, forms => forms.activate_whens)
    forms: Forms[];
}

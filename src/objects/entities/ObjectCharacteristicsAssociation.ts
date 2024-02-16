import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany} from "typeorm";
import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Calculators } from "./Calculators";
import { Articles } from "./Articles";
import { Forms } from "./Forms";
import { Characteristics } from "../../characteristics/entities/Characteristics";


@Entity('ObjectCharacteristicsAssociation')
export class ObjectCharacteristicsAssociation {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    ID: number;

    @Column()
    option_selected: string;

    @ManyToMany(() => Characteristics, characteristic => characteristic.objectCharacteristicsAssociations ,{ nullable: true })
    @JoinTable({ name: 'characteristics_id' })
    characteristics: Characteristics[];

    @ManyToMany(() => Carousels, carousels => carousels.objectCharacteristicsAssociations, { nullable: true })
    @JoinTable({ name: 'carousel_id' })
    carousels: Carousels[];

    @ManyToMany(() => MealCards, mealCards => mealCards.objectCharacteristicsAssociations, { nullable: true })
    @JoinTable({ name: 'meal_card_id' })
    mealCards: MealCards[];

    @ManyToMany(() => Calculators, calculators => calculators.objectCharacteristicsAssociations, { nullable: true })
    @JoinTable({ name: 'calculator_id' })
    calculators: Calculators[];

    @ManyToMany(() => Articles, articles => articles.objectCharacteristicsAssociations, { nullable: true })
    @JoinTable({ name: 'article_id' })
    articles: Articles[];

    @ManyToMany(() => Forms, forms => forms.objectCharacteristicsAssociations, { nullable: true })
    @JoinTable({ name: 'form_id' })
    forms: Forms[];
}
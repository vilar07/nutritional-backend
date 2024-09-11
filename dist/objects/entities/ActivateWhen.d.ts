import { Characteristics } from "../../characteristics/entities/Characteristics";
import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Calculators } from "./Calculators";
import { Articles } from "./Articles";
import { Forms } from "./Forms";
export declare class ActivateWhen {
    ID: number;
    datetime_value: Date;
    characteristics: Characteristics[];
    carousels: Carousels[];
    mealCards: MealCards[];
    calculators: Calculators[];
    articles: Articles[];
    forms: Forms[];
}

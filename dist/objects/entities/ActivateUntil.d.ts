import { Characteristics } from "../../characteristics/entities/Characteristics";
import { Carousels } from "../entities/Carousels";
import { MealCards } from "../entities/MealCards";
import { Calculators } from "../entities/Calculators";
import { Articles } from "../entities/Articles";
import { Forms } from "../entities/Forms";
export declare class ActivateUntil {
    ID: number;
    datetime_value: Date;
    characteristics: Characteristics[];
    carousels: Carousels[];
    mealCards: MealCards[];
    calculators: Calculators[];
    articles: Articles[];
    forms: Forms[];
}

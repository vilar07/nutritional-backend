import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Calculators } from "./Calculators";
import { Articles } from "./Articles";
import { Forms } from "./Forms";
import { Characteristics } from "../../characteristics/entities/Characteristics";
export declare class ObjectCharacteristicsAssociation {
    ID: number;
    option_selected: string;
    characteristics: Characteristics[];
    carousels: Carousels[];
    mealCards: MealCards[];
    calculators: Calculators[];
    articles: Articles[];
    forms: Forms[];
}

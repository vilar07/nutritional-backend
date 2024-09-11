import { User } from "../../users/entities/User";
import { Articles } from "./Articles";
import { Calculators } from "./Calculators";
import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Forms } from "./Forms";
export declare class ObjectRatings {
    ID: number;
    rating: number;
    users: User[];
    articles: Articles[];
    calculators: Calculators[];
    carousels: Carousels[];
    mealCards: MealCards[];
    forms: Forms[];
}

import { ActivateWhen } from "../entities/ActivateWhen";
import { ActivateUntil } from "../entities/ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";
import { CarouselItem } from "./CarouselItem";
import { ObjectRatings } from "./ObjectRatings";
export declare class Carousels {
    ID: number;
    title: string;
    views: number;
    time_of_day_relevance: string;
    season_relevance: string;
    created_at: Date;
    items: CarouselItem[];
    activate_whens: ActivateWhen[];
    activate_untils: ActivateUntil[];
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
    ratings: ObjectRatings[];
}

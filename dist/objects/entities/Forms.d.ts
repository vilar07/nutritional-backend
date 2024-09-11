import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";
import { ObjectRatings } from "./ObjectRatings";
export declare class Forms {
    ID: number;
    title: string;
    subtitle: string;
    views: number;
    time_of_day_relevance: string;
    season_relevance: string;
    created_at: Date;
    activate_whens: ActivateWhen[];
    activate_untils: ActivateUntil[];
    objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
    ratings: ObjectRatings[];
}

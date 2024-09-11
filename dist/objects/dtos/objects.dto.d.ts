export declare class GetObjectByIDdto {
    id: number;
    objectType: string;
}
export declare class CreateArticleDTO {
    title: string;
    subtitle: string;
    description: string;
    time_of_day_relevance: string;
    season_relevance: string;
}
export declare class CreateCalculatorDTO {
    title: string;
    subtitle: string;
    description: string;
    image: any;
    variable_to_calculate: string;
    equation: string;
    time_of_day_relevance: string;
    season_relevance: string;
}
export declare class UpdateArticleDTO {
    title?: string;
    subtitle?: string;
    description?: string;
    time_of_day_relevance?: string;
    season_relevance?: string;
}
export declare class AssociationItemDTO {
    characteristic: string;
    options: string[];
}
export declare class AssociateObjectDTO {
    objectType: string;
    title: string;
}
export declare class UpdateAssociationDTO {
    objectType: string;
    title: string;
    associations?: AssociationItemDTO[];
}
export declare class AssociateObjectOptionDTO {
    option: string;
}

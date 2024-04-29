// objects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty } from 'class-validator';

    export class GetObjectByIDdto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object id cannot be empty' })
        id: number;

        @ApiProperty()
        @IsNotEmpty({ message: 'Object type cannot be empty' })
        objectType: string;
    }

    export class CreateArticleDTO {
        @ApiProperty({ description: 'The title of the article', type: 'string' })
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;

        @ApiProperty({ description: 'The subtitle of the article', type: 'string' })
        @IsNotEmpty({ message: 'Subtitle cannot be empty' })
        subtitle: string;

        @ApiProperty({ description: 'The description of the article', type: 'string' })
        @IsNotEmpty({ message: 'Description cannot be empty' })
        description: string;

        @ApiProperty({ description: 'The Time of the day (Morning, Afternoon, Evening)', type: 'string' })
        @IsOptional()
        time_of_day_relevance: string;

        @ApiProperty({ description: 'The Seasonal relevance (Spring, Summer, Fall, Winter)', type: 'string' })
        @IsOptional()
        season_relevance: string;
    }

    export class CreateCalculatorDTO {
        @ApiProperty({ description: 'The title of the calculator', type: 'string' })
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;

        @ApiProperty({ description: 'The subtitle of the calculator', type: 'string' })
        @IsNotEmpty({ message: 'Subtitle cannot be empty' })
        subtitle: string;

        @ApiProperty({ description: 'The data of the calculator', type: 'string' })
        @IsNotEmpty({ message: 'Data cannot be empty' })
        data: string;

        @ApiProperty({ description: 'The equation of the calculator', type: 'string' })
        @IsNotEmpty({ message: 'Equation cannot be empty' })
        equation: string;

        @ApiProperty({ description: 'The Time of the day (Morning, Afternoon, Evening)', type: 'string' })
        @IsOptional()
        time_of_day_relevance: string;

        @ApiProperty({ description: 'The Seasonal relevance (Spring, Summer, Fall, Winter)', type: 'string' })
        @IsOptional()
        season_relevance: string;
    }

    export class UpdateArticleDTO {
        @ApiProperty({ required: false })
        title?: string;
    
        @ApiProperty({ required: false })
        subtitle?: string;
    
        @ApiProperty({ required: false })
        description?: string;

        @ApiProperty({ required: false })
        time_of_day_relevance?: string;

        @ApiProperty({ required: false })
        season_relevance?: string;
    }

    export class AssociationItemDTO {
        @ApiProperty()
        @IsNotEmpty({ message: 'Characteristic cannot be empty' })
        characteristic: string;
    
        @ApiProperty({ type: [String] })
        @IsNotEmpty({ message: 'Options cannot be empty' })
        options: string[];
    }
    
    export class AssociateObjectDTO {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object Type cannot be empty' })
        objectType: string;
    
        @ApiProperty()
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;
    }
    

    export class UpdateAssociationDTO {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object Type cannot be empty' })
        objectType: string;
    
        @ApiProperty()
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;
    
        @ApiProperty({ type: [AssociationItemDTO] })
        @IsOptional()
        associations?: AssociationItemDTO[];
    }

    export class AssociateObjectOptionDTO {

        @ApiProperty()
        @IsNotEmpty({ message: 'Option cannot be empty' })
        option: string;
    }
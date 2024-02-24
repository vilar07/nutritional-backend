// objects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

    export class GetObjectByIDdto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object id cannot be empty' })
        id: number;
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
    }

    export class UpdateArticleDTO {
        @ApiProperty({ required: false })
        title?: string;
    
        @ApiProperty({ required: false })
        subtitle?: string;
    
        @ApiProperty({ required: false })
        description?: string;
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
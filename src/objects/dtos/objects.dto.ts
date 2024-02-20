// objects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

    export class GetObjectByIDdto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object id cannot be empty' })
        id: number;
    }

    export class CreateArticleDTO {
        @ApiProperty()
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Subtitle cannot be empty' })
        subtitle: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Description cannot be empty' })
        description: string;
    }

    export class AssociateObjectDTO {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object Type cannot be empty' })
        objectType: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Characteristic cannot be empty' })
        characteristic: string;
    }

    export class AssociateObjectOptionDTO {

        @ApiProperty()
        @IsNotEmpty({ message: 'Option cannot be empty' })
        option: string;
    }
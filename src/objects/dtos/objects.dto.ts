// objects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

    export class GetObjectByIDdto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object id cannot be empty' })
        id: number;
    }

    export class createArticle {
        @ApiProperty()
        @IsNotEmpty({ message: 'Title cannot be empty' })
        title: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Subtitle cannot be empty' })
        subtitle: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'Characteristics cannot be empty' })
        characteristics_id: string[];
        
        

    }
// objects.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

    export class GetObjectByIDdto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Object id cannot be empty' })
        id: number;
    }
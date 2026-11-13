import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdatePlayerDto {
    @IsNotEmpty()
    readonly phoneNumber: string;

    @IsNotEmpty()
    readonly name: string;

    @IsOptional()
    readonly category: string;
}

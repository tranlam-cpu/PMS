import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class editRentalDto{
    @IsNotEmpty()
    @IsOptional()
    start_date? : Date;

    @IsNotEmpty()
    @IsOptional()
    end_date? : Date;

    @IsNumber()
    @IsOptional()
    rental_duration?: number;

    @IsNumber()
    @IsOptional()
    rental_fee? : number;


    @IsOptional()
    status? : string;

    @IsOptional()
    productId?: string[];

    @IsOptional()
    updatedAt?: Date;
}
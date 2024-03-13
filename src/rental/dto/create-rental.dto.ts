import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createRentalDto{

    @IsNotEmpty()
    start_date : Date;

    @IsNotEmpty()
    end_date : Date;

    @IsNumber()
    @IsOptional()
    rental_duration?: number;

    @IsNumber()
    @IsOptional()
    rental_fee? : number;

    @IsNotEmpty()
    @IsOptional()
    status? : string;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    productId: string[] | string;

}
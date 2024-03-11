import { IsDate, IsOptional, IsString } from "class-validator";


export class editcategoryDto{
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsString()
    description?: string;
    
    @IsOptional()
    active?: boolean;

    @IsOptional()
    @IsDate()
    updated_at?: Date;
}
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createCategoryDto{
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsString()
    description?: string;
    
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
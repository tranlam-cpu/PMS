import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class editProductDto{
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  image?: Express.Multer.File | string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
import { IsArray, IsString } from "class-validator";


export class deleteManyCategoryDto{
    @IsArray()
    ids: string[];
}
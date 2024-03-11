import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCategoryDto, editcategoryDto } from './dto';

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
    ){}
    
    async getAllCategory(){
        return await this.prisma.product_Category.findMany()
    }
    
    async getCategoryById(id: string){
        return await this.prisma.product_Category.findUnique({
            where:{
                id: id
            }
        })
    }

    async createCategory(dto: createCategoryDto){
        try{
            return await this.prisma.product_Category.create({
                data: dto
            })
        }catch(e){
            throw new ForbiddenException(e)
        }
    }

    async updateCategory(id: string, dto: editcategoryDto){
        try{
            return await this.prisma.product_Category.update({
                where:{
                    id: id
                },
                data: {
                    updatedAt: new Date(),
                    ...dto
                }
            })
        }catch(e){
            throw new ForbiddenException(e)
        }
    }

    async deleteCategory(id: string){
        try{
            return await this.prisma.product_Category.delete({
                where:{
                    id: id
                }
            })
        }catch(e){
            throw new ForbiddenException(e)
        }
    }
}

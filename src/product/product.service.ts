import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { editProductDto } from './dto/edit-product.dto';
import { AwsService } from 'src/awsS3.storage.ts/aws.service';

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService, private aws: AwsService) {}

    async getAllProduct(){
        return this.prismaService.product.findMany()
    }

    async createProduct(dto: CreateProductDto){
        try{
          //check image exist
          if(dto.image){
            const url = await this.aws.uploadFile(dto.image as Express.Multer.File)
            dto.image=url
            
          }


          return this.prismaService.product.create({
              data: dto as any
          })
        }catch (error) {
            throw new ForbiddenException(error);
          }
        
    }

    async updateProduct(id: string, dto: editProductDto){
        try {
            //if image exists
            if(dto.image){
              throw new ForbiddenException(`error with code`);
            }


            return await this.prismaService.product.update({
              where: { id },
              data: dto as any,
            });
          } catch (error) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`Product with id ${id} not found`);
            } else {
              throw error;
            }
          }
    }

    async deleteProduct(id: string){
        try{
            // check image exists
            const data=await this.prismaService.product.findUnique({
              where: {id},
              select:{
                image:true,
              },
            })

            if(data.image){
              await this.aws.deleteFile(data.image)
            }

            return this.prismaService.product.delete({
                where: {id}
            })
        }catch (error) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`Product with id ${id} not found`);
            } else {
              throw error;
            }
          }
        
    }
}

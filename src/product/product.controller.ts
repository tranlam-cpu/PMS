import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { editProductDto } from './dto/edit-product.dto';
import { AwsService } from 'src/awsS3.storage.ts/aws.service';


@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
    constructor (private productService: ProductService) {}

    @Get()
    getAllProduct(){
        return this.productService.getAllProduct()
    }

    @Post()
    createProduct(
        @Body() dto:CreateProductDto
    ){

        return this.productService.createProduct(dto)
    }

    @Patch('/:id')
    updateProduct(
        @Param('id') id: string,
        @Body() dto:editProductDto
    ){
        return this.productService.updateProduct(id,dto)
    }

    @Delete('/:id')
    deleteProduct(
        @Param('id') id: string
    ){
        return this.productService.deleteProduct(id)
    }
}

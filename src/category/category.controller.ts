import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto, editcategoryDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    getAllProduct(){
        return this.categoryService.getAllCategory()
    }

    @Get('/:id')
    getProductById(
        @Param('id') id: string,
    ){
        return this.categoryService.getCategoryById(id)
    }

    @Post()
    createProduct(
        @Body() dto: createCategoryDto
    ){
        return this.categoryService.createCategory(dto)
    }

    @Patch('/:id')
    updateProduct(
        @Param('id') id: string,
        @Body() dto: editcategoryDto
    ){
        return this.categoryService.updateCategory(id,dto)
    }

    @Delete('/:id')
    deleteProduct(
        @Param('id') id: string,
    ){
        return this.categoryService.deleteCategory(id)
    }
}

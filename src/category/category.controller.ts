import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto, editcategoryDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    getAllCategory(){
        return this.categoryService.getAllCategory()
    }

    @Get('/:id')
    getCategoryById(
        @Param('id') id: string,
    ){
        return this.categoryService.getCategoryById(id)
    }

    @Post()
    createCategory(
        @Body() dto: createCategoryDto
    ){
        return this.categoryService.createCategory(dto)
    }

    @Patch('/:id')
    updateCategory(
        @Param('id') id: string,
        @Body() dto: editcategoryDto
    ){
        return this.categoryService.updateCategory(id,dto)
    }

    @Delete('/:id')
    deleteCategory(
        @Param('id') id: string,
    ){
        return this.categoryService.deleteCategory(id)
    }
}

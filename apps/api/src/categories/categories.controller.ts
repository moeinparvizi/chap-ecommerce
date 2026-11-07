import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

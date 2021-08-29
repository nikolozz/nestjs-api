import { Injectable } from '@nestjs/common';
import { CategoriesRepostiry } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepostiry) {}

  getAllCategories() {
    return this.categoriesRepository.getAllCategories();
  }

  async getCategoryById(id: number) {
    return this.categoriesRepository.getCategoryById(id);
  }

  async updateCategory(id: number, category: { name: string }) {
    return this.categoriesRepository.updateCategory(id, category);
  }
}

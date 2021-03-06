import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Category)
class CategorysRepository extends Repository<Category> {
  public async getBalance(): Promise<Balance> {
    return { income: 0, outcome: 0, total: 0 };
  }

  public async produce(item: Category): Promise<Category> {
    let category = new Category();
    if (item instanceof Category) {
      category = item;
    } else {
      category.title = item;
    }

    let categoryEntity = await this.findOne({
      where: { title: category.title },
    });

    if (!categoryEntity) {
      const createCategory = this.create(category);
      categoryEntity = await this.save(createCategory);
    }

    return categoryEntity;
  }
}

export default CategorysRepository;

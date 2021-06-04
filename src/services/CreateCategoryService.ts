import { getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import CategoryRepository from '../repositories/CategorysRepository';

class CreateCategoryService {
  public async execute(category: Category): Promise<Category> {
    /*
    const categoryRepository = getRepository(Category);

    let categoryEntity = await categoryRepository.findOne({
      where: { title: category.title },
    });

    if (!categoryEntity) {
      const createCategory = categoryRepository.create(category);
      categoryEntity = await categoryRepository.save(createCategory);
    }
*/
    const categoryEntity = await getCustomRepository(
      CategoryRepository,
    ).produce(category);
    return categoryEntity;
  }
}

export default CreateCategoryService;

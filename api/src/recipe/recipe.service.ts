import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}
  async create(createRecipeDto: CreateRecipeDto) {
    const { name, description, foodIdList } = createRecipeDto;
    const recipe = await this.prisma.recipe.create({
      data: {
        name,
        description
      }
    });
    const recipeId = recipe.recipeId;
    await this.prisma.recipeFoodList.createMany({
      data: foodIdList.map((e) => {
        return { recipeId, foodId: e };
      })
    });
    return 'Create recipe successfully';
  }

  async findAll() {
    const recipes = await this.prisma.recipe.findMany();
    return recipes;
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        recipeId: id
      },
      include: {
        foods: {
          include: { food: true }
        }
      }
    });
    const foodNames = recipe.foods.map((recipeFood) => {
      return {
        foodId: recipeFood.foodId,
        foodNames: recipeFood.food.name
      };
    });
    return {
      recipeId: recipe.recipeId,
      name: recipe.name,
      description: recipe.description,
      foods: foodNames
    };
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const { name, description, foodIdList } = updateRecipeDto;
    try {
      await this.prisma.recipe.update({
        where: {
          recipeId: id
        },
        data: {
          name: name,
          description: description
        }
      });

      const oldFoodIdList = await this.prisma.recipeFoodList.findMany({
        where: { recipeId: id }
      });

      const oldFoodIds = oldFoodIdList.map((recipeFood) => recipeFood.foodId);
      const foodIdsToDelete = oldFoodIds.filter(
        (oldFoodId) => !foodIdList.includes(oldFoodId)
      );
      const newIdsToAdd = foodIdList.filter(
        (foodId) => !oldFoodIds.includes(foodId)
      );
      await this.prisma.recipeFoodList.deleteMany({
        where: {
          recipeId: id,
          foodId: { in: foodIdsToDelete }
        }
      });

      await this.prisma.recipeFoodList.createMany({
        data: newIdsToAdd.map((newId) => {
          return {
            foodId: newId,
            recipeId: id
          };
        })
      });
    } catch (err) {
      console.log(err);
    }
    return 'Updated successfully';
  }

  async remove(id: number) {
    try {
      await this.prisma.recipeFoodList.deleteMany({
        where: {
          recipeId: id
        }
      });
      await this.prisma.recipe.delete({
        where: {
          recipeId: id
        }
      });
      return 'Delete successfully';
    } catch (err) {
      console.log(err);
    }
  }
}

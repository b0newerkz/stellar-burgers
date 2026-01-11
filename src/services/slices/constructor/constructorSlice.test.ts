import { constructorReducer, addIngredient, removeIngredient, moveIngredient } from './constructorSlice';
import type { ConstructorState } from './constructorSlice';
import type { TConstructorIngredient, TIngredient } from '../../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: 'bun.png',
  image_mobile: 'bun-m.png',
  image_large: 'bun-l.png'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 2,
  image: 'sauce.png',
  image_mobile: 'sauce-m.png',
  image_large: 'sauce-l.png'
};

describe('constructorSlice reducer', () => {
	
 	test('Добавление начинки', () => {

		const prevState: ConstructorState = {
			constructorItems: {
				bun: null,
				ingredients: []
			}
		};

		const nextState = constructorReducer(prevState, addIngredient(sauce));

		expect(nextState.constructorItems.ingredients).toHaveLength(1);
		expect(nextState.constructorItems.ingredients[0]._id).toBe('sauce-1');
		expect(nextState.constructorItems.ingredients[0]).toHaveProperty('id');
  });

  test('Добавление булки', () => {
	const prevState: ConstructorState = {
		constructorItems: {
			bun: null,
			ingredients: []
		}
	};

	const nextState = constructorReducer(prevState, addIngredient(bun));

	expect(nextState.constructorItems.bun?._id).toBe('bun-1');
	expect(nextState.constructorItems.ingredients).toHaveLength(0);
  });

  test('Удалить ингредент по id', () => {
	const ingredient1: TConstructorIngredient = { ...sauce, id: 'id-1' };
	const ingredient2: TConstructorIngredient = { ...sauce, _id: 'sauce-2', id: 'id-2' };

	const prevState: ConstructorState = {
		constructorItems: {
			bun: null,
			ingredients: [ingredient1, ingredient2]
		}
	};

	const nextState = constructorReducer(prevState, removeIngredient('id-1'));

	expect(nextState.constructorItems.ingredients).toEqual([ingredient2]);
  });

  test('Изменение порядка ингредиентов в заказе', () => {
	const ingredient1: TConstructorIngredient = { ...sauce, id: 'id-1', name: 'A' };
	const ingredient2: TConstructorIngredient = { ...sauce, _id: 'sauce-2', id: 'id-2', name: 'B' };
	const ingredient3: TConstructorIngredient = { ...sauce, _id: 'sauce-3', id: 'id-3', name: 'C' };

	const prevState: ConstructorState = {
		constructorItems: {
			bun: null,
			ingredients: [ingredient1, ingredient2, ingredient3]
		}
	};

	const nextState = constructorReducer(prevState, moveIngredient({ fromIndex: 0, toIndex: 2 }));

	expect(nextState.constructorItems.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-3', 'id-1']);
  });
});

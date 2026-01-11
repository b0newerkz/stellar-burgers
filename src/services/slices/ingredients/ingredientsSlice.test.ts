import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';
import type { IngredientsState } from './ingredientsSlice';
import type { TIngredient } from '../../../utils/types';

describe('ingredientsSlice reducer', () => {

	test('Pending: ставит isLoading = true и очищает error', () => {
		const prevState: IngredientsState = {
			items: [],
			isLoading: false,
			error: 'Какая-то ошибка'
		};

		const nextState = ingredientsReducer(prevState, fetchIngredients.pending('', undefined));

		expect(nextState.isLoading).toBe(true);
		expect(nextState.error).toBeNull();
	});

	test('Fulfilled: записывает ингредиенты и ставит isLoading = false', () => {
		const prevState: IngredientsState = {
			items: [],
			isLoading: true,
			error: null
		};

		const items: TIngredient[] = [
			{
				_id: 'id-1',
				name: 'Ингредиент',
				type: 'main',
				proteins: 0,
				fat: 0,
				carbohydrates: 0,
				calories: 0,
				price: 10,
				image: '1.png',
				image_mobile: '1m.png',
				image_large: '1l.png'
			}
		];

		const nextState = ingredientsReducer(prevState, fetchIngredients.fulfilled(items, '', undefined));

		expect(nextState.isLoading).toBe(false);
		expect(nextState.items).toEqual(items);
	});

	test('Rejected: записывает ошибку и ставит isLoading = false', () => {
		const prevState: IngredientsState = {
			items: [],
			isLoading: true,
			error: null
		};

		const action = {
			type: fetchIngredients.rejected.type,
			error: {
				message: 'Ошибка сети'
			}
		};

		const nextState = ingredientsReducer(prevState, action);

		expect(nextState.isLoading).toBe(false);
		expect(nextState.error).toBe('Ошибка сети');
	});
});

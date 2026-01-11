import { profileOrdersReducer, fetchProfileOrders } from './profileOrdersSlice';
import type { ProfileOrdersState } from './profileOrdersSlice';
import type { TOrder } from '../../../utils/types';

describe('profileOrdersSlice reducer', () => {
	test('pending: ставит isLoading = true и очищает error', () => {
		const prevState: ProfileOrdersState = {
			orders: [],
			isLoading: false,
			error: 'Старая ошибка'
		};

		const nextState = profileOrdersReducer(
			prevState,
			fetchProfileOrders.pending('', undefined)
		);

		expect(nextState.isLoading).toBe(true);
		expect(nextState.error).toBeNull();
	});

	test('fulfilled: записывает заказы и ставит isLoading = false', () => {
		const prevState: ProfileOrdersState = {
			orders: [],
			isLoading: true,
			error: null
		};

		const orders: TOrder[] = [
		{
			_id: 'order-1',
			status: 'done',
			name: 'Заказ 1',
			createdAt: '-',
			updatedAt: '-',
			number: 1,
			ingredients: ['id-1']
		}
		];

		const nextState = profileOrdersReducer(
			prevState,
			fetchProfileOrders.fulfilled(orders, '', undefined)
		);

		expect(nextState.isLoading).toBe(false);
		expect(nextState.orders).toEqual(orders);
	});

	test('rejected: записывает ошибку и ставит isLoading = false', () => {
		const prevState: ProfileOrdersState = {
			orders: [],
			isLoading: true,
			error: null
		};

		const action = {
			type: fetchProfileOrders.rejected.type,
			error: { message: 'Ошибка загрузки' }
		};

		const nextState = profileOrdersReducer(prevState, action);

		expect(nextState.isLoading).toBe(false);
		expect(nextState.error).toBe('Ошибка загрузки');
	});
});

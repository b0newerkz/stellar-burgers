import {
  orderReducer,
  createOrder,
  clearOrderModal,
  setOrderError
} from './orderSlice';
import type { OrderState } from './orderSlice';
import type { TOrder } from '../../../utils/types';

describe('orderSlice reducer', () => {

	test('createOrder.pending: ставит orderRequest = true и очищает данные/ошибку', () => {
		const prevState: OrderState = {
			orderRequest: false,
			orderModalData: {} as TOrder,
			error: 'Старая ошибка'
		};

		const nextState = orderReducer(prevState, createOrder.pending('', []));

		expect(nextState.orderRequest).toBe(true);
		expect(nextState.orderModalData).toBeNull();
		expect(nextState.error).toBeNull();
	});

	test('createOrder.fulfilled: записывает заказ и ставит orderRequest = false', () => {
		const prevState: OrderState = {
			orderRequest: true,
			orderModalData: null,
			error: null
		};

		const order: TOrder = {
			_id: 'order-1',
			status: 'done',
			name: 'Заказ',
			createdAt: '',
			updatedAt: '',
			number: 1,
			ingredients: ['id-1']
		};

		const nextState = orderReducer(prevState, createOrder.fulfilled(order, '', []));

		expect(nextState.orderRequest).toBe(false);
		expect(nextState.orderModalData).toEqual(order);
	});

	test('createOrder.rejected: записывает ошибку и ставит orderRequest = false', () => {
		const prevState: OrderState = {
			orderRequest: true,
			orderModalData: null,
			error: null
		};

		const action = {
			type: createOrder.rejected.type,
			error: { message: 'Ошибка заказа' }
		};

		const nextState = orderReducer(prevState, action);

		expect(nextState.orderRequest).toBe(false);
		expect(nextState.error).toBe('Ошибка заказа');
	});

	test('clearOrderModal: сбрасывает состояние модалки заказа', () => {
		const prevState: OrderState = {
			orderRequest: true,
			orderModalData: {} as TOrder,
			error: 'Ошибка'
		};

		const nextState = orderReducer(prevState, clearOrderModal());

		expect(nextState).toEqual({
			orderRequest: false,
			orderModalData: null,
			error: null
		});
	});

	test('setOrderError записывает ошибку', () => {
		const prevState: OrderState = {
			orderRequest: false,
			orderModalData: null,
			error: null
		};

		const nextState = orderReducer(prevState, setOrderError('Текст ошибки'));

		expect(nextState.error).toBe('Текст ошибки');
	});
});

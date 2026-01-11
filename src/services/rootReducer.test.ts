import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  test('Возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        }
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        updateUserError: null
      },
      feed: {
        orders: [],
        feed: null,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    });
  });
});

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store';
import type { TConstructorIngredient, TIngredient } from '../../../utils/types';

export type ConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type ConstructorState = {
  constructorItems: ConstructorItems;
};

export type MoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
          return;
        }

        state.constructorItems.ingredients.push(ingredient);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    moveIngredient: (state, action: PayloadAction<MoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;
      const items = state.constructorItems.ingredients;

      if (fromIndex === toIndex) return;
      if (fromIndex < 0 || fromIndex >= items.length) return;
      if (toIndex < 0 || toIndex >= items.length) return;

      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
    },

    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  }
});

export const constructorReducer = constructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

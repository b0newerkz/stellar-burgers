import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useAppSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/constructor/constructorSlice';

import { useAppDispatch } from '../../services/store';
import {
  clearOrderModal,
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/order/orderSlice';

import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/auth/authSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector(selectConstructorItems);
  const dispatch = useAppDispatch();

  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(selectOrderModalData);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ids: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ids));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

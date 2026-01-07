import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feed/feedSlice';
import { selectProfileOrders } from '../../services/slices/profile-orders/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients: TIngredient[] = useAppSelector(selectIngredients);

  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);

  const orderNumber = Number(number);
  const orderData =
    feedOrders.find((o) => o.number === orderNumber) ||
    profileOrders.find((o) => o.number === orderNumber) ||
    null;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

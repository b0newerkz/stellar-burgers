import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feed/feedSlice';
import { selectProfileOrders } from '../../services/slices/profile-orders/profileOrdersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients: TIngredient[] = useAppSelector(selectIngredients);

  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);

  const orderNumber = Number(number);
  const orderFromStore =
    feedOrders.find((o) => o.number === orderNumber) ||
    profileOrders.find((o) => o.number === orderNumber) ||
    null;

  const [orderFromApi, setOrderFromApi] = useState<TOrder | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderRequestDone, setOrderRequestDone] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!orderFromStore && Number.isFinite(orderNumber) && !orderRequestDone) {
      setIsOrderLoading(true);
      getOrderByNumberApi(orderNumber)
        .then((res) => {
          if (!isMounted) return;
          setOrderFromApi(res.orders?.[0] ?? null);
        })
        .catch(() => {
          if (!isMounted) return;
          setOrderFromApi(null);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsOrderLoading(false);
          setOrderRequestDone(true);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [orderFromStore, orderNumber, orderRequestDone]);

  const orderData = orderFromStore || orderFromApi;

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
    if (isOrderLoading) return <Preloader />;
    if (orderRequestDone) {
      return <p className='text text_type_main-default'>Заказ не найден.</p>;
    }
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

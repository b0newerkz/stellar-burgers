import { FC, ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { useAppSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/auth/authSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from ? from.pathname : '/'} replace />;
  }

  return element;
};

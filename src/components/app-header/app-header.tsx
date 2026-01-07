import { FC } from 'react';
import { AppHeaderUI } from '@ui';

import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/slices/auth/authSlice';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  return <AppHeaderUI userName={user?.name || ''} />;
};

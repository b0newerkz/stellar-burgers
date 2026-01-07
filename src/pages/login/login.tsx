import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUser, selectUser } from '../../services/slices/auth/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectUser);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorText('');

    const action = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(action)) {
      navigate(from, { replace: true });
      return;
    }

    setErrorText(action.error.message || 'Не удалось войти');
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

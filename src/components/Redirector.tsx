/* eslint-disable react-refresh/only-export-components */
import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '../contexts/Auth.tsx';

function ToHome({ children }: PropsWithChildren) {
  const { loggedIn } = useAuth();

  return loggedIn ? children : <Navigate to="/login" />;
}

function ToLogin({ children }: PropsWithChildren) {
  const { loggedIn } = useAuth();

  return !loggedIn ? children : <Navigate to="/" />;
}

export const Redirector = {
  ToLogin,
  ToHome
}
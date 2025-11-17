/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { NO_AUTH_CODE, OK_CODE } from '../api/config';
import { refresh } from '../api/users';

type User = {
  id: number;
  name: string;
  email: string;
}

export type AuthHeadersProps = {
  token: string;
}

type AuthContextProps = {
  loggedIn: boolean;
  user: User|null;
  headers: AuthHeadersProps|null;
  logIn: (token: string, user: User) => void;
  logOut: () => void;
  request: (callback: (token: string) => Promise<[number, unknown]>) => Promise<unknown | void>
};

type AuthProviderProps = PropsWithChildren;

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User|null>(null);
  const [headers, setHeaders] = useState<AuthHeadersProps|null>(null);

  useEffect(() => {
    const sessionUser = localStorage.getItem('synk@user');
    const sessionToken = localStorage.getItem('synk@token');

    if (sessionUser && sessionToken) {
      setUser((JSON.parse(sessionUser)) as User);
      setHeaders({
        token: sessionToken
      });
    }
  }, []);

  function logIn(token: string, user: User) {
    setUser(user);
    setHeaders({
      token
    });

    localStorage.setItem('synk@user', JSON.stringify(user));
    localStorage.setItem('synk@token', token);
  }

  function logOut() {
    setUser(null);
    setHeaders(null);

    localStorage.removeItem('synk@user');
    localStorage.removeItem('synk@token');
  }

  async function request(callback: (token: string) => Promise<[number, unknown]>): Promise<unknown> {
    let accessToken = '';

    if (headers) {
      accessToken = headers.token;
    }

    const response = await callback(accessToken);
    const httpCode = response[0];
    const content = response[1];

    if (httpCode === NO_AUTH_CODE) {
      const [refreshHttpCode, refreshInfo] = await refresh();

      if (refreshHttpCode !== OK_CODE || !refreshInfo.resource.ok) {
        let errorMessage = 'Erro ao revalidar token de acesso';

        if (refreshInfo.resource.error) {
          errorMessage += ` [${refreshInfo.resource.error}]`;
        }

        toast.error(errorMessage);
        logOut();
        navigate('/login');

        return {};
      }

      logIn(refreshInfo.user.token, {
        email: refreshInfo.user.user_email,
        name: refreshInfo.user.user_name,
        id: refreshInfo.user.user_id,
      });

      return request(() => callback(refreshInfo.user.token));
    }

    return content;
  }

  return (
    <AuthContext.Provider value={{
      loggedIn: !!user,
      user,
      headers,
      logIn,
      logOut,
      request
    }}>
      {children}
    </AuthContext.Provider>
  );
}
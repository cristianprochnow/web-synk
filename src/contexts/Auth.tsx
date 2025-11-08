/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

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
};

type AuthProviderProps = PropsWithChildren;

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User|null>(null);
  const [headers, setHeaders] = useState<AuthHeadersProps|null>(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('synk@user');
    const sessionToken = sessionStorage.getItem('synk@token');

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

    sessionStorage.setItem('synk@user', JSON.stringify(user));
    sessionStorage.setItem('synk@token', token);
  }

  function logOut() {
    setUser(null);
    setHeaders(null);

    sessionStorage.removeItem('synk@user');
    sessionStorage.removeItem('synk@token');
  }

  return (
    <AuthContext.Provider value={{
      loggedIn: !!user,
      user,
      headers,
      logIn,
      logOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
import { AUTH_ENDPOINT } from "./config";

export type LoginRequestData = {
  user_email: string | null;
  user_pass: string | null;
};

export type RegisterRequestData = {
  user_name: string | null;
  user_email: string | null;
  user_pass: string | null;
};

export type UserResponse<T> = {
  resource: {
    ok: boolean
    error: string
  }
  user: T
};

export type UserLoginResponseInfo = {
  user_id: number;
  user_name: string;
  user_email: string;
  token: string;
};

export type UserRegisterResponseInfo = {
  user_id: number;
  token: string;
};

export async function login(data: LoginRequestData): Promise<UserResponse<UserLoginResponseInfo>> {
  const response = await fetch(AUTH_ENDPOINT + '/users/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await response.json() as UserResponse<UserLoginResponseInfo>;
}

export async function register(data: RegisterRequestData): Promise<UserResponse<UserRegisterResponseInfo>> {
  const response = await fetch(AUTH_ENDPOINT + '/users/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await response.json() as UserResponse<UserRegisterResponseInfo>;
}

export async function refresh(): Promise<[number, UserResponse<UserLoginResponseInfo>]> {
  const response = await fetch(AUTH_ENDPOINT + '/users/refresh', {
    credentials: 'include'
  });
  const content = await response.json() as UserResponse<UserLoginResponseInfo>;

  return [response.status, content];
}
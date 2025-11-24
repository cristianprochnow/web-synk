export const API_ENDPOINT = import.meta.env.VITE_GATEWAY_ENDPOINT;
export const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;
export const REGISTER_TOKEN = import.meta.env.VITE_REGISTER_TOKEN;
export const NO_AUTH_CODE = 401;
export const OK_CODE = 200;

export function bearerHeader(token: string) {
  return {
    'Authorization': 'Bearer ' + token
  };
}
import { API_ENDPOINT } from './config';
import type { IntCredentialsList } from './intCredentials';

export type IntProfileOption = {
  int_profile_id: number
  int_profile_name: string
  color_hex: string
};

export type IntProfileItem = {
  int_profile_id: number
  int_profile_name: string
  color_hex: string
  color_name: string
  credentials: IntCredentialsList[]
};

export type FetchIntProfileListResponse<T> = {
  resource: {
    ok: boolean
    error: string
  }
  int_profiles: T[]
};

export async function fetchBasicIntProfiles(): Promise<FetchIntProfileListResponse<IntProfileOption>> {
  const response = await fetch(API_ENDPOINT + '/int_profiles/basic');

  return await response.json() as FetchIntProfileListResponse<IntProfileOption>;
}

export function hasBasicIntProfiles(data: FetchIntProfileListResponse<IntProfileOption>): boolean {
  return data.int_profiles && data.int_profiles.length > 0;
}

export async function fetchIntProfiles(): Promise<FetchIntProfileListResponse<IntProfileItem>> {
  const response = await fetch(API_ENDPOINT + '/int_profiles');

  return await response.json() as FetchIntProfileListResponse<IntProfileItem>;
}

export function hasProfiles(data: FetchIntProfileListResponse<IntProfileItem>): boolean {
  return data.int_profiles && data.int_profiles.length > 0;
}
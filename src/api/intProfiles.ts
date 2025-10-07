import { API_ENDPOINT } from './config';

export type IntProfileOption = {
  int_profile_id: number
  int_profile_name: string
  color_hex: string
};

export type FetchIntProfileListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  int_profiles: IntProfileOption[]
};

export async function fetchBasicIntProfiles(): Promise<FetchIntProfileListResponse> {
  const response = await fetch(API_ENDPOINT + '/int_profiles/basic');

  return await response.json() as FetchIntProfileListResponse;
}

export function hasBasicIntProfiles(data: FetchIntProfileListResponse): boolean {
  return data.int_profiles && data.int_profiles.length > 0;
}
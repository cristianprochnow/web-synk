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

export type NewIntProfileData = {
  int_profile_name: string | null;
  color_id: number | null;
  credentials: number[];
};

export type UpdateIntProfileData = {
  int_profile_id: number;
} & NewIntProfileData;

export type IntProfileResponse<T> = {
  resource: {
    ok: boolean
    error: string
  }
  int_profile: T
};

export type NewIntProfileResponse = {
  int_profile_id: number;
};

export type UpdateIntProfileResponse = {
  rows_affected: number;
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

export async function addIntProfile(template: NewIntProfileData): Promise<IntProfileResponse<NewIntProfileResponse>> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });

  return await response.json() as IntProfileResponse<NewIntProfileResponse>;
}

export async function editIntProfile(post: UpdateIntProfileData): Promise<IntProfileResponse<UpdateIntProfileResponse>> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  });

  return await response.json() as IntProfileResponse<UpdateIntProfileResponse>;
}

export async function deleteIntProfile(intProfileId: number): Promise<IntProfileResponse<UpdateIntProfileResponse>> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ int_profile_id: intProfileId })
  });

  return await response.json() as IntProfileResponse<UpdateIntProfileResponse>;
}
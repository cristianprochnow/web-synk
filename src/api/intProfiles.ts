import { API_ENDPOINT, bearerHeader } from './config';
import type { IntCredentialsList } from './intCredentials';

export type IntProfileOption = {
  int_profile_id: number
  int_profile_name: string
  color_hex: string
};

export type IntProfileItem = {
  int_profile_id: number
  int_profile_name: string
  color_id: number;
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

export type ListIntProfilesFilters = {
  int_profile_id: number | null;
};

export async function fetchBasicIntProfiles(token: string): Promise<[number, FetchIntProfileListResponse<IntProfileOption>]> {
  const response = await fetch(API_ENDPOINT + '/int_profiles/basic', {
    headers: bearerHeader(token)
  });
  const content = await response.json() as FetchIntProfileListResponse<IntProfileOption>;

  return [response.status, content];
}

export function hasBasicIntProfiles(data: FetchIntProfileListResponse<IntProfileOption>): boolean {
  return data.int_profiles && data.int_profiles.length > 0;
}

export async function fetchIntProfiles(token: string): Promise<[number, FetchIntProfileListResponse<IntProfileItem>]> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    headers: bearerHeader(token)
  });
  const content = await response.json() as FetchIntProfileListResponse<IntProfileItem>;

  return [response.status, content];
}

export function hasProfiles(data: FetchIntProfileListResponse<IntProfileItem>): boolean {
  return data.int_profiles && data.int_profiles.length > 0;
}

export async function addIntProfile(template: NewIntProfileData, token: string): Promise<[number, IntProfileResponse<NewIntProfileResponse>]> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(template)
  });
  const content = await response.json() as IntProfileResponse<NewIntProfileResponse>;

  return [response.status, content];
}

export async function editIntProfile(post: UpdateIntProfileData, token: string): Promise<[number, IntProfileResponse<UpdateIntProfileResponse>]> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(post)
  });
  const content = await response.json() as IntProfileResponse<UpdateIntProfileResponse>;

  return [response.status, content];
}

export async function deleteIntProfile(intProfileId: number, token: string): Promise<[number, IntProfileResponse<UpdateIntProfileResponse>]> {
  const response = await fetch(API_ENDPOINT + '/int_profiles', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify({ int_profile_id: intProfileId })
  });
  const content = await response.json() as IntProfileResponse<UpdateIntProfileResponse>;

  return [response.status, content];
}

export async function listProfiles(params: ListIntProfilesFilters | null = null, token: string): Promise<[number, FetchIntProfileListResponse<IntProfileItem>]> {
  const queryParams = [];

  if (params) {
    if (params.int_profile_id) {
      queryParams.push('int_profile_id=' + params.int_profile_id.toString().trim());
    }
  }

  const response = await fetch(API_ENDPOINT + '/int_profiles?' + queryParams.join('&'), {
    headers: bearerHeader(token)
  });
  const content = await response.json() as FetchIntProfileListResponse<IntProfileItem>;

  return [response.status, content];
}
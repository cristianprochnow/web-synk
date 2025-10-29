import { API_ENDPOINT } from "./config";

export const INT_CREDENTIAL_TYPE_TWITTER = 'twitter';
export const INT_CREDENTIAL_TYPE_LINKEDIN = 'linkedin';
export const INT_CREDENTIAL_TYPE_INSTAGRAM = 'instagram';

export type IntCredentialsList = {
  int_credential_id: number;
  int_profile_name: string;
  int_credential_type: string;
};

export type FetchIntCredentialsFilters = {
  credentialId: number | null | undefined,
  includeConfig: boolean | null | undefined
};

export type FetchIntCredentialsListItemsResponse = {
  resource: {
    ok: boolean
    error: string
  }
  int_credentials: IntCredentialsItem[]
};

export type IntCredentialsItem = {
  int_credential_id: number;
  int_credential_name: string;
  int_credential_type: string;
};

export type IntCredentialsByType = {
  [type: string]: IntCredentialsItem[]
};

export async function listCredentials(params: FetchIntCredentialsFilters | null = null): Promise<FetchIntCredentialsListItemsResponse> {
  const queryParams = [];

  if (params) {
    if (params.credentialId) {
      queryParams.push('int_credential_id=' + params.credentialId.toString().trim());
    }
    if (params.includeConfig === true) {
      queryParams.push('include_config=1');
    }
  }

  const response = await fetch(API_ENDPOINT + '/int_credentials?' + queryParams.join('&'));

  return await response.json() as FetchIntCredentialsListItemsResponse;
}

export function hasCredentials(data: FetchIntCredentialsListItemsResponse): boolean {
  return data.int_credentials && data.int_credentials.length > 0;
}
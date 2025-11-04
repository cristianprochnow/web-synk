import { API_ENDPOINT } from "./config";

export const INT_CREDENTIAL_TYPE_TWITTER = 'twitter';
export const INT_CREDENTIAL_TYPE_LINKEDIN = 'linkedin';
export const INT_CREDENTIAL_TYPE_INSTAGRAM = 'instagram';

export type IntCredentialsList = {
  int_credential_id: number;
  int_credential_name: string;
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
  int_credential_config: string;
};

export type IntCredentialsByType = {
  [type: string]: IntCredentialsItem[]
};

export type NewIntCredentialData = {
  int_credential_name: string | null
  int_credential_type: string | null
  int_credential_config: string | null
};

export type UpdateIntCredentialData = {
  int_credential_id: number
} & NewIntCredentialData;

export type NewIntCredentialResponse = {
  resource: {
    ok: boolean
    error: string
  }
  int_credential: NewIntCredentialResponseInfo
};

export type NewIntCredentialResponseInfo = {
  int_credential_id: number
};

export type EditIntCredentialResponse = {
  resource: {
    ok: boolean
    error: string
  }
  template: EditIntCredentialResponseInfo
};

export type EditIntCredentialResponseInfo = {
  rows_affected: number
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

export async function addIntCredential(template: NewIntCredentialData): Promise<NewIntCredentialResponse> {
  const response = await fetch(API_ENDPOINT + '/int_credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });

  return await response.json() as NewIntCredentialResponse;
}

export async function editIntCredential(post: UpdateIntCredentialData): Promise<EditIntCredentialResponse> {
  const response = await fetch(API_ENDPOINT + '/int_credentials', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  });

  return await response.json() as EditIntCredentialResponse;
}

export async function deleteIntCredential(intCredentialId: number): Promise<EditIntCredentialResponse> {
  const response = await fetch(API_ENDPOINT + '/int_credentials', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ int_credential_id: intCredentialId })
  });

  return await response.json() as EditIntCredentialResponse;
}
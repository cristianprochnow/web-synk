import { API_ENDPOINT, bearerHeader } from './config';

export type TemplateOption = {
  template_id: number
  template_name: string
};

export type FetchTemplateListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  templates: TemplateOption[]
};

export type FetchTemplateFilters = {
  templateId: number | null | undefined,
  includeContent: boolean | null | undefined
};

export type TemplateItem = {
  template_id: number;
  template_name: string;
  template_content: string;
  template_url_import: string|null;
  created_at: string;
};

export type FetchTemplateListItemsResponse = {
  resource: {
    ok: boolean
    error: string
  }
  templates: TemplateItem[]
};

export type NewTemplateData = {
  template_name: string | null;
  template_content: string | null;
  template_url_import: string | null;
};

export type EditTemplateData = {
  template_id: number;
} & NewTemplateData;

export type CreatePostResponse = {
  resource: {
    ok: boolean
    error: string
  }
  post: CreatePostResponseInfo
};

export type CreatePostResponseInfo = {
  template_id: number
};

export type EditPostResponse = {
  resource: {
    ok: boolean
    error: string
  }
  template: EditPostResponseInfo
};

export type EditPostResponseInfo = {
  rows_affected: number
};


export const TEMPLATE_EMPTY_URL_VALUE = 'default';

export async function fetchBasicTemplates(token: string): Promise<[number, FetchTemplateListResponse]> {
  const response = await fetch(API_ENDPOINT + '/templates/basic', {
    headers: bearerHeader(token)
  });
  const content = await response.json() as FetchTemplateListResponse;

  return [response.status, content];
}

export function hasBasicTemplates(data: FetchTemplateListResponse): boolean {
  return data.templates && data.templates.length > 0;
}

export async function listTemplates(params: FetchTemplateFilters | null = null, token: string): Promise<[number, FetchTemplateListItemsResponse]> {
  const queryParams = [];

  if (params) {
    if (params.templateId) {
      const templateId = params.templateId.toString().trim();
      queryParams.push('template_id=' + templateId);
    }
    if (params.includeContent === true) {
      queryParams.push('include_content=1');
    }
  }

  const response = await fetch(API_ENDPOINT + '/templates?' + queryParams.join('&'), {
    headers: bearerHeader(token)
  });

  const content = await response.json() as FetchTemplateListItemsResponse;

  return [response.status, content];
}

export function hasTemplates(data: FetchTemplateListItemsResponse): boolean {
  return data.templates && data.templates.length > 0;
}

export async function addTemplate(template: NewTemplateData, token: string): Promise<[number, CreatePostResponse]> {
  const response = await fetch(API_ENDPOINT + '/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(template)
  });
  const content = await response.json() as CreatePostResponse;

  return [response.status, content];
}

export async function editTemplate(post: EditTemplateData, token: string): Promise<[number, EditPostResponse]> {
  const response = await fetch(API_ENDPOINT + '/templates', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify(post)
  });
  const content = await response.json() as EditPostResponse;

  return [response.status, content];
}

export async function deleteTemplate(templateId: number, token: string): Promise<[number, EditPostResponse]> {
  const response = await fetch(API_ENDPOINT + '/templates', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...bearerHeader(token)
    },
    body: JSON.stringify({ template_id: templateId })
  });
  const content = await response.json() as EditPostResponse;

  return [response.status, content];
}
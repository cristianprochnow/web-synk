import { API_ENDPOINT } from './config';

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

export async function fetchBasicTemplates(): Promise<FetchTemplateListResponse> {
  const response = await fetch(API_ENDPOINT + '/templates/basic');

  return await response.json() as FetchTemplateListResponse;
}

export function hasBasicTemplates(data: FetchTemplateListResponse): boolean {
  return data.templates && data.templates.length > 0;
}

export async function listTemplates(params: FetchTemplateFilters | null = null): Promise<FetchTemplateListItemsResponse> {
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

  const response = await fetch(API_ENDPOINT + '/templates?' + queryParams.join('&'));

  return await response.json() as FetchTemplateListItemsResponse;
}

export function hasTemplates(data: FetchTemplateListItemsResponse): boolean {
  return data.templates && data.templates.length > 0;
}

export async function addTemplate(template: NewTemplateData): Promise<CreatePostResponse> {
  const response = await fetch(API_ENDPOINT + '/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });

  return await response.json() as CreatePostResponse;
}